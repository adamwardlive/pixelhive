document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('upload-form').addEventListener('submit', function(e) {
    e.preventDefault();
    uploadPhoto();
  });

  function uploadPhoto() {
    var formData = new FormData();
    var photoInput = document.getElementById('photo-upload');
    formData.append('file', photoInput.files[0]); // Ensure this matches the name expected by the server

    var uploadUrl = 'https://prod-05.northeurope.logic.azure.com:443/workflows/d16fda7f5e084f4abf6574b81d11e46d/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=VOco_-4vvar98WT0aX7jJL2SviHzsybZzbTo9F_cJUk';

    fetch(uploadUrl, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      fetchAndDisplayImages(); // Refresh the gallery after successful upload
    })
    .catch(error => {
      console.error('Error during upload:', error);
    });
  }

  function fetchAndDisplayImages() {
    const galleryElement = document.getElementById('gallery');
    const logicAppUrl = 'https://prod-14.northeurope.logic.azure.com:443/workflows/d1796592c81d4d238f1f9462b580ec50/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=kcVG7x0CvW9ugWmDkWUcUibkrcA83Gs2h8Q3qE5V5EI';
    const blobStorageBaseUrl = 'https://pixelhiveb00787643.blob.core.windows.net/pixelhive-img-share-b00787643/';

    fetch(logicAppUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      galleryElement.innerHTML = ''; // Clear existing gallery items
      data.forEach(item => {
        const imageUrl = blobStorageBaseUrl + item.filePath; // Construct the full URL
        const imageElement = document.createElement('img');
        imageElement.src = imageUrl;
        imageElement.alt = item.caption || 'Uploaded Image';
        imageElement.classList.add('gallery-image');
        galleryElement.appendChild(imageElement);
      });
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  }

  // Initial call to populate the gallery
  fetchAndDisplayImages();
});




