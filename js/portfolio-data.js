let PORTFOLIO_CATEGORIES = {};
let PORTFOLIO_DEFAULT_DESCRIPTION = '';

let portfolioDataPromise = null;

function slugifyPortfolioText(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-+|-+$)/g, '');
}

function normalizePortfolioCategories() {
    Object.values(PORTFOLIO_CATEGORIES).forEach((category) => {
        category.items.forEach((item) => {
            if (!item.slug) {
                item.slug = slugifyPortfolioText(item.name);
            }
            if (!item.year) {
                item.year = '2024';
            }
            if (!item.description) {
                item.description = PORTFOLIO_DEFAULT_DESCRIPTION;
            }
        });
    });
}

function getPortfolioItem(categorySlug, itemSlug) {
    const category = PORTFOLIO_CATEGORIES[categorySlug];
    if (!category) return null;

    const item = category.items.find((entry) => entry.slug === itemSlug);
    if (!item) return null;

    return { category, item };
}

function getPortfolioItemUrl(categorySlug, itemSlug) {
    return `item.html?category=${encodeURIComponent(categorySlug)}&item=${encodeURIComponent(itemSlug)}`;
}

function loadPortfolioData() {
    if (!portfolioDataPromise) {
        portfolioDataPromise = fetch(getDataUrl('portfolio.json'))
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load portfolio data (${response.status})`);
                }
                return response.json();
            })
            .then((data) => {
                PORTFOLIO_CATEGORIES = data.categories || {};
                PORTFOLIO_DEFAULT_DESCRIPTION = data.defaultDescription || '';
                normalizePortfolioCategories();
                return PORTFOLIO_CATEGORIES;
            })
            .catch((error) => {
                console.error(error);
                return PORTFOLIO_CATEGORIES;
            });
    }

    return portfolioDataPromise;
}
