document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('upload-form').addEventListener('submit', function(e) {
      e.preventDefault();
      uploadPhoto();
    });
  
    fetchPhotos();
  });
  
  function uploadPhoto() {
    var formData = new FormData();
    var photoInput = document.getElementById('photo-upload');
    var captionInput = document.getElementById('photo-caption');
    formData.append('photo', photoInput.files[0]);
    formData.append('caption', captionInput.value);
  
    fetch('/api/photographs', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      fetchPhotos(); // Refresh the gallery
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  
  function fetchPhotos() {
    fetch('/api/photographs')
    .then(response => response.json())
    .then(photos => {
      const gallery = document.getElementById('photo-gallery');
      gallery.innerHTML = ''; // Clear gallery
      photos.forEach(photo => {
        const photoItem = document.createElement('div');
        photoItem.classList.add('photo-item');
        photoItem.innerHTML = `
          <img src="${photo.filePath}" alt="${photo.caption}" title="${photo.caption}">
          <p>${photo.caption}</p>
        `;
        gallery.appendChild(photoItem);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  
