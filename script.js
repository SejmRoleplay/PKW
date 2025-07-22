document.addEventListener('DOMContentLoaded', () => {
    // Funkcja do animacji pojawiania się elementów po scrollowaniu
    // Wykorzystuje Intersection Observer do wykrywania, kiedy element wchodzi w obszar widoku
    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Jeśli element jest widoczny, ustaw jego przezroczystość na 1 i przesuń do pozycji początkowej
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Przestań obserwować element po jego animacji, aby animacja nie powtarzała się bez potrzeby
                observer.unobserve(entry.target);
            }
        });
    };

    // --- Obserwator dla sekcji CTA (Call to Action) na stronie głównej (index.html) ---
    const ctaBoxes = document.querySelectorAll('.cta-box');
    const ctaObserver = new IntersectionObserver(animateOnScroll, {
        root: null, // viewport jako root (obszar widoczności)
        threshold: 0.2 // Element zostanie uznany za widoczny, gdy 20% jego wysokości znajdzie się w widoku
    });
    // Rozpocznij obserwowanie każdego bloku CTA
    ctaBoxes.forEach(box => ctaObserver.observe(box));

    // --- Obserwator dla kart członków (member-card) na stronie członków (czlonkowie.html) ---
    const memberCards = document.querySelectorAll('.member-card');
    const memberObserver = new IntersectionObserver(animateOnScroll, {
        root: null,
        threshold: 0.1 // Element zostanie uznany za widoczny, gdy 10% jego wysokości znajdzie się w widoku
    });
    // Rozpocznij obserwowanie każdej karty członka
    memberCards.forEach(card => memberObserver.observe(card));

    // --- Obserwator dla bloków miesięcy w kalendarzu (kalendarz.html) ---
    const months = document.querySelectorAll('.month');
    const monthObserver = new IntersectionObserver(animateOnScroll, {
        root: null,
        threshold: 0.1
    });
    // Rozpocznij obserwowanie każdego bloku miesiąca
    months.forEach(month => monthObserver.observe(month));


    // --- Animacja nagłówka hero na stronie głównej (index.html) ---
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        // Jeśli element hero-content istnieje, natychmiast ustaw jego styl
        // Przejście (transition) jest zdefiniowane w CSS, więc to wystarczy do aktywacji animacji
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }

    // --- Animacja pulsowania przycisku Discorda (kontakt.html) ---
    const discordBtn = document.querySelector('.discord-btn');
    if (discordBtn) {
        // Dodaj słuchacz zdarzeń dla najechania myszką
        discordBtn.addEventListener('mouseenter', () => {
            // Po najechaniu, włącz animację CSS 'pulse'
            discordBtn.style.animation = 'pulse 1s infinite alternate';
        });
        // Dodaj słuchacz zdarzeń dla opuszczenia myszką
        discordBtn.addEventListener('mouseleave', () => {
            // Po opuszczeniu, wyłącz animację
            discordBtn.style.animation = 'none';
        });
    }

    // --- Obsługa tooltipów w kalendarzu (kalendarz.html) ---
    const eventDays = document.querySelectorAll('.day.event');
    const tooltip = document.getElementById('event-tooltip');

    eventDays.forEach(day => {
        // Dodaj słuchacz zdarzeń dla ruchu myszy nad dniem z wydarzeniem
        day.addEventListener('mousemove', (e) => {
            const eventText = day.getAttribute('data-event'); // Pobierz tekst wydarzenia z atrybutu 'data-event'
            if (eventText) {
                tooltip.textContent = eventText; // Ustaw tekst tooltipa

                // Ustaw pozycję tooltipa względem kursora myszy
                // 'e.clientX' i 'e.clientY' dają współrzędne kursora względem okna przeglądarki
                tooltip.style.left = `${e.clientX}px`;
                tooltip.style.top = `${e.clientY}px`;

                // Korekta pozycji tooltipa, aby był nad kursorem i wyśrodkowany
                // 'translate(-50%, calc(-100% - 15px))' oznacza:
                // -50% w X: przesunięcie tooltipa o połowę jego szerokości w lewo (wyśrodkowanie)
                // calc(-100% - 15px) w Y: przesunięcie tooltipa o całą jego wysokość plus 15px w górę (nad kursorem)
                tooltip.style.transform = `translate(-50%, calc(-100% - 15px))`;

                // Ujawnij tooltip
                tooltip.style.visibility = 'visible';
                tooltip.style.opacity = '1';
            }
        });

        // Dodaj słuchacz zdarzeń dla opuszczenia myszką dnia z wydarzeniem
        day.addEventListener('mouseleave', () => {
            // Ukryj tooltip
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
        });
    });
});