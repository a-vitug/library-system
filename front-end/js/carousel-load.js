// Fix this so it displays per user recommanded too?

let currentSlide = 0;

async function loadFeatured() {
    const res = await fetch('/api/google-books/search?q=bestseller&maxResults=6');
    if (!res.ok) return;
    const data = await res.json();
    const books = data.results || [];
    if (!books.length) return;

    const container = document.getElementById('homeCarousel');
    container.innerHTML = books.map((book, i) => `
        <div class="carousel-slide${i === 0 ? ' active' : ''}">
            ${book.thumbnail
                ? `<img src="${book.thumbnail}" alt="${book.title}" style="height:160px;object-fit:contain;margin-bottom:12px;">`
                : ''}
            <h3>${book.title || 'Unknown Title'}</h3>
            <p>${(book.authors || []).join(', ') || 'Unknown Author'}</p>
            ${book.previewLink
                ? `<a href="${book.previewLink}" target="_blank" class="home-link">Preview</a>`
                : ''}
        </div>
    `).join('');
    currentSlide = 0;
}

function prevSlide() {
    const slides = document.querySelectorAll('#homeCarousel .carousel-slide');
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

function nextSlide() {
    const slides = document.querySelectorAll('#homeCarousel .carousel-slide');
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

loadFeatured();