function getPortfolioSlug() {
    const fileName = window.location.pathname.split('/').pop() || '';
    return fileName.replace(/\.html$/, '');
}

function createCarouselCard(item, categorySlug) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.name = item.name;

    const label = document.createElement('span');
    label.className = 'card-label';
    label.textContent = item.name;

    const image = document.createElement('img');
    image.src = resolveSiteRootPath(item.image);
    image.alt = item.name;
    image.loading = 'lazy';
    image.decoding = 'async';

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
    category.items.forEach((item) => {
        carousel.appendChild(createCarouselCard(item, slug));
    });

    if (typeof initCarousel === 'function') {
        initCarousel(carousel, null);
    }
}

loadPortfolioData().then(renderPortfolioCategory);
