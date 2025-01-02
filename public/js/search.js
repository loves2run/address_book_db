import { initializeDeleteModal, serveDeleteSuccessModal, initializeModalsOnLoad } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const clearButton = document.getElementById('clearSearch');
    const cardContainer = document.querySelector('.card-container');
    const deleteButtons = document.querySelectorAll('.btn-delete');

    // console.log('Initial pagination element:', document.querySelector('.pagination'));

    //initialize delete modal on initial page load
    initializeDeleteModal();
   
    // Function to show/hide loading indicator
    const toggleLoading = (show) => {
        loadingIndicator.style.display = show ? 'block' : 'none';
    };

    // Function to create address card HTML matching existing structure
    const createAddressCard = (address) => {
        return `
            <div class="card">
                <div class="card-title">
                    <h2>${address.firstName} ${address.lastName}</h2>
                </div>
                <div class="card-body">
                    <div class="card-section">
                        <p>Phone</p>
                        <p>${address.phone || 'N/A'}</p>
                    </div>
                    <div class="card-section">
                        <p>Email</p>
                        <p>${address.email || 'N/A'}</p>
                    </div>              
                    <div class="card-section">
                        <p>Address</p>
                        <p>${address.streetAddress}</p>
                        <p>${address.city}, ${address.state} ${address.zipCode}</p>
                    </div>
                    <div class="card-section">
                        <p>Categories</p>
                        <p>${address.category}</p>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn-edit btn">
                        <a href="/api/edit/${address._id}" class="btn">Edit</a><br>
                    </button>
                    <button 
                        class="btn-delete btn"
                        type="button"
                        data-id="${address._id}"
                        data-name="${address.firstName} ${address.lastName}"
                        data-address="${address.streetAddress}, ${address.city} ${address.state} ${address.zipCode}"
                    >
                        Delete
                    </button>
                </div>
            </div>
        `;
    };

    // Function to create pagination HTML
    const createPaginationHTML = (pagination) => {
        console.log('Pagination data:', pagination);
        const { currentPage, totalPages, totalResults } = pagination;
        let paginationHtml = '<div class="pagination">';
        
        // Previous page button
        if (currentPage > 1) {
            paginationHtml += `<button class="pagination-btn btn" data-page="${currentPage - 1}">Previous</button>`;
        }

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `
                <button class="pagination-btn btn ${i === currentPage ? 'active' : ''}" 
                    data-page="${i}">${i}</button>`;
        }

        // Next page button
        if (currentPage < totalPages) {
            paginationHtml += `<button class="pagination-btn btn" data-page="${currentPage + 1}">Next</button>`;
        }

        paginationHtml += '</div>';
        return paginationHtml;
    };

    // Function to perform the search
    const performSearch = async (formData, page = 1) => {
        try {
            toggleLoading(true);
            
            // Build query string from form data
            const params = new URLSearchParams(formData);
            params.append('page', page);
            params.append('sortBy', document.getElementById('sortBy').value);
            params.append('sortOrder', document.getElementById('sortOrder').value);

            // Fetch results from API
            const response = await fetch(`/api/search?${params.toString()}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Search response:', data);
            
            // Clear previous results
            cardContainer.innerHTML = '';
            
            if (data.results.length === 0) {
                cardContainer.innerHTML = '<p class="no-results">No results found</p>';
                return;
            }

            // Display results
            data.results.forEach(address => {
                cardContainer.innerHTML += createAddressCard(address);
            });

            // Add pagination
            if (data.pagination) {
                const paginationElement = document.querySelector('.pagination');
                console.log('Found pagination element:', !!paginationElement);

                const paginationHTML = createPaginationHTML(data.pagination);
                console.log('Generated pagination HTML:', paginationHTML);

                document.querySelector('.pagination').innerHTML = paginationHTML;
                
                // Add event listeners to pagination buttons
                document.querySelectorAll('.pagination-btn').forEach(button => {
                    button.addEventListener('click', () => {
                        console.log('Pagination button clicked:', button.dataset.page);
                        performSearch(formData, parseInt(button.dataset.page));
                    });
                });
            }

            //ensure delete modal exists after results are loaded
            ensureModalExists();

        } catch (error) {
            console.error('Search error:', error);
            cardContainer.innerHTML = `
                <p class="error-message">
                    An error occurred while searching. Please try again later.
                </p>
            `;
        } finally {
            toggleLoading(false);
        }
    };

    const initialFormData = new FormData(searchForm);
    performSearch(initialFormData, 1);

    // Event delegation for delete button function
    cardContainer.addEventListener('click', (event) => {

        if (event.target.classList.contains('btn-delete')) {

            console.log('Delete button clicked:', event.target.dataset);

            const button = event.target;
            const id = button.dataset.id;
            const name = button.dataset.name;
            const address = button.dataset.address;

            console.log('Delete button data:', { id, name, address });
    
            // Update modal content
            const modalName = document.getElementById('modalName');
            const modalAddress = document.getElementById('modalAddress');
            const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
            const deleteModal = document.getElementById('deleteModal');
    
            modalName.textContent = name;
            modalAddress.textContent = address;
            confirmDeleteBtn.setAttribute('data-id', id);
            deleteModal.classList.add('show');
        }
    });

    // Handle form submission
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(searchForm);
        await performSearch(formData);
    });

    // Handle clear button
    clearButton.addEventListener('click', () => {
        searchForm.reset();
        // Reset to first page of full results
        performSearch(new FormData());
    });

    // Add debounced real-time search
    const debounce = (fn, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    };

    // Add input event listeners for real-time search
    const inputs = searchForm.querySelectorAll('.search-input');
    const debouncedSearch = debounce(() => {
        const formData = new FormData(searchForm);
        performSearch(formData);
    }, 300);

    inputs.forEach(input => {
        input.addEventListener('input', debouncedSearch);
    });

    // Handle sorting changes
    document.getElementById('sortBy').addEventListener('change', debouncedSearch);
    document.getElementById('sortOrder').addEventListener('change', debouncedSearch);

    //ensures delete modal is added after search
    const ensureModalExists = () => {
        const modal = document.getElementById('deleteModal');
        if (!modal) {
            const modalHTML = `
                <div id="deleteModal" class="modal">
                <div class="modalContent">
                    <h2>Delete Address</h2>
                    <p id="modalText">Are you sure you want to delete this address?</p>
                    <p id="modalName"></p>
                    <p id="modalAddress"></p>
                    <button type="button" class="btn" id="confirmDeleteBtn" data-id="">Confirm</button>
                    <button type="button" class="btn" id="cancelDeleteBtn">Cancel</button>
                </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // addModalListeners();
            initializeDeleteModal();
        }
    };
});