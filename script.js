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

            // Дуга: соседние фото парят чуть выше центрального и развёрнуты к нему.
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

    // Свайпы и перетаскивание
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

    // Автоподгонка: подбираем максимальный размер шрифта, при котором текст
    // обеих страниц целиком помещается и не наезжает на дату и подпись.
    function fitPoem() {
        if (!leftPart || !rightPart) return;

        leftText.textContent = leftPoem;
        rightText.textContent = rightPoem;

        const baseSize = parseFloat(getComputedStyle(leftText).fontSize) || 16;
        const minSize = 8;
        let size = baseSize;

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

    // Печать запускается ровно один раз — при первом появлении блокнота в зоне видимости.
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

// --- 5. Photo Gallery with Lightbox ---
(function() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;

    const captions = {
        1: 'Студенты и преподаватель',
        2: 'Вместе со студентами',
        3: 'Активности на перемене',
        4: 'Бадминтон после пар',
        5: 'Педагогическое образование',
        6: 'Сборная по волейболу',
        7: 'На корте с ракеткой',
        8: 'Награда за труд',
        9: 'Занятие в спортивном зале',
        10: 'Помощь на тренировке',
        11: 'Медали студенческого клуба',
        12: 'На выставке «Дон спортивный»',
        13: 'Педагогический стенд',
        14: 'Подача на занятии',
        15: 'Класс в полном составе',
        16: 'Профориентационное мероприятие',
        17: 'Слёт студенческих клубов',
        18: 'Форум «Путь к Олимпу»',
        19: 'Разминка под ГТО',
        20: 'Отработка первой помощи',
        21: '«Лыжня России 2024»',
        22: 'Призёр «Лыжни России»',
        23: 'Команда на «Лыжне России»',
        24: 'Церемония награждения',
        25: 'Научный журнал: публикация',
        26: 'Страница научной статьи',
        27: 'Урок физкультуры',
        28: 'Стихотворение в блокноте'
    };

    const galleryPhotos = [];
    for (let i = 1; i <= 28; i++) {
        galleryPhotos.push({
            src: `images/photo_${i}_2026-11-01_01-16-25.jpg`,
            alt: captions[i] || `Фото ${i}`,
            caption: captions[i] || `Фото ${i}`
        });
    }

    const fragment = document.createDocumentFragment();

    galleryPhotos.forEach((photo, index) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'gallery-item';
        item.dataset.index = String(index);
        item.setAttribute('aria-label', `Открыть фото: ${photo.caption}`);

        const img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.alt;
        img.loading = 'lazy';
        img.decoding = 'async';

        const overlay = document.createElement('div');
        overlay.className = 'gallery-overlay';

        const caption = document.createElement('span');
        caption.className = 'gallery-caption';
        caption.textContent = photo.caption;

        overlay.appendChild(caption);
        item.appendChild(img);
        item.appendChild(overlay);
        fragment.appendChild(item);
    });

    galleryGrid.appendChild(fragment);

    // Lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Просмотр фотографий');
    lightbox.innerHTML = `
        <button class="lightbox-close" type="button" aria-label="Закрыть">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
        <button class="lightbox-nav lightbox-prev" type="button" aria-label="Предыдущее фото">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        </button>
        <button class="lightbox-nav lightbox-next" type="button" aria-label="Следующее фото">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </button>
        <div class="lightbox-content"></div>
        <div class="lightbox-counter" aria-live="polite"></div>
    `;
    document.body.appendChild(lightbox);

    const lightboxContent = lightbox.querySelector('.lightbox-content');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const items = galleryGrid.querySelectorAll('.gallery-item');

    let currentIndex = 0;
    let lastFocused = null;

    function renderSlide(index) {
        const photo = galleryPhotos[index];
        lightboxContent.innerHTML = '';

        const img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.alt;
        lightboxContent.appendChild(img);

        lightboxCounter.textContent = `${index + 1} / ${galleryPhotos.length} · ${photo.caption}`;
    }

    function openLightbox(index) {
        currentIndex = index;
        lastFocused = document.activeElement;
        renderSlide(currentIndex);
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
        lightboxClose.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
        if (lastFocused && typeof lastFocused.focus === 'function') {
            lastFocused.focus();
        }
    }

    function navigate(direction) {
        currentIndex = (currentIndex + direction + galleryPhotos.length) % galleryPhotos.length;
        renderSlide(currentIndex);
    }

    items.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigate(-1));
    lightboxNext.addEventListener('click', () => navigate(1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            navigate(-1);
        } else if (e.key === 'ArrowRight') {
            navigate(1);
        } else if (e.key === 'Tab') {
            // Небольшая ловушка фокуса внутри лайтбокса
            const focusable = [lightboxClose, lightboxPrev, lightboxNext];
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    // Свайпы на мобильных
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            navigate(diff > 0 ? 1 : -1);
        }
    }, { passive: true });
})();
