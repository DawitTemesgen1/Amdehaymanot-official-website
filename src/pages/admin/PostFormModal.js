import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
  Grid, Box, Typography, Divider, Tabs, Tab, Chip,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { POST_LANGS, emptyTranslations } from '../../utils/localizePost';

const initialFormState = {
  title: '',
  content: '',
  category: 'General',
  author: '',
  image_url: '',
  translations: emptyTranslations(),
};

const PostFormModal = ({ open, onClose, onSave, post }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [selectedFile, setSelectedFile] = useState(null);
  const [langTab, setLangTab] = useState('en');
  const { currentUser } = useAuth();

  useEffect(() => {
    if (post) {
      const translations = emptyTranslations({
        title: post.title || '',
        content: post.content || '',
      });
      if (post.translations) {
        for (const { code } of POST_LANGS) {
          if (post.translations[code]) {
            translations[code] = {
              title: post.translations[code].title || '',
              content: post.translations[code].content || '',
            };
          }
        }
      }
      // Prefer en translation for base fields when present
      const en = translations.en;
      setFormData({
        title: en.title || post.title || '',
        content: en.content || post.content || '',
        category: post.category || 'General',
        author: post.author || currentUser?.name || '',
        image_url: post.image_url || '',
        translations,
        source: post.source || 'manual',
      });
    } else {
      setFormData({
        ...initialFormState,
        author: currentUser?.name || '',
        translations: emptyTranslations(),
      });
    }
    setSelectedFile(null);
    setLangTab('en');
  }, [post, open, currentUser]);

  const handleMetaChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTranslationChange = (field, value) => {
    setFormData((prev) => {
      const nextTranslations = {
        ...prev.translations,
        [langTab]: {
          ...prev.translations[langTab],
          [field]: value,
        },
      };
      const next = { ...prev, translations: nextTranslations };
      if (langTab === 'en') {
        next[field] = value;
      }
      return next;
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    if (e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image_url: '' }));
    }
  };

  const handleSave = () => {
    const translations = { ...formData.translations };
    // Keep en in sync with title/content
    translations.en = {
      title: formData.title || translations.en?.title || '',
      content: formData.content || translations.en?.content || '',
    };
    onSave(
      {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        author: formData.author,
        image_url: formData.image_url,
        translations: JSON.stringify(translations),
      },
      selectedFile
    );
  };

  const current = formData.translations?.[langTab] || { title: '', content: '' };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        {post ? 'Edit Post' : 'Create New Post'}
        {post?.source === 'telegram' && (
          <Chip size="small" label="Telegram" color="primary" variant="outlined" />
        )}
      </DialogTitle>
      <DialogContent>
        <Box component="form" noValidate sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="category"
                label="Category"
                value={formData.category}
                onChange={handleMetaChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="author"
                label="Author"
                value={formData.author}
                onChange={handleMetaChange}
                fullWidth
                helperText="Defaults to your name."
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                POST COVER IMAGE
              </Typography>
              <Button variant="outlined" component="label" fullWidth>
                Upload Image File
                <input type="file" hidden onChange={handleFileChange} accept="image/*" />
              </Button>
              {selectedFile && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected: {selectedFile.name}
                </Typography>
              )}
              <Divider sx={{ my: 2 }}>OR</Divider>
              <TextField
                name="image_url"
                label="Paste Image URL"
                value={formData.image_url}
                onChange={handleMetaChange}
                fullWidth
                disabled={!!selectedFile}
                helperText="Uploading a file will override the URL."
              />
            </Grid>

            <Grid item xs={12}>
              <Tabs
                value={langTab}
                onChange={(_, v) => setLangTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
              >
                {POST_LANGS.map((l) => (
                  <Tab key={l.code} value={l.code} label={l.label} />
                ))}
              </Tabs>
              <TextField
                label={`Title (${langTab})`}
                value={langTab === 'en' ? formData.title : current.title}
                onChange={(e) => handleTranslationChange('title', e.target.value)}
                fullWidth
                required={langTab === 'en'}
                sx={{ mb: 2 }}
              />
              <TextField
                label={`Content (${langTab})`}
                value={langTab === 'en' ? formData.content : current.content}
                onChange={(e) => handleTranslationChange('content', e.target.value)}
                fullWidth
                multiline
                rows={10}
                required={langTab === 'en'}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          {post ? 'Save Changes' : 'Create Post'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostFormModal;
