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
  fetch('https://prod-59.northeurope.logic.azure.com:443/workflows/a0e1c136c0c145c08f6a5f4edab4a99b/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=XoEch95vh_XunmD0scYJY7-RzTLPiG4u15E2iDKsjYI')
    .then(response => response.json())
    .then(photos => {
      const gallery = document.getElementById('photo-gallery');
      gallery.innerHTML = ''; // Clear gallery before adding new photos
      
      photos.forEach(photo => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        
        // Assuming 'fileLocation' is the property that contains the URL of the photo
        const image = document.createElement('img');
        image.src = photo.fileLocation; 
        image.alt = 'Photo'; // There's no caption property, so we use a generic alt text
        
        // Assuming 'fileName' is the property you want to use as a caption
        const caption = document.createElement('p');
        caption.textContent = photo.fileName;
        
        photoItem.appendChild(image);
        photoItem.appendChild(caption);
        gallery.appendChild(photoItem);
      });
    })
    .catch(error => {
      console.error('Error fetching photos:', error);
    });
}




// Don't forget to call fetchPhotos to actually execute the function on page load or after photo uploads
fetchPhotos();

  
