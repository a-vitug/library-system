let bookCache = [];
let currentGenre = 'fiction';
let currentBookId = null;
let currentBook = null;
let borrowedBookIds = [];

async function fetchBooks(query, maxResults = 100) {
    const res = await fetch(`/api/google-books/search?q=${encodeURIComponent(query)}&maxResults=${maxResults}`);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data.results || [];
};

async function loadGenre(genre) {
    const container = document.getElementById('bookContainer');

    document.querySelectorAll('.filter button').forEach(btn => {
        const isAll = genre === 'all' && btn.textContent === 'All Genres';
        const isMatch = btn.textContent.toLowerCase() === genre.toLowerCase();
        btn.classList.toggle('active', isAll || isMatch);
    });

    currentGenre = genre;
    container.innerHTML = '<p>Loading...</p>';

    const query = genre === 'all' ? 'fiction' : genre;

    try {
        const books = await fetchBooks(`subject:${query}`, 100);

        if (!Array.isArray(books)) {
            throw new Error("Invalid books data");
        }

        bookCache = books;

        try {
            await loadBorrowedBooks();
        } catch (err) {
            console.warn("Borrowed books failed:", err);
        }

        renderCards(books);

    } catch (err) {
        console.error('loadGenre error:', err);
        container.innerHTML = '<p>Failed to load books. Please try again.</p>';
    }
}

function renderCards(books) {
    bookCache = books;
    const container = document.getElementById('bookContainer');
    if (!books.length) {
        container.innerHTML = '<p>No books found.</p>';
        return;
    }
    container.innerHTML = books.map((book, i) => `
        <div class="book-item-wrapper" onclick="openBook(${i})">
            <div class="book-card-stack">
                <div class="book-card-back"></div>
                <div class="book-card">
                    <img src="${book.thumbnail || '/images/no-cover.png'}" alt="${book.title}" onerror="this.src='/images/no-cover.png'">
                </div>
            </div>
            <p class="book-title">${book.title || 'Unknown Title'}</p>
            <p class="book-author">${(book.authors || []).join(', ') || 'Unknown Author'}</p>
            ${
                borrowedBookIds.includes(book._id?.toString())
                    ? '<span class="status-badge status-checked-out">Already Borrowed</span>'
                    : book.available !== undefined
                        ? book.available
                            ? '<span class="status-badge status-available">Available</span>'
                            : '<span class="status-badge status-checked-out">Checked Out</span>'
                        : ''
            }
        </div>
    `).join('');
};

function openBook(index) {
    const book = bookCache[index];
    if (!book) return;

    const cover = document.getElementById('modalCover');
    if (book.thumbnail) {
        cover.src = book.thumbnail;
        cover.style.display = 'block';
    } else {
        cover.style.display = 'none';
    }

    document.getElementById('modalTitle').textContent = book.title || 'Unknown Title';
    document.getElementById('modalAuthor').textContent = (book.authors || []).join(', ') || 'Unknown Author';
    document.getElementById('modalGenre').textContent = currentGenre.charAt(0).toUpperCase() + currentGenre.slice(1);
    document.getElementById('modalDescription').textContent = book.description || 'No description available.';

    const previewBtn = document.getElementById('modalPreview');
    if (book.googleId) {
        previewBtn.href = `https://books.google.com/books?id=${book.googleId}`;
        previewBtn.style.display = 'inline-block';
    } else {
        previewBtn.style.display = 'none';
    }

    document.getElementById('bookModal').classList.add('active');
    document.body.style.overflow = 'hidden';

    window.currentBook = book;

    const borrowBtn = document.querySelector('.book-actions button:nth-child(2)');

    if (borrowedBookIds.includes(book._id?.toString())) {
        borrowBtn.textContent = "Already Borrowed";
        borrowBtn.disabled = true;
    } else if (book.available === false) {
        borrowBtn.textContent = "Checked Out";
        borrowBtn.disabled = true;
    } else {
        borrowBtn.textContent = "Add to Cart";
        borrowBtn.disabled = false;
    }

    currentBook = book;
    currentBookId = book._id;

    const modalInfo = document.querySelector('.modal-info');
};

function closeBook() {
    document.getElementById('bookModal').classList.remove('active');
    document.body.style.overflow = '';
};

function closeModal(e) {
    if (e.target.id === 'bookModal') {
        document.getElementById('bookModal').classList.remove('active');
        closeBook();
    };
};

async function handleSearch(e) {
    e.preventDefault();
    const q = document.getElementById('searchInput').value.trim();
    if (!q) return;
    document.getElementById('bookContainer').innerHTML = '<p>Searching...</p>';
    try {
        const books = await fetchBooks(q, 20);
        renderCards(books);
    } catch (err) {
        console.error('handleSearch error:', err);
        document.getElementById('bookContainer').innerHTML = '<p>Search failed. Please try again.</p>';
    }
};

async function saveFavorite(){
    const token = localStorage.getItem('token');

    if(!token) {
        alert("User needs to be logged in");
        return;
    }

    const book = currentBook;

    let created = await fetch('/api/books/add-from-api',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            Authorization:`Bearer ${token}`
        },
        body: JSON.stringify({
            title: book.title,
            authors: book.authors,
            categories: book.categories,
            isbn: book.isbn13 || book.isbn10 || book.googleId,
            thumbnail: book.thumbnail,
            description: book.description,
        })
    });

    let apiBook = await created.json();

    await fetch(`/api/user/favorites/${apiBook._id}`,{
        method:'POST',
        headers:{
        Authorization:`Bearer ${token}`
        }
    });

    alert("Added to favorites");
};

async function borrowBook() {
    try {
        if (!currentBook) return;

        if (borrowedBookIds.includes(currentBook._id?.toString())) {
            alert("You already borrowed this book.");
            return;
        }

        if (currentBook.available === false) {
            alert("This book is currently checked out.");
            return;
        }

        const token = localStorage.getItem('token');

        if(!token) {
            alert("Please log in first.");
            return;
        }

        let created = await fetch('/api/books/add-from-api', {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${token}`
            },
            body: JSON.stringify({
                title: currentBook.title,
                authors: currentBook.authors,
                isbn: currentBook.isbn13
            })
        });

        if(!created.ok){
            alert("Could not add book.");
            return;
        }

        let apiBook = await created.json();
        let cart = JSON.parse(localStorage.getItem("checkoutCart")) || [];

        if (cart.find(b => b._id === apiBook._id)) {
            alert("This book is already in your cart.");
            return;
        }

        cart.push(apiBook);
        localStorage.setItem("checkoutCart", JSON.stringify(cart));

        const goCheckout = confirm("Book added to cart.\n\nPress OK to go to check out.\nPress Cancel to keep browsing for more books.");

        if(goCheckout) {
            window.location.href="/cart";
        } else {
            closeBook();
        };

    } catch(err) {
        console.error(err);
        alert("Something went wrong.");
    };
};

async function loadBorrowedBooks() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const res = await fetch('/api/user/my-books', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const books = await res.json();
        borrowedBookIds = books.map(b => b._id?.toString());

    } catch (err) {
        console.error("Failed to load borrowed books", err);
    }
}

loadGenre('all');
