/* ============================================================
   Gallery photos
   To add your own: drop files in  image/gallery/  and add the
   path here, e.g.  'image/gallery/bohol-01.jpg'
   ============================================================ */
const galleryImages = [
    'image/gallery/RAK07123.jpg',
    'image/gallery/RAK07214.jpg',
    'image/gallery/RAK07220.jpg',
    'image/gallery/RAK05121.jpg',
    'image/gallery/IMG_4060.JPG',
    'image/gallery/IMG_3524.JPG',
    'image/gallery/IMG_3525.jpg',
    'image/gallery/IMG_3615.JPG',
    'image/gallery/IMG_0148.jpg',
    'image/gallery/IMG_0207.JPG',
    'image/gallery/IMG_0212.jpg',
    'image/gallery/IMG_3293.JPG',
    'image/gallery/IMG_3297.JPG',
    'image/gallery/IMG_3299.JPG',
    'image/gallery/IMG_3300.JPG',
    'image/gallery/IMG_4550.JPG',
    'image/gallery/IMG_4819.JPG',
    'image/gallery/IMG_5109.JPG',
    'image/gallery/IMG_5125.JPG',
    'image/gallery/IMG_5142.JPG',
    'image/gallery/IMG_8536.JPG',
    'image/gallery/IMG_8550.JPG',
    'image/gallery/IMG_20190203_213916_481.jpg',
    // To add more: drop the file in image/gallery/ and add its path here.
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
        document.body.style.overflow = '';
    };
    navToggle.addEventListener('click', () => {
        const open = navToggle.classList.toggle('open');
        navLinks.classList.toggle('open', open);
        navToggle.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
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
        try { localStorage.setItem('c2e_lang_v2', lang); } catch (e) {}
        if (typeof window.c2eOnLang === 'function') window.c2eOnLang(lang);
    };

    let currentLang = 'en';
    try { currentLang = localStorage.getItem('c2e_lang_v2') || 'en'; } catch (e) {}
    applyLang(currentLang);

    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'ko' ? 'en' : 'ko';
        applyLang(currentLang);
        if (detailOpen) openDetail(detailOpen);
        renderDday();
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
        { date: '2026.10', place: 'Manado', country: 'Indonesia', type: 'dive', upcoming: true, next: true, detail: 'manado', lat: 1.49, lng: 124.84 },
        { date: '2027.02', place: 'Zao Onsen', country: 'Japan', type: 'snow', upcoming: true, lat: 38.16, lng: 140.44 },
    ];
    const iconFor = (type) => (type === 'snow' ? '🏂' : '🤿');

    const timelineEl = document.getElementById('journeyTimeline');
    const mapEl = document.getElementById('journeyMap');
    let markersByKey = {};

    // Build timeline items (newest first)
    [...tours].reverse().forEach(t => {
        const key = `${t.lat},${t.lng}`;
        const item = document.createElement('div');
        item.className = 'journey-item' + (t.upcoming ? ' upcoming' : '');
        item.dataset.key = key;
        const badge = t.next ? '<span class="j-next">NEXT</span>'
            : (t.upcoming ? '<span class="j-next planned">PLANNED</span>' : '');
        item.innerHTML =
            `<span class="j-icon">${iconFor(t.type)}</span>` +
            `<span class="j-date">${t.date}</span>` +
            `<span class="j-place">${t.place} ${badge}</span>` +
            `<span class="j-country">${t.country}</span>` +
            (t.detail ? `<button class="j-detail-btn" data-detail="${t.detail}">Itinerary <span class="j-detail-arrow" aria-hidden="true">&#8594;</span></button>` : '');
        timelineEl.appendChild(item);
    });

    // Detail (itinerary) buttons
    timelineEl.querySelectorAll('.j-detail-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openDetail(btn.dataset.detail);
        });
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

        const pinIcon = (t) => L.divIcon({
            className: '',
            html: `<div class="c2e-pin ${t.upcoming ? 'next' : (t.type === 'snow' ? 'snow' : '')}"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
        });

        const bounds = [];
        [...tours].forEach(t => {
            const key = `${t.lat},${t.lng}`;
            bounds.push([t.lat, t.lng]);
            if (markersByKey[key]) return;
            const m = L.marker([t.lat, t.lng], { icon: pinIcon(t) })
                .addTo(map)
                .bindPopup(`<b>${iconFor(t.type)} ${t.place}</b><br>${t.country}` +
                    (t.upcoming ? '<br><span style="color:#ffd166">Next tour · 2026.10.03</span>' : ''));
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

    /* ---------- Tour detail modal (itinerary) ---------- */
    const detailModal = document.getElementById('detailModal');
    const detailBody = document.getElementById('detailBody');
    let detailOpen = null;

    // Prep checklist (rendered inside the modal's 준비물 tab, saved per browser)
    const CK = 'c2e_check_manado';
    const checkItems = [
        { id: 'passport', label: '여권 (유효기간 6개월 이상)' },
        { id: 'evoa', label: 'e-VOA 온라인 발급' },
        { id: 'edecl', label: 'All Indonesia 전자신고 (입국 72h 전)' },
        { id: 'ticket', label: '왕복 항공권 (ZE535 / ZE536)' },
        { id: 'log', label: '다이빙 로그북 · 자격증 카드' },
        { id: 'gear', label: '다이빙 장비 (자가 장비)' },
        { id: 'suit', label: '3mm 슈트 / 래시가드' },
        { id: 'computer', label: '다이브 컴퓨터' },
        { id: 'cash', label: 'USD 현금 (잔금 $1,000)' },
        { id: 'meds', label: '상비약 · 멀미약' },
        { id: 'sun', label: '자외선차단제' },
        { id: 'adapter', label: '멀티 어댑터 (C타입)' },
        { id: 'etc', label: '방수팩 · 보조배터리' },
    ];
    let checked = {};
    try { checked = JSON.parse(localStorage.getItem(CK) || '{}'); } catch (e) {}
    const saveChecks = () => { try { localStorage.setItem(CK, JSON.stringify(checked)); } catch (e) {} };
    const checklistItemsHtml = () => checkItems.map(i =>
        `<li class="check-item ${checked[i.id] ? 'done' : ''}" data-id="${i.id}">` +
        `<span class="check-box">${checked[i.id] ? '✓' : ''}</span>` +
        `<span class="check-label">${i.label}</span></li>`).join('');
    const checkDone = () => checkItems.filter(i => checked[i.id]).length;
    const updateCheckProgress = () => {
        const el = detailBody.querySelector('.check-progress');
        if (el) el.textContent = `${checkDone()} / ${checkItems.length}`;
    };

    function openDetail(key) {
        if (key !== 'manado' || !detailModal) return;
        const food = [
            ['First Class', '메가마스 해변 · 오션뷰 · 대형 생선구이 · 칠리크랩'],
            ['Om Iker', '참치 턱살 구이 원조집 · 한국어 주문 가능'],
            ['Warung Boke', '돼지고기 전문 · 쏘토 바비 · 바비 불루(대나무 통구이)'],
            ['Hapa Kitchen', '웨스턴-아시안 퓨전 · 버거 · 파스타 · 스테이크'],
            ['Raja Oci Paniki', '해산물 숯불구이 · 오징어구이 · 공항 근처'],
            ['Se7en Bar & Lounge', '타운스퀘어 옥상 라이브 뮤직 바'],
            ['Marugame Udon', '일식 우동 · 새우튀김'],
            ['Sushi Bar Manado', '현지 해산물 스시'],
            ['Wisata Bahari', '가장 오래된 유명 씨푸드 레스토랑'],
            ['Solaria', '국민 패밀리 레스토랑 · 향신료 약함'],
        ];
        const day = (d, date, title, rows, note) =>
            `<div class="itin-day">
                <div class="itin-when"><span class="itin-d">${d}</span><span class="itin-date">${date}</span><span class="itin-title">${title}</span></div>
                <div class="itin-rows">` +
            rows.map(([t, x]) => `<div class="itin-row"><span class="itin-time">${t}</span><span class="itin-text">${x}</span></div>`).join('') +
            (note ? `<div class="itin-day-note">※ ${note}</div>` : '') +
            `</div></div>`;

        detailBody.innerHTML =
            `<div class="detail-head">
                <span class="detail-flag">Indonesia · Manado</span>
                <h2>Bunaken Diving Tour</h2>
                <p class="detail-meta">2026.10.3–10.7 · 3박 5일 · 이스타항공 · 애스턴 호텔 · 인투블 마나도 · 3인</p>
             </div>` +

            `<div class="detail-tabs">
                <button class="detail-tab active" data-tab="itin">Itinerary</button>
                <button class="detail-tab" data-tab="dive">Diving</button>
                <button class="detail-tab" data-tab="cost">Cost</button>
                <button class="detail-tab" data-tab="food">Places</button>
                <button class="detail-tab" data-tab="prep">Prep</button>
             </div>
             <div class="detail-panels">` +

            `<div class="detail-tabpanel active" data-panel="itin"><div class="itin">` +
            day('Day 1', '10/3 (토)', '출발', [
                ['저녁', '인천국제공항 집결 (출발 3시간 전 권장) · 이스타항공 <b>ZE535</b> 체크인 · 다이빙 장비 수하물 위탁'],
                ['심야', 'ZE535 인천 → 마나도 출발 · 기내 취침 권장'],
                ['안내', '애스턴 호텔 객실은 이날 밤부터 확보되어 새벽 도착 즉시 입실 가능'],
            ]) +
            day('Day 2', '10/4 (일)', '도착 &amp; 첫 다이빙', [
                ['01:15', '마나도 삼 라툴랑이 국제공항 도착 (<b>ZE535</b>)'],
                ['~01:40', '도착비자(e-VOA) 확인 · 입국심사 · 수하물 · All Indonesia 전자신고'],
                ['02:00', '인투블 공항 픽업 → 애스턴 호텔 입실 · 휴식'],
                ['07:20', '호텔 픽업 (첫날) → 다이브샵'],
                ['08:30', '보트 출항 — 부나켄 해양국립공원'],
                ['09:30', '1차 다이빙 (수직 절벽 월 다이빙)'],
                ['11:30', '2차 다이빙'],
                ['12:30', '보트 위 <b>수제 한식 도시락</b> 점심 · 커피'],
                ['14:30', '3차 다이빙'],
                ['16:00', '호텔 복귀 · 휴식'],
                ['저녁', '자유 — 시내 맛집 (예: Om Iker 참치 턱살구이)'],
            ], '새벽 도착 직후 일정이라 첫날 다이빙 시각은 컨디션·현지 상황에 따라 조정될 수 있어요') +
            day('Day 3', '10/5 (월)', '부나켄 다이빙', [
                ['07:40', '호텔 픽업 (둘째 날부터 약 20분 늦게) → 다이브샵'],
                ['08:30', '보트 출항'],
                ['09:30', '1차 다이빙'],
                ['11:30', '2차 다이빙'],
                ['12:30', '보트 점심'],
                ['14:30', '3차 다이빙'],
                ['16:00', '호텔 복귀'],
                ['저녁', '자유 — 맛집 탐방 (해산물 숯불구이 Raja Oci 등)'],
            ], '이날이 <b>마지막 다이빙</b> → 10/7 새벽 출국까지 약 36시간, 다이빙 후 비행 18시간 규정 충족') +
            day('Day 4', '10/6 (화)', '토모트립 &amp; 귀국 준비', [
                ['오전', '애스턴 조식 · 짐 정리'],
                ['11:00', '애스턴 <b>체크아웃</b> (짐 보관 요청 가능)'],
                ['낮', '<b>토모트립</b> 출발 — 토모혼 고산지대로 이동 (리노우 호수 · 토모혼 꽃시장)'],
                ['오후', '부킷카시(사랑의 언덕) 유황온천 트래킹 · 톤다노 호수 · <b>프라이빗 독채 온천 + 전신 마사지</b>'],
                ['저녁', '토모혼 나이트마켓 체험 · 저녁 식사'],
                ['23:00', '공항으로 이동 (심야 비행 대비)'],
            ], '토모트립 코스·순서는 아래 「토모트립」 섹션 참고 — 현지 진행에 따라 달라질 수 있어요') +
            day('Day 5', '10/7 (수)', '귀국', [
                ['자정~새벽', '공항 체크인 · 출국 심사 · 면세'],
                ['02:20', '마나도 → 인천 출발 (<b>ZE536</b>)'],
                ['오전', '인천국제공항 도착 · 해산'],
            ]) +
            `</div></div>` +

            `<div class="detail-tabpanel" data-panel="dive"><section class="detail-sec"><h3>Bunaken Diving</h3>
                <p class="detail-note">바다 나가는 날 — 07:20~07:40 호텔 픽업 · 08:30 출항 · 09:30 / 11:30 / 14:30 3회 다이빙 · 12:30 보트 위 수제 한식 점심 · 16:00 호텔 복귀. 둘째 날부터 픽업이 약 20분 늦어져요.</p>
                <ul class="detail-list">
                    <li>수직 절벽 <b>월 다이빙</b> · 이글레이 · 참치 떼 · 범프헤드</li>
                    <li>수온 연중 28~30°C · <b>3mm 슈트 또는 래시가드</b> 권장</li>
                    <li>포함 — 가이드 · 보트 · 탱크/웨이트 · 점심 · 타올 · 국립공원 입장료</li>
                    <li>불포함 — 개인 장비(자가 지참) · 컴퓨터 렌탈 $10</li>
                </ul>
             </section>` +

            `<section class="detail-sec"><h3>Tomohon Land Tour</h3>
                <p class="detail-note">Day 4 · 11:00 체크아웃 후 시작 → 저녁 식사 → 23:00 공항 샌딩까지, 토모혼 고산지대 중심의 하루 코스예요. (2인 이상 $90/인 · 시설이용료·입장료·주차 포함 / 식음료 별도)</p>
                <ul class="detail-list">
                    <li><b>리노우 호수 (Linow Lake)</b> — 유황 성분으로 시시각각 색이 변하는 화산 호수</li>
                    <li><b>토모혼 꽃시장 · 팔랑기 꽃정원</b> — '꽃의 도시' 토모혼의 화훼 시장/정원</li>
                    <li><b>부킷카시 (사랑의 언덕)</b> — 유황 노천온천 연기가 피어오르는 활화산지대 트래킹</li>
                    <li><b>부끼도아 정글 트래킹</b> — 열대 정글 트레킹 (선택)</li>
                    <li><b>톤다노 호수</b> — 미나하사 최대 담수호</li>
                    <li><b>프라이빗 독채 온천 + 전신 마사지</b> — 다이빙 피로 회복</li>
                    <li><b>토모혼 나이트마켓</b> — 현지 '극한시장'으로 유명한 야시장 체험</li>
                </ul>
                <p class="detail-note">코스 순서·소요 시간은 현지 진행 상황과 교통·날씨에 따라 달라질 수 있어요.</p>
             </section></div>` +

            `<div class="detail-tabpanel" data-panel="cost"><section class="detail-sec"><h3>Cost</h3>
                <table class="detail-table">
                    <tr><td>부나켄 다이빙 (10/4–10/5)</td><td>$150 × 3 × 2</td><td>$900</td></tr>
                    <tr><td>국립공원 입장료</td><td>$10 × 3</td><td>$30</td></tr>
                    <tr><td>애스턴 호텔 (트윈)</td><td>$40 × 3박</td><td>$120</td></tr>
                    <tr><td>애스턴 호텔 (더블)</td><td>$40 × 3박</td><td>$120</td></tr>
                    <tr><td>공항 픽업 (편도)</td><td>3인</td><td>$40</td></tr>
                    <tr><td>토모트립 (육상 투어)</td><td>$90 × 3</td><td>$270</td></tr>
                    <tr class="total"><td>Total</td><td></td><td>$1,480</td></tr>
                </table>
                <div class="detail-callout">예약금 <b>$480</b> · 잔금 <b>$1,000</b> (현지 결제, 10/4) · 항공 · 팁 · 개인경비 별도</div>
             </section></div>` +

            `<div class="detail-tabpanel" data-panel="food">` +
            `<section class="detail-sec"><h3>Key Places</h3>
                <div class="food-grid">
                    <div class="food-item"><div class="food-info"><b>애스턴 호텔</b><span>3박 숙소 · 마나도</span></div><a class="food-map" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Aston Manado Hotel')}" target="_blank" rel="noopener" aria-label="애스턴 호텔 지도">Google Maps</a></div>
                    <div class="food-item"><div class="food-info"><b>마나도 국제공항</b><span>삼 라툴랑이 (MDC)</span></div><a class="food-map" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Sam Ratulangi International Airport Manado')}" target="_blank" rel="noopener" aria-label="마나도 공항 지도">Google Maps</a></div>
                    <div class="food-item"><div class="food-info"><b>인투블 마나도</b><span>다이빙 샵 · Marina Plaza (Boulevard)</span></div><a class="food-map" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Marina Plaza, Jl. Piere Tendean, Manado 95111')}" target="_blank" rel="noopener" aria-label="인투블 샵 지도">Google Maps</a></div>
                </div>
             </section>` +
            `<section class="detail-sec"><h3>Best 10 Eats <span class="detail-src">by In2Blue</span></h3>
                <div class="food-grid">` +
            food.map(([n, d]) => {
                const q = encodeURIComponent(n + ' Manado');
                return `<div class="food-item"><div class="food-info"><b>${n}</b><span>${d}</span></div>` +
                    `<a class="food-map" href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener" aria-label="${n} 지도">Google Maps</a></div>`;
            }).join('') +
            `</div></section></div>` +

            `<div class="detail-tabpanel" data-panel="prep">` +
            `<div class="check-card">
                <div class="check-head"><span class="check-title">Packing Checklist</span><span class="check-progress">${checkDone()} / ${checkItems.length}</span></div>
                <ul class="check-list">${checklistItemsHtml()}</ul>
                <button class="check-reset">체크 초기화</button>
             </div>` +
            `<section class="detail-sec"><h3>Entry Guide</h3>
                <ul class="detail-list">
                    <li><b>비자</b> — 도착비자(VOA) 필수 · 50만 루피아(약 $35). 출발 전 <b>e-VOA 온라인 발급</b> 권장</li>
                    <li><b>전자신고</b> — 세관+검역 통합 「All Indonesia」 전자신고, 입국 72시간 전부터 <b>allindonesia.imigrasi.go.id</b> 에서 무료 작성 (e-VOA도 같은 곳에서 신청 가능)</li>
                    <li><b>여권</b> — 유효기간 6개월 이상 + 왕복 항공권</li>
                    <li><b>다이빙 후 비행</b> — 마지막 다이빙 후 최소 18시간 뒤 탑승 (10/5 다이빙 → 10/7 새벽 출국, 규정 충족)</li>
                </ul>
                <p class="detail-note">일정·비용은 인투블 견적서(20260821-001) 기준이며, 현지 기상·해상 상황에 따라 변경될 수 있어요.</p>
             </section>` +
            `<section class="detail-sec"><h3>Quick Links</h3>
                <div class="detail-links">
                    <a href="https://www.manadodive.co.kr" target="_blank" rel="noopener">인투블 마나도</a>
                    <a href="https://allindonesia.imigrasi.go.id" target="_blank" rel="noopener">e-VOA · 전자신고</a>
                    <a href="https://www.eastarjet.com" target="_blank" rel="noopener">이스타항공</a>
                    <a href="https://search.naver.com/search.naver?query=달러환율" target="_blank" rel="noopener">환율</a>
                    <a href="https://www.google.com/search?q=manado+weather" target="_blank" rel="noopener">마나도 날씨</a>
                    <a href="https://open.kakao.com/o/git3MgNi" target="_blank" rel="noopener">크루 오픈채팅</a>
                </div>
             </section></div></div>`;

        detailModal.classList.add('open');
        detailModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        detailBody.scrollTop = 0;
        detailOpen = 'manado';
    }

    function closeDetail() {
        if (!detailModal) return;
        detailModal.classList.remove('open');
        detailModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        detailOpen = null;
    }

    if (detailModal) {
        detailModal.querySelector('.detail-close').addEventListener('click', closeDetail);
        detailModal.querySelector('.detail-backdrop').addEventListener('click', closeDetail);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && detailOpen) closeDetail(); });

        detailBody.addEventListener('click', (e) => {
            const tab = e.target.closest('.detail-tab');
            if (tab) {
                detailBody.querySelectorAll('.detail-tab').forEach(t => t.classList.toggle('active', t === tab));
                detailBody.querySelectorAll('.detail-tabpanel').forEach(p => p.classList.toggle('active', p.dataset.panel === tab.dataset.tab));
                detailBody.scrollTop = 0;
                return;
            }
            const item = e.target.closest('.check-item');
            if (item) {
                const id = item.dataset.id;
                checked[id] = !checked[id];
                item.classList.toggle('done', checked[id]);
                item.querySelector('.check-box').textContent = checked[id] ? '✓' : '';
                saveChecks();
                updateCheckProgress();
                return;
            }
            if (e.target.closest('.check-reset')) {
                checked = {};
                saveChecks();
                const list = detailBody.querySelector('.check-list');
                if (list) list.innerHTML = checklistItemsHtml();
                updateCheckProgress();
            }
        });
    }

    /* ---------- C2E Tours videos (thumbnail -> opens on YouTube) ---------- */
    const videos = [
        { id: 'MwaYwdTxXw4', title: 'C2E in Niseko' },
        { id: 'YlUIl1EUcJ0', title: 'C2E Bohol Tour' },
        { id: 'GKeFacM-Rb8', title: 'C2E Anilao Tour' },
        { id: 'MzHY_3FrsMI', title: 'C2E Liloan Tour' },
        { id: '74ywr5ugxvk', title: 'C2E Bohol Tour' },
        { id: 'Ww8BeS-rVnU', title: 'C2E Palau Tour' },
        { id: 'Sha6-Esf5Hs', title: 'C2E Sabang Tour' },
    ];
    const videoGrid = document.getElementById('videoGrid');
    if (videoGrid) {
        videos.forEach(v => {
            const item = document.createElement('div');
            item.className = 'video-item';
            item.innerHTML =
                `<a class="video-card" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener" aria-label="Watch on YouTube: ${v.title}">` +
                `<img src="https://img.youtube.com/vi/${v.id}/hqdefault.jpg" alt="${v.title}" loading="lazy">` +
                `<span class="play-btn"></span>` +
                `<span class="video-tag">Watch on YouTube ↗</span>` +
                `</a>` +
                `<h3 class="video-title">${v.title}</h3>`;
            videoGrid.appendChild(item);
        });
    }

    /* ---------- Gallery (load-more batches) ---------- */
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryMoreBtn = document.getElementById('galleryMore');
    const galleryMoreCount = document.getElementById('galleryMoreCount');
    const GALLERY_PAGE = 12;
    let gShown = 0;

    function renderGalleryBatch() {
        const next = galleryImages.slice(gShown, gShown + GALLERY_PAGE);
        const frag = document.createDocumentFragment();
        next.forEach((src, k) => {
            const idx = gShown + k;
            const fig = document.createElement('figure');
            fig.className = 'gallery-item';
            fig.dataset.index = idx;
            fig.innerHTML = `<img src="${src}" alt="C2E moment ${idx + 1}" loading="lazy">`;
            frag.appendChild(fig);
        });
        galleryGrid.appendChild(frag);
        gShown += next.length;
        const remaining = galleryImages.length - gShown;
        if (galleryMoreBtn) {
            galleryMoreBtn.hidden = remaining <= 0;
            if (galleryMoreCount) galleryMoreCount.textContent = remaining > 0 ? '(' + remaining + ')' : '';
        }
    }
    renderGalleryBatch();
    if (galleryMoreBtn) galleryMoreBtn.addEventListener('click', renderGalleryBatch);

    /* ---------- Lightbox (navigates the full gallery, not just loaded ones) ---------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCount = document.getElementById('lightboxCount');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    let lbIndex = 0;

    function showLightbox(i) {
        const n = galleryImages.length;
        if (n === 0) return;
        lbIndex = (i + n) % n;
        lightboxImg.src = galleryImages[lbIndex];
        if (lightboxCount) lightboxCount.textContent = (lbIndex + 1) + ' / ' + n;
    }
    function openLightbox(i) {
        showLightbox(i);
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
    }
    const closeLightbox = () => {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImg.src = '';
    };

    // Delegated click (covers items added later via "load more")
    galleryGrid.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (item) openLightbox(+item.dataset.index);
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showLightbox(lbIndex - 1); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showLightbox(lbIndex + 1); });
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    // Click the enlarged image again → close
    lightboxImg.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') showLightbox(lbIndex - 1);
        else if (e.key === 'ArrowRight') showLightbox(lbIndex + 1);
    });

    // Swipe navigation on touch devices
    let lbTouchX = null;
    lightbox.addEventListener('touchstart', (e) => { lbTouchX = e.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
        if (lbTouchX === null) return;
        const dx = e.changedTouches[0].clientX - lbTouchX;
        if (Math.abs(dx) > 45) showLightbox(lbIndex + (dx < 0 ? 1 : -1));
        lbTouchX = null;
    }, { passive: true });

    /* ---------- D-day to next tour ---------- */
    const nextTourDate = new Date(2026, 9, 3); // 2026-10-03 (Manado)
    function daysUntil(d) {
        const now = new Date(); now.setHours(0, 0, 0, 0);
        return Math.ceil((d - now) / 86400000);
    }
    function ddayLabel() {
        const n = daysUntil(nextTourDate);
        return n > 0 ? 'D-' + n : (n === 0 ? 'D-DAY' : 'D+' + (-n));
    }
    function renderDday() {
        const dd = ddayLabel();
        const nm = currentLang === 'ko' ? '마나도' : 'Manado';
        const lbl = currentLang === 'ko' ? '다음 투어' : 'NEXT TOUR';
        const hero = document.getElementById('heroDday');
        if (hero) {
            hero.hidden = false;
            hero.innerHTML = `<span class="dd-label">${lbl}</span> 🤿 ${nm} <b>${dd}</b>`;
        }
        const up = document.getElementById('upcomingDday');
        if (up) up.textContent = dd;
    }
    renderDday();

    /* ---------- Scroll to top ---------- */
    const toTop = document.getElementById('toTop');
    if (toTop) {
        const onScrollTop = () => toTop.classList.toggle('show', window.scrollY > 500);
        onScrollTop();
        window.addEventListener('scroll', onScrollTop, { passive: true });
        toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    /* ---------- Shared mini toast (also used by store) ---------- */
    const toastElG = document.getElementById('toast');
    let toastTimerG;
    function showToast(msg) {
        if (!toastElG) return;
        toastElG.textContent = msg;
        toastElG.hidden = false;
        requestAnimationFrame(() => toastElG.classList.add('show'));
        clearTimeout(toastTimerG);
        toastTimerG = setTimeout(() => {
            toastElG.classList.remove('show');
            setTimeout(() => { toastElG.hidden = true; }, 300);
        }, 2200);
    }

    /* ---------- Scroll progress bar ---------- */
    const progress = document.getElementById('scrollProgress');
    if (progress) {
        const updateProgress = () => {
            const doc = document.documentElement;
            const max = doc.scrollHeight - window.innerHeight;
            const y = window.scrollY || window.pageYOffset || doc.scrollTop || 0;
            progress.style.width = (max > 0 ? Math.min(100, (y / max) * 100) : 0) + '%';
        };
        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress, { passive: true });
    }

    /* ---------- Scrollspy: highlight active nav link ---------- */
    const navMap = {};
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
        navMap[a.getAttribute('href').slice(1)] = a;
    });
    const spySections = document.querySelectorAll('.main-content section[id]');
    if (spySections.length && 'IntersectionObserver' in window) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                const link = navMap[e.target.id];
                if (!link) return;
                Object.values(navMap).forEach(a => a.classList.remove('active'));
                link.classList.add('active');
            });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
        spySections.forEach(s => spy.observe(s));
    }

    /* ---------- Share (Web Share API → clipboard fallback) ---------- */
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const shareData = {
                title: 'C2E — Closer to Earth',
                text: currentLang === 'ko' ? 'C2E · 바다와 눈을 누비는 크루' : 'C2E · a crew that dives the sea and rides the snow',
                url: location.href.split('#')[0],
            };
            // Desktop gets the ugly OS share window from navigator.share, so only use the
            // native sheet on touch/mobile (where KakaoTalk etc. show up). Desktop copies the link.
            const isTouch = window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(max-width: 768px)').matches;
            try {
                if (navigator.share && isTouch) { await navigator.share(shareData); return; }
                await navigator.clipboard.writeText(shareData.url);
                showToast(currentLang === 'ko' ? '링크를 복사했어요' : 'Link copied');
            } catch (e) { /* user cancelled or blocked — no-op */ }
        });
    }

    /* ---------- PWA service worker ---------- */
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').catch(() => {});
        });
    }

    /* ---------- PWA install (Add to Home Screen) ---------- */
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
        let deferredPrompt = null;
        const ua = navigator.userAgent || '';
        const isIOS = /iphone|ipad|ipod/i.test(ua) || (/Macintosh/.test(ua) && 'ontouchend' in document);
        const inApp = /KAKAOTALK|Instagram|FBAN|FBAV|FB_IAB|NAVER|Line\/|DaumApps|; wv\)/i.test(ua);
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

        // Android / desktop Chrome: capture the native prompt and reveal the button
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            if (!isStandalone) installBtn.hidden = false;
        });
        // iOS & in-app browsers get no prompt event — still show the button (with guided steps)
        if ((isIOS || inApp) && !isStandalone) installBtn.hidden = false;

        const installModal = document.getElementById('installModal');
        const installSteps = document.getElementById('installSteps');

        function stepsHtml() {
            const ko = currentLang === 'ko';
            if (inApp) {
                return ko
                    ? '<li>지금은 카톡·인스타 같은 <b>앱 안의 브라우저</b>예요. 여기선 홈 화면 추가가 안 됩니다.</li>'
                    + '<li>화면 <b>오른쪽 위</b> 또는 <b>아래</b>의 <span class="ih-key">···</span> 메뉴를 누르세요.</li>'
                    + '<li><b>‘Safari로 열기’</b>(아이폰) 또는 <b>‘다른 브라우저로 열기’</b>(안드로이드)를 선택하세요.</li>'
                    + '<li>그 브라우저에서 이 버튼을 다시 누르면 됩니다.</li>'
                    : '<li>You’re in an <b>in-app browser</b> (KakaoTalk, Instagram…). Install isn’t possible here.</li>'
                    + '<li>Open the <span class="ih-key">···</span> menu (top-right or bottom).</li>'
                    + '<li>Choose <b>“Open in Safari”</b> (iOS) or <b>“Open in browser”</b> (Android).</li>'
                    + '<li>Then tap this button again there.</li>';
            }
            if (isIOS) {
                return ko
                    ? '<li>사파리 <b>맨 아래 가운데</b>의 <span class="ih-key">공유 버튼</span>(⬆️ 네모 아이콘)을 누르세요.</li>'
                    + '<li>메뉴를 아래로 내려 <b>‘홈 화면에 추가’</b>를 누르세요.</li>'
                    + '<li>오른쪽 위 <b>‘추가’</b>를 누르면 끝!</li>'
                    : '<li>Tap the <span class="ih-key">Share button</span> (box with ↑) at the bottom of Safari.</li>'
                    + '<li>Scroll down and choose <b>“Add to Home Screen”</b>.</li>'
                    + '<li>Tap <b>“Add”</b> at the top-right.</li>';
            }
            return ko
                ? '<li>브라우저 <span class="ih-key">⋮</span> 메뉴(오른쪽 위)를 여세요.</li>'
                + '<li><b>‘앱 설치’</b> 또는 <b>‘홈 화면에 추가’</b>를 선택하세요.</li>'
                : '<li>Open the browser <span class="ih-key">⋮</span> menu (top-right).</li>'
                + '<li>Choose <b>“Install app”</b> or <b>“Add to Home screen”</b>.</li>';
        }
        function openInstallHelp() {
            if (!installModal || !installSteps) return;
            installSteps.innerHTML = stepsHtml();
            installModal.classList.add('open');
            installModal.setAttribute('aria-hidden', 'false');
        }
        function closeInstallHelp() {
            if (!installModal) return;
            installModal.classList.remove('open');
            installModal.setAttribute('aria-hidden', 'true');
        }

        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {           // Android / desktop → native install
                deferredPrompt.prompt();
                await deferredPrompt.userChoice;
                deferredPrompt = null;
                installBtn.hidden = true;
                return;
            }
            openInstallHelp();              // iOS / in-app → guided steps
        });

        const imClose = document.getElementById('installModalClose');
        const imBackdrop = document.getElementById('installBackdrop');
        if (imClose) imClose.addEventListener('click', closeInstallHelp);
        if (imBackdrop) imBackdrop.addEventListener('click', closeInstallHelp);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && installModal && installModal.classList.contains('open')) closeInstallHelp();
        });
        window.addEventListener('appinstalled', () => { installBtn.hidden = true; });
    }

    /* ============================================================
       Store — product options, cart & checkout (preview flow)
       Payment is intentionally stubbed: the final step shows a
       "coming soon" dialog instead of charging.
       ============================================================ */
    (function initStore() {
        const storeSec = document.getElementById('store');
        if (!storeSec) return;

        const L = (ko, en) => (currentLang === 'ko' ? ko : en);
        const won = (n) => '₩' + Number(n).toLocaleString('ko-KR');

        const PRODUCT = { id: 'c2e-hoodie', nameKo: 'C2E 크루 후드티', nameEn: 'C2E Crew Hoodie', price: 49000 };
        const COLOR_KO = { Black: '블랙', Slate: '슬레이트', Sand: '샌드' };
        const FREE_SHIP_OVER = 30000;
        const SHIP_FEE = 3000;

        // ----- Product option state -----
        const storePhoto = storeSec.querySelector('.store-photo');
        const mainImg = storeSec.querySelector('.store-photo img');
        const thumbs = [...storeSec.querySelectorAll('.store-thumb')];

        // Adapt the frame to each image: portrait shots fill a 4/5 frame (cover),
        // wide shots (e.g. the collage) match their own ratio so nothing is cropped.
        // Class-based so the browser derives the frame height from the image itself
        // (no dependency on JS reading naturalWidth / load timing).
        function applyFit(thumb) {
            const fit = (thumb && thumb.dataset.fit) || 'cover';
            storePhoto.classList.toggle('fit-natural', fit === 'natural');
        }
        const swatches = [...storeSec.querySelectorAll('.store-swatch')];
        const sizes = [...storeSec.querySelectorAll('.store-size')];
        const qtyVal = document.getElementById('storeQty');
        let qty = 1;

        const activeColor = () => {
            const s = storeSec.querySelector('.store-swatch.is-active');
            return s ? (s.getAttribute('aria-label') || 'Black') : 'Black';
        };
        const activeSize = () => {
            const s = storeSec.querySelector('.store-size.is-active');
            return s ? s.textContent.trim() : 'M';
        };

        // Swap the main image to a thumbnail index
        function setMainByIndex(i) {
            const t = thumbs[i];
            if (!t) return;
            const src = t.querySelector('img') && t.querySelector('img').getAttribute('src');
            if (src && mainImg) mainImg.setAttribute('src', src);
            thumbs.forEach(x => x.classList.remove('is-active'));
            t.classList.add('is-active');
            applyFit(t);
        }
        const activeIndex = () => Math.max(0, thumbs.findIndex(t => t.classList.contains('is-active')));

        // ----- Product image popup (zoom / large view) -----
        const STORE_IMAGES = thumbs.map(t => t.querySelector('img').getAttribute('src'));
        const slb = document.getElementById('storeLightbox');
        const slbImg = document.getElementById('storeLbImg');
        const slbCount = document.getElementById('storeLbCount');
        const slbPrev = document.getElementById('storeLbPrev');
        const slbNext = document.getElementById('storeLbNext');
        let slbIndex = 0;

        function slbShow(i) {
            const n = STORE_IMAGES.length;
            if (!n) return;
            slbIndex = (i + n) % n;
            slbImg.src = STORE_IMAGES[slbIndex];
            if (slbCount) slbCount.textContent = (slbIndex + 1) + ' / ' + n;
            [slbPrev, slbNext].forEach(b => { if (b) b.style.display = n > 1 ? '' : 'none'; });
        }
        function slbOpen(i) {
            slbShow(i);
            slb.classList.add('open');
            slb.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
        function slbClose() {
            slb.classList.remove('open');
            slb.setAttribute('aria-hidden', 'true');
            slbImg.src = '';
            document.body.style.overflow = '';
            setMainByIndex(slbIndex); // keep the inline main image in sync with last viewed
        }

        // Thumbnail click → only select/swap the main image (no popup)
        thumbs.forEach((t, i) => t.addEventListener('click', () => setMainByIndex(i)));
        // Only the selected main image opens the zoom popup
        if (storePhoto) storePhoto.addEventListener('click', () => slbOpen(activeIndex()));

        // Popup controls
        const slbCloseBtn = document.getElementById('storeLbClose');
        if (slbCloseBtn) slbCloseBtn.addEventListener('click', slbClose);
        if (slbPrev) slbPrev.addEventListener('click', (e) => { e.stopPropagation(); slbShow(slbIndex - 1); });
        if (slbNext) slbNext.addEventListener('click', (e) => { e.stopPropagation(); slbShow(slbIndex + 1); });
        slb.addEventListener('click', (e) => { if (e.target === slb) slbClose(); });
        // Click the enlarged image again → back to normal
        slbImg.addEventListener('click', slbClose);
        document.addEventListener('keydown', (e) => {
            if (!slb.classList.contains('open')) return;
            if (e.key === 'Escape') slbClose();
            else if (e.key === 'ArrowLeft') slbShow(slbIndex - 1);
            else if (e.key === 'ArrowRight') slbShow(slbIndex + 1);
        });
        let slbTouchX = null;
        slb.addEventListener('touchstart', (e) => { slbTouchX = e.changedTouches[0].clientX; }, { passive: true });
        slb.addEventListener('touchend', (e) => {
            if (slbTouchX === null) return;
            const dx = e.changedTouches[0].clientX - slbTouchX;
            if (Math.abs(dx) > 45) slbShow(slbIndex + (dx < 0 ? 1 : -1));
            slbTouchX = null;
        }, { passive: true });

        applyFit(thumbs.find(t => t.classList.contains('is-active')) || thumbs[0]);

        // Color swatch select
        swatches.forEach(sw => sw.addEventListener('click', () => {
            swatches.forEach(x => x.classList.remove('is-active'));
            sw.classList.add('is-active');
        }));

        // Size select
        sizes.forEach(sz => sz.addEventListener('click', () => {
            sizes.forEach(x => x.classList.remove('is-active'));
            sz.classList.add('is-active');
        }));

        // Quantity stepper
        storeSec.querySelectorAll('[data-qty]').forEach(b => b.addEventListener('click', () => {
            qty = Math.max(1, Math.min(99, qty + (b.dataset.qty === 'inc' ? 1 : -1)));
            if (qtyVal) qtyVal.textContent = qty;
        }));

        // ----- Cart state -----
        let cart = [];
        try { cart = JSON.parse(localStorage.getItem('c2e_cart_v1')) || []; } catch (e) { cart = []; }
        const saveCart = () => { try { localStorage.setItem('c2e_cart_v1', JSON.stringify(cart)); } catch (e) {} };

        const productName = () => L(PRODUCT.nameKo, PRODUCT.nameEn);
        const colorName = (en) => L(COLOR_KO[en] || en, en);
        const subtotal = () => cart.reduce((s, i) => s + i.price * i.qty, 0);
        const shipping = () => { const s = subtotal(); return (s > 0 && s < FREE_SHIP_OVER) ? SHIP_FEE : 0; };
        const totalQty = () => cart.reduce((s, i) => s + i.qty, 0);

        function addToCart(color, size, n) {
            const existing = cart.find(i => i.color === color && i.size === size);
            if (existing) existing.qty += n;
            else cart.push({ id: PRODUCT.id, color, size, qty: n, price: PRODUCT.price });
            saveCart();
            renderAll();
        }

        // ----- Toast -----
        const toastEl = document.getElementById('toast');
        let toastTimer;
        function toast(msg) {
            if (!toastEl) return;
            toastEl.textContent = msg;
            toastEl.hidden = false;
            requestAnimationFrame(() => toastEl.classList.add('show'));
            clearTimeout(toastTimer);
            toastTimer = setTimeout(() => {
                toastEl.classList.remove('show');
                setTimeout(() => { toastEl.hidden = true; }, 300);
            }, 2200);
        }

        // ----- Cart badge -----
        const cartCount = document.getElementById('cartCount');
        function renderBadge() {
            const n = totalQty();
            if (!cartCount) return;
            cartCount.textContent = n;
            cartCount.hidden = n === 0;
        }

        // ----- Cart drawer render -----
        const cartItemsEl = document.getElementById('cartItems');
        const cartEmptyEl = document.getElementById('cartEmpty');
        const cartFootEl = document.getElementById('cartFoot');
        const cartHeadCount = document.getElementById('cartHeadCount');

        function lineRow(item, idx) {
            const line = item.price * item.qty;
            return (
                '<li class="cart-item" data-idx="' + idx + '">' +
                    '<div class="cart-item-thumb"><img src="image/store/hoodie-1.jpg" alt=""></div>' +
                    '<div class="cart-item-main">' +
                        '<div class="cart-item-top">' +
                            '<span class="cart-item-name">' + productName() + '</span>' +
                            '<button class="cart-item-x" type="button" data-remove="' + idx + '" aria-label="Remove">&times;</button>' +
                        '</div>' +
                        '<span class="cart-item-opt">' + colorName(item.color) + ' · ' + item.size + '</span>' +
                        '<div class="cart-item-bot">' +
                            '<div class="cart-item-qty">' +
                                '<button type="button" data-cq="dec" data-idx="' + idx + '">−</button>' +
                                '<span>' + item.qty + '</span>' +
                                '<button type="button" data-cq="inc" data-idx="' + idx + '">+</button>' +
                            '</div>' +
                            '<span class="cart-item-price">' + won(line) + '</span>' +
                        '</div>' +
                    '</div>' +
                '</li>'
            );
        }

        function renderCart() {
            if (!cartItemsEl) return;
            if (cart.length === 0) {
                cartItemsEl.innerHTML = '';
                if (cartEmptyEl) cartEmptyEl.hidden = false;
                if (cartFootEl) cartFootEl.hidden = true;
                if (cartHeadCount) cartHeadCount.textContent = '';
            } else {
                cartItemsEl.innerHTML = cart.map(lineRow).join('');
                if (cartEmptyEl) cartEmptyEl.hidden = true;
                if (cartFootEl) cartFootEl.hidden = false;
                if (cartHeadCount) cartHeadCount.textContent = '(' + totalQty() + ')';
                setText('cartSubtotal', won(subtotal()));
                setText('cartShip', shipping() === 0 ? L('무료', 'Free') : won(shipping()));
                setText('cartTotal', won(subtotal() + shipping()));
            }
        }

        function setText(id, v) { const el = document.getElementById(id); if (el) el.textContent = v; }

        // Cart item interactions (delegated)
        if (cartItemsEl) cartItemsEl.addEventListener('click', (e) => {
            const rm = e.target.closest('[data-remove]');
            if (rm) { cart.splice(+rm.dataset.remove, 1); saveCart(); renderAll(); return; }
            const cq = e.target.closest('[data-cq]');
            if (cq) {
                const i = cart[+cq.dataset.idx];
                if (!i) return;
                i.qty += (cq.dataset.cq === 'inc' ? 1 : -1);
                if (i.qty < 1) cart.splice(+cq.dataset.idx, 1);
                saveCart(); renderAll();
            }
        });

        // ----- Checkout summary render -----
        function renderSummary() {
            const el = document.getElementById('summaryItems');
            if (!el) return;
            el.innerHTML = cart.map(i => (
                '<li class="summary-item">' +
                    '<span class="summary-item-name">' + productName() + ' <em>' + colorName(i.color) + ' · ' + i.size + '</em></span>' +
                    '<span class="summary-item-q">×' + i.qty + '</span>' +
                    '<span class="summary-item-p">' + won(i.price * i.qty) + '</span>' +
                '</li>'
            )).join('');
            setText('sumSubtotal', won(subtotal()));
            setText('sumShip', shipping() === 0 ? L('무료', 'Free') : won(shipping()));
            setText('sumTotal', won(subtotal() + shipping()));
            setText('payTotal', won(subtotal() + shipping()));
        }

        function renderAll() { renderBadge(); renderCart(); renderSummary(); }

        // ----- Overlay open/close -----
        const drawer = document.getElementById('cartDrawer');
        const checkout = document.getElementById('checkoutModal');
        const soon = document.getElementById('soonModal');
        const overlays = { cart: drawer, checkout: checkout, soon: soon };

        function anyOpen() { return Object.values(overlays).some(o => o && o.classList.contains('open')); }
        function open(el) {
            if (!el) return;
            el.classList.add('open');
            el.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
        function close(el) {
            if (!el) return;
            el.classList.remove('open');
            el.setAttribute('aria-hidden', 'true');
            if (!anyOpen()) document.body.style.overflow = '';
        }

        // data-close buttons/backdrops
        document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => close(overlays[b.dataset.close])));
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;
            if (soon && soon.classList.contains('open')) return close(soon);
            if (checkout && checkout.classList.contains('open')) return close(checkout);
            if (drawer && drawer.classList.contains('open')) return close(drawer);
        });

        // ----- Wire buttons -----
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) cartBtn.addEventListener('click', () => open(drawer));

        const addBtn = document.getElementById('addToCart');
        if (addBtn) addBtn.addEventListener('click', () => {
            addToCart(activeColor(), activeSize(), qty);
            toast(L(qty + '개를 장바구니에 담았어요', 'Added ' + qty + ' to cart'));
            open(drawer);
        });

        const buyBtn = document.getElementById('buyNow');
        if (buyBtn) buyBtn.addEventListener('click', () => {
            addToCart(activeColor(), activeSize(), qty);
            open(checkout);
        });

        const cartCheckoutBtn = document.getElementById('cartCheckout');
        if (cartCheckoutBtn) cartCheckoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return;
            close(drawer);
            open(checkout);
        });

        // Fake "find address"
        const zipBtn = document.querySelector('.zip-btn');
        if (zipBtn) zipBtn.addEventListener('click', () => toast(L('주소 검색은 준비중이에요', 'Address search coming soon')));

        // Final payment → coming soon
        const payBtn = document.getElementById('payBtn');
        const checkoutForm = document.getElementById('checkoutForm');
        const agreeChk = document.getElementById('agreeChk');
        if (payBtn) payBtn.addEventListener('click', () => {
            if (cart.length === 0) { toast(L('장바구니가 비어 있어요', 'Your cart is empty')); return; }
            if (checkoutForm && !checkoutForm.checkValidity()) { checkoutForm.reportValidity(); return; }
            if (agreeChk && !agreeChk.checked) { toast(L('결제 동의에 체크해주세요', 'Please agree to proceed')); return; }
            const note = document.getElementById('soonOrder');
            if (note) note.textContent = L(
                totalQty() + '개 · 결제 예정 금액 ' + won(subtotal() + shipping()),
                totalQty() + ' item(s) · ' + won(subtotal() + shipping()) + ' due'
            );
            open(soon);
        });

        // Coming-soon product cards
        document.querySelectorAll('.store-card').forEach(c => c.addEventListener('click', () => {
            toast(L('출시 예정 상품이에요 🙌', 'Coming soon 🙌'));
        }));

        // Re-render dynamic text on language switch
        window.c2eOnLang = () => renderAll();

        renderAll();
    })();

    /* ---------- Console branding ---------- */
    console.log('%c C2E Crew ', 'background:#00c6ff; color:#04070d; font-size:20px; padding:10px; border-radius:4px;');
});
