export const loadImage = (url) => {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.addEventListener('load', () => {
            resolve(image);
        });

        image.src = url;
    });
};

export const loadJson = (url) => fetch(url)
    .then((res) => res.json());