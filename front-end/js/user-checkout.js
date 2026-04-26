function updateDueDate() {
    const days = parseInt(document.getElementById('loanPeriod').value, 10);
    const due = new Date();
    due.setDate(due.getDate() + days);
    document.getElementById('dueDate').textContent = due.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });
    document.getElementById('toastDate').textContent = document.getElementById('dueDate').textContent;
}

function removeItem(id) {
    const item = document.getElementById(id);
    if (!item) return;
    item.style.transition = 'opacity 0.2s, transform 0.2s';
    item.style.opacity = '0';
    item.style.transform = 'translateX(12px)';
    setTimeout(() => {
        item.remove();
        updateBookCount();
    }, 200);
}

function updateBookCount() {
    const count = document.querySelectorAll('.book-item').length;
    document.getElementById('bookCount').textContent = count;
    document.getElementById('emptyState').style.display = count === 0 ? 'block' : 'none';
    document.getElementById('checkoutBtn').disabled = count === 0;
}

function confirmCheckout() {
    const count = document.querySelectorAll('.book-item').length;
    if (count === 0) return;

    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

updateDueDate();
