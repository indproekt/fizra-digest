/* ===== INTERACTIVE ELEMENTS ===== */

// --- 1. Career Toggle (Surgeon ↔ Teacher) ---
(function() {
    const toggle = document.getElementById('careerToggle');
    const labelSurgeon = document.getElementById('labelSurgeon');
    const labelTeacher = document.getElementById('labelTeacher');
    const wrapper = document.querySelector('.toggle-image-wrapper');
    const hint = document.getElementById('toggleHint');
    if (!toggle || !wrapper) return;

    const hints = {
        surgeon: 'Мечта о медицине осталась в прошлом — но забота о здоровье никуда не ушла.',
        teacher: 'Сегодня мой кабинет — спортивный зал, а пациенты стали студентами.'
    };

    function updateToggle() {
        const isTeacher = toggle.checked;
        labelSurgeon.classList.toggle('active', !isTeacher);
        labelTeacher.classList.toggle('active', isTeacher);
        wrapper.classList.toggle('is-teacher', isTeacher);
        if (hint) hint.textContent = isTeacher ? hints.teacher : hints.surgeon;
    }

    toggle.addEventListener('change', updateToggle);
    updateToggle();
})();

// --- 2. Hobbies Carousel (Arc Trajectory) ---
(function() {
    const viewport = document.getElementById('carouselViewport');
    if (!viewport) return;
    const slides = Array.from(viewport.querySelectorAll('.carousel-slide'));
    if (!slides.length) return;

    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsWrap = document.getElementById('carouselDots');
    const count = slides.length;
    let active = 0;
    let dragStartX = null;
    let suppressClick = false;

    const dots = slides.map((slide, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot';
        const title = slide.querySelector('.carousel-caption-title');
        dot.setAttribute('aria-label', 'Показать: ' + (title ? title.textContent : 'Фото ' + (i + 1)));
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
        return dot;
    });

    function render() {
        const slideWidth = slides[0].offsetWidth || viewport.clientWidth * 0.56;
        const shift = slideWidth * 0.76;
        const arcHeight = viewport.clientHeight * 0.16;

        slides.forEach((slide, i) => {
            let d = i - active;
            if (d > count / 2) d -= count;
            if (d < -count / 2) d += count;
            const distance = Math.abs(d);
            const normalizedD = Math.min(distance / 2, 1);
            const ty = -arcHeight * Math.pow(normalizedD, 1.3);
            const ry = distance === 0 ? 0 : (d > 0 ? 16 : -16);

            slide.style.setProperty('--tx', (d * shift) + 'px');
            slide.style.setProperty('--ty', ty + 'px');
            slide.style.setProperty('--ry', ry + 'deg');
            slide.style.setProperty('--sc', distance === 0 ? '1' : '0.78');
            slide.style.setProperty('--op', distance === 0 ? '1' : distance === 1 ? '0.9' : '0');
            slide.style.setProperty('--z', String(10 - distance));
            slide.classList.toggle('is-active', d === 0);
            slide.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === active);
            dot.setAttribute('aria-current', i === active ? 'true' : 'false');
        });
    }

    function goTo(index) {
        active = (index + count) % count;
        render();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(active - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(active + 1));

    slides.forEach((slide, i) => {
        slide.addEventListener('click', () => {
            if (suppressClick) {
                suppressClick = false;
                return;
            }
            if (i !== active) goTo(i);
        });
    });

    viewport.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowRight':
                e.preventDefault();
                goTo(active + 1);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                goTo(active - 1);
                break;
            case 'Home':
                e.preventDefault();
                goTo(0);
                break;
            case 'End':
                e.preventDefault();
                goTo(count - 1);
                break;
        }
    });

    viewport.addEventListener('pointerdown', (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        dragStartX = e.clientX;
        suppressClick = false;
        viewport.classList.add('is-dragging');
    });

    function endDrag(e) {
        if (dragStartX === null) return;
        const diff = e.clientX - dragStartX;
        dragStartX = null;
        viewport.classList.remove('is-dragging');
        if (Math.abs(diff) > 45) {
            suppressClick = true;
            goTo(active + (diff < 0 ? 1 : -1));
        }
    }

    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', () => {
        dragStartX = null;
        viewport.classList.remove('is-dragging');
    });

    window.addEventListener('resize', render);
    render();
})();

// --- 3. Automatic Typewriter Effect (Notebook) ---
(function() {
    const notebook = document.querySelector('.notebook');
    const leftText = document.getElementById('poemLeftText');
    const rightText = document.getElementById('poemRightText');
    const cursorLeft = document.getElementById('cursorLeft');
    const cursorRight = document.getElementById('cursorRight');
    const status = document.getElementById('typewriterStatus');
    if (!notebook || !leftText || !rightText || !cursorLeft || !cursorRight) return;

    const leftPoem = `Забыть хочу лже-королей, бросающих словами громко,
Забыть хочу и тех людей, слова чьи задели колко,
Забыть хочу я тех «друзей», которые однажды решили предать
И потом порадоваться счастью...
Еще хочу забыть «друзей», которые с улыбкой
Хотели фальшью своих слов исправить все ошибки...
Забыть и тех, кто зарекался, что я не та, кем возомнилась!
Забыть и тех, кто прошептал: «За счастье ты не поплатилась».`;

    const rightPoem = `Кто боль когда-то причинял, не видя за собой ошибки,
Забыть их всех и понимать: «Нет права на ошибку!»
Ошибкой было бы прощать —
Всех тех, кто причиняет боль,
Всех тех «друзей», лже-королей — отвергнутых судьбой.
Всех сплетников из подворотни, угрюмой массой скрытых,
А также рьяных подлецов, замазкой алчной прикрытых!`;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const leftPart = leftText.closest('.poem-part');
    const rightPart = rightText.closest('.poem-part');
    let timer = null;
    let hasTyped = false;

    function fitPoem() {
        if (!leftPart || !rightPart) return;
        leftText.textContent = leftPoem;
        rightText.textContent = rightPoem;
        const minSize = 8;
        const maxSize = window.innerWidth <= 768 ? 16 : 34;
        let size = maxSize;
        const apply = () => {
            leftText.style.fontSize = size + 'px';
            rightText.style.fontSize = size + 'px';
        };
        const fits = () =>
            leftPart.scrollHeight <= leftPart.clientHeight + 1 &&
            rightPart.scrollHeight <= rightPart.clientHeight + 1;
        apply();
        while (size > minSize && !fits()) {
            size -= 0.5;
            apply();
        }
        leftText.textContent = '';
        rightText.textContent = '';
    }

    function showFullText() {
        leftText.textContent = leftPoem;
        rightText.textContent = rightPoem;
        cursorLeft.hidden = true;
        cursorRight.hidden = true;
        if (status) status.textContent = leftPoem + '\n' + rightPoem;
    }

    function typeChunk(el, text, index, cursor, done) {
        if (index > text.length) {
            cursor.hidden = true;
            done();
            return;
        }
        el.textContent = text.slice(0, index);
        cursor.hidden = false;
        const char = text[index - 1];
        const delay = (char === '.' || char === '!' || char === '?' || char === '…') ? 10
            : char === '\n' ? 6
            : (char === ',' || char === ':' || char === ';' || char === '-') ? 5
            : 1 + Math.random() * 1.5;
        timer = setTimeout(() => typeChunk(el, text, index + 1, cursor, done), delay);
    }

    function startTyping() {
        if (hasTyped) return;
        hasTyped = true;
        if (reduceMotion) {
            fitPoem();
            showFullText();
            return;
        }
        fitPoem();
        leftText.textContent = '';
        rightText.textContent = '';
        cursorLeft.hidden = false;
        cursorRight.hidden = true;
        if (status) status.textContent = '';
        typeChunk(leftText, leftPoem, 0, cursorLeft, () => {
            typeChunk(rightText, rightPoem, 0, cursorRight, () => {
                cursorLeft.hidden = true;
                cursorRight.hidden = true;
                if (status) status.textContent = leftPoem + '\n' + rightPoem;
            });
        });
    }

    if (!('IntersectionObserver' in window)) {
        startTyping();
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting || hasTyped) return;
            observer.disconnect();
            startTyping();
        });
    }, {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.2
    });
    observer.observe(notebook);
    window.addEventListener('pagehide', () => {
        if (timer) clearTimeout(timer);
    });
})();

// --- 4. Scroll Animations (Intersection Observer) ---
(function() {
    const sections = document.querySelectorAll('.section');
    if (!sections.length) return;
    if (!('IntersectionObserver' in window)) {
        sections.forEach(section => section.classList.add('visible'));
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.08
    });
    sections.forEach(section => observer.observe(section));
})();

// --- 5. Gallery Generation (by sections, without captions) ---
(function() {
    const sections = {
        galleryTogether: [
            { src: 'images/photo_2026-10-31_15-56-25.jpg', alt: 'Юлия Александровна со студентами' },
            { src: 'images/photo_2026-10-31_16-56-32.jpg', alt: 'Занятие со студентами' },
            { src: 'images/photo_2026-11-03_10-24-43.jpg', alt: 'Вместе со студентами' },
            { src: 'images/photo_2026-11-03_10-24-44.jpg', alt: 'Студенты и преподаватель' }
        ],
        galleryHobby: [
            { src: 'images/photo_2026-10-31_16-05-08.jpg', alt: 'Бадминтон после пар' },
            { src: 'images/photo_2026-10-31_16-05-09.jpg', alt: 'За любимым делом' }
        ],
        galleryEvents: [
            { src: 'images/photo_2026-10-31_15-56-25.jpg', alt: 'Соревнования' },
            { src: 'images/photo_2026-10-31_16-05-07.jpg', alt: 'Спортивное мероприятие' },
            { src: 'images/photo_2026-10-31_16-06-09.jpg', alt: 'Соревнования и мероприятия' },
            { src: 'images/photo_2026-11-03_10-29-29.jpg', alt: 'Мероприятие' },
            { src: 'images/photo_2026-11-03_10-29-30.jpg', alt: 'Соревнования' }
        ]
    };

    Object.keys(sections).forEach(containerId => {
        const container = document.getElementById(containerId);
        if (!container) return;
        sections[containerId].forEach(photo => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `
                <img src="${photo.src}" alt="${photo.alt}" loading="lazy">
            `;
            container.appendChild(item);
        });
    });
})();

// --- 6. Gallery Lightbox ---
(function() {
const galleryImgs = document.querySelectorAll('.gallery-item img, .achievements-photo img, .article-photo img');
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || !galleryImgs.length) return;
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const closeBtn = lightbox.querySelector('.close-lightbox');
    if (!lightboxImg || !closeBtn) return;

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.paddingRight = '';
        document.body.style.overflow = '';
    }

    galleryImgs.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.currentSrc || img.src;
            lightboxImg.alt = img.alt || 'Увеличенное фото';
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            document.body.style.overflow = 'hidden';
            lightbox.classList.add('active');
        });
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });
    lightbox.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
})();

// --- 7. Interactive floating particles background ---
(function() {
    const layer = document.getElementById('particlesLayer');
    if (!layer) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const count = 28;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('span');
        particle.className = 'particle';
        const size = 6 + Math.random() * 4;
        const duration = 14 + Math.random() * 14;
        const delay = -Math.random() * duration;
        const drift = (Math.random() * 2 - 1) * 70;
        particle.style.left = (Math.random() * 100).toFixed(2) + '%';
        particle.style.width = size.toFixed(1) + 'px';
        particle.style.height = size.toFixed(1) + 'px';
        particle.style.animationDuration = duration.toFixed(1) + 's';
        particle.style.animationDelay = delay.toFixed(1) + 's';
        particle.style.setProperty('--particle-drift', drift.toFixed(1) + 'px');
        particle.style.setProperty('--particle-opacity', (0.5 + Math.random() * 0.2).toFixed(2));
        fragment.appendChild(particle);
    }
    layer.appendChild(fragment);
})();
