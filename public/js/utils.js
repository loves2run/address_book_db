// utils.js

const initializeDeleteModal = () => {
    const deleteModal = document.getElementById('deleteModal');
    const modalText = document.getElementById('modalText');
    const modalName = document.getElementById('modalName');
    const modalAddress = document.getElementById('modalAddress');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const deleteSuccessModal = document.getElementById('deleteSuccessModal');

    // Handle confirm delete
    confirmDeleteBtn.addEventListener('click', async () => {
        const id = confirmDeleteBtn.getAttribute('data-id');

        try {
            const response = await fetch(`/api/delete/${id}`, { method: 'DELETE' });

            if (response.ok) {
                deleteModal.classList.remove('show');
                serveDeleteSuccessModal();
            } else {
                alert('Error deleting address. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting address:', error);
        }

    });

    const hideModal = () => deleteModal.classList.remove('show');
    cancelDeleteBtn.addEventListener('click', hideModal);
    window.addEventListener('click', (event) => {
        if (event.target === deleteModal) hideModal();
    });
};

const serveDeleteSuccessModal = () => {
     // Show delete success modal
     if(!document.getElementById('deleteSuccessModal')) {
        const modalHTML = `
        <div id="deleteSuccessModal" class="modal">
        <div class="modalContent">
            <h2>Address Successfully Deleted!</h2>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML)
     }

     //show the modal
     deleteSuccessModal.classList.add('show');

     // Reload page or remove element from DOM
     setTimeout(() => {
         window.location.reload();
     }, 2000);
};

const initializeModalsOnLoad = () => {
    window.onload = function () {
        const urlParams = new URLSearchParams(window.location.search);

        // Check for success flag on edit
        if (urlParams.get('success') === 'true') {
            showEditModal();
        }

        // Check for added flag when a new address is added
        if (urlParams.get('added') === 'true') {
            showAddModal();
        }
    };
};

export { initializeDeleteModal, serveDeleteSuccessModal, initializeModalsOnLoad };