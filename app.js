 const viewer = document.querySelector('.miv2-image-display');
 const gallery = document.querySelector('.miv2-image-gallery');
 
 const zoomNPan = new ZoomNPan(viewer);
 zoomNPan.minScale = 50;