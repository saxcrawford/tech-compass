// Tech Compass - Main JavaScript
// Phase 2: You'll add functionality here

const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-button');
const categoryCards = document.querySelectorAll('.category-card');

const filterCards = () => {
    categoryCards.forEach(card => {
        if (card.textContent.toLowerCase().includes(searchInput.value.toLowerCase())) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    })
}

searchBtn.addEventListener('click', filterCards);
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        filterCards();
    } else if (event.key === 'Escape') {
        searchInput.value = '';
        filterCards();
    }
})