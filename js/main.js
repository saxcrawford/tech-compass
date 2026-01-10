// Tech Compass - Main JavaScript
// Phase 2: You'll add functionality here

const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-button');
const categoryCards = document.querySelectorAll('.category-card');
const noResultsCard = document.querySelector('.no-results');
const menuToggle = document.querySelector('.menu-toggle');
const navElement = document.querySelector('.nav');
const themeToggle = document.querySelector('.theme-toggle');
const navLinks = document.querySelectorAll('.nav-links a');
const backToTopBtn = document.querySelector('.back-to-top');

const filterCards = () => {
    let visibleCount = 0;
    categoryCards.forEach(card => {
        if (card.textContent.toLowerCase().includes(searchInput.value.toLowerCase())) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    })

    if (!visibleCount) {
        noResultsCard.style.display = 'block'
    } else {
        noResultsCard.style.display = ''
    }
}

searchInput.addEventListener('input', filterCards);
searchBtn.addEventListener('click', filterCards);
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        filterCards();
    } else if (event.key === 'Escape') {
        searchInput.value = '';
        filterCards();
    }
})

menuToggle.addEventListener('click', () => {
    navElement.classList.toggle('menu-open');
    lucide.createIcons();
})

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('dark-mode', 'dark');
    } else {
        localStorage.setItem('dark-mode', 'light');
    }
    lucide.createIcons();
})

if (localStorage.getItem('dark-mode') === 'dark') {
    document.body.classList.add('dark-mode');
}

categoryCards.forEach(card => {
    card.classList.add('fade-in');
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    })
}, {threshold: 0.2});

categoryCards.forEach(card => {
    observer.observe(card);
})

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navElement.classList.remove('menu-open');
    })
})

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible')
    } else {
        backToTopBtn.classList.remove('visible')
    }
})

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
})

