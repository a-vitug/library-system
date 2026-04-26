let bookCache = [];
let currentGenre = 'fiction';

async function fetchBooks(query, maxResults = 20) {
    const res = await fetch(`/api/google-books/search?q=${encodeURIComponent(query)}&maxResults=${maxResults}`);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data.results || [];
}

async function loadGenre(genre) {
    document.querySelectorAll('.filter button').forEach(btn => {
        const isAll = genre === 'all' && btn.textContent === 'All Genres';
        const isMatch = btn.textContent.toLowerCase() === genre.toLowerCase();
        btn.classList.toggle('active', isAll || isMatch);
    });
    currentGenre = genre;
    document.getElementById('bookContainer').innerHTML = '<p>Loading...</p>';
    const query = genre === 'all' ? 'fiction' : genre;
    try {
        const books = await fetchBooks(`subject:${query}`, 20);
        bookCache = books;
        renderCards(books);
    } catch (err) {
        console.error('loadGenre error:', err);
        document.getElementById('bookContainer').innerHTML = '<p>Failed to load books. Please try again.</p>';
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
        <div class="book-card" onclick="openBook(${i})">
            <img src="${book.thumbnail || ''}" alt="${book.title}" onerror="this.style.display='none'">
            <p class="book-title">${book.title || 'Unknown Title'}</p>
            <p class="book-author">${(book.authors || []).join(', ') || 'Unknown Author'}</p>
        </div>
    `).join('');
}

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
}

function closeBook() {
    document.getElementById('bookModal').classList.remove('active');
    document.body.style.overflow = '';
}

function closeModal(e) {
    if (e.target.id === 'bookModal') closeBook();
}

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
}

loadGenre('all');
