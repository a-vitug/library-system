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

    document.getElementById("display-name").textContent = user.name;
    document.getElementById("username").value = user.username;
    document.querySelector("email").value = user.email;
    document.querySelector("phone").value = user.phone || "";
};

loadProfile();