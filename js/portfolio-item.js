function getPortfolioItemParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        category: params.get('category') || '',
        item: params.get('item') || '',
    };
}

function renderPortfolioItem() {
    const { category: categorySlug, item: itemSlug } = getPortfolioItemParams();
    const result = getPortfolioItem(categorySlug, itemSlug);

    if (!result) {
        document.title = 'Portfolio | Apieceofia';
        return;
    }

    const { category, item } = result;

    document.title = `${item.name} | Apieceofia`;

    const photo = document.querySelector('.portfolio-item__photo');
    if (photo) {
        photo.src = resolveSiteRootPath(item.image);
        photo.alt = item.name;
    }

    const year = document.querySelector('.portfolio-item__year');
    if (year) {
        year.textContent = item.year;
    }

    const title = document.querySelector('.portfolio-item__title');
    if (title) {
        title.textContent = item.name;
    }

    const backLink = document.getElementById('portfolio-item-back');
    if (backLink) {
        backLink.href = `${categorySlug}.html`;
        backLink.setAttribute('aria-label', `Back to ${category.title}`);
    }
}

loadPortfolioData().then(renderPortfolioItem);
