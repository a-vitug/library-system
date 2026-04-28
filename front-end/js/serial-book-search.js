let bookCache = [];

function isISBN(q) {
    const digits = q.replace(/[-\s]/g, '');
    return /^\d{10}$|^\d{13}$/.test(digits);
}

async function handleSearch(e) {
    e.preventDefault();
    const q = document.getElementById('searchInput').value.trim();
    if (!q) return;

    const clean = q.replace(/[-\s]/g, '');
    if (isISBN(q)) {
        await searchByISBN(clean);
    } else {
        await searchByTitle(q);
    }
}

async function searchByTitle(q) {
    const results = document.getElementById('results');
    results.innerHTML = '<p class="empty-msg">Searching...</p>';
    try {
        const res = await fetch(`/api/google-books/search?q=${encodeURIComponent(q)}&maxResults=20`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const books = data.results || [];
        bookCache = books;
        if (!books.length) {
            results.innerHTML = '<p class="empty-msg">No books found.</p>';
            return;
        }
        results.innerHTML = `<div class="bookContainer">${books.map((book, i) => `
            <div class="book-item-wrapper" onclick="openBook(${i})">
                <div class="book-card-stack">
                    <div class="book-card-back"></div>
                    <div class="book-card">
                        <img src="${book.thumbnail || '/images/no-cover.png'}" alt="${book.title}" onerror="this.src='/images/no-cover.png'">
                    </div>
                </div>
                <p class="book-title">${book.title || 'Unknown Title'}</p>
                <p class="book-author">${(book.authors || []).join(', ') || 'Unknown Author'}</p>
            </div>
        `).join('')}</div>`;
    } catch {
        results.innerHTML = '<p class="empty-msg">Search failed. Please try again.</p>';
    }
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

    const isbn = book.isbn13 || book.isbn10;
    const isbnEl = document.getElementById('modalISBN');
    if (isbn) {
        isbnEl.textContent = `ISBN: ${isbn}`;
        isbnEl.style.display = 'block';
    } else {
        isbnEl.style.display = 'none';
    }

    document.getElementById('modalTitle').textContent = book.title || 'Unknown Title';
    document.getElementById('modalAuthor').textContent = (book.authors || []).join(', ') || 'Unknown Author';
    document.getElementById('modalGenre').textContent = (book.categories || []).join(', ') || '';
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

async function searchByISBN(isbn) {
    const results = document.getElementById('results');
    results.innerHTML = '<p class="empty-msg">Searching...</p>';

    const token = localStorage.getItem('token');
    if (!token) {
        results.innerHTML = '<p class="empty-msg">You must be logged in to search the catalog.</p>';
        return;
    }

    try {
        const res = await fetch(`/api/books/search?isbn=${encodeURIComponent(isbn)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 404) {
            results.innerHTML = '<p class="empty-msg">No book with that serial number is in the catalog.</p>';
            return;
        }
        if (!res.ok) {
            results.innerHTML = '<p class="empty-msg">Lookup failed. Please try again.</p>';
            return;
        }

        const book = await res.json();
        renderSerialResult(book);
    } catch {
        results.innerHTML = '<p class="empty-msg">Lookup failed. Please try again.</p>';
    }
}

function renderSerialResult(book) {
    const statusBadge = book.available
        ? '<span class="status-badge status-available">Available</span>'
        : '<span class="status-badge status-checked-out">Checked Out</span>';

    const borrower = book.checkedOutBy;
    const due = book.dueDate ? new Date(book.dueDate).toLocaleDateString() : null;

    const borrowerInfo = !book.available && borrower ? `
        <p class="serial-detail"><span class="detail-label">Borrower:</span> ${borrower.username} (${borrower.email})</p>
        ${due ? `<p class="serial-detail"><span class="detail-label">Due:</span> ${due}</p>` : ''}
    ` : '';

    document.getElementById('results').innerHTML = `
        <div class="serial-result-card">
            ${book.thumbnail ? `<img src="${book.thumbnail}" alt="Cover" class="serial-cover" onerror="this.style.display='none'">` : ''}
            <div class="serial-info">
                <p class="serial-detail"><span class="detail-label">ISBN:</span> ${book.isbn}</p>
                <h2 class="serial-title">${book.title || 'Unknown Title'}</h2>
                <p class="serial-detail"><span class="detail-label">Author:</span> ${book.author || 'Unknown'}</p>
                ${(book.genre || []).length ? `<p class="serial-detail"><span class="detail-label">Genre:</span> ${book.genre.join(', ')}</p>` : ''}
                <div class="serial-status">${statusBadge}</div>
                ${borrowerInfo}
            </div>
        </div>
    `;
}
