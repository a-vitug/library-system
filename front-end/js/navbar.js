const navbarHTML = `
<nav>
  <ul class="navLeft">
    <li><a href="/home">Home</a></li>
    <li class="dropDown">
      <a href="/genre/allgenres">Genres</a>
      <div class="dropDownGenre">
        <a href="/genre/allgenres">All Genres</a>
        <a href="/genre/action">Action</a>
        <a href="/genre/thriller">Thriller</a>
        <a href="/genre/mystery">Mystery</a>
        <a href="/genre/romance">Romance</a>
        <a href="/genre/fiction">Fiction</a>
        <a href="/genre/non-fiction">Non-fiction</a>
      </div>
    </li>
    <li><a href="/about">About</a></li>
  </ul>
  <div class="navRight">
    <a href="/log-in" class="create-account">Log In</a>
  </div>
</nav>
`;

document.addEventListener("DOMContentLoaded", () => {
  document.body.insertAdjacentHTML("afterbegin", navbarHTML);

  const isLoggedIn = !!localStorage.getItem("token");
  document.getElementById("auth-buttons").innerHTML = isLoggedIn
    ? `<button onclick="logout()">Logout</button>`
    : `<a href="/pages/auth/login.html">Login</a>`;

 
  document.querySelectorAll(".nav-link").forEach(link => {
    if (link.href === window.location.href) link.classList.add("active");
  });
});

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/pages/auth/login.html";
}
