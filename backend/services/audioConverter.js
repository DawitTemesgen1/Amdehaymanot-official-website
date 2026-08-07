const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

/**
 * Converts an input audio file into .opus and .m4a formats
 * @param {string} inputPath - Absolute path to the original downloaded audio file
 * @returns {Promise<{ opusPath: string, m4aPath: string, duration: number, sizes: object }>}
 */
function convertAudio(inputPath) {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const uploadDir = path.dirname(inputPath);
    const basename = path.basename(inputPath, path.extname(inputPath));
    const opusFilename = `aud_${timestamp}_${basename}.opus`;
    const m4aFilename = `aud_${timestamp}_${basename}.m4a`;
    
    const opusPath = path.join(uploadDir, opusFilename);
    const m4aPath = path.join(uploadDir, m4aFilename);

    let duration = 0;

    // Use fluent-ffmpeg to process both outputs in one command if possible,
    // but for simplicity and safety across formats, we can run them sequentially or in parallel.
    // We will do parallel.

    const processOpus = new Promise((res, rej) => {
      ffmpeg(inputPath)
        .noVideo()
        .audioCodec('libopus')
        .audioBitrate('48k')
        .output(opusPath)
        .on('end', () => res(opusPath))
        .on('error', (err) => rej(err))
        .run();
    });

    const processM4a = new Promise((res, rej) => {
      ffmpeg(inputPath)
        .noVideo()
        .audioCodec('aac')
        .audioBitrate('128k')
        .output(m4aPath)
        .on('codecData', data => {
          if (data.duration) {
            // Duration is in HH:MM:SS.ms format
            const parts = data.duration.split(':');
            duration = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseFloat(parts[2]);
          }
        })
        .on('end', () => res(m4aPath))
        .on('error', (err) => rej(err))
        .run();
    });

    Promise.all([processOpus, processM4a])
      .then(() => {
        try {
          const opusSize = fs.statSync(opusPath).size;
          const m4aSize = fs.statSync(m4aPath).size;
          
          resolve({
            opusPath: `/uploads/audio/${opusFilename}`,
            m4aPath: `/uploads/audio/${m4aFilename}`,
            duration: Math.round(duration),
            sizes: { opus: opusSize, m4a: m4aSize }
          });
        } catch (e) {
          reject(e);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = { convertAudio };
