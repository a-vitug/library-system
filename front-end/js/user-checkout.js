function updateDueDate() {
    const days = 14;
    const due = new Date();
    due.setDate(due.getDate() + days);

    const formatted = due.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    document.getElementById('dueDate').textContent = formatted;
    document.getElementById('toastDate').textContent = formatted;
}

function loadCartBooks() {
    const books = JSON.parse(localStorage.getItem("checkoutCart")) || [];
    const container = document.querySelector('.checkout-books');
    const emptyState = document.getElementById('emptyState');

    container.querySelectorAll('.book-item').forEach(el => el.remove());

    if (!books.length) {
        emptyState.style.display = 'block';
        document.getElementById('checkoutBtn').disabled = true;
        document.getElementById('bookCount').textContent = 0;
        return;
    }

    emptyState.style.display = 'none';

    books.forEach((book, i) => {
        container.insertAdjacentHTML('beforeend', `
            <div class="book-item" id="bookItem${i}">
                <div class="book-item-cover book-item-placeholder"></div>
                <div class="book-item-info">
                    <p class="book-item-title">${book.title}</p>
                    <p class="book-item-author">
                        ${book.authors?.join(', ') || book.author || "Unknown Author"}
                    </p>

                    ${
                        book.available === false
                        ? '<span class="status-badge status-checked-out">Checked Out</span>'
                        : '<span class="status-badge status-available">Available</span>'
                    }
                </div>

                <button class="remove-btn" onclick="removeItem('bookItem${i}', '${book._id}')">
                    ✕
                </button>
            </div>
        `);
    });

    updateBookCount();
}

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
    document.getElementById('emptyState').style.display = count === 0 ? 'block' : 'none';
    document.getElementById('checkoutBtn').disabled = count === 0;
};

async function confirmCheckout() {
    const token = localStorage.getItem('token');
    const cart = JSON.parse(localStorage.getItem("checkoutCart")) || [];

    if (!cart.length) return;

    try {
        for (let book of cart) {
            const res = await fetch(`/books/checkout/${book._id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error("Error checking out a book");
            }
        }

        const toast = document.getElementById('toast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);

        localStorage.removeItem("checkoutCart");

        loadCartBooks();

    } catch (err) {
        console.error(err);
        alert("Error during checkout");
    }
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
    emptyState.innerHTML = `<p>No borrowed books yet.</p>`;
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

  localStorage.removeItem("justCheckedOut");
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