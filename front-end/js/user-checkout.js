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
    const emptyState = document.getElementById('emptyState');
    const items = container.querySelectorAll('.book-item');

    items.forEach(item => item.remove());

    if(!books.length) {
        emptyState.style.display = 'block';
        document.getElementById('checkoutBtn').disabled = true;
        document.getElementById('bookCount').textContent = 0;
        return;
    }

    emptyState.style.display = 'none';

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
        ).join('')}`
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
    const cart = JSON.parse(localStorage.getItem("checkoutCart")) || [];
    const count = cart.length;
    document.getElementById('bookCount').textContent = count;
    document.getElementById('emptyState').style.display = count === 0 ? 'block':'none';
    document.getElementById('checkoutBtn').disabled = count === 0;
};

async function confirmCheckout() {
    const token = localStorage.getItem('token');
    const cart = JSON.parse(localStorage.getItem("checkoutCart")) || [];

    if (!cart.length) return;

    for (let book of cart) {
        await fetch(`/books/checkout/${book._id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
    localStorage.removeItem("checkoutCart");

    loadCartBooks();
}

async function loadBooks() {
  const token = localStorage.getItem('token');

  const res = await fetch('/api/user/my-books', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const books = await res.json();
  const container = document.querySelector('.checkout-books');
  const emptyState = document.getElementById('emptyState');  

  container.innerHTML = `<h2 class="section-heading">Selected Books</h2>`;

  if (!books.length) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  books.forEach(book => {
    const div = document.createElement('div');
    div.className = 'book-item';

    div.innerHTML = `
      <div class="book-item-cover book-item-placeholder"></div>
      <div class="book-item-info">
        <p class="book-item-title">${book.title}</p>
        <p class="book-item-author">${book.author}</p>
      </div>
      <button class="remove-btn" onclick="returnBook('${book._id}')">&#x2715;</button>
    `;

    container.appendChild(div);
  });
}

async function returnBook(id) {
  const token = localStorage.getItem('token');

  await fetch(`/books/return/${id}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  loadBooks();
}

updateDueDate();
loadCartBooks();