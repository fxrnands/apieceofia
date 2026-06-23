function bindImageSkeleton(wrapper) {
    if (!wrapper || !wrapper.classList.contains('image-skeleton--loading')) {
        return;
    }

    const image = wrapper.querySelector('img');
    if (!image) {
        return;
    }

    const reveal = () => {
        wrapper.classList.remove('image-skeleton--loading');
    };

    if (image.complete && image.naturalWidth > 0) {
        reveal();
        return;
    }

    image.addEventListener('load', reveal, { once: true });
    image.addEventListener('error', reveal, { once: true });
}

function wrapImageWithSkeleton(image, extraClass = '') {
    if (!image) {
        return null;
    }

    const existingWrapper = image.closest('.image-skeleton');
    if (existingWrapper) {
        existingWrapper.classList.add('image-skeleton--loading');
        bindImageSkeleton(existingWrapper);
        return existingWrapper;
    }

    const wrapper = document.createElement('div');
    wrapper.className = `image-skeleton image-skeleton--loading${extraClass ? ` ${extraClass}` : ''}`;

    const shimmer = document.createElement('div');
    shimmer.className = 'image-skeleton__shimmer';
    shimmer.setAttribute('aria-hidden', 'true');

    image.parentNode.insertBefore(wrapper, image);
    wrapper.append(shimmer, image);
    bindImageSkeleton(wrapper);

    return wrapper;
}

function setImageWithSkeleton(image, src, alt = '') {
    if (!image) {
        return;
    }

    const wrapper = wrapImageWithSkeleton(image);
    wrapper?.classList.add('image-skeleton--loading');
    image.decoding = 'async';

    if (alt) {
        image.alt = alt;
    }

    image.src = src;
    bindImageSkeleton(wrapper || image.closest('.image-skeleton'));
}

function initImageSkeletons(root = document) {
    root.querySelectorAll('.image-skeleton--loading').forEach(bindImageSkeleton);
}

function initHeroPhotoSkeletons() {
    document.querySelectorAll('.hero-photo').forEach((image) => {
        wrapImageWithSkeleton(image, 'hero-photo-skeleton');
    });
}

function initFooterPhotoSkeleton() {
    document.querySelectorAll('.site-footer__photo').forEach((image) => {
        wrapImageWithSkeleton(image, 'site-footer__photo-wrap');
    });
}

window.bindImageSkeleton = bindImageSkeleton;
window.wrapImageWithSkeleton = wrapImageWithSkeleton;
window.setImageWithSkeleton = setImageWithSkeleton;
window.initImageSkeletons = initImageSkeletons;
