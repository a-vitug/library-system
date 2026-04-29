const navFile = localStorage.getItem("token")
    ? "/static/navbarloggedin.html"
    : "/static/navbar.html";

fetch(navFile)
    .then(res => res.text())
    .then(data => {
        document.getElementById("nav-placeholder").innerHTML = data;

        const token = localStorage.getItem("token");
        if (token) {
            fetch('/user', { headers: { Authorization: `Bearer ${token}` } })
                .then(r => r.ok ? r.json() : null)
                .then(user => {
                    if (!user?.name) return;
                    const avatar = document.getElementById('nav-icon');
                    if (avatar) avatar.textContent = user.name.charAt(0).toUpperCase();
                    const usernameEl = document.getElementById('nav-username');
                    if (usernameEl) usernameEl.textContent = user.name;
                })
                .catch(() => {});
        }

        window.addEventListener('scroll', () => {
            const nav = document.querySelector('nav');
            if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
        });
    });

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/log-in";
}

const buttons = document.querySelectorAll('.nav-btn');

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

function goToProfile() {
    const role = localStorage.getItem("role");

    if (!role) {
        window.location = "/log-in";
        return;
    } else if (role === "member") {
        window.location = "/member";
    } else if (role === "employee") {
        window.location = "/librarian";
    } else if (role === "manager") {
        window.location = "/admin";
    }
}