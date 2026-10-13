// ═══════════════════════════════════════════════════════════════════
// FORT SULLIVAN (version 2 base) — shared behaviour for index + history
// ═══════════════════════════════════════════════════════════════════
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// ═══════════════════════════════════════════════
// HERO FILM
// Set `mp4` to a local file (e.g. 'hero.mp4') once the original footage
// arrives; it takes priority over YouTube. Adjust start/end to re-cut.
// ═══════════════════════════════════════════════
const HERO_FILM = { mp4: null, youtubeId: 'VDt1A-Oq2Xg', start: 0, end: 30 };

(() => {
    const film = document.querySelector('.hero-film');
    const toggle = document.querySelector('.film-toggle');
    if (!film || reducedMotion.matches || navigator.connection?.saveData) return;

    let pause, play, paused = false;
    const showToggle = () => { if (toggle) toggle.hidden = false; };
    const fallback = () => { film.classList.remove('is-playing'); if (toggle) toggle.hidden = true; };

    if (HERO_FILM.mp4) {
        const video = document.createElement('video');
        Object.assign(video, { src: HERO_FILM.mp4, muted: true, loop: true, playsInline: true, autoplay: true });
        video.setAttribute('aria-hidden', 'true');
        video.addEventListener('playing', () => { film.classList.add('is-playing'); showToggle(); });
        video.addEventListener('error', fallback);
        film.appendChild(video);
        pause = () => video.pause();
        play = () => video.play();
    } else {
        let player, ready = false;
        const mount = document.createElement('div');
        mount.id = 'hero-player';
        film.appendChild(mount);
        window.onYouTubeIframeAPIReady = () => {
            player = new YT.Player('hero-player', {
                host: 'https://www.youtube-nocookie.com',
                videoId: HERO_FILM.youtubeId,
                playerVars: { autoplay: 1, mute: 1, controls: 0, playsinline: 1, disablekb: 1, rel: 0,
                              start: HERO_FILM.start, end: HERO_FILM.end, origin: location.origin },
                events: {
                    onReady(e) {
                        ready = true;
                        const frame = e.target.getIframe();
                        frame.title = 'Fort Sullivan aerial film';
                        frame.tabIndex = -1;
                        frame.setAttribute('aria-hidden', 'true');
                        e.target.mute();
                        e.target.playVideo();
                    },
                    onStateChange(e) {
                        if (e.data === YT.PlayerState.PLAYING) { film.classList.add('is-playing'); showToggle(); }
                        if (e.data === YT.PlayerState.ENDED && !paused) {
                            player.loadVideoById({ videoId: HERO_FILM.youtubeId, startSeconds: HERO_FILM.start, endSeconds: HERO_FILM.end });
                        }
                    },
                    onError: fallback,
                    onAutoplayBlocked: fallback
                }
            });
        };
        pause = () => ready && player.pauseVideo();
        play = () => ready && player.playVideo();
        const api = document.createElement('script');
        api.src = 'https://www.youtube.com/iframe_api';
        api.async = true;
        api.onerror = fallback;
        document.head.appendChild(api);
    }

    toggle?.addEventListener('click', () => {
        paused = !paused;
        paused ? pause() : play();
        toggle.textContent = paused ? 'Play film' : 'Pause film';
    });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) pause(); else if (!paused) play();
    });
})();

// ═══════════════════════════════════════════════
// ESOTERICA DATA — the archive notes
// ═══════════════════════════════════════════════
const ESOTERICA = {
    rafters: {
        category: 'Structural Fabric · 1891',
        title: 'Open Timber Trusses & Hammer Beams',
        text: 'The chapel\'s nave ceiling was carried by open timber trusses with hammer beams — a technique directly descended from English Gothic carpentry of the 14th and 15th centuries. Architect W. W. Deveaux specified this system not merely for structural efficiency but for its acoustic and visual character: hammer beams create a vault-like visual rhythm without the weight or cost of stone vaulting. The memorial windows once filtered light through these trusses; when the congregation departed in 1907 and took the glass with them, the light that replaced it was harder and more direct, changing the character of the room entirely.',
        source: 'Albert Sidney Thomas, 1957 Diocesan History · Witold Rybczynski, The Pennsylvania Gazette'
    },
    fireplace: {
        category: 'Material Record · Rubble Granite',
        title: 'The Wall Fabric: Rubble Granite',
        text: 'The chapel\'s walls were built of rubble granite — rough-cut, irregular, unlaid in formal courses. This is a deliberate aesthetic and economic choice by Deveaux: rubble masonry is cheaper and faster than coursed ashlar, but in the hands of a skilled mason like Robert McCarrel it produces a wall with enormous visual texture and psychological weight. The mortar joints are wide and expressive. No two stones are identical. This is a wall that reads as geological rather than manufactured — as if the building grew from the island\'s substrate rather than being placed upon it. The current owners have preserved this character absolutely: the rubble fabric is the building\'s primary text.',
        source: 'National Register Multiple Property Documentation · 1957 Diocesan History'
    },
    sundial: {
        category: 'Courtyard Detail · Coordinates',
        title: 'The Meridian Sundial',
        text: 'The sundial in the courtyard is positioned according to Sullivan\'s Island\'s precise latitude: 32°46\'N. A correctly calibrated sundial at this latitude requires a gnomon angled at exactly 32.77° from horizontal to cast a true solar shadow. The inscription on the dial plate — if present — would traditionally record the motto of the house or the family arms. The placement of a sundial in a fortified residential courtyard continues a tradition that runs from medieval Scottish tower houses through the great country houses of the 18th century: time made physical, astronomy made domestic.',
        source: 'Site survey · Mugdock Arms design research'
    },
    joindoor: {
        category: 'The Seam · Threshold',
        title: 'The Door Between Centuries',
        text: 'This doorway is the most historically charged object in the property. On one side of its threshold: rubble granite laid in August 1891 by Robert McCarrel under contract to the Episcopal Diocese of South Carolina. On the other: reinforced concrete poured in 2009 by New World Byzantine architects under commission from the current owner. The door itself is a physical argument: that 120 years of history need not be concealed, that the junction of two eras can be stated as plainly as a seam in stone. To walk through it is to cross not a room but a century.',
        source: 'New World Byzantine construction documentation · 1957 Diocesan History'
    },
    stars: {
        category: 'Interior · Painted Cosmology',
        title: 'The Star Vault Ceiling',
        text: 'The painted star vault in the stairwell and keep ceiling draws on the tradition of the stellar vault — a decorative program found in the great choirs of English Gothic cathedrals (most notably Exeter and Gloucester) and transplanted into secular domestic architecture beginning in the 16th century. The use of a stellar ceiling in a private home is an assertion of cosmological ambition: the house as a kind of universe, the ceiling as a reminder of what lies beyond the stone. At Fort Sullivan, positioned at the junction of the stair where one moves between floors, it functions as an architectural moment of orientation — you look up before you ascend.',
        source: 'New World Byzantine project documentation · Gothic architectural tradition'
    },
    sword: {
        category: 'Heraldic Object · Mugdock Arms',
        title: 'The Ceremonial Sword',
        text: 'The ceremonial sword displayed at Fort Sullivan references the heraldic tradition of Mugdock Castle in Stirlingshire, Scotland — the ancestral seat of the Edmonstone family, whose arms include a sword upright. The property\'s name "Mugdock Keep" is not whimsy: it is a deliberate act of historical citation, connecting a Sullivan\'s Island structure built in the Romanesque tradition with the Scottish tower house tradition of the 14th-16th centuries. The sword, in this context, is not decoration but an argument: that this building belongs to a lineage of fortified private architecture that predates the nation it occupies.',
        source: 'Mugdock Arms heraldic documentation · New World Byzantine project narrative'
    },
    flag: {
        category: 'Heraldic Standard · The Mugdock Arms',
        title: 'The Flag of Fort Sullivan',
        text: 'The flag flying from the keep\'s parapet carries the Mugdock Arms — blue and white, derived from the Edmonstone clan heraldry of Stirlingshire, Scotland. Flying a heraldic standard from a residential structure is a practice that disappeared from American architecture almost entirely after the colonial period; its reappearance here is intentional. The flag performs the function that a name plate or address number performs for ordinary houses: it identifies, it claims, and it asserts a particular kind of belonging — one rooted not in municipal records but in something older and more personal.',
        source: 'Mugdock Arms heraldic documentation · Site observation'
    }
};

// ═══════════════════════════════════════════════
// COMPARISON SLIDER
// ═══════════════════════════════════════════════
(() => {
    const compareRange = document.getElementById('compare-range');
    const chapelLayer = document.getElementById('compare-chapel-layer');
    const compareDivider = document.getElementById('compare-divider');
    const compareHandle = document.getElementById('compare-handle');
    const compareWrapper = document.getElementById('compare');
    if (!compareRange) return;

    function updateCompare(pct) {
        chapelLayer.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
        compareDivider.style.left = pct + '%';
        compareHandle.style.left = pct + '%';
    }
    const fromPointer = (clientX) => {
        const rect = compareWrapper.getBoundingClientRect();
        const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        compareRange.value = pct;
        updateCompare(pct);
    };
    compareRange.addEventListener('input', (e) => updateCompare(e.target.value));
    compareWrapper.addEventListener('mousemove', (e) => { if (e.buttons === 1) fromPointer(e.clientX); });
    // Horizontal drags move the slider; vertical swipes still scroll the page
    let touchStart = null;
    compareWrapper.addEventListener('touchstart', (e) => {
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, dragging: false };
    }, { passive: true });
    compareWrapper.addEventListener('touchmove', (e) => {
        if (!touchStart) return;
        const t = e.touches[0];
        if (!touchStart.dragging && Math.abs(t.clientX - touchStart.x) > Math.abs(t.clientY - touchStart.y)) touchStart.dragging = true;
        if (touchStart.dragging) { e.preventDefault(); fromPointer(t.clientX); }
    }, { passive: false });
    compareWrapper.addEventListener('touchend', () => { touchStart = null; });
    updateCompare(compareRange.value);
})();

// ═══════════════════════════════════════════════
// MODAL — archive notes, plus a plain photo viewer
// that steps through the photographs around it
// ═══════════════════════════════════════════════
(() => {
    const overlay = document.getElementById('modal-overlay');
    if (!overlay) return;
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-image');
    const prevBtn = document.getElementById('modal-prev');
    const nextBtn = document.getElementById('modal-next');
    const counter = document.getElementById('modal-count');
    let set = [], index = 0, opener = null;

    function fillNote(key) {
        const data = ESOTERICA[key];
        document.getElementById('modal-category').textContent = data.category;
        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-text').textContent = data.text;
        document.getElementById('modal-source').textContent = 'Source: ' + data.source;
    }
    function show(i) {
        index = (i + set.length) % set.length;
        const el = set[index];
        const img = el.querySelector('img');
        modalImg.src = img.currentSrc || img.src;
        modalImg.alt = img.alt;
        const key = el.dataset.modal;
        const isNote = el.dataset.esoterica && ESOTERICA[key];
        modal.classList.toggle('modal-photo', !isNote);
        if (isNote) fillNote(key);
        counter.textContent = set.length > 1 ? `${index + 1} / ${set.length}` : '';
        prevBtn.hidden = nextBtn.hidden = set.length < 2;
    }
    function open(el) {
        opener = el;
        const group = el.closest('.masonry, .archive-grid, .keep-grid-main, .keep-grid-two, .keep-grid-three, .join-triptych, .hscroll-track, .filmstrip-track');
        set = group ? [...group.querySelectorAll('figure, .archive-item, .hscroll-item, .film-item')]
            .filter(n => n.querySelector('img') && n.offsetParent !== null) : [el];
        show(Math.max(0, set.indexOf(el)));
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        document.getElementById('modal-close').focus();
    }
    function close() {
        if (!overlay.classList.contains('open')) return;
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        opener?.focus();
    }

    document.getElementById('modal-close').addEventListener('click', close);
    prevBtn.addEventListener('click', () => show(index - 1));
    nextBtn.addEventListener('click', () => show(index + 1));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', (e) => {
        if (!overlay.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft' && set.length > 1) show(index - 1);
        if (e.key === 'ArrowRight' && set.length > 1) show(index + 1);
    });

    document.querySelectorAll('.masonry figure, .archive-item, .keep-grid-main figure, .keep-grid-two figure, .keep-grid-three figure, .join-triptych figure, .hscroll-item, .film-item')
        .forEach(el => {
            if (!el.querySelector('img')) return;
            el.tabIndex = 0;
            el.setAttribute('role', 'button');
            el.addEventListener('click', () => { if (!el.closest('[data-dragged="true"]')) open(el); });
            el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(el); } });
        });
})();

// ═══════════════════════════════════════════════
// ARCHIVE FILTER
// ═══════════════════════════════════════════════
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.archive-item').forEach(item => {
            const show = filter === 'all' ? true
                : filter === 'esoterica' ? !!item.dataset.esoterica
                : item.dataset.era === filter;
            item.style.display = show ? 'block' : 'none';
        });
    });
});

// ═══════════════════════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════════════════════
(() => {
    const targets = document.querySelectorAll('.stratum, .stratum-interlude, .pull-quote');
    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
        targets.forEach(el => el.classList.add('visible'));
        return;
    }
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
        });
    }, { threshold: 0.06 });
    targets.forEach(el => revealObserver.observe(el));
    if (location.hash) document.getElementById(location.hash.slice(1))?.classList.add('visible');
})();

// ═══════════════════════════════════════════════
// SPINE / TIMELINE ACTIVE STATE (in-page links only)
// ═══════════════════════════════════════════════
(() => {
    const links = [...document.querySelectorAll('.spine-link, .timeline-strip a')]
        .filter(a => a.getAttribute('href')?.startsWith('#'));
    if (!links.length) return;
    const ids = [...new Set(links.map(a => a.getAttribute('href').slice(1)))];
    const spy = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ids.map(id => document.getElementById(id)).filter(Boolean).forEach(s => spy.observe(s));
})();

// ═══════════════════════════════════════════════
// HORIZONTAL SCROLL — drag to scroll (a drag never opens the viewer)
// ═══════════════════════════════════════════════
document.querySelectorAll('.hscroll-track, .filmstrip-track').forEach(track => {
    let isDown = false, startX, scrollLeft;
    track.addEventListener('mousedown', e => {
        isDown = true; startX = e.pageX; scrollLeft = track.scrollLeft;
        track.dataset.dragged = 'false';
        e.preventDefault();
    });
    window.addEventListener('mouseup', () => {
        isDown = false;
        setTimeout(() => { track.dataset.dragged = 'false'; }, 0);
    });
    window.addEventListener('mousemove', e => {
        if (!isDown) return;
        const dx = e.pageX - startX;
        if (Math.abs(dx) > 5) track.dataset.dragged = 'true';
        track.scrollLeft = scrollLeft - dx * 1.5;
    });
});
