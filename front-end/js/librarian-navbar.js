async function loadNavbar() {
    const res = await fetch('/static/librarian-navbar.html');
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const nav = doc.querySelector('.lib-nav');
    const placeholder = document.getElementById('nav-placeholder');
    if (nav && placeholder) {
        placeholder.replaceWith(nav);
    }
}

async function loadDisplayName() {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
        const res = await fetch('/api/user/me', { headers: { Authorization: `Bearer ${token}` } });
        if (res.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/log-in';
            return;
        }
        if (res.ok) {
            const data = await res.json();
            const el = document.getElementById('display-name');
            if (el && data.name) el.textContent = data.name;
        }
    } catch (err) {
        console.error('loadDisplayName failed:', err);
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/log-in';
}

loadNavbar();
loadDisplayName();
