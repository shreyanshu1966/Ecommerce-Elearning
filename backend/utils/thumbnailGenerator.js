const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

// Create thumbnails directory if it doesn't exist
const thumbnailDir = path.join(__dirname, '..', 'uploads', 'thumbnails');
if (!fs.existsSync(thumbnailDir)) {
  fs.mkdirSync(thumbnailDir, { recursive: true });
}

// Add default thumbnail if it doesn't exist
const defaultThumbPath = path.join(thumbnailDir, 'default-video-thumb.jpg');
if (!fs.existsSync(defaultThumbPath)) {
  // Copy default thumbnail from assets or create a placeholder
  const placeholderPath = path.join(__dirname, '..', 'assets', 'default-thumb.jpg');
  if (fs.existsSync(placeholderPath)) {
    fs.copyFileSync(placeholderPath, defaultThumbPath);
  } else {
    // We'll just log this for now - you should add a default thumbnail file to your assets
    console.log('Default thumbnail not found. Please add one to backend/assets/default-thumb.jpg');
  }
}

/**
 * Generate thumbnail from video file
 * @param {string} videoPath Path to the video file
 * @param {string} outputFilename Desired output filename
 * @returns {Promise<string>} Path to the generated thumbnail
 */
const generateThumbnail = (videoPath, outputFilename) => {
  return new Promise((resolve, reject) => {
    const thumbnailPath = path.join(thumbnailDir, `${outputFilename}.jpg`);
    
    ffmpeg(videoPath)
      .screenshots({
        timestamps: ['10%'],
        filename: `${outputFilename}.jpg`,
        folder: thumbnailDir,
        size: '640x360'
      })
      .on('error', (err) => {
        console.error('Error generating thumbnail:', err);
        resolve(defaultThumbPath.replace(/^.*[\\\/]/, '/uploads/thumbnails/'));
      })
      .on('end', () => {
        resolve(`/uploads/thumbnails/${outputFilename}.jpg`);
      });
  });
};

module.exports = { generateThumbnail };