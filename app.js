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
      gallery.innerHTML = ''; // Clear the gallery before adding new photos.
      
      // Ensure 'photos' is actually an array and has items.
      if (Array.isArray(photos) && photos.length > 0) {
        photos.forEach(photo => {
          const photoItem = document.createElement('div');
          photoItem.className = 'photo-item';
          
          // Check if the photo object has the 'url' and 'caption' properties.
          if(photo.url && photo.caption) {
            const image = document.createElement('img');
            image.src = photo.url; // Use the actual property name for the photo URL.
            image.alt = photo.caption; // Use the actual property name for the caption.
            
            const caption = document.createElement('p');
            caption.textContent = photo.caption; // Use the actual property name for the caption.
            
            photoItem.appendChild(image);
            photoItem.appendChild(caption);
            gallery.appendChild(photoItem);
          } else {
            // If there's no 'url' or 'caption', log an error or handle it appropriately.
            console.error('Photo object is missing the url or caption property', photo);
          }
        });
      } else {
        // Handle the case where 'photos' is not an array or is empty.
        console.error('Photos data is not an array or is empty', photos);
      }
    })
    .catch(error => {
      console.error('Error fetching photos:', error);
    });
}


// Don't forget to call fetchPhotos to actually execute the function on page load or after photo uploads
fetchPhotos();

  
