function getDataUrl(fileName) {
    const script = document.currentScript || document.querySelector('script[src*="data-path.js"]');
    const scriptSrc = script?.src;

    if (scriptSrc) {
        return new URL(`../data/${fileName}`, scriptSrc).href;
    }

    return `../data/${fileName}`;
}

function resolveSiteRootPath(path) {
    if (!path || /^https?:\/\//.test(path) || path.startsWith('data:')) {
        return path;
    }

    const cleanPath = path.replace(/^\//, '');
    const segments = window.location.pathname
        .split('/')
        .filter((segment) => segment && !segment.includes('.'));

    const prefix = segments.length ? '../'.repeat(segments.length) : '';
    return `${prefix}${cleanPath}`;
}
