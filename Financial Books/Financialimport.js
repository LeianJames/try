// This script will send the book data to Flask

document.addEventListener('DOMContentLoaded', function() {
    // Create an import button
    const importButton = document.createElement('button');
    importButton.textContent = 'Import Books to Database';
    importButton.style.padding = '10px';
    importButton.style.backgroundColor = '#4CAF50';
    importButton.style.color = 'white';
    importButton.style.border = 'none';
    importButton.style.borderRadius = '4px';
    importButton.style.cursor = 'pointer';
    importButton.style.margin = '10px 0';
    
    // Add button to the page (adjust this selector to match your HTML structure)
    document.body.insertBefore(importButton, document.body.firstChild);
    
    // Add click event handler
    importButton.addEventListener('click', function() {
        // Check if books variable exists (loaded from Financialdatabase.js)
        if (typeof books !== 'undefined') {
            // Send books to Flask API
            fetch('/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(books)
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
            })
            .catch(error => {
                console.error('Error importing books:', error);
                alert('Error importing books. See console for details.');
            });
        } else {
            alert('Books data not found. Make sure Financialdatabase.js is loaded.');
        }
    });
});