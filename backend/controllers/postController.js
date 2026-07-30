const Post = require('../models/post.model.js');
const PostTranslation = require('../models/postTranslation.model.js');
const { deleteFile } = require('../utils/fileHelper.js');
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

function applyLangFlatten(post, lang) {
  if (!lang || !post) return post;
  const t = post.translations?.[lang] || post.translations?.en;
  if (!t) return post;
  return {
    ...post,
    title: t.title || post.title,
    content: t.content || post.content,
  };
}

async function attachTranslations(post) {
  if (!post) return post;
  const translations = await PostTranslation.getByPostId(post.id);
  // Ensure base en is present from columns if missing
  if (!translations.en && post.title && post.content) {
    translations.en = { title: post.title, content: post.content };
  }
  return { ...post, translations };
}

async function attachTranslationsMany(posts) {
  if (!posts.length) return posts;
  const byPost = await PostTranslation.getByPostIds(posts.map((p) => p.id));
  return posts.map((p) => {
    const translations = byPost[p.id] || {};
    if (!translations.en && p.title && p.content) {
      translations.en = { title: p.title, content: p.content };
    }
    return { ...p, translations };
  });
}

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.getAll();
    let withT = await attachTranslationsMany(posts);
    const lang = req.query.lang;
    if (lang && SITE_LANGS.includes(lang)) {
      withT = withT.map((p) => applyLangFlatten(p, lang));
    }
    res.json(withT);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(parseInt(req.params.id, 10));
    if (!post) return res.status(404).json({ message: 'Post not found' });
    let withT = await attachTranslations(post);
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

exports.createPost = async (req, res) => {
  const { title, content, category } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  try {
    const newPost = await Post.create({
      title,
      content,
      category: category || 'General',
      source: req.body.source || 'manual',
      authorId: req.user.id,
      image_url: req.file
        ? `/${req.file.path.replace(/\\/g, '/')}`
        : req.body.image_url || null,
    });

    const translations = parseTranslationsBody(req.body) || {
      en: { title, content },
    };
    if (!translations.en) {
      translations.en = { title, content };
    }
    await PostTranslation.upsertMany(newPost.id, translations);

    const full = await attachTranslations(await Post.findById(newPost.id));
    res.status(201).json(full);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updatePost = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const existingPost = await Post.findById(id);
    if (!existingPost) return res.status(404).json({ message: 'Post not found' });

    let newImageUrl = existingPost.image_url;
    if (req.file) {
      newImageUrl = `/${req.file.path.replace(/\\/g, '/')}`;
      if (existingPost.image_url) deleteFile(existingPost.image_url);
    } else if (req.body.image_url !== undefined && req.body.image_url !== existingPost.image_url) {
      newImageUrl = req.body.image_url;
    }

    const translations = parseTranslationsBody(req.body);

    let title = req.body.title !== undefined ? req.body.title : existingPost.title;
    let content = req.body.content !== undefined ? req.body.content : existingPost.content;

    // If translations.en provided, keep base columns in sync
    if (translations?.en?.title) title = translations.en.title;
    if (translations?.en?.content) content = translations.en.content;

    const postData = {
      title,
      content,
      category: req.body.category !== undefined ? req.body.category : existingPost.category,
      source: existingPost.source || 'manual',
      telegram_chat_id: existingPost.telegram_chat_id ?? null,
      telegram_message_id: existingPost.telegram_message_id ?? null,
      authorId: existingPost.authorId,
      image_url: newImageUrl,
    };

    await Post.updateById(id, postData);

    if (translations) {
      if (!translations.en) {
        translations.en = { title: postData.title, content: postData.content };
      }
      await PostTranslation.upsertMany(id, translations);
    } else if (req.body.title !== undefined || req.body.content !== undefined) {
      await PostTranslation.upsertMany(id, {
        en: { title: postData.title, content: postData.content },
      });
    }

    const full = await attachTranslations(await Post.findById(id));
    res.json(full);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deletePost = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.image_url) deleteFile(post.image_url);
    await Post.remove(id);
    res.json({ message: 'Post deleted' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server Error' });
  }
};
