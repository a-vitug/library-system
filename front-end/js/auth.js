const isLoggedIn = !!localStorage.getItem("token");
const authLinks = isLoggedIn
  ? `<a href="/pages/portals/member-portal.html">My Account</a>
     <button onclick="logout()">Logout</button>`
  : `<a href="/pages/auth/login.html">Login</a>`;