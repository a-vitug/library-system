function renderUserBooks(userId, books) {
    const container = document.getElementById('profile-books');

    if (!books.length) {
        container.innerHTML = `<p>No checked out books.</p>`;
        return;
    }

    container.innerHTML = `
        <h3>Checked Out Books</h3>
        ${books.map(book => `
            <div class="book-item">
                <strong>${book.title}</strong><br>
                <span>${book.authors?.join(', ') || 'Unknown Author'}</span>

                <div class="actions">
                    <button onclick="returnBook('${userId}', '${book._id}')">
                        Return
                    </button>
                    <button onclick="renewBook('${userId}', '${book._id}')">
                        Renew
                    </button>
                    <p>Due: ${
                        book.dueDate 
                            ? new Date(book.dueDate).toLocaleDateString() 
                            : "N/A"
                    }</p>
                </div>
            </div>
        `).join('')}
    `;
}

async function returnBook(userId, bookId) {
    const token = localStorage.getItem('token');

    try {
        const res = await fetch('/manager/books/return', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ userId, bookId })
        });

        if (!res.ok) throw new Error("Return failed");

        viewMember(userId);

    } catch (err) {
        console.error(err);
        alert("Failed to return book");
    }
}

async function viewMember(userId) {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`/manager/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!res.ok) throw new Error("Failed to load user");

        const user = await res.json();

        document.getElementById("profile-name").textContent = user.name;
        document.getElementById("profile-username").textContent = user.username;
        document.getElementById("profile-email").textContent = user.email;
        document.getElementById("profile-role").textContent = user.role;

        renderUserBooks(user._id, user.checkedOutBooks);

        document.getElementById("member-profile-panel").style.display = "block";

    } catch (err) {
        console.error(err);
        alert("Failed to load member");
    }
}

async function loadNavbar() {
    const res = await fetch('/static/librarian-navbar.html');
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const nav = doc.querySelector('.lib-nav');
    const placeholder = document.getElementById('nav-placeholder');
    if (nav && placeholder) {
        placeholder.replaceWith(nav);
    }
}

async function loadDisplayName() {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
        const res = await fetch('/api/user/me', { headers: { Authorization: `Bearer ${token}` } });
        if (res.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/log-in';
            return;
        }
        if (res.ok) {
            const data = await res.json();
            const el = document.getElementById('display-name');
            if (el && data.name) el.textContent = data.name;
        }
    } catch (err) {
        console.error('loadDisplayName failed:', err);
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/log-in';
}

document.addEventListener("DOMContentLoaded", () => {
    loadNavbar();
    loadDisplayName();
});