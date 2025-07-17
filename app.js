// Declarations
const viewer = document.querySelector('.miv2-image-display');
const gallery = document.querySelector('.miv2-image-gallery');
const WHEEL_STEP = 120;
 
const zoomNPan = new ZoomNPan(viewer);
zoomNPan.minScale = 50;

 
// Logic
function displayByImageElement(imageElement) {
  const thumbnailElement = imageElement.closest('.miv2-thumbnail');
  getThumbnails().forEach(thumbnail => thumbnail.classList.remove('selected'));
  thumbnailElement.classList.add('selected');
  setDisplayImageSourceByUrl(imageElement.src);
}

function displayByOffset(offset) {
  const thumbnails = getThumbnails();
  const currentIndex = thumbnails.findIndex(thumbnail => thumbnail.classList.contains('selected'));
  const nextIndex = (currentIndex + offset + thumbnails.length) % thumbnails.length;
  
  thumbnails.forEach(thumbnail => thumbnail.classList.remove('selected'));
  const selected = thumbnails[nextIndex];
  selected.classList.add('selected');
  setDisplayImageSourceByUrl(selected.querySelector('img').src);
}

// Helpers
function setDisplayImageSourceByUrl(url) { viewer.style.backgroundImage = `url(${url})`; }
function displayPreviousImage() { displayByOffset(-1); }
function displayNextImage() { displayByOffset(1); }
function zoom(direction) {
  const deltaY = -direction * WHEEL_STEP;
  const wheelEvent = new WheelEvent('wheel', {deltaY, bubbles: true, canelable: true});
  viewer.dispatchEvent(wheelEvent);
}

// Getters
function getThumbnails() {
  return Array.from(document.querySelectorAll('.miv2-thumbnail'));
}

// Main
gallery.addEventListener('click', e => {
  const thumbnail = e.target.closest('.miv2-thumbnail');
  if (!thumbnail) return;
  displayByImageElement(thumbnail.querySelector('img'));
});

document.querySelectorAll('.miv2-image-control').forEach(control => {
  control.addEventListener('click', () => {
    switch (control.dataset.action) {
      case 'previous': displayPreviousImage(); break;
      case 'next': displayNextImage(); break;
      case 'zoom-in': zoom(1); break;
      case 'zoom-out': zoom(-1); break;
    }
  });
});