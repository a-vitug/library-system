async function loadProfile() {
    const token = localStorage.getItem('token');

    const res = await fetch('/api/user/me', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const user = await res.json();

    document.getElementById("display-name").textContent = user.name;
    document.getElementById("[name=username]").value = username;
    document.querySelector("[name = email]").value = user.email;
}

loadProfile();