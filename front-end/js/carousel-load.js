let currentSlide = 0;
let autoplayTimer = null;

async function fetchWithTimeout(url, ms = 8000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    try {
        const res = await fetch(url, { signal: controller.signal });
        return res;
    } finally {
        clearTimeout(timer);
    }
}

async function loadFeatured() {
    try {
        const res = await fetchWithTimeout('/api/google-books/search?q=bestseller&maxResults=5');
        if (!res.ok) return;
        const data = await res.json();
        const books = (data.results || []).slice(0, 5);
        if (!books.length) return;

        const container = document.getElementById('homeCarousel');
        container.innerHTML = books.map((book, i) => `
            <div class="carousel-slide${i === 0 ? ' active' : ''}">
                ${book.thumbnail
                    ? `<img src="${book.thumbnail}" alt="${book.title}" class="slide-cover">`
                    : '<div class="slide-cover slide-no-cover"></div>'}
                <div class="slide-info">
                    <h2 class="slide-title">${book.title || 'Unknown Title'}</h2>
                    <p class="slide-author">${(book.authors || []).join(', ') || 'Unknown Author'}</p>
                    <p class="slide-description">${book.description || ''}</p>
                    ${book.googleId
                        ? `<a href="https://books.google.com/books?id=${book.googleId}" target="_blank" class="slide-btn">Read More</a>`
                        : ''}
                </div>
            </div>
        `).join('');

        renderDots(books.length);
        currentSlide = 0;
        startAutoplay();
    } catch (err) {
        console.error('loadFeatured error:', err.name === 'AbortError' ? 'Request timed out' : err);
    }
}

async function loadRecommendations() {
    const token = localStorage.getItem('token');
    const grid = document.getElementById('recommendationsGrid');

    try {

        if(token) {
            const res = await fetch('/api/user/recommendations', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (res.ok) {
                const books = await res.json();

                if (books.length) {
                    renderRecommendations( books, true );
                    return;
                };
            }
        };

        const res = await fetchWithTimeout('/api/google-books/search?q=popular+fiction&maxResults=6');
        const data = await res.json();

        renderRecommendations(data.results || [], false);

        // const books = (data.results || []).slice(0, 6);
        // const grid = document.getElementById('recommendationsGrid');
        // if (!grid || !books.length) return;
        // grid.innerHTML = books.map(book => `
        //     <div class="reco-card">
        //         ${book.thumbnail
        //             ? `<img src="${book.thumbnail}" alt="${book.title}">`
        //             : '<div class="reco-no-cover"></div>'}
        //     </div>
        // `).join('');
    } catch (err) {
        console.error('loadRecommendations error:', err);
    }
}

function renderRecommendations( books, personalized ) {
    const grid = document.getElementById('recommendationsGrid');

    if(personalized) {
        document.querySelector('.section-header h1').textContent = 'RECOMMENDED FOR YOU';
    }

    grid.innerHTML = books.map(book => `
        <div class="reco-card">
            ${book.thumbnail
                ? `<img src="${book.thumbnail}" alt="${book.title}">`
                : '<div class="reco-no-cover"></div>'}
        
            <h3>${book.title}</h3>
            <p>${book.authors || (book.authors || []).join(', ')}</p>
            ${book.genre
                ? `<small>${book.genre.join(', ')}`
                : ''
            }
        </div>
    `).join('');
}

function renderDots(count) {
    const dotsContainer = document.getElementById('carouselDots');
    if (!dotsContainer) return;
    dotsContainer.innerHTML = Array.from({ length: count }, (_, i) => `
        <button class="carousel-dot${i === 0 ? ' active' : ''}" onclick="goToSlide(${i})"></button>
    `).join('');
}

function updateDots() {
    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function goToSlide(index) {
    const slides = document.querySelectorAll('#homeCarousel .carousel-slide');
    slides[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    updateDots();
    resetAutoplay();
}

function nextSlide() {
    const slides = document.querySelectorAll('#homeCarousel .carousel-slide');
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
    updateDots();
}

function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 7000);
}

function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
}

//loadFeatured().then(() => setTimeout(loadRecommendations, 500));
loadFeatured();
loadRecommendations();