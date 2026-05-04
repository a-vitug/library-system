let orderBooks = [];
let currentBook = null;

document.addEventListener('DOMContentLoaded', function() {
    loadOrders();
});

async function loadOrders() {
    const token = localStorage.getItem('token');
    const content = document.getElementById('ordersContent');
    const emptyState = document.getElementById('emptyState');

    if (!token) {
        content.innerHTML = `
            <div class="empty-state">
                <h2>Please log in</h2>
                <p>You need to be logged in to view your orders.</p>
                <a href="/pages/authentication/log-in.html" class="browse-btn">Log In</a>
            </div>
        `;
        return;
    }

    try {
        console.log("TOKEN SENT:", `Bearer ${token}`);
        const response = await fetch('/api/user/orders', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load orders');
        }

        const data = await response.json();
        console.log("DATA:", data);

        orderBooks = data;
        renderOrders();

    } catch (error) {
        console.error('Error loading orders:', error);
        content.innerHTML = `
            <div class="empty-state">
                <h2>Error loading orders</h2>
                <p>Please try again later.</p>
                <button onclick="loadOrders()" class="browse-btn">Retry</button>
            </div>
        `;
    }
}

function renderOrders() {
    const content = document.getElementById('ordersContent');
    const emptyState = document.getElementById('emptyState');

    if (!orderBooks.length) {
        content.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    content.style.display = 'block';
    emptyState.style.display = 'none';

    content.innerHTML = `
        <div class="orders-grid">
            ${orderBooks.map((order, index) => {
                const book = order.book || order;

                return `
                    <div class="order-card" onclick="openBookModal(${index})">
                        <div class="order-card-header">
                            ${book.thumbnail 
                                ? `<img src="${book.thumbnail}" alt="${book.title}" class="order-cover">`
                                : '<div class="order-no-cover">📚</div>'
                            }

                            <div class="due-date-badge ${getDueDateClass(order.dueDate)}">
                                ${formatDueDate(order.dueDate)}
                            </div>
                        </div>

                        <div class="order-card-body">
                            <h3 class="order-title">${book.title || 'Unknown Title'}</h3>

                            <p class="order-author">
                                ${
                                    book.authors?.length
                                        ? book.authors.join(', ')
                                        : book.author || 'Unknown Author'
                                }
                            </p>

                            ${
                                book.genre?.length
                                ? `<span class="order-genre">${book.genre[0]}</span>`
                                : ''
                            }

                            <div class="order-dates">
                                <div class="order-date-item">
                                    <span class="order-date-label">Checked Out:</span>
                                    <span class="order-date-value">${formatDate(order.checkoutDate)}</span>
                                </div>
                                <div class="order-date-item">
                                    <span class="order-date-label">Due Date:</span>
                                    <span class="order-date-value">${formatDate(order.dueDate)}</span>
                                </div>
                            </div>

                            <div class="order-actions">
                                <button class="action-btn renew-btn"
                                    onclick="renewBookFromCard(event, '${order._id}')"
                                    ${canRenew(order) ? '' : 'disabled'}>
                                    ${canRenew(order) ? 'Renew' : 'Max Renewals'}
                                </button>

                                <button class="action-btn return-btn"
                                    onclick="returnBookFromCard(event, '${order._id}')">
                                    Return
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function getDueDateClass(dueDate) {
    const now = new Date();
    const due = new Date(dueDate);
    const daysUntilDue = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) {
        return 'due-date-overdue';
    } else if (daysUntilDue <= 3) {
        return 'due-date-soon';
    } else {
        return 'due-date-normal';
    }
}

function formatDueDate(dueDate) {
    const now = new Date();
    const due = new Date(dueDate);
    const daysUntilDue = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) {
        return `Overdue by ${Math.abs(daysUntilDue)} days`;
    } else if (daysUntilDue === 0) {
        return 'Due Today';
    } else if (daysUntilDue === 1) {
        return 'Due Tomorrow';
    } else if (daysUntilDue <= 7) {
        return `Due in ${daysUntilDue} days`;
    } else {
        return formatDate(dueDate);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function canRenew(order) {
    if (!order.renewalCount || order.renewalCount < 2) {
        return true;
    }
    return false;
}

function openBookModal(index) {
    const order = orderBooks[index];
    if (!order) return;

    currentBook = order;

    const book = order.book;
    document.getElementById('modalTitle').textContent = book?.title || 'Unknown Title';
    document.getElementById('modalAuthor').textContent =
        book?.authors?.length
            ? book.authors.join(', ')
            : book?.author || 'Unknown Author';
    document.getElementById('modalGenre').textContent = (book?.genre || []).join(', ') || 'No genre specified';
    document.getElementById('modalDescription').textContent = book?.description || 'No description available.';

    const cover = document.getElementById('modalCover');
    if (book?.thumbnail) {
        cover.src = book.thumbnail;
        cover.style.display = 'block';
    } else {
        cover.style.display = 'none';
    }

    const dueDateDiv = document.getElementById('modalDueDate');
    dueDateDiv.innerHTML = `<span class="modal-due-date ${getDueDateClass(order.dueDate)}">${formatDueDate(order.dueDate)}</span>`;

    const orderDetailsDiv = document.getElementById('modalOrderDetails');
    orderDetailsDiv.innerHTML = `
        <div class="modal-order-details">
            <div class="modal-order-item">
                <span>Order ID:</span>
                <span>${order._id}</span>
            </div>
            <div class="modal-order-item">
                <span>Checked Out:</span>
                <span>${formatDate(order.checkoutDate)}</span>
            </div>
            <div class="modal-order-item">
                <span>Due Date:</span>
                <span>${formatDate(order.dueDate)}</span>
            </div>
            <div class="modal-order-item">
                <span>Renewals Used:</span>
                <span>${order.renewalCount || 0}/2</span>
            </div>
        </div>
    `;

    const renewBtn = document.getElementById('renewBtn');
    if (canRenew(order)) {
        renewBtn.disabled = false;
        renewBtn.textContent = 'Renew Book';
    } else {
        renewBtn.disabled = true;
        renewBtn.textContent = 'Max Renewals';
    }

    const previewBtn = document.getElementById('modalPreview');
    if (book?.googleId) {
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

async function renewBook() {
    if (!currentBook) return;

    const token = localStorage.getItem('token');

    if (!token) {
        alert('Please log in to renew books');
        return;
    }

    try {
        const response = await fetch(`/api/user/orders/${orderId}/renew`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to renew book');
        }

        const updatedOrder = await response.json();
        
        // Update the order in the array
        const index = orderBooks.findIndex(order => order._id === currentBook._id);
        if (index !== -1) {
            orderBooks[index] = updatedOrder;
        }
        
        closeModal();
        renderOrders();
        
        alert('Book renewed successfully! New due date: ' + formatDate(updatedOrder.dueDate));

    } catch (error) {
        console.error('Error renewing book:', error);
        alert(error.message || 'Failed to renew book. Please try again.');
    }
}

async function renewBookFromCard(event, orderId) {
    event.stopPropagation();

    const token = localStorage.getItem('token');

    try {
        const res = await fetch(`/api/user/orders/${orderId}/renew`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!res.ok) throw new Error("Renew failed");

        const updatedOrder = await res.json();

        const index = orderBooks.findIndex(o => o._id === orderId);
        if (index !== -1) orderBooks[index] = updatedOrder;

        renderOrders();

    } catch (err) {
        console.error(err);
        alert("Failed to renew book");
    }
}

async function returnBook() {
    if (!currentBook) return;

    if (!confirm('Are you sure you want to return this book?')) {
        return;
    }

    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('Please log in to return books');
        return;
    }

    try {
        const response = await fetch(`/api/user/orders/${orderId}/return`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to return book');
        }

        // Remove the order from the array
        orderBooks = orderBooks.filter(order => order._id !== currentBook._id);
        
        closeModal();
        renderOrders();
        
        alert('Book returned successfully!');

    } catch (error) {
        console.error('Error returning book:', error);
        alert('Failed to return book. Please try again.');
    }
}

async function returnBookFromCard(event, orderId) {
    event.stopPropagation();

    if (!confirm('Are you sure you want to return this book?')) return;

    const token = localStorage.getItem('token');

    if (!token) {
        alert('Please log in to return books');
        return;
    }

    try {
        const response = await fetch(`/api/user/orders/${orderId}/return`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to return book');
        }

        // Remove the order from the array
        orderBooks = orderBooks.filter(order => order._id !== orderId);
        
        renderOrders();
        
        alert('Book returned successfully!');

    } catch (error) {
        console.error('Error returning book:', error);
        alert('Failed to return book. Please try again.');
    }
};