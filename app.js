// Declarations
const viewer = document.querySelector('.miv2-image-display');
const gallery = document.querySelector('.miv2-image-gallery');
 
const zoomNPan = new ZoomNPan(viewer);
zoomNPan.minScale = 50;

 
// Helper
function selectImageByImageElement(imageElement) {
  const thumbnailElement = imageElement.closest('.miv2-thumbnail');
  getThumbnails().forEach(thumbnail => thumbnail.classList.remove('selected'));
  thumbnailElement.classList.add('selected');
  viewer.style.backgroundImage = `url(${imageElement.src})`;
}

// Getters
function getThumbnails() {
  return Array.from(document.querySelectorAll('.miv2-thumbnail'));
}

// Main
gallery.addEventListener('click', e => {
  const thumbnail = e.target.closest('.miv2-thumbnail');
  if (!thumbnail) return;
  selectImageByImageElement(thumbnail.querySelector('img'));
});