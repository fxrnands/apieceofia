const CAROUSEL_POSITIONS = ['pos-0', 'pos-1', 'pos-2', 'pos-3', 'pos-4'];

function getPortfolioSlug() {
    const fileName = window.location.pathname.split('/').pop() || '';
    return fileName.replace(/\.html$/, '');
}

function createCarouselCard(item, positionClass, categorySlug) {
    const card = document.createElement('div');
    card.className = `card ${positionClass}`;
    card.dataset.name = item.name;
    card.dataset.description = item.description || '';

    const label = document.createElement('span');
    label.className = 'card-label';
    label.textContent = item.name;

    const image = document.createElement('img');
    image.src = resolveSiteRootPath(item.image);
    image.alt = item.name;
    image.loading = 'lazy';

    const detailsLink = document.createElement('a');
    detailsLink.className = 'details-btn';
    detailsLink.href = getPortfolioItemUrl(categorySlug, item.slug);
    detailsLink.textContent = 'See Details';

    card.append(label, image, detailsLink);
    return card;
}

function renderPortfolioCategory() {
    const slug = getPortfolioSlug();
    const category = PORTFOLIO_CATEGORIES[slug];

    if (!category) {
        document.title = 'Portfolio | Apieceofia';
        return;
    }

    document.title = `${category.title} | Apieceofia`;

    const titleImage = document.querySelector('.portfolio-detail__title');
    if (titleImage) {
        titleImage.src = resolveSiteRootPath(category.titleImage);
        titleImage.alt = category.title;
    }

    const carousel = document.getElementById('portfolio-carousel');
    if (!carousel) return;

    carousel.replaceChildren();
    category.items.forEach((item, index) => {
        const positionClass = CAROUSEL_POSITIONS[index] || CAROUSEL_POSITIONS[CAROUSEL_POSITIONS.length - 1];
        carousel.appendChild(createCarouselCard(item, positionClass, slug));
    });

    if (typeof initCarousel === 'function') {
        initCarousel(carousel, null);
    }
}

loadPortfolioData().then(renderPortfolioCategory);
