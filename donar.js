(() => {
    'use strict';
    const slides = [
        {src: '/images/campanas/lala-jovenes.webp', alt: 'Ximena Capia, Ximena Cortez, Sebastián Zapata y Valeria Rivas: nos vamos a LALA, pero te necesitamos.', caption: '01 / 02 · Conoce a los cuatro jóvenes'},
        {src: '/images/campanas/lala-en-accion.webp', alt: 'Valeria Rivas en un taller con niños, Ximena Capia conversando con jóvenes, Sebastián Zapata y Ximena Cortez presentando sus iniciativas.', caption: '02 / 02 · Liderazgo que ya está en acción'}
    ];
    let current = 0;
    const picture = document.querySelector('#campaign-image');
    const lightbox = document.querySelector('#campaign-lightbox');
    function showSlide(next) {
        current = (next + slides.length) % slides.length;
        picture.src = slides[current].src;
        picture.alt = slides[current].alt;
        document.querySelector('#gallery-caption').textContent = slides[current].caption;
    }
    document.querySelector('#gallery-prev').addEventListener('click', () => showSlide(current - 1));
    document.querySelector('#gallery-next').addEventListener('click', () => showSlide(current + 1));
    document.querySelector('.campaign-gallery').addEventListener('keydown', event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            showSlide(current + (event.key === 'ArrowRight' ? 1 : -1));
        }
    });
    document.querySelector('.campaign-zoom').addEventListener('click', () => {
        const full = lightbox.querySelector('img');
        full.src = slides[current].src;
        full.alt = slides[current].alt;
        lightbox.showModal();
    });
    document.querySelector('#close-lightbox').addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
    const shareUrl = 'https://www.redastrum.org/donar/';
    document.querySelector('.campaign-share').addEventListener('click', async () => {
        const status = document.querySelector('.campaign-share-status');
        const fallback = document.querySelector('.campaign-share-fallback');
        status.textContent = '';
        try {
            if (navigator.share) {
                await navigator.share({title: 'Cuatro jóvenes, una oportunidad: juntos hacia LALA', text: 'Apoyemos a cuatro jóvenes para que continúen su formación. Una campaña de Astrum Becas.', url: shareUrl});
            } else {
                await navigator.clipboard.writeText(shareUrl);
                status.textContent = 'Enlace copiado. ¡Gracias por compartir!';
            }
        } catch (error) {
            if (error.name === 'AbortError') return;
            fallback.hidden = false;
            const field = fallback.querySelector('input');
            field.focus();
            field.select();
            status.textContent = 'Copia este enlace para compartir la campaña.';
        }
    });
})();
