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
}

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
}

function searchMembers() {
    const query = document.getElementById("search-input").value.toLowerCase();
    const filtered = allMembers.filter(m =>
        m.username.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query)
    );
    renderResults(filtered);
}

function viewMember(id) {
    window.location.href = `/member-profile?id=${id}`;
}

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
}

document.getElementById("search-input").addEventListener("input", searchMembers);

loadMembers();
