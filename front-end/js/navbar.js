const navFile = localStorage.getItem("token")
    ? "/static/navbarloggedin.html"
    : "/static/navbar.html";

fetch(navFile)
    .then(res => res.text())
    .then(data => {
        document.getElementById("nav-placeholder").innerHTML = data;

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