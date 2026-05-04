let favoriteBooks = [];
let currentBook = null;

document.addEventListener('DOMContentLoaded', function() {
    loadFavorites();
});

async function loadFavorites() {
    const token = localStorage.getItem('token');
    const content = document.getElementById('favoritesContent');
    const emptyState = document.getElementById('emptyState');

    if (!token) {
        content.innerHTML = `
            <div class="empty-state">
                <h2>Please log in</h2>
                <p>You need to be logged in to view your favorites.</p>
                <a href="/log-in" class="browse-btn">Log In</a>
            </div>
        `;
        return;
    }

    try {
        const response = await fetch('/api/user/favorites', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load favorites');
        }

        favoriteBooks = await response.json();
        renderFavorites();

    } catch (error) {
        console.error('Error loading favorites:', error);
        content.innerHTML = `
            <div class="empty-state">
                <h2>Error loading favorites</h2>
                <p>Please try again later.</p>
                <button onclick="loadFavorites()" class="browse-btn">Retry</button>
            </div>
        `;
    }
}

function renderFavorites() {
    const content = document.getElementById('favoritesContent');
    const emptyState = document.getElementById('emptyState');

    if (!favoriteBooks.length) {
        content.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    content.style.display = 'block';
    emptyState.style.display = 'none';

    content.innerHTML = `
        <div class="favorites-grid">
            ${favoriteBooks.map((book, index) => `
                <div class="favorite-card" onclick="openBookModal(${index})">
                    <div class="favorite-card-header">
                        ${book.thumbnail 
                            ? `<img src="${book.thumbnail}" alt="${book.title}" class="favorite-cover">`
                            : '<div class="favorite-no-cover">📚</div>'
                        }
                    </div>
                    <div class="favorite-card-body">
                        <h3 class="favorite-title">${book.title || 'Unknown Title'}</h3>
                        <p class="favorite-author">
                            ${
                                book.authors?.length
                                    ? book.authors.join(', ')
                                    : book.author || 'Unknown Author'
                            }
                        </p>
                        ${!book.available 
                            ? '<span class="status-badge status-checked-out">Checked Out</span>'
                            : '<span class="status-badge status-available">Available</span>'
                        }
                        ${book.genre && book.genre.length 
                            ? `<span class="favorite-genre">${book.genre[0]}</span>`
                            : ''
                        }
                        <div class="favorite-actions">
                            <button class="action-btn remove-btn" onclick="removeFavoriteFromCard(event, '${book._id}')">
                                Remove
                            </button>
                        ${!book.available 
                            ? '<button class="action-btn borrow-btn" disabled>Unavailable</button>'
                            : `<button class="action-btn borrow-btn" onclick="addToCart(event, '${book._id}')">
                                    Add to Cart
                            </button>`
                        }
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function openBookModal(index) {
    const book = favoriteBooks[index];
    if (!book) return;

    currentBook = book;

    document.getElementById('modalTitle').textContent = book.title || 'Unknown Title';
    document.getElementById('modalAuthor').textContent =
        book.authors?.length
            ? book.authors.join(', ')
            : book.author || 'Unknown Author';
    document.getElementById('modalGenre').textContent = (book.genre || []).join(', ') || 'No genre specified';
    document.getElementById('modalDescription').textContent = book.description || 'No description available.';

    const cover = document.getElementById('modalCover');
    if (book.thumbnail) {
        cover.src = book.thumbnail;
        cover.style.display = 'block';
    } else {
        cover.style.display = 'none';
    }

    const availabilityDiv = document.getElementById('modalAvailability');
    if (!book.available) {
        availabilityDiv.innerHTML = '<span class="status-badge status-checked-out">Checked Out</span>';
        document.getElementById('borrowBtn').disabled = true;
    } else {
        availabilityDiv.innerHTML = '<span class="status-badge status-available">Available</span>';
        document.getElementById('borrowBtn').disabled = false;
    }

    const previewBtn = document.getElementById('modalPreview');
    if (book.googleId) {
        previewBtn.href = `https://books.google.com/books?id=${book.googleId}`;
        previewBtn.style.display = 'inline-block';
    } else {
        previewBtn.style.display = 'none';
    }

    document.getElementById('bookModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('bookModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    currentBook = null;
}

window.onclick = function(event) {
    const modal = document.getElementById('bookModal');
    if (event.target === modal) {
        closeModal();
    }
}

async function removeFavorite() {
    if (!currentBook) return;

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to remove favorites');
        return;
    }

    try {
        const response = await fetch(`/api/user/favorites/${currentBook._id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to remove favorite');
        }

        favoriteBooks = favoriteBooks.filter(book => book._id !== currentBook._id);
        
        closeModal();
        renderFavorites();

    } catch (error) {
        console.error('Error removing favorite:', error);
        alert('Failed to remove favorite. Please try again.');
    }
}

async function removeFavoriteFromCard(event, bookId) {
    event.stopPropagation(); // Prevent opening the modal

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to remove favorites');
        return;
    }

    try {
        const response = await fetch(`/api/user/favorites/${bookId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to remove favorite');
        }

        favoriteBooks = favoriteBooks.filter(book => book._id !== bookId);
        
        renderFavorites();

    } catch (error) {
        console.error('Error removing favorite:', error);
        alert('Failed to remove favorite. Please try again.');
    }
}

async function addToCart(event, bookId) {
    event.stopPropagation();

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to add books to cart');
        return;
    }

    try {
        let cart = JSON.parse(localStorage.getItem("checkoutCart")) || [];
        
        const book = favoriteBooks.find(b => b._id === bookId);

        if (!book.available) {
            alert("This book is already checked out");
            return;
        }

        if (!book) {
            alert('Book not found');
            return;
        }

        if (!cart.some(b => b._id === bookId)) {
            let created = await fetch('/api/books/add-from-api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: book.title,
                    authors: book.authors,
                    genre: book.genre,
                    isbn: book.isbn,
                    thumbnail: book.thumbnail,
                    description: book.description
                })
            });

            const apiBook = await created.json();
            cart.push(apiBook);
            localStorage.setItem("checkoutCart", JSON.stringify(cart));
            
            const goCheckout = confirm("Book added to cart.\n\nPress OK to go to checkout.\nPress Cancel to keep browsing.");
            
            if (goCheckout) {
                window.location.href = "/cart";
            }
        } else {
            alert('This book is already in your cart');
        }

    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add book to cart. Please try again.');
    }
}

async function borrowBook() {
    if (!currentBook) return;

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to borrow books');
        return;
    }

    try {
        let cart = JSON.parse(localStorage.getItem("checkoutCart")) || [];
        
        if (!cart.some(b => b._id === currentBook._id)) {
            let created = await fetch('/api/books/add-from-api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                title: currentBook.title,
                authors: currentBook.authors,
                genre: currentBook.genre,
                isbn: currentBook.isbn,
                thumbnail: currentBook.thumbnail,
                description: currentBook.description
            })
        });

        const apiBook = await created.json();

        cart.push(apiBook);
        localStorage.setItem("checkoutCart", JSON.stringify(cart));
        
        const goCheckout = confirm("Book added to cart.\n\nPress OK to go to checkout.\nPress Cancel to keep browsing.");
        
        if (goCheckout) {
            window.location.href = "/cart";
        } else {
            closeModal();
        }
        } else {
            alert('This book is already in your cart');
        }

    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add book to cart. Please try again.');
    }
}
