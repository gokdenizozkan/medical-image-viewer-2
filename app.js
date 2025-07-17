// Declarations
const viewer = document.querySelector('.miv2-image-display');
const gallery = document.querySelector('.miv2-image-gallery');
const followMouseControl = document.querySelector('[data-action="toggle-mouse-follow"]');

const WHEEL_STEP = 120;
let autoPan = false;
let dragging = false;
let dragStart = {x: 0, y: 0};
let manualPan = {x: 50, y: 50};
let initialPan = {x: 50, y: 50};

let currentZoomLevel = 100;
 
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
function resetView() {
  viewer.style.backgroundSize = '100%';
  viewer.style.backgroundPosition = '50% 50%';
  viewer.classList.remove('zoomed-in', 'zoomed-out');
  currentZoomLevel = 100;
}

// Getters
function getThumbnails() {
  return Array.from(document.querySelectorAll('.miv2-thumbnail'));
}

// Mouse & drag handlers
viewer.addEventListener('mousedown', e => {
  if (!viewer.classList.contains('zoomed-in')) return;
  dragging = true;
  dragStart = { x: e.clientX, y: e.clientY };
  initialPan = { ...manualPan };
  e.preventDefault();
});

document.addEventListener('mouseup', e => dragging = false);

viewer.addEventListener('mousemove', e => {
  if (autoPan) return;
  if (dragging) {
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    manualPan.x = initialPan.x - (dx / viewer.clientWidth) * 100;
    manualPan.y = initialPan.y - (dy / viewer.clientHeight) * 100;
  }
  viewer.style.backgroundPosition = `${manualPan.x}% ${manualPan.y}%`;
});

function toggleMouseFollow() {
  autoPan = !autoPan;
  dragging = false;
  if (autoPan) {
    manualPan = { x: 50, y: 50 };
    viewer.style.backgroundPosition = '50% 50%';
  }
  followMouseControl.innerText = autoPan ? "Following" : "Follow Mouse";
  followMouseControl.classList.toggle('active', autoPan);
}

// Main Helpers
function initializeGallery() {
  const firstThumbnail = getThumbnails()[0];
  firstThumbnail.classList.add('selected');
  setDisplayImageSourceByUrl(firstThumbnail.querySelector('img').src);
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
      case 'toggle-mouse-follow': toggleMouseFollow(); break;
      case 'reset-view': resetView(); break;
    }
  });
});

initializeGallery();