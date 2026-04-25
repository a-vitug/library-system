async function fetchBooks(query, maxResults = 20) {
    const res = await fetch(`/api/google-books/search?q=${encodeURIComponent(query)}&maxResults=${maxResults}`);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    return data.results || [];
}

async function loadGenre(genre) {
    document.getElementById('bookContainer').innerHTML = '<p>Loading...</p>';

    const books = await fetchBooks(`subject:${genre}`, 20);
    renderCards(books);
}

function renderCards(books) {
    const container = document.getElementById('bookContainer');
    if (!books.length) {
        container.innerHTML = '<p>No books found.</p>';
        return;
    }
    container.innerHTML = books.map(book => `
        <div class="book-card">
            <img src="${book.thumbnail || ''}" alt="${book.title}" onerror="this.style.display='none'">
            <p class="book-title">${book.title || 'Unknown Title'}</p>
            <p class="book-author">${(book.authors || []).join(', ') || 'Unknown Author'}</p>
        </div>
    `).join('');
}

async function handleSearch(e) {
    e.preventDefault();
    const q = document.getElementById('searchInput').value.trim();
    if (!q) return;
    document.getElementById('bookContainer').innerHTML = '<p>Searching...</p>';
    const books = await fetchBooks(q, 20);
    renderCards(books);
}
loadGenre('fiction');