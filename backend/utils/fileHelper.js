const fs = require('fs');
const path = require('path');

const deleteFile = (filePath) => {
  if (!filePath) return;
  // filePath is relative, like '/uploads/images/...'
  // Construct the full path from the project root.
  const fullPath = path.join(process.cwd(), filePath);

  if (fs.existsSync(fullPath)) {
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error(`Failed to delete file: ${fullPath}`, err);
      }
    });
  }
};

module.exports = { deleteFile };