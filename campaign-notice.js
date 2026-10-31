(() => {
    'use strict';
    const notice = document.querySelector('#campaign-notice');
    if (!notice) return;
    const storageKey = 'astrum-lala-entry-notice-2026';
    try { if (sessionStorage.getItem(storageKey) === 'seen') return; } catch {}
    const dismiss = () => {
        const wasFocused = notice.contains(document.activeElement);
        notice.hidden = true;
        if (wasFocused) document.querySelector('header a[href="/"]')?.focus();
    };
    notice.querySelector('.campaign-notice-close').addEventListener('click', dismiss);
    notice.querySelector('.campaign-notice-dismiss').addEventListener('click', dismiss);
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !notice.hidden) dismiss();
    });
    notice.hidden = false;
    try { sessionStorage.setItem(storageKey, 'seen'); } catch {}
})();
