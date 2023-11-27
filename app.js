document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('upload-form').addEventListener('submit', function(e) {
    e.preventDefault();
    uploadPhoto();
  });

  function uploadPhoto() {
    var formData = new FormData();
    var photoInput = document.getElementById('photo-upload');
    formData.append('file', photoInput.files[0]); // 'file' is the expected key for the file in the Logic App

    var uploadUrl = 'https://prod-05.northeurope.logic.azure.com:443/workflows/d16fda7f5e084f4abf6574b81d11e46d/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=VOco_-4vvar98WT0aX7jJL2SviHzsybZzbTo9F_cJUk'; // Replace with your actual Logic App URL

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
    const logicAppUrl = 'https://prod-14.northeurope.logic.azure.com:443/workflows/d1796592c81d4d238f1f9462b580ec50/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=kcVG7x0CvW9ugWmDkWUcUibkrcA83Gs2h8Q3qE5V5EI'; // Replace with the URL to fetch images

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
        const imageUrl = constructImageUrl(item); // Implement this function based on how you get your URLs
        const imageElement = document.createElement('img');
        imageElement.src = imageUrl;
        imageElement.alt = item.caption;
        imageElement.classList.add('gallery-image');

        galleryElement.appendChild(imageElement);
      });
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  }

  // Call fetchAndDisplayImages when the page loads to display existing images
  fetchAndDisplayImages();
}); 

