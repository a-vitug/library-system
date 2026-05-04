const role = document.body.dataset.role; // "manager" or "librarian"
let allMembers = [];

async function loadMembers() {
    const token = localStorage.getItem("token");
    const res = await fetch("/manager/users", {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
        document.getElementById("search-results").innerHTML = "<p>Failed to load members.</p>";
        return;
    }
    allMembers = await res.json();
    renderResults(allMembers);
};

function renderResults(members) {
    const container = document.getElementById("search-results");
    if (members.length === 0) {
        container.innerHTML = "<p>No members found.</p>";
        return;
    }

    const rows = members.map(m => `
        <tr>
            <td>${m.username}</td>
            <td>${m.email}</td>
            <td>${m.role}</td>
            <td>${new Date(m.createdAt).toLocaleDateString()}</td>
            <td class="actions">
                <button onclick="viewMember('${m._id}')">View</button>
                ${role === "manager" ? `<button class="btn-danger" onclick="deleteMember('${m._id}')">Delete</button>` : ""}
            </td>
        </tr>
    `).join("");

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
};

function searchMembers() {
    const query = document.getElementById("search-input").value.toLowerCase();
    const filtered = allMembers.filter(m =>
        m.username.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query)
    );
    renderResults(filtered);
};

function showMemberProfile(user) {
    const panel = document.getElementById("member-profile-panel");

    document.getElementById("profile-name").textContent = user.name;
    document.getElementById("profile-username").textContent = user.username;
    document.getElementById("profile-email").textContent = user.email;
    document.getElementById("profile-role").textContent = user.role;

    const booksDiv = document.getElementById("profile-books");

    if (!user.checkedOutBooks || !user.checkedOutBooks.length) {
        booksDiv.innerHTML = "<p>No borrowed books.</p>";
    } else {
        booksDiv.innerHTML = `
            <h3>Borrowed Books</h3>
            ${user.checkedOutBooks.map(book => `
                <div class="book-item">
                    <p><strong>${book.title}</strong></p>
                    <p>Due: ${
                        book.dueDate 
                            ? new Date(book.dueDate).toLocaleDateString() 
                            : "N/A"
                    }</p>

                    ${role === "librarian" ? `
                        <div class="actions">
                            <button onclick="returnBook('${user._id}', '${book._id}')">
                                Return
                            </button>
                            <button onclick="renewBook('${user._id}', '${book._id}')">
                                Renew
                            </button>
                        </div>
                    ` : ""}
                </div>
            `).join('')}
        `;
    }

    panel.style.display = "block";
};

function closeProfile() {
    document.getElementById("member-profile-panel").style.display = "none";
};

async function renewBook(userId, bookId) {
    const token = localStorage.getItem('token');

    try {
        const res = await fetch('/manager/books/renew', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ userId, bookId })
        });

        if (!res.ok) throw new Error("Renew failed");

        alert("Book renewed!");
        viewMember(userId); // refresh UI

    } catch (err) {
        console.error(err);
        alert("Failed to renew book");
    }
};

async function viewMember(id) {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`/manager/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!res.ok) {
            throw new Error("Failed to load member");
        }

        const user = await res.json();
        showMemberProfile(user); 
        console.log("USER:", user);

    } catch (err) {
        console.error(err);
        alert("Error loading member profile");
    }
};

async function deleteMember(id) {
    if (!confirm("Are you sure you want to delete this member?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`/manager/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
        allMembers = allMembers.filter(m => m._id !== id);
        renderResults(allMembers);
    } else {
        alert("Failed to delete member.");
    }
};

document.getElementById("search-input").addEventListener("input", searchMembers);

loadMembers();