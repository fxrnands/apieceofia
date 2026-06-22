function initCarousel(carousel, title) {
    const cards = Array.from(carousel.querySelectorAll('.card'));
    const positions = ['pos-0', 'pos-1', 'pos-2', 'pos-3', 'pos-4'];
    let activeIndex = Math.min(2, Math.max(0, cards.length - 1));
    let startX = 0;
    let isDragging = false;

    function getVisibleOffsets(count) {
        if (count >= 5) return [-2, -1, 0, 1, 2];
        if (count === 4) return [-1, 0, 1, 2];
        if (count === 3) return [-1, 0, 1];
        if (count === 2) return [0, 1];
        return [0];
    }

    function applyPositions(animate = true) {
        const count = cards.length;
        const visibleOffsets = getVisibleOffsets(count);
        const positionByIndex = new Map();

        visibleOffsets.forEach((offset) => {
            const cardIndex = (activeIndex + offset + count) % count;
            positionByIndex.set(cardIndex, positions[2 + offset]);
        });

        if (!animate) {
            carousel.classList.add('is-repositioning');
        }

        cards.forEach((card, index) => {
            const nextPosition = positionByIndex.get(index);

            card.classList.remove(...positions, 'is-active');
            card.style.pointerEvents = 'none';

            if (nextPosition) {
                card.classList.add(nextPosition, 'is-active');
            }
        });

        if (!animate) {
            requestAnimationFrame(() => {
                carousel.classList.remove('is-repositioning');
            });
        }

        carousel.classList.add('is-ready');
        updateTitle();
    }

    function updateTitle() {
        if (!title) return;

        const activeCard = cards[activeIndex];
        if (activeCard) {
            title.textContent = activeCard.dataset.name || '';
        }
    }

    function rotate(direction) {
        if (cards.length <= 1) return;

        activeIndex = (activeIndex - direction + cards.length) % cards.length;
        applyPositions(true);
    }

    carousel.addEventListener('mousedown', (event) => {
        isDragging = true;
        startX = event.clientX;
    });

    window.addEventListener('mouseup', (event) => {
        if (!isDragging) return;
        const deltaX = event.clientX - startX;
        if (Math.abs(deltaX) > 50) {
            rotate(deltaX > 0 ? 1 : -1);
        }
        isDragging = false;
    });

    carousel.addEventListener('touchstart', (event) => {
        startX = event.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', (event) => {
        const deltaX = event.changedTouches[0].clientX - startX;
        if (Math.abs(deltaX) > 50) {
            rotate(deltaX > 0 ? 1 : -1);
        }
    }, { passive: true });

    const wrap = carousel.closest('.carousel-wrap');
    if (wrap) {
        const prevBtn = wrap.querySelector('.carousel-arrow--prev');
        const nextBtn = wrap.querySelector('.carousel-arrow--next');

        prevBtn?.addEventListener('click', () => rotate(1));
        nextBtn?.addEventListener('click', () => rotate(-1));
    }

    applyPositions(false);
}

window.initCarousel = initCarousel;

document.querySelectorAll('.card-carousel:not(#portfolio-carousel)').forEach((carousel) => {
    const titleId = carousel.dataset.titleTarget;
    const title = titleId ? document.getElementById(titleId) : null;
    initCarousel(carousel, title);
});
