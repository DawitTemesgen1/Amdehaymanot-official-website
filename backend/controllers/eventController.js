const Event = require('../models/event.model.js');
const { deleteFile } = require('../utils/fileHelper');

exports.getEvents = async (req, res) => {
    try {
        const events = await Event.getAll();
        res.json(events);
    } catch (e) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.createEvent = async (req, res) => {
    const { title, description, location, event_date, organizer } = req.body;
    if (!title || !event_date) return res.status(400).json({ message: 'Title and Date are required.' });
    try {
        const newEvent = await Event.create({
            title, description, location, organizer,
            event_date: new Date(event_date),
            image_url: req.file ? `/${req.file.path.replace(/\\/g, "/")}` : req.body.image_url || null
        });
        res.status(201).json(newEvent);
    } catch (e) {
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
            newImageUrl = `/${req.file.path.replace(/\\/g, "/")}`;
            if (existingEvent.image_url) deleteFile(existingEvent.image_url);
        } else if (req.body.image_url !== undefined && req.body.image_url !== existingEvent.image_url) {
            newImageUrl = req.body.image_url;
        }

        const eventData = { ...existingEvent, ...req.body, image_url: newImageUrl };
        if(eventData.event_date) eventData.event_date = new Date(eventData.event_date);
        delete eventData.id;

        await Event.updateById(id, eventData);
        res.json({ id, ...eventData });
    } catch (e) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteEvent = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (event.image_url) deleteFile(event.image_url);
        await Event.remove(id);
        res.json({ message: 'Event deleted' });
    } catch (e) {
        res.status(500).json({ message: 'Server Error' });
    }
};