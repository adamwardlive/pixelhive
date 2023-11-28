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
    var photoInput = document.getElementById('photo-upload'); 
    formData.append('file', photoInput.files[0]); 

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
      window.location.reload(); 
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
  
        data.sort((a, b) => b._ts - a._ts); 
  
        data.forEach(item => {
          const filePath = item.filePath.startsWith('/pixelhive-img-share-b00787643/') ? item.filePath.split('/pixelhive-img-share-b00787643/')[1] : item.filePath;
          const imageUrl = `${blobStorageBaseUrl}/${filePath}`;
  
          const linkElement = document.createElement('a');
          linkElement.href = `image-detail.html?image=${encodeURIComponent(imageUrl)}&name=${encodeURIComponent(item.fileName)}&timestamp=${encodeURIComponent(item._ts)}&caption=${encodeURIComponent(item.caption)}`;  
          const imgElement = document.createElement('img');
          imgElement.src = imageUrl;
          imgElement.alt = item.fileName;
          imgElement.classList.add('gallery-image');
  
          const updateButton = document.createElement('button');
          updateButton.innerText = 'Update';
          updateButton.onclick = function() { showUpdateForm(item); };
          linkElement.appendChild(updateButton);

          const deleteButton = document.createElement('button');
          deleteButton.innerText = 'Delete';
          deleteButton.onclick = function() { deleteImage(item.id); };
          linkElement.appendChild(deleteButton);

          galleryElement.appendChild(linkElement);

          linkElement.appendChild(imgElement);
          galleryElement.appendChild(linkElement);
        });
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }

  function showUpdateForm(item) {
    // Assuming 'id', 'caption' are properties of the item
    const updateForm = document.getElementById('update-form');
    document.getElementById('update-photo-id').value = item.id;
    document.getElementById('update-photo-caption').value = item.caption;
  
    updateForm.onsubmit = function(e) {
      e.preventDefault();
      const updatedCaption = document.getElementById('update-photo-caption').value;
  
      // Replace with your actual Logic App URL for update
      const updateUrl = 'https://your-logic-app-url-for-update';
  
      fetch(updateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: item.id, caption: updatedCaption })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Update successful:', data);
        // Action after successful update (e.g., refresh the gallery)
        fetchAndDisplayImages();
      })
      .catch(error => {
        console.error('Error during update:', error);
      });
    };
  
    // Show the update form
    document.getElementById('update-section').style.display = 'block';
  }
  

  function deleteImage(imageId) {
    // Confirm before deleting
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }
  
    // Replace with your actual Logic App URL for delete
    const deleteUrl = 'https://your-logic-app-url-for-delete';
  
    fetch(deleteUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: imageId })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Delete successful:', data);
      // Action after successful delete (e.g., refresh the gallery)
      fetchAndDisplayImages();
    })
    .catch(error => {
      console.error('Error during delete:', error);
    });
  }
  

  fetchAndDisplayImages();  
});








