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

    const imageWrap = document.createElement('div');
    imageWrap.className = 'card__image-wrap image-skeleton image-skeleton--loading';

    const shimmer = document.createElement('div');
    shimmer.className = 'image-skeleton__shimmer';
    shimmer.setAttribute('aria-hidden', 'true');

    const image = document.createElement('img');
    image.decoding = 'async';
    image.alt = item.name;

    const detailsLink = document.createElement('a');
    detailsLink.className = 'details-btn';
    detailsLink.href = getPortfolioItemUrl(categorySlug, item.slug);
    detailsLink.textContent = 'See Details';

    imageWrap.append(shimmer, image);
    card.append(label, imageWrap, detailsLink);

    setImageWithSkeleton(image, resolveSiteRootPath(item.image), item.name);
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
