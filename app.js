document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('upload-form').addEventListener('submit', function(e) {
    e.preventDefault();
    uploadPhoto();
  });

  function uploadPhoto() {
    var formData = new FormData();
    var photoInput = document.getElementById('photo-upload'); // Make sure this is the ID of your file input
    formData.append('file', photoInput.files[0]); // 'file' is the expected key for the file in the Logic App

    var uploadUrl = 'https://prod-05.northeurope.logic.azure.com:443/workflows/d16fda7f5e084f4abf6574b81d11e46d/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=VOco_-4vvar98WT0aX7jJL2SviHzsybZzbTo9F_cJUk'; // Replace with your actual Logic App URL

    // No need to explicitly set 'Content-Type' header for 'multipart/form-data', 
    // the browser will automatically set it along with the boundary parameter
    fetch(uploadUrl, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return response.text().then(text => Promise.reject(`Error: ${text}`));
      }
      return response.text().then(text => text ? JSON.parse(text) : {});
    })
    .then(data => {
      console.log('Success:', data);
      // Add any action you want to take after successful upload
    })
    .catch(error => {
      console.error('Error during upload:', error);
    });
  }
  

  function fetchAndDisplayImages() {
    const blobStorageBaseUrl = 'https://pixelhiveb00787643.blob.core.windows.net/pixelhive-img-share-b00787643';
  
    const logicAppUrl = 'https://prod-14.northeurope.logic.azure.com:443/workflows/d1796592c81d4d238f1f9462b580ec50/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=kcVG7x0CvW9ugWmDkWUcUibkrcA83Gs2h8Q3qE5V5EI';
  
    fetch(logicAppUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        const galleryElement = document.getElementById('gallery');
        if (!galleryElement) {
          console.error('The gallery element does not exist.');
          return;
        }
  
        galleryElement.innerHTML = '';
  
        data.sort((a, b) => b._ts - a._ts); // Sort based on a timestamp field
  
        data.forEach(item => {
          const filePath = item.filePath.startsWith('/pixelhive-img-share-b00787643/') ? item.filePath.split('/pixelhive-img-share-b00787643/')[1] : item.filePath;
          const imageUrl = `${blobStorageBaseUrl}/${filePath}`;
  
          const linkElement = document.createElement('a');
          linkElement.href = `image-detail.html?image=${encodeURIComponent(imageUrl)}&name=${encodeURIComponent(item.fileName)}&timestamp=${encodeURIComponent(item._ts)}&caption=${encodeURIComponent(item.caption)}`;  
          const imgElement = document.createElement('img');
          imgElement.src = imageUrl;
          imgElement.alt = item.fileName;
          imgElement.classList.add('gallery-image');
  
          linkElement.appendChild(imgElement);
          galleryElement.appendChild(linkElement);
        });
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }
  
  // Call the function to fetch and display images
  fetchAndDisplayImages();  
});
