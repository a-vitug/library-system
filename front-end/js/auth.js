const isLoggedIn = !!localStorage.getItem("token");
const authLinks = isLoggedIn
  ? `<a href="/member">My Account</a>
     <button onclick="logout()">Logout</button>`
  : `<a href="/log-in">Login</a>`;