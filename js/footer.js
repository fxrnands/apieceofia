const FOOTER_SOCIAL_LABELS = {
    whatsapp: 'WhatsApp',
    instagram: 'Instagram',
    tiktok: 'TikTok',
};

function renderFooterContent(data) {
    if (data.social) {
        document.querySelectorAll('[data-social]').forEach((link) => {
            const platform = link.dataset.social;
            const url = data.social[platform];

            if (!url) return;

            link.href = url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.setAttribute('aria-label', FOOTER_SOCIAL_LABELS[platform] || platform);
        });
    }

    const photo = document.querySelector('.site-footer__photo');
    if (photo && data.photo) {
        setImageWithSkeleton(photo, resolveSiteRootPath(data.photo.src), data.photo.alt || '');
    }

    const form = document.querySelector('.site-footer__form');
    if (form && data.email) {
        initFooterForm(form, data.email);
    }
}

function initFooterForm(form, recipientEmail) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const name = String(formData.get('name') || '').trim();
        const subjectText = String(formData.get('subject') || '').trim();
        const brief = String(formData.get('brief') || '').trim();

        const subject = encodeURIComponent(subjectText || 'Portfolio Contact');
        const bodyParts = [];

        if (name) {
            bodyParts.push(`Name: ${name}`);
        }

        if (brief) {
            if (bodyParts.length) {
                bodyParts.push('');
            }
            bodyParts.push(brief);
        }

        const query = bodyParts.length
            ? `?subject=${subject}&body=${encodeURIComponent(bodyParts.join('\n'))}`
            : `?subject=${subject}`;

        window.location.href = `mailto:${recipientEmail}${query}`;
    });
}

function loadFooterContent() {
    return fetch(getDataUrl('footer.json'))
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to load footer data (${response.status})`);
            }
            return response.json();
        })
        .then((data) => {
            renderFooterContent(data);
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}

loadFooterContent();
