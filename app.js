document.addEventListener('DOMContentLoaded', function() {
  var uploadForm = document.getElementById('upload-form');

  uploadForm.reset();

  uploadForm.addEventListener('submit', function(e) {
    e.preventDefault();
    uploadPhoto();
  });

  function uploadPhoto() {
    var formData = new FormData();
    var photoInput = document.getElementById('photo-upload');
    formData.append('file', photoInput.files[0]);

    var uploadUrl = 'YOUR_LOGIC_APP_UPLOAD_URL'; // Replace with your Logic App URL for upload

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
      window.location.reload();
    })
    .catch(error => {
      console.error('Error during upload:', error);
    });
  }

  function deleteImage(imageId) {
    var deleteUrl = 'YOUR_LOGIC_APP_DELETE_URL'; // Replace with your Logic App URL for delete

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
      window.location.reload();
    })
    .catch(error => {
      console.error('Error during deletion:', error);
    });
  }

  function updateImage(imageId) {
    console.log('Update logic for image with ID:', imageId);
    // Placeholder function for update logic
    // You will need to implement the actual update functionality here
  }

  function fetchAndDisplayImages() {
    var blobStorageBaseUrl = 'https://pixelhiveb00787643.blob.core.windows.net/pixelhive-img-share-b00787643';
    var logicAppUrl = 'YOUR_LOGIC_APP_GET_URL'; // Replace with your Logic App URL for get images

    fetch(logicAppUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        var galleryElement = document.getElementById('gallery');
        if (!galleryElement) {
          console.error('The gallery element does not exist.');
          return;
        }

        galleryElement.innerHTML = '';

        data.forEach(item => {
          var imageUrl = `${blobStorageBaseUrl}/${item.filePath}`;

          var linkElement = document.createElement('a');
          linkElement.href = `image-detail.html?image=${encodeURIComponent(imageUrl)}&name=${encodeURIComponent(item.fileName)}`;

          var imgElement = document.createElement('img');
          imgElement.src = imageUrl;
          imgElement.alt = item.fileName;
          imgElement.classList.add('gallery-image');

          var deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.onclick = function() {
            deleteImage(item.id);
          };

          var updateButton = document.createElement('button');
          updateButton.textContent = 'Update';
          updateButton.onclick = function() {
            updateImage(item.id);
          };

          linkElement.appendChild(imgElement);
          linkElement.appendChild(deleteButton);
          linkElement.appendChild(updateButton);
          galleryElement.appendChild(linkElement);
        });
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }

  fetchAndDisplayImages();
});

















