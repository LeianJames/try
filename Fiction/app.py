from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

# Initialize the Flask app
app = Flask(__name__)

# Set up SQLite Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///fiction_books.db'  # Use SQLite database for storing books
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define the Book model to represent a table in SQLite database
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    location = db.Column(db.String(255), nullable=False)

# Create the database and the table (if it doesn't exist)
with app.app_context():
    db.create_all()

# Book data from the fictiondatabase.js file (to be inserted into the database)
books_data = [
    {"id": 1, "title": "Regeneration", "author": "Pat Barker,", "description": "Book - 251 pages;", "location": "Nova Schola Main Library"},
    {"id": 2, "title": "ADVERBS: A Novel", "author": "Daniel, Handler, author.", "description": "Book - 272 pages;", "location": "Nova Schola Main Library"},
    {"id": 3, "title": "The Fountainhead", "author": "AYN Rand.", "description": "Book - 696 pages;", "location": "Nova Schola Main Library"},
    {"id": 4, "title": "Eden Burning", "author": "Belva Plain, author.", "description": "Book - 476 pages;", "location": "Nova Schola Main Library"},
    {"id": 5, "title": "The road less travelled", "author": "M. Scott Peck , author.", "description": "Book - 342 pages;", "location": "Nova Schola Main Library"},
    {"id": 6, "title": "James and the Giant Peach", "author": "Roald Dahl, author.", "description": "Book - 230 pages;", "location": "Nova Schola Main Library"},
    {"id": 7, "title": "A Painted House", "author": "Grisham John,", "description": "Book - 456 pages;", "location": "Nova Schola Main Library"}
]

# Insert books into the database (if not already present)
@app.before_first_request
def insert_books():
    with app.app_context():
        for book_data in books_data:
            # Check if the book already exists by its ID
            if not Book.query.filter_by(id=book_data["id"]).first():
                book = Book(
                    id=book_data["id"],
                    title=book_data["title"],
                    author=book_data["author"],
                    description=book_data["description"],
                    location=book_data["location"]
                )
                db.session.add(book)
        db.session.commit()

# Route to display all books
@app.route('/')
def index():
    books = Book.query.all()  # Get all books from the database
    return render_template('fiction.html', books=books)

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
