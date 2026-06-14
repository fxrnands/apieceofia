function renderAboutContent(data) {
    const photo = document.querySelector('.photo-box img');
    if (photo && data.photo) {
        photo.src = resolveSiteRootPath(data.photo.src);
        photo.alt = data.photo.alt || '';
    }

    const aboutText = document.querySelector('.about-text');
    if (aboutText && Array.isArray(data.description)) {
        aboutText.replaceChildren();
        data.description.forEach((paragraph) => {
            const element = document.createElement('p');
            element.textContent = paragraph;
            aboutText.appendChild(element);
        });
    }
}

function loadAboutContent() {
    return fetch(getDataUrl('about.json'))
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to load about data (${response.status})`);
            }
            return response.json();
        })
        .then((data) => {
            renderAboutContent(data);
            return data;
        })
        .catch((error) => {
            console.error(error);
        });
}

loadAboutContent();
