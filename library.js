document.addEventListener('DOMContentLoaded', function() {
    // Get query parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'SelfGrowth';
    const searchQuery = urlParams.get('search') || '';
    const page = parseInt(urlParams.get('page') || '1');
    
    // Update search query display
    document.getElementById('searchQuery').textContent = category;
    
    // Set up event listeners
    document.getElementById('sortBy').addEventListener('change', handleSortChange);
    document.getElementById('itemsPerPage').addEventListener('change', handlePerPageChange);
    
    // Load initial data
    loadBooks();
    
    function loadBooks() {
      const perPage = document.getElementById('itemsPerPage').value;
      const sortBy = document.getElementById('sortBy').value;
      
      // Construct API URL with parameters
      const url = `/api/books?category=${encodeURIComponent(category)}&search=${encodeURIComponent(searchQuery)}&page=${page}&per_page=${perPage}&sort=${sortBy}`;
      
      // Fetch books from API
      fetch(url)
        .then(response => response.json())
        .then(data => {
          displayBooks(data.books);
          displayPagination(data.pagination);
          document.getElementById('totalResults').textContent = data.pagination.total;
        })
        .catch(error => {
          console.error('Error fetching books:', error);
          document.getElementById('bookResults').innerHTML = '<p>Error loading books. Please try again later.</p>';
        });
    }
    
    function displayBooks(books) {
      const resultsContainer = document.getElementById('bookResults');
      resultsContainer.innerHTML = '';
      
      if (books.length === 0) {
        resultsContainer.innerHTML = '<p>No books found matching your criteria.</p>';
        return;
      }
      
      books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.className = 'result-item';
        bookElement.innerHTML = `
          <div class="result-details">
            <h3>${book.title}</h3>
            <p class="author">By ${book.author}</p>
            <p class="description">${book.description} ${book.pages ? book.pages + ' pages' : ''}</p>
            <p class="location">Location: ${book.location}</p>
          </div>
          <div class="result-actions">
            <button class="borrow-btn">Borrow</button>
            <button class="reserve-btn">Reserve</button>
          </div>
        `;
        resultsContainer.appendChild(bookElement);
      });
    }
    
    function displayPagination(pagination) {
      const paginationContainer = document.getElementById('paginationControls');
      paginationContainer.innerHTML = '';
      
      if (pagination.total_pages <= 1) {
        return;
      }
      
      // Previous button
      if (pagination.current_page > 1) {
        addPaginationButton(paginationContainer, pagination.current_page - 1, '&laquo; Previous');
      }
      
      // Page numbers
      const startPage = Math.max(1, pagination.current_page - 2);
      const endPage = Math.min(pagination.total_pages, pagination.current_page + 2);
      
      for (let i = startPage; i <= endPage; i++) {
        addPaginationButton(paginationContainer, i, i.toString(), i === pagination.current_page);
      }
      
      // Next button
      if (pagination.current_page < pagination.total_pages) {
        addPaginationButton(paginationContainer, pagination.current_page + 1, 'Next &raquo;');
      }
    }
    
    function addPaginationButton(container, pageNum, label, isActive = false) {
      const button = document.createElement('button');
      button.className = isActive ? 'active' : '';
      button.innerHTML = label;
      button.addEventListener('click', () => navigateToPage(pageNum));
      container.appendChild(button);
    }
    
    function navigateToPage(pageNum) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('page', pageNum);
      window.location.href = newUrl.toString();
    }
    
    function handleSortChange(event) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('sort', event.target.value);
      newUrl.searchParams.set('page', 1); // Reset to first page when sorting changes
      window.location.href = newUrl.toString();
    }
    
    function handlePerPageChange(event) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('per_page', event.target.value);
      newUrl.searchParams.set('page', 1); // Reset to first page
      window.location.href = newUrl.toString();
    }
  });