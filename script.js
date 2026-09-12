/* ============================================================
   Gallery photos
   To add your own: drop files in  image/gallery/  and add the
   path here, e.g.  'image/gallery/bohol-01.jpg'
   ============================================================ */
const galleryImages = [
    // Default: tour video thumbnails. Replace/extend with real photos below.
    'https://img.youtube.com/vi/MwaYwdTxXw4/hqdefault.jpg',
    'https://img.youtube.com/vi/YlUIl1EUcJ0/hqdefault.jpg',
    'https://img.youtube.com/vi/GKeFacM-Rb8/hqdefault.jpg',
    'https://img.youtube.com/vi/MzHY_3FrsMI/hqdefault.jpg',
    'https://img.youtube.com/vi/74ywr5ugxvk/hqdefault.jpg',
    'https://img.youtube.com/vi/Ww8BeS-rVnU/hqdefault.jpg',
    // 'image/gallery/bohol-01.jpg',
    // 'image/gallery/niseko-01.jpg',
];

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Navbar scrolled state ---------- */
    const navbar = document.querySelector('.navbar');
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------- Mobile menu ---------- */
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const closeMenu = () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
    };
    navToggle.addEventListener('click', () => {
        const open = navToggle.classList.toggle('open');
        navLinks.classList.toggle('open', open);
        navToggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    /* ---------- Language toggle (default EN / KO) ---------- */
    const langBtn = document.getElementById('langToggle');
    const i18nEls = document.querySelectorAll('[data-ko]');
    // Capture the original English markup once
    i18nEls.forEach(el => { el.dataset.en = el.innerHTML.trim(); });

    const applyLang = (lang) => {
        i18nEls.forEach(el => {
            el.innerHTML = lang === 'ko' ? el.dataset.ko : el.dataset.en;
        });
        document.documentElement.lang = lang;
        langBtn.textContent = lang === 'ko' ? 'EN' : 'KO';
        try { localStorage.setItem('c2e-lang', lang); } catch (e) {}
    };

    let currentLang = 'en';
    try { currentLang = localStorage.getItem('c2e-lang') || 'en'; } catch (e) {}
    applyLang(currentLang);

    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'ko' ? 'en' : 'ko';
        applyLang(currentLang);
    });

    /* ---------- Scroll reveal ---------- */
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.id === 'history' && window._c2eMap) {
                    setTimeout(() => window._c2eMap.invalidateSize(), 350);
                }
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    reveals.forEach(el => revealObserver.observe(el));

    /* ---------- Stats counter ---------- */
    const stats = document.querySelectorAll('.stat-num');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            if (el.dataset.plain === 'true') {
                el.textContent = target;
            } else {
                let cur = 0;
                const step = Math.max(1, Math.ceil(target / 40));
                const tick = () => {
                    cur = Math.min(target, cur + step);
                    el.textContent = cur;
                    if (cur < target) requestAnimationFrame(tick);
                };
                tick();
            }
            statObserver.unobserve(el);
        });
    }, { threshold: 0.6 });
    stats.forEach(el => statObserver.observe(el));

    /* ---------- Journey map + timeline ---------- */
    // type: 'dive' (🤿) or 'snow' (🏂 ski/snowboard)
    const tours = [
        { date: '2018.07', place: 'Anilao', country: 'Philippines', type: 'dive', lat: 13.76, lng: 120.90 },
        { date: '2019.02', place: 'Sabang', country: 'Philippines', type: 'dive', lat: 13.52, lng: 120.96 },
        { date: '2019.06', place: 'Palau', country: 'Palau', type: 'dive', lat: 7.34, lng: 134.48 },
        { date: '2019.10', place: 'Bohol', country: 'Philippines', type: 'dive', lat: 9.85, lng: 124.14 },
        { date: '2020.01', place: 'Liloan', country: 'Philippines', type: 'dive', lat: 10.40, lng: 123.99 },
        { date: '2022.08', place: 'Anilao', country: 'Philippines', type: 'dive', lat: 13.76, lng: 120.90 },
        { date: '2022.12', place: 'Bohol', country: 'Philippines', type: 'dive', lat: 9.85, lng: 124.14 },
        { date: '2024.06', place: 'Bohol', country: 'Philippines', type: 'dive', lat: 9.85, lng: 124.14 },
        { date: '2024.12', place: 'Malapascua', country: 'Philippines', type: 'dive', lat: 11.32, lng: 124.12 },
        { date: '2025.08', place: 'Ishigaki', country: 'Japan', type: 'dive', lat: 24.34, lng: 124.16 },
        { date: '2026.02', place: 'Niseko', country: 'Japan', type: 'snow', lat: 42.80, lng: 140.69 },
        { date: '2026.05', place: 'Sabang', country: 'Philippines', type: 'dive', lat: 13.52, lng: 120.96 },
    ];
    const iconFor = (type) => (type === 'snow' ? '🏂' : '🤿');

    const timelineEl = document.getElementById('journeyTimeline');
    const mapEl = document.getElementById('journeyMap');
    let markersByKey = {};

    // Build timeline items (newest first)
    [...tours].reverse().forEach(t => {
        const key = `${t.lat},${t.lng}`;
        const item = document.createElement('div');
        item.className = 'journey-item';
        item.dataset.key = key;
        item.innerHTML =
            `<span class="j-icon">${iconFor(t.type)}</span>` +
            `<span class="j-date">${t.date}</span>` +
            `<span class="j-place">${t.place}</span>` +
            `<span class="j-country">${t.country}</span>`;
        timelineEl.appendChild(item);
    });

    if (typeof L !== 'undefined' && mapEl) {
        const map = L.map(mapEl, { scrollWheelZoom: false, attributionControl: true });
        window._c2eMap = map;

        // Esri dark canvas (free, no API key required)
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri', maxZoom: 16,
        }).addTo(map);
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 16,
        }).addTo(map);

        const pinIcon = (type) => L.divIcon({
            className: '',
            html: `<div class="c2e-pin ${type === 'snow' ? 'snow' : ''}"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
        });

        const bounds = [];
        [...tours].forEach(t => {
            const key = `${t.lat},${t.lng}`;
            bounds.push([t.lat, t.lng]);
            if (markersByKey[key]) return;
            const m = L.marker([t.lat, t.lng], { icon: pinIcon(t.type) })
                .addTo(map)
                .bindPopup(`<b>${iconFor(t.type)} ${t.place}</b><br>${t.country}`);
            m.on('click', () => setActive(key, false));
            markersByKey[key] = m;
        });

        map.fitBounds(bounds, { padding: [45, 45] });

        function setActive(key, fly = true) {
            document.querySelectorAll('.journey-item').forEach(it => {
                it.classList.toggle('active', it.dataset.key === key);
            });
            const active = document.querySelector(`.journey-item[data-key="${key}"]`);
            if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            const m = markersByKey[key];
            if (m) {
                if (fly) map.flyTo(m.getLatLng(), 7, { duration: 0.8 });
                m.openPopup();
            }
        }

        timelineEl.querySelectorAll('.journey-item').forEach(item => {
            item.addEventListener('click', () => setActive(item.dataset.key, true));
        });
    }

    /* ---------- Gallery (rendered from galleryImages) ---------- */
    const galleryGrid = document.getElementById('galleryGrid');
    galleryImages.forEach((src, i) => {
        const fig = document.createElement('figure');
        fig.className = 'gallery-item';
        fig.dataset.full = src;
        fig.innerHTML = `<img src="${src}" alt="C2E moment ${i + 1}" loading="lazy">`;
        galleryGrid.appendChild(fig);
    });

    /* ---------- Lightbox ---------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            lightboxImg.src = item.dataset.full || item.querySelector('img').src;
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImg.src = '';
    };
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

    /* ---------- Console branding ---------- */
    console.log('%c C2E Crew ', 'background:#00c6ff; color:#04070d; font-size:20px; padding:10px; border-radius:4px;');
});
