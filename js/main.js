const TRANSITION_DURATION = 700;
const TRANSITION_STAGGER = 50;
const TRANSITION_FLAG = 'page-transition';
const COVER_GRADIENT = 'linear-gradient(to right, #d62f66 50%, #98a74b 50%)';

let isTransitioning = false;
let transitionOverlay = null;

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function coverDocument() {
    document.documentElement.classList.add('is-covered');
    document.documentElement.style.background = COVER_GRADIENT;
}

function clearPanelInlineStyles(overlay) {
    overlay.querySelectorAll('.page-transition__panel').forEach((panel) => {
        panel.style.transition = '';
        panel.style.transform = '';
    });
}

function getOrCreateTransitionOverlay() {
    const existing = document.querySelector('.page-transition');
    if (existing) return existing;

    const overlay = document.createElement('div');
    overlay.className = 'page-transition';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
        <div class="page-transition__panel page-transition__panel--left"></div>
        <div class="page-transition__panel page-transition__panel--right"></div>
    `;
    document.body.prepend(overlay);
    return overlay;
}

function wait(ms) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
    });
}

function waitForNextFrame() {
    return new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
}

function resetOverlay(overlay) {
    overlay.classList.remove('is-revealing', 'is-covering', 'is-active');
    overlay.style.visibility = 'hidden';
    overlay.querySelectorAll('.page-transition__panel').forEach((panel) => {
        panel.style.transition = 'none';
        panel.style.transform = 'translate3d(0, 100%, 0)';
    });
    overlay.getBoundingClientRect();
    clearPanelInlineStyles(overlay);
    overlay.style.visibility = '';
}

async function revealPage(overlay) {
    if (prefersReducedMotion()) {
        document.documentElement.classList.remove('is-covered');
        document.documentElement.style.background = '';
        resetOverlay(overlay);
        return;
    }

    await waitForNextFrame();
    clearPanelInlineStyles(overlay);
    overlay.classList.add('is-revealing');
    document.documentElement.classList.remove('is-covered');
    document.documentElement.style.background = '';

    await wait(TRANSITION_DURATION + TRANSITION_STAGGER);
    resetOverlay(overlay);
}

async function leavePage(overlay, url) {
    if (prefersReducedMotion()) {
        window.location.href = url;
        return;
    }

    isTransitioning = true;
    clearPanelInlineStyles(overlay);
    overlay.classList.remove('is-revealing');
    document.body.classList.add('is-leaving');
    document.documentElement.style.background = COVER_GRADIENT;
    overlay.classList.add('is-active', 'is-covering');

    await wait(TRANSITION_DURATION);
    sessionStorage.setItem(TRANSITION_FLAG, '1');
    window.location.href = url;
}

function isInternalPageLink(anchor) {
    if (!(anchor instanceof HTMLAnchorElement)) return false;
    if (anchor.target === '_blank' || anchor.hasAttribute('download')) return false;

    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return false;
    }

    if (href.startsWith('http://') || href.startsWith('https://')) {
        return anchor.origin === window.location.origin;
    }

    const pathPart = href.split('?')[0].split('#')[0];
    return pathPart.endsWith('.html') || !pathPart.includes('.');
}

function bindPageTransitions(overlay) {
    document.addEventListener('click', (event) => {
        if (isTransitioning) return;

        const anchor = event.target.closest('a');
        if (!anchor || !isInternalPageLink(anchor)) return;

        const href = anchor.href;
        if (href === window.location.href) return;

        event.preventDefault();
        leavePage(overlay, href);
    });
}

function closeNav() {
    document.body.classList.remove('nav-open');

    const toggle = document.querySelector('.nav-toggle');
    const drawer = document.getElementById('nav-drawer');

    if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
    }

    if (drawer) {
        drawer.setAttribute('aria-hidden', 'true');
    }
}

function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const drawer = document.getElementById('nav-drawer');

    if (!toggle || !drawer) return;

    toggle.addEventListener('click', () => {
        const isOpen = document.body.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        drawer.setAttribute('aria-hidden', String(!isOpen));
    });

    drawer.querySelectorAll('[data-nav-close]').forEach((element) => {
        element.addEventListener('click', closeNav);
    });

    drawer.querySelectorAll('.nav-links a').forEach((link) => {
        link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeNav();
        }
    });
}

function initAboutPhotoSkeleton() {
    const photoBox = document.querySelector('.photo-box--loading');
    if (!photoBox) return;

    const image = photoBox.querySelector('img');
    if (!image) return;

    const revealPhoto = () => {
        photoBox.classList.remove('photo-box--loading');
    };

    if (image.complete) {
        revealPhoto();
        return;
    }

    image.addEventListener('load', revealPhoto, { once: true });
    image.addEventListener('error', revealPhoto, { once: true });
}

function initPageTransitions() {
    transitionOverlay = getOrCreateTransitionOverlay();
    bindPageTransitions(transitionOverlay);
    initMobileNav();
    initAboutPhotoSkeleton();
    revealPage(transitionOverlay);
}

window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;

    document.documentElement.classList.remove('is-covered');
    document.documentElement.style.background = '';

    if (transitionOverlay) {
        resetOverlay(transitionOverlay);
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageTransitions);
} else {
    initPageTransitions();
}
