from flask import Flask, request, jsonify
import sqlite3
import os

app = Flask(__name__, static_folder='Financial Books')


# Database setup
DB_FILE = 'financial_books.db'

def setup_database():
    """Create the database and books table if they don't exist"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Create books table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        description TEXT NOT NULL,
        location TEXT NOT NULL
    )
    ''')
    
    conn.commit()
    conn.close()

@app.route('/')
def index():
    """Serve the main HTML file"""
    return app.send_static_file('Financial.html')

@app.route('/api/books', methods=['POST'])
def import_books():
    """Receive book data and store in SQLite"""
    books = request.json
    
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    inserted_count = 0
    for book in books:
        # Check if book with this ID already exists
        cursor.execute('SELECT id FROM books WHERE id = ?', (book['id'],))
        existing = cursor.fetchone()
        
        if not existing:
            cursor.execute(
                'INSERT INTO books (id, title, author, description, location) VALUES (?, ?, ?, ?, ?)',
                (book['id'], book['title'], book['author'], book['description'], book['location'])
            )
            inserted_count += 1
    
    conn.commit()
    conn.close()
    
    return jsonify({
        'success': True,
        'message': f'Imported {inserted_count} new books',
        'total_books': get_book_count()
    })

@app.route('/api/books', methods=['GET'])
def get_books():
    """Return all books from the database"""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row  # This lets us access columns by name
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM books')
    books = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    return jsonify(books)

def get_book_count():
    """Return the total number of books in the database"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM books')
    count = cursor.fetchone()[0]
    conn.close()
    return count

if __name__ == '__main__':
    setup_database()
    app.run(debug=True)