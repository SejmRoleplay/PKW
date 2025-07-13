document.addEventListener('DOMContentLoaded', () => {
    // Definicja godziny rozpoczęcia i zakończenia symulacji (stałe wartości)
    const SIM_START_HOUR = 21;
    const SIM_START_MINUTE = 10;
    const SIM_END_HOUR = 23;
    const SIM_END_MINUTE = 0;

    // Ustawiamy daty startu i końca symulacji na DZISIEJSZĄ DATĘ
    const simulationStartTime = new Date();
    simulationStartTime.setHours(SIM_START_HOUR, SIM_START_MINUTE, 0, 0);

    const simulationEndTime = new Date();
    simulationEndTime.setHours(SIM_END_HOUR, SIM_END_MINUTE, 0, 0);

    const totalSimulationDurationMs = simulationEndTime.getTime() - simulationStartTime.getTime();

    // =========================================================================
    // DANE KOŃCOWE (NA 23:00) - SEJM (zgodne z Twoimi ostatnimi danymi)
    // =========================================================================
    const finalSejmData = {
        'Komitet Wyborczy Koalicja Świadomego Wyboru (KŚW)': { percent: 31.30, mandates: 160 },
        'Komitet Wyborczy Bezpartyjni': { percent: 18.80, mandates: 97 },
        'Komitet Wyborczy Koalicja Niebieskiej Polski': { percent: 18.80, mandates: 97 },
        'Komitet Wyborczy Polska 2055 Michała Kołodziejskiego': { percent: 12.50, mandates: 64 },
        'Komitet Wyborczy Prawo i Suwerenność (PiS)': { percent: 12.50, mandates: 64 },
        'Komitet Wyborczy Nowy Ład Społeczny (NŁS)': { percent: 6.30, mandates: 32 },
        'Pozostałe komitety wyborcze': { percent: 0.00, mandates: 0 } // Brak danych - ustawiam na 0
    };

    // =========================================================================
    // DANE POCZĄTKOWE (NA 21:10) - SEJM (moje przykładowe)
    // =========================================================================
    const initialSejmData = {
        'Komitet Wyborczy Koalicja Świadomego Wyboru (KŚW)': { percent: 25.00, mandates: 130 },
        'Komitet Wyborczy Bezpartyjni': { percent: 15.00, mandates: 75 },
        'Komitet Wyborczy Koalicja Niebieskiej Polski': { percent: 15.00, mandates: 75 },
        'Komitet Wyborczy Polska 2055 Michała Kołodziejskiego': { percent: 10.00, mandates: 50 },
        'Komitet Wyborczy Prawo i Suwerenność (PiS)': { percent: 10.00, mandates: 50 },
        'Komitet Wyborczy Nowy Ład Społeczny (NŁS)': { percent: 5.00, mandates: 25 },
        'Pozostałe komitety wyborcze': { percent: 20.00, mandates: 55 }
    };

    // =========================================================================
    // DANE KOŃCOWE (NA 23:00) - SENAT
    // =========================================================================
    const finalSenatData = {
        'Senatorowie związani z Koalicją Świadomego Wyboru (KŚW)': 41,
        'Senatorowie związani z Polską 2055 Michała Kołodziejskiego': 17,
        'Senatorowie związani z Prawem i Suwerennością (PiS)': 17,
        'Senatorowie związani z Koalicją Niebieskiej Polski': 17,
        'Senatorowie związani z Nowym Ładzie Społecznym (NŁS)': 8,
        'Pozostałe komitety wyborcze oraz kandydaci niezależni': 0
    };

    // =========================================================================
    // DANE POCZĄTKOWE (NA 21:10) - SENAT (moje przykładowe)
    // =========================================================================
    const initialSenatData = {
        'Senatorowie związani z Koalicją Świadomego Wyboru (KŚW)': 25,
        'Senatorowie związani z Polską 2055 Michała Kołodziejskiego': 10,
        'Senatorowie związani z Prawem i Suwerennością (PiS)': 10,
        'Senatorowie związani z Koalicją Niebieskiej Polski': 10,
        'Senatorowie związani z Nowym Ładzie Społecznym (NŁS)': 5,
        'Pozostałe komitety wyborcze oraz kandydaci niezależni': 40
    };

    // =========================================================================
    // DANE KOŃCOWE (NA 23:00) - OGÓLNE
    // =========================================================================
    const finalGeneralData = {
        przeliczoneObwody: 31215,
        procentPrzeliczenia: 100.0,
        wydaneKarty: 20893286,
        frekwencja: 69.9,
        kartyNiewazneProcent: 0.75,
        glosyWazneProcent: 99.25
    };

    // =========================================================================
    // DANE POCZĄTKOWE (NA 21:10) - OGÓLNE (moje przykładowe)
    // =========================================================================
    const initialGeneralData = {
        przeliczoneObwody: Math.round(31215 * 0.00), // 0% przed startem
        procentPrzeliczenia: 0.0,
        wydaneKarty: Math.round(20893286 * 0.00),
        frekwencja: 0.0,
        kartyNiewazneProcent: 0.0,
        glosyWazneProcent: 0.0
    };


    // Elementy DOM
    const currentTimeSpan = document.getElementById('currentTime');
    const sejmTableBody = document.getElementById('sejmTableBody');
    const senatTableBody = document.getElementById('senatTableBody');

    const przeliczoneObwodySpan = document.getElementById('przeliczoneObwody');
    const procentPrzeliczeniaSpan = document.getElementById('procentPrzeliczenia');
    const wydaneKartySpan = document.getElementById('wydaneKarty');
    const frekwencjaSpan = document.getElementById('frekwencja');
    const kartyNiewazneProcentSpan = document.getElementById('kartyNiewazneProcent');
    const glosyWazneProcentSpan = document.getElementById('glosyWazneProcent');

    let previousSejmMandates = {};
    let previousSenatMandates = {};
    let lastUpdatedRealMinute = -1; // Śledzi, kiedy ostatnio zaktualizowano dane (na podstawie realnej minuty)

    function updateDisplay() {
        const now = new Date(); // Bieżąca realna data i czas
        let progress = 0; // Domyślny progress na 0

        // --- Obsługa czasu przed startem symulacji (przed 21:10) ---
        if (now.getTime() < simulationStartTime.getTime()) {
            currentTimeSpan.textContent = formatTime(simulationStartTime); // Pokaż 21:10
            // Wyczyść lub pokaż komunikat "Oczekiwanie"
            sejmTableBody.innerHTML = '<tr><td colspan="4" class="waiting-message">Oczekiwanie na start symulacji (21:10)</td></tr>';
            senatTableBody.innerHTML = '<tr><td colspan="3" class="waiting-message">Oczekiwanie na start symulacji (21:10)</td></tr>';
            // Zeruj dane ogólne
            przeliczoneObwodySpan.textContent = '0';
            procentPrzeliczeniaSpan.textContent = '0.00';
            wydaneKartySpan.textContent = '0';
            frekwencjaSpan.textContent = '0.00%';
            kartyNiewazneProcentSpan.textContent = '0.00%';
            glosyWazneProcentSpan.textContent = '0.00%';
            return; // Zakończ funkcję, jeśli symulacja jeszcze nie wystartowała
        }

        // --- Obsługa czasu po zakończeniu symulacji (po 23:00) ---
        if (now.getTime() >= simulationEndTime.getTime()) {
            displayFinalResults();
            clearInterval(intervalId); // Zatrzymaj aktualizacje
            return;
        }

        // --- Symulacja jest w trakcie (pomiędzy 21:10 a 23:00) ---
        currentTimeSpan.textContent = formatTime(now); // Pokaż aktualny realny czas
        progress = (now.getTime() - simulationStartTime.getTime()) / totalSimulationDurationMs;
        progress = Math.min(1, Math.max(0, progress)); // Upewnij się, że progress jest w zakresie [0, 1]

        // --- Aktualizacja DANYCH (mandaty, procenty) tylko co minutę realnego czasu ---
        const currentRealMinute = now.getMinutes();

        if (currentRealMinute !== lastUpdatedRealMinute) {
            lastUpdatedRealMinute = currentRealMinute; // Zaktualizuj ostatnią zaktualizowaną minutę
            updateDataBasedOnProgress(progress);
        }
    }

    // Funkcja do aktualizacji danych na podstawie postępu
    function updateDataBasedOnProgress(progress) {
        // Aktualizacja danych ogólnych
        for (const key in finalGeneralData) {
            let currentValue;
            // Dla wartości, które są liczbami całkowitymi (obwody, karty), zaokrąglaj
            if (key === 'przeliczoneObwody' || key === 'wydaneKarty') {
                currentValue = Math.round(initialGeneralData[key] + (finalGeneralData[key] - initialGeneralData[key]) * progress);
            } else {
                currentValue = initialGeneralData[key] + (finalGeneralData[key] - initialGeneralData[key]) * progress;
            }

            if (key === 'przeliczoneObwody') przeliczoneObwodySpan.textContent = currentValue.toLocaleString('pl-PL');
            if (key === 'procentPrzeliczenia') procentPrzeliczeniaSpan.textContent = currentValue.toFixed(2);
            if (key === 'wydaneKarty') wydaneKartySpan.textContent = currentValue.toLocaleString('pl-PL');
            if (key === 'frekwencja') frekwencjaSpan.textContent = currentValue.toFixed(2) + '%';
            if (key === 'kartyNiewazneProcent') kartyNiewazneProcentSpan.textContent = currentValue.toFixed(2) + '%';
            if (key === 'glosyWazneProcent') glosyWazneProcentSpan.textContent = currentValue.toFixed(2) + '%';
        }

        // Aktualizacja Sejmu
        sejmTableBody.innerHTML = '';
        for (const partyName in finalSejmData) {
            const initialParty = initialSejmData[partyName];
            const finalParty = finalSejmData[partyName];

            // Upewnij się, że initialParty istnieje, w przeciwnym razie użyj wartości 0 lub finalParty
            const startPercent = initialParty ? initialParty.percent : 0;
            const startMandates = initialParty ? initialParty.mandates : 0;

            const currentPercent = startPercent + (finalParty.percent - startPercent) * progress;
            const currentMandates = Math.round(startMandates + (finalParty.mandates - startMandates) * progress);

            const row = document.createElement('tr');
            let changeClass = 'change-none';
            let changeIndicator = '';
            if (previousSejmMandates[partyName] !== undefined) {
                const diff = currentMandates - previousSejmMandates[partyName];
                if (diff > 0) {
                    changeClass = 'change-up';
                    changeIndicator = ` (+${diff})`;
                } else if (diff < 0) {
                    changeClass = 'change-down';
                    changeIndicator = ` (${diff})`;
                }
            }
            previousSejmMandates[partyName] = currentMandates;

            row.innerHTML = `
                <td>${partyName}</td>
                <td>${currentPercent.toFixed(2)}%</td>
                <td>${currentMandates}</td>
                <td class="${changeClass}">${changeIndicator}</td>
            `;
            sejmTableBody.appendChild(row);
        }

        // Aktualizacja Senatu
        senatTableBody.innerHTML = '';
        for (const partyName in finalSenatData) {
            const initialMandates = initialSenatData[partyName];
            const finalMandates = finalSenatData[partyName];

            // Upewnij się, że initialMandates istnieje
            const startMandatesSenat = initialMandates !== undefined ? initialMandates : 0;

            const currentMandates = Math.round(startMandatesSenat + (finalMandates - startMandatesSenat) * progress);

            const row = document.createElement('tr');
            let changeClass = 'change-none';
            let changeIndicator = '';
            if (previousSenatMandates[partyName] !== undefined) {
                const diff = currentMandates - previousSenatMandates[partyName];
                if (diff > 0) {
                    changeClass = 'change-up';
                    changeIndicator = ` (+${diff})`;
                } else if (diff < 0) {
                    changeClass = 'change-down';
                    changeIndicator = ` (${diff})`;
                }
            }
            previousSenatMandates[partyName] = currentMandates;

            row.innerHTML = `
                <td>${partyName}</td>
                <td>${currentMandates}</td>
                <td class="${changeClass}">${changeIndicator}</td>
            `;
            senatTableBody.appendChild(row);
        }
    }


    function displayFinalResults() {
        currentTimeSpan.textContent = formatTime(simulationEndTime); // Pokaż 23:00
        updateDataBasedOnProgress(1); // Ustawia dane na 100% postępu (czyli finalne)
    }

    // Funkcja formatująca czas bez sekund
    function formatTime(date) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`; // Zwracamy tylko HH:MM
    }

    // Pierwsze wywołanie, aby zainicjować stan
    updateDisplay();

    // Ustaw interwał aktualizacji na każdą sekundę
    const intervalId = setInterval(updateDisplay, 1000); // Wykonuj co 1 sekundę
});