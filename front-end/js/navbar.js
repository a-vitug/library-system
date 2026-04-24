const navFile = localStorage.getItem("token")
    ? "/static/navbarloggedin.html"
    : "/static/navbar.html";

fetch(navFile)
    .then(res => res.text())
    .then(data => {
        document.getElementById("nav-placeholder").innerHTML = data;
    });

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/log-in";
}
