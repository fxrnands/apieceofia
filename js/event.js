const carousel = document.getElementById('carousel');
const title = document.getElementById('event-title');

if (carousel && title) {
    const cards = Array.from(carousel.querySelectorAll('.card'));
    const positions = ['pos-0', 'pos-1', 'pos-2', 'pos-3', 'pos-4'];
    let startX = 0;
    let isDragging = false;

    function updateTitle() {
        const activeCard = cards.find((card) => card.classList.contains('pos-2'));
        if (activeCard) {
            title.textContent = activeCard.dataset.name || '';
        }
    }

    function rotate(direction) {
        cards.forEach((card) => {
            const currentIndex = positions.findIndex((pos) => card.classList.contains(pos));
            const nextIndex = (currentIndex + direction + positions.length) % positions.length;
            card.classList.remove(...positions);
            card.classList.add(positions[nextIndex]);
        });
        updateTitle();
    }

    carousel.addEventListener('mousedown', (event) => {
        isDragging = true;
        startX = event.clientX;
    });

    window.addEventListener('mouseup', (event) => {
        if (!isDragging) return;
        const deltaX = event.clientX - startX;
        if (Math.abs(deltaX) > 50) {
            rotate(deltaX > 0 ? -1 : 1);
        }
        isDragging = false;
    });

    carousel.addEventListener('touchstart', (event) => {
        startX = event.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', (event) => {
        const deltaX = event.changedTouches[0].clientX - startX;
        if (Math.abs(deltaX) > 50) {
            rotate(deltaX > 0 ? -1 : 1);
        }
    }, { passive: true });

    updateTitle();
}
