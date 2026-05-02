function updateDueDate() {
    const days = 14;
    const due = new Date();
    due.setDate(due.getDate() + days);

    document.getElementById('dueDate').textContent =
        due.toLocaleDateString('en-US', {
            month:'short',
            day:'numeric',
            year:'numeric'
    });

    document.getElementById('toastDate').textContent = document.getElementById('dueDate').textContent;
}

function loadCartBooks() {
    const books = JSON.parse(localStorage.getItem("checkoutCart")) || [];

    const container = document.querySelector('.checkout-books');

    if(!books.length) {
        document.getElementById('emptyState').style.display = 'block';
        document.getElementById('checkoutBtn').disabled = true;
        return;
    }

    container.innerHTML = 
        `<h2 class="section-heading">Selected Books</h2>

        ${books.map((book,i) =>
            `<div class = "book-item" id = "bookItem${i}">
                <div class = "book-item-cover book-item-placeholder"></div>
                <div class = "book-item-info">
                    <p class = "book-item-title">${book.title}</p>
                    <p class = "book-item-author">${book.author || "Unknown Author"}</p>
                    ${book.available !== undefined
                        ? book.available
                            ? '<span class="status-badge status-available">Available</span>'
                            : '<span class="status-badge status-checked-out">Checked Out</span>'
                        : '<span class="book-item-badge">Available</span>'
                    }
                </div>
                <button class = "remove-btn" onclick = "removeItem('bookItem${i}', '${book._id}')"> ✕ </button>
            </div>`
        ).join('')}

        <div class = "empty-state" id = "emptyState" style = "display:none;">
            <p>No books selected.</p>
        </div>`
    ;

    updateBookCount();
};

function removeItem(id, bookId) {
    let cart = JSON.parse(localStorage.getItem("checkoutCart")) || [];

    cart = cart.filter(book => book._id !== bookId);

    localStorage.setItem("checkoutCart", JSON.stringify(cart));

    const item=document.getElementById(id);

    if(item) {
        item.style.opacity='0';

        setTimeout(() => {
            item.remove();
            updateBookCount();
        }, 200);
    }
};

function updateBookCount() {
    const count = document.querySelectorAll('.book-item').length;
    document.getElementById('bookCount').textContent = count;
    document.getElementById('emptyState').style.display = count === 0 ? 'block':'none';
    document.getElementById('checkoutBtn').disabled = count === 0;
};

function confirmCheckout() {
    const count = document.querySelectorAll('.book-item').length;
    if(!count) return;
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
    localStorage.removeItem("checkoutCart");
};

updateDueDate();
loadCartBooks();