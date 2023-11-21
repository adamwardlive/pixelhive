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
  
// Function to fetch photos from another Logic App endpoint
function fetchPhotos() {
  fetch('https://prod-59.northeurope.logic.azure.com:443/workflows/a0e1c136c0c145c08f6a5f4edab4a99b/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=XoEch95vh_XunmD0scYJY7-RzTLPiG4u15E2iDKsjYI')
    .then(response => response.json())
    .then(photos => {
      const gallery = document.getElementById('photo-gallery');
      gallery.innerHTML = ''; // Clear gallery before adding new photos
      photos.forEach(photo => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        const image = document.createElement('img');
        image.src = photo.url; // Assuming 'url' is the property containing the photo URL
        image.alt = photo.caption; // Assuming 'caption' is the property containing the caption
        const caption = document.createElement('p');
        caption.textContent = photo.caption;
        photoItem.appendChild(image);
        photoItem.appendChild(caption);
        gallery.appendChild(photoItem);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Don't forget to call fetchPhotos to actually execute the function on page load or after photo uploads
fetchPhotos();

  
