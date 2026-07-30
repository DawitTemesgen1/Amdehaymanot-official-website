const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createStorage = (destination) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = `uploads/${destination}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, `${destination.slice(0, -1)}-${Date.now()}${path.extname(file.originalname)}`);
    }
  });
};

const imageUpload = multer({ 
  storage: createStorage('images'),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.', false));
    }
  }
});

const videoUpload = multer({ 
  storage: createStorage('videos'),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Not a video! Please upload a video file.', false));
    }
  }
});

const appStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/apps';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const safeVersion = (req.body.version || '0.0.0').replace(/[^a-z0-9.-]/gi, '_');
        const safeArch = (req.body.architecture || 'unknown').replace(/[^a-z0-9_-]/gi, '_');
        cb(null, `amdehaymanot-${safeVersion}-${safeArch}${path.extname(file.originalname)}`);
    }
});
const appUpload = multer({ storage: appStorage });


module.exports = { imageUpload, videoUpload, appUpload };