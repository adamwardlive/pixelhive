document.addEventListener('DOMContentLoaded', function() {
  var uploadForm = document.getElementById('upload-form');

  // Clear the form on page load
  uploadForm.reset();

  uploadForm.addEventListener('submit', function(e) {
    e.preventDefault();
    uploadPhoto();
  });

  function uploadPhoto() {
    var formData = new FormData();
    var photoInput = document.getElementById('photo-upload'); // Make sure this is the ID of your file input
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
      window.location.reload(); // This will refresh the page
    })
    .catch(error => {
      console.error('Error during upload:', error);
    });
  }

  function deleteImage(imageId) {
    var deleteUrl = 'https://prod-52.northeurope.logic.azure.com:443/workflows/e20b0a7c9bd44a4ebdc0f78ba4805284/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=NlDLlEi3MEJhdjVXcEy-EiOuszn-p4MLSJrEelYe-ag'; // Replace with your actual Logic App DELETE endpoint URL

    fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: imageId }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Image deleted successfully:', data);
      window.location.reload(); // This will refresh the page
    })
    .catch(error => {
      console.error('Error during deletion:', error);
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
  
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.onclick = function() {
            event.preventDefault(); // Prevent the default anchor tag behavior
            event.stopPropagation(); // Stop the click from "bubbling" up to other elements
            deleteImage(item.id); // Replace with the correct property for image ID
          };
  
          linkElement.appendChild(imgElement);
          linkElement.appendChild(deleteButton); // Append the delete button next to the image
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
















