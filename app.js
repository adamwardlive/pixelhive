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
  
  function fetchAndDisplayImages() {
    // The base URL for your Blob Storage container
    const blobStorageBaseUrl = 'https://pixelhive-blob-b00787643.blob.core.windows.net/pixelhive-img-share-b00787643/';
  
    // The URL of your Logic App's HTTP GET endpoint
    const logicAppUrl = 'https://prod-14.northeurope.logic.azure.com:443/workflows/d1796592c81d4d238f1f9462b580ec50/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=kcVG7x0CvW9ugWmDkWUcUibkrcA83Gs2h8Q3qE5V5EI';
  
    document.addEventListener('DOMContentLoaded', function() {
      // Function to fetch and display images
      function fetchAndDisplayImages() {
        // The base URL for your Blob Storage container
        const blobStorageBaseUrl = 'https://pixelhive.blob.core.windows.net/images/';
    
        // The URL of your Logic App's HTTP GET endpoint
        const logicAppUrl = 'https://prod-14.northeurope.logic.azure.com:443/workflows/d1796592c81d4d238f1f9462b580ec50/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=kcVG7x0CvW9ugWmDkWUcUibkrcA83Gs2h8Q3qE5V5EI';
    
        // Use the Fetch API to make the GET request
        fetch(logicAppUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json(); // Parse the JSON in the response
          })
          .then(data => {
            const galleryElement = document.getElementById('gallery'); // Corrected ID to match the HTML
    
            // Ensure the gallery element exists
            if (!galleryElement) {
              console.error('The gallery element does not exist.');
              return;
            }
    
            // Clear the gallery container
            galleryElement.innerHTML = '';
    
            // Iterate over each item in the response data
            data.forEach(item => {
              const imageUrl = blobStorageBaseUrl + item.filePath; // Construct the full image URL
              const imgElement = document.createElement('img'); // Create an image element
              imgElement.src = imageUrl; // Set the source of the image element
              imgElement.alt = item.fileName; // Use the fileName as alt text for accessibility
              galleryElement.appendChild(imgElement); // Append the image to the gallery container
            });
          })
          .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
          });
      }
    
      // Call the function to fetch and display images
      fetchAndDisplayImages();
    });}