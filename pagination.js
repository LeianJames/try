// Pagination and display logic for book results

document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const bookResultsContainer = document.getElementById('bookResults');
    const paginationContainer = document.getElementById('paginationControls');
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    const totalResultsDisplay = document.getElementById('totalResults');
    
    // Update total results count
    totalResultsDisplay.textContent = books.length;
    
    // Set default values
    let currentPage = 1;
    let itemsPerPage = parseInt(itemsPerPageSelect.value);
    
    // Function to display books for the current page
    function displayBooks() {
        // Clear the container
        bookResultsContainer.innerHTML = '';
        
        // Calculate indexes
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, books.length);
        
        // Display books for current page
        for(let i = startIndex; i < endIndex; i++) {
            const book = books[i];
            const resultNumber = i + 1;
            
            // Create result item
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            resultItem.innerHTML = `
                <div class="result-number">${resultNumber}</div>
                <div class="result-content">
                    <div class="result-title">${book.title}</div>
                    <div class="result-author">${book.author}</div>
                    <div class="result-publication">${book.description} - ${book.pages} pages;</div>
                    <div class="result-actions">
                        <button class="check-availability">Check availability</button>
                        <span class="library-location">${book.location}</span>
                    </div>
                </div>
            `;
            
            bookResultsContainer.appendChild(resultItem);
        }
    }
    
    // Function to create pagination controls
    function createPagination() {
        // Clear pagination container
        paginationContainer.innerHTML = '';
        
        // Calculate total pages
        const totalPages = Math.ceil(books.length / itemsPerPage);
        
        // Create pagination buttons
        for(let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.className = i === currentPage ? 'active' : '';
            
            pageButton.addEventListener('click', function() {
                currentPage = i;
                displayBooks();
                createPagination();
            });
            
            paginationContainer.appendChild(pageButton);
        }
    }
    
    // Listen for changes in items per page
    itemsPerPageSelect.addEventListener('change', function() {
        itemsPerPage = parseInt(this.value);
        currentPage = 1; // Reset to first page
        displayBooks();
        createPagination();
    });
    
    // Initial display
    displayBooks();
    createPagination();
});