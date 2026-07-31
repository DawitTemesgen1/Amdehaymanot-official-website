const Event = require('../models/event.model.js');
const EventTranslation = require('../models/eventTranslation.model.js');
const ContentImage = require('../models/contentImage.model.js');
const { deleteFile } = require('../utils/fileHelper');
const { attachImagesOne, attachImagesMany } = require('../utils/contentImages.js');
const { SITE_LANGS } = require('../constants/languages');

function parseTranslationsBody(body) {
  if (!body) return null;
  if (body.translations) {
    if (typeof body.translations === 'string') {
      try {
        return JSON.parse(body.translations);
      } catch {
        return null;
      }
    }
    if (typeof body.translations === 'object') return body.translations;
  }
  return null;
}

function applyLangFlatten(event, lang) {
  if (!lang || !event) return event;
  const t = event.translations?.[lang] || event.translations?.en;
  if (!t) return event;
  return {
    ...event,
    title: t.title || event.title,
    description: t.description || event.description,
    location: t.location || event.location,
  };
}

async function attachTranslations(event) {
  if (!event) return event;
  const translations = await EventTranslation.getByEventId(event.id);
  if (!translations.en && event.title && event.description) {
    translations.en = {
      title: event.title,
      description: event.description,
      location: event.location || '',
    };
  }
  const withTranslations = { ...event, translations };
  return attachImagesOne(withTranslations, 'event');
}

async function attachTranslationsMany(events) {
  if (!events.length) return events;
  const byEvent = await EventTranslation.getByEventIds(events.map((e) => e.id));
  const withTranslations = events.map((e) => {
    const translations = byEvent[e.id] || {};
    if (!translations.en && e.title && e.description) {
      translations.en = {
        title: e.title,
        description: e.description,
        location: e.location || '',
      };
    }
    return { ...e, translations };
  });
  return attachImagesMany(withTranslations, 'event');
}

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.getAll();
    let withT = await attachTranslationsMany(events);
    const lang = req.query.lang;
    if (lang && SITE_LANGS.includes(lang)) {
      withT = withT.map((e) => applyLangFlatten(e, lang));
    }
    res.json(withT);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(parseInt(req.params.id, 10));
    if (!event) return res.status(404).json({ message: 'Event not found' });
    let withT = await attachTranslations(event);
    const lang = req.query.lang;
    if (lang && SITE_LANGS.includes(lang)) {
      withT = applyLangFlatten(withT, lang);
    }
    res.json(withT);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.createEvent = async (req, res) => {
  const { title, description, location, event_date, organizer } = req.body;
  if (!title || !event_date) return res.status(400).json({ message: 'Title and Date are required.' });
  try {
    const translations = parseTranslationsBody(req.body);
    const newEvent = await Event.create({
      title,
      description,
      location,
      organizer,
      event_date: new Date(event_date),
      image_url: req.file ? `/${req.file.path.replace(/\\/g, '/')}` : req.body.image_url || null,
    });

    if (translations) {
      if (!translations.en) {
        translations.en = { title, description, location: location || '' };
      }
      await EventTranslation.upsertMany(newEvent.id, translations);
    }

    const withT = await attachTranslations(newEvent);
    res.status(201).json(withT);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateEvent = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const existingEvent = await Event.findById(id);
    if (!existingEvent) return res.status(404).json({ message: 'Event not found' });

    let newImageUrl = existingEvent.image_url;
    if (req.file) {
      newImageUrl = `/${req.file.path.replace(/\\/g, '/')}`;
      if (existingEvent.image_url) deleteFile(existingEvent.image_url);
    } else if (req.body.image_url !== undefined && req.body.image_url !== existingEvent.image_url) {
      newImageUrl = req.body.image_url;
    }

    const translations = parseTranslationsBody(req.body);
    let title = req.body.title ?? existingEvent.title;
    let description = req.body.description ?? existingEvent.description;
    let location = req.body.location ?? existingEvent.location;

    if (translations?.en?.title) title = translations.en.title;
    if (translations?.en?.description) description = translations.en.description;
    if (translations?.en?.location) location = translations.en.location;

    const eventData = {
      ...existingEvent,
      ...req.body,
      title,
      description,
      location,
      image_url: newImageUrl,
    };
    if (eventData.event_date) eventData.event_date = new Date(eventData.event_date);
    delete eventData.id;
    delete eventData.translations;

    await Event.updateById(id, eventData);

    if (translations) {
      if (!translations.en) {
        translations.en = { title, description, location: location || '' };
      }
      await EventTranslation.upsertMany(id, translations);
    }

    const withT = await attachTranslations({ id, ...eventData });
    res.json(withT);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteEvent = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.image_url) deleteFile(event.image_url);
    await ContentImage.removeByContent('event', id);
    await EventTranslation.removeByEventId(id);
    await Event.remove(id);
    res.json({ message: 'Event deleted' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server Error' });
  }
};
