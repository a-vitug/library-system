async function loadNavbar() {
    const res = await fetch('/static/manager-navbar.html');
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
            localStorage.removeItem('role');
            window.location.href = '/log-in';
            return;
        }
        if (res.ok) {
            const data = await res.json();
            const el = document.getElementById('display-name');
            if (el && data.name) el.textContent = data.name;
            const greeting = document.getElementById('manager-greeting');
            if (greeting && data.name) greeting.textContent = `Hello, ${data.name}!`;
        }
    } catch (err) {
        console.error('loadDisplayName failed:', err);
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/log-in';
}

async function loadStats() {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
        const res = await fetch('/manager/users', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const users = await res.json();
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('count-members',   users.filter(u => u.role === 'member').length);
        set('count-librarians', users.filter(u => u.role === 'librarian').length);
        set('count-managers',  users.filter(u => u.role === 'manager').length);
        set('count-total',     users.length);
    } catch (err) {
        console.error('loadStats failed:', err);
    }
}

loadNavbar();
loadDisplayName();
loadStats();
