async function loadProfile() {
    const token = localStorage.getItem('token');

    const res = await fetch('/api/user/me', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) {
        alert("User is not logged in");
        return;
    }

    const user = await res.json();

    document.getElementById("display-name").textContent = `Hello, ${user.name}`;
    document.getElementById("role").value = user.role || "";
    document.getElementById("username").value = user.username || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("phone").value = user.phone || "";

    document.getElementById("update-username").value = user.username || "";
    document.getElementById("update-phone").value = user.phone || "";

    const avatar = document.querySelector(".member-avatar");
    if (avatar && user.name) {
        avatar.textContent = user.name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase();
    }
}

async function updateProfile() {
    const token = localStorage.getItem("token");

    const username = document.getElementById("update-username").value.trim();
    const phone = document.getElementById("update-phone").value.trim();
    const password = document.getElementById("update-password").value;

    const msg = document.getElementById("update-msg");

    const body = {};
    if (username) body.username = username;
    if (phone) body.phone = phone;
    if (password) body.password = password;

    try {
        const res = await fetch("/api/user/update-profile", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Update failed");

        msg.style.color = "#4ade80";
        msg.textContent = "Profile updated successfully";

        document.getElementById("update-password").value = "";

        await loadProfile();

    } catch (err) {
        msg.style.color = "#f87171";
        msg.textContent = err.message;
    }
}

document.addEventListener("DOMContentLoaded", loadProfile);