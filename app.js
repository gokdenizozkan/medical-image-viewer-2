// Declarations
const viewer = document.querySelector('.miv2-image-display');
const gallery = document.querySelector('.miv2-image-gallery');
const followMouseControl = document.querySelector('[data-action="toggle-mouse-follow"]');
const zoomIndicator = document.getElementById('zoomIndicator');

const WHEEL_STEP = 120;
const ZOOM_INDICATOR_TIMEOUT = 1500; // ms
let autoPan = false;
let dragging = false;
let dragStart = {x: 0, y: 0};
let manualPan = {x: 50, y: 50};
let initialPan = {x: 50, y: 50};
let zoomIndicatorTimeoutId = null;

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
function setDisplayImageSourceByUrl(url) {
  const tempImage = new Image();
  viewer.classList.add('loading');

  tempImage.onload = function() {
    viewer.style.backgroundImage = `url(${url})`;
    viewer.classList.remove('loading');
    viewer.classList.remove('error');
  };

  tempImage.onerror = function() {
    console.error('Failed to load image:', url);
    viewer.classList.add('error');
    viewer.classList.remove('loading');
  };

  tempImage.src = url;
}

function displayPreviousImage() { displayByOffset(-1); }
function displayNextImage() { displayByOffset(1); }
function zoom(direction) {
  const deltaY = -direction * WHEEL_STEP;
  const wheelEvent = new WheelEvent('wheel', {deltaY, bubbles: true, cancelable: true});
  viewer.dispatchEvent(wheelEvent);
}
function resetView() {
  zoomNPan.reset();
  manualPan = { x: 50, y: 50 };
  currentZoomLevel = 100;
  dragging = false;
  updateZoomIndicator(100);
}

// Zoom indicator functions
function updateZoomIndicator(zoomLevel) {
  zoomIndicator.textContent = `${Math.round(zoomLevel)}%`;
  zoomIndicator.classList.add('visible');

  if (zoomIndicatorTimeoutId) {
    clearTimeout(zoomIndicatorTimeoutId);
  }

  zoomIndicatorTimeoutId = setTimeout(() => {
    zoomIndicator.classList.remove('visible');
  }, ZOOM_INDICATOR_TIMEOUT);
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
  const textSpan = followMouseControl.querySelector('.miv2-control-text');
  if (textSpan) {
    textSpan.textContent = autoPan ? "Following" : "Follow Mouse";
  }
  followMouseControl.classList.toggle('active', autoPan);
}

// Zoom level observer
const observeZoomChanges = () => {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'style') {
        const backgroundSize = viewer.style.backgroundSize;
        if (!backgroundSize) return;

        const zoomLevel = parseInt(backgroundSize);
        if (!isNaN(zoomLevel) && zoomLevel !== currentZoomLevel) {
          currentZoomLevel = zoomLevel;
          updateZoomIndicator(zoomLevel);
        }

      }
    });
  });

  observer.observe(viewer, { attributes: true });
};

// Theme initialization
function initializeThemeSystem() {
  window.miv2Themes.initializeTheme();

  const themeSelector = window.miv2Themes.createThemeSelector();
  const themeContainer = document.getElementById('themeContainer');
  if (themeContainer) {
    themeContainer.appendChild(themeSelector);
  }
}

// Keyboard shortcuts handler
function handleKeyboardShortcuts(e) {
  // Navigation shortcuts
  if (e.key === 'ArrowLeft') {
    displayPreviousImage();
    e.preventDefault();
  } else if (e.key === 'ArrowRight') {
    displayNextImage();
    e.preventDefault();
  }

  // Zoom shortcuts
  else if (e.key === '+') {
    zoom(1);
    e.preventDefault();
  } else if (e.key === '-') {
    zoom(-1);
    e.preventDefault();
  }

  // View control shortcuts
  else if (e.key.toLowerCase() === 'f') {
    toggleMouseFollow();
    e.preventDefault();
  } else if (e.key.toLowerCase() === 'r') {
    resetView();
    e.preventDefault();
  }
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

// Initialize application
initializeGallery();
observeZoomChanges();
initializeThemeSystem();
document.addEventListener('keydown', handleKeyboardShortcuts);