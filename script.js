  // --- Zmienne podstawowe ---
  let count = 0;
  let cps = 0;
  let clickValue = 1;
  let eventMultiplier = 1;
  let eventActive = false;
  let accumulatedCookies = 0; // Nowa zmienna do śledzenia ciastek na sekundę
  let playTimeSeconds = 0;


  // --- Nowy licznik ciastek upieczonych w sesji ---
  let cookiesBakedThisAscension = 0;

  // --- Referencje do elementów ---
  const cookieBtn = document.getElementById('cookieBtn');
  const countEl = document.getElementById('count');
  const cpsEl = document.getElementById('cps');
  const clickValueEl = document.getElementById('clickValue');
  const multiplierEl = document.getElementById('multiplier');
  const sessionCountEl = document.getElementById('sessionCount');
  const bakeryNameEl = document.getElementById('bakeryName');
  const bakeryOwnerEl = document.getElementById('bakeryOwner');
  const playTimeEl = document.getElementById('playTime');
  const backgroundMusic = document.getElementById('backgroundMusic');
  const settingsMenu = document.getElementById('settingsMenu');
  const volumeSection = document.getElementById('volumeSection');
  const enableMusicButton = document.getElementById('enableMusicButton');
  const volumeControl = document.getElementById('volumeControl');
  volumeControl.value = 1; // Ustaw domyślną głośność na 100%
  backgroundMusic.play().catch(() => {
    volumeSection.style.display = 'none';
    enableMusicButton.style.display = 'inline-block';
  });
  const muteButton = document.getElementById('muteButton');
  const clickSound = document.getElementById('clickSound');

  cookieBtn.addEventListener('click', () => {
      clickSound.currentTime = 0; // Resetuj dźwięk, aby można było go odtworzyć wielokrotnie
      clickSound.play();
    });

  // --- Ulepszenia produkcji ---
  const upgrades = [
    { id: 'cursor', name: 'Kursor', cost: 15, cps: 0.1, count: 0 },
    { id: 'grandma', name: 'Babcia', cost: 100, cps: 1, count: 0 },
    { id: 'farm', name: 'Farm', cost: 1100, cps: 8, count: 0 },
    { id: 'factory', name: 'Fabryka', cost: 12000, cps: 47, count: 0 },
    { id: 'bank', name: 'Bank', cost: 130000, cps: 260, count: 0 },
    { id: 'temple', name: 'Świątynia', cost: 1400000, cps: 1400, count: 0 },
    { id: 'wizardTower', name: 'Wieża czarodzieja', cost: 20000000, cps: 7800, count: 0 },
    { id: 'shipment', name: 'Przesyłka', cost: 330000000, cps: 44000, count: 0 },
    { id: 'alchemyLab', name: 'Laboratorium alchemiczne', cost: 5100000000, cps: 260000, count: 0 },
    { id: 'portal', name: 'Portal', cost: 75000000000, cps: 1600000, count: 0 }
  ];

  // --- Ulepszenia kliknięć ---
  const cursorUpgrades = [
    { id: 'fingerStrength', name: 'Siła palca', cost: 100, clickValue: 1, count: 0 },
    { id: 'doubleFinger', name: 'Podwójny palec', cost: 1000, clickValue: 5, count: 0 },
    { id: 'thirdFinger', name: 'Trzeci palec', cost: 15000, clickValue: 10, count: 0 }
  ];

  // --- Osiągnięcia ---
  const achievements = [
    { id: 'firstCookie', name: 'Pierwsze ciastko', condition: () => count >= 1, unlocked: false },
    { id: 'clickMaster', name: 'Mistrz kliknięć', condition: () => clickValue >= 10, unlocked: false },
    { id: 'cookieTycoon', name: 'Ciastkowy magnat', condition: () => count >= 1000, unlocked: false },
    // Nowe osiągnięcia "Bake X cookies in one ascension" - sesji:
    { id: 'wakeAndBake', name: 'Obudź się i piecz', condition: () => cookiesBakedThisAscension >= 1, unlocked: false },
    { id: 'makingSomeDough', name: 'Trochę ciasta', condition: () => cookiesBakedThisAscension >= 1e3, unlocked: false },
    { id: 'soBakedRightNow', name: 'Totalnie upieczony', condition: () => cookiesBakedThisAscension >= 1e5, unlocked: false },
    { id: 'fledglingBakery', name: 'Młoda piekarnia', condition: () => cookiesBakedThisAscension >= 1e6, unlocked: false },
    { id: 'affluentBakery', name: 'Bogata piekarnia', condition: () => cookiesBakedThisAscension >= 1e8, unlocked: false },
    { id: 'worldFamousBakery', name: 'Światowej sławy piekarnia', condition: () => cookiesBakedThisAscension >= 1e9, unlocked: false },
    { id: 'cosmicBakery', name: 'Kosmiczna piekarnia', condition: () => cookiesBakedThisAscension >= 1e11, unlocked: false },
    { id: 'galacticBakery', name: 'Galaktyczna piekarnia', condition: () => cookiesBakedThisAscension >= 1e12, unlocked: false },
    { id: 'universalBakery', name: 'Uniwersalna piekarnia', condition: () => cookiesBakedThisAscension >= 1e14, unlocked: false },
    { id: 'timelessBakery', name: 'Ponadczasowa piekarnia', condition: () => cookiesBakedThisAscension >= 1e15, unlocked: false },
    { id: 'infiniteBakery', name: 'Nieskończona piekarnia', condition: () => cookiesBakedThisAscension >= 1e17, unlocked: false },
    { id: 'immortalBakery', name: 'Nieśmiertelna piekarnia', condition: () => cookiesBakedThisAscension >= 1e18, unlocked: false },
    { id: 'dontStopMeNow', name: 'Nie zatrzymasz mnie', condition: () => cookiesBakedThisAscension >= 1e20, unlocked: false },
    { id: 'youCanStopNow', name: 'Możesz przestać', condition: () => cookiesBakedThisAscension >= 1e21, unlocked: false },
    { id: 'cookiesAllTheWayDown', name: 'Ciasteczka wszędzie', condition: () => cookiesBakedThisAscension >= 1e23, unlocked: false },
    { id: 'overdose', name: 'Przedawkowanie', condition: () => cookiesBakedThisAscension >= 1e24, unlocked: false }
  ];

  // --- Wyświetlanie ulepszeń ---
  const upgradesDiv = document.getElementById('upgrades');
  const cursorUpgradesDiv = document.getElementById('cursorUpgrades');

  function formatNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + " mld";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + " mln";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + " tys.";
    return Math.floor(num);
  }

  function createUpgradeItem(upgrade, container, type) {
    const div = document.createElement('div');
    div.className = 'upgrade-item';
    const span = document.createElement('span');
    if (type === 'production') {
      span.textContent = `${upgrade.name} (x${upgrade.count}) - ${upgrade.cps.toFixed(1)} cps - koszt: ${formatNumber(upgrade.cost)} ciastek`;
    } else if (type === 'click') {
      span.textContent = `${upgrade.name} (x${upgrade.count}) - +${upgrade.clickValue} za klik - koszt: ${formatNumber(upgrade.cost)} ciastek`;
    }
    const btn = document.createElement('button');
    btn.textContent = 'Kup';
    btn.disabled = count < upgrade.cost;
    btn.addEventListener('click', () => {
      if (count >= upgrade.cost) {
        count -= upgrade.cost;
        if(type === 'production') {
          upgrade.count++;
          cps += upgrade.cps;
          upgrade.cost = Math.ceil(upgrade.cost * 1.2);
        } else if(type === 'click') {
          upgrade.count++;
          clickValue += upgrade.clickValue;
          upgrade.cost = Math.ceil(upgrade.cost * 2.5);
        }
        updateDisplay();
        renderUpgrades();
        checkAchievements();
      }
    });
    div.appendChild(span);
    div.appendChild(btn);
    container.appendChild(div);
  }

  function renderUpgrades() {
    upgradesDiv.innerHTML = '<h2>Ulepszenia Produkcji</h2>';
    upgrades.forEach(upg => createUpgradeItem(upg, upgradesDiv, 'production'));

    cursorUpgradesDiv.innerHTML = '<h2>Ulepszenia Kliknięć</h2>';
    cursorUpgrades.forEach(upg => createUpgradeItem(upg, cursorUpgradesDiv, 'click'));
  }

  // --- Obsługa kliknięcia ciasteczka ---
  cookieBtn.addEventListener('click', e => {
    count += clickValue;
    cookiesBakedThisAscension += clickValue;
    createFlyingCookie(e.clientX, e.clientY);
    updateDisplay();
    checkAchievements();
  });

  // --- Dodawanie ciastek na sekundę ---
  function addCookiesPerSecond() {
    const amount = (cps * eventMultiplier) / 10;
    count += amount;
    cookiesBakedThisAscension += amount;

    // animuj nawet ułamki ciastek, np. jedno ciastko animowane za każde 1.0
    accumulatedCookies += amount;
    const wholeCookies = Math.floor(accumulatedCookies);
    if (wholeCookies >= 1) {
      createAutoCookieAnimation(Math.min(wholeCookies, 100));
      accumulatedCookies -= wholeCookies;
    }

    updateDisplay();
    checkAchievements();
  }

  // --- Nowa funkcja do animacji automatycznych ciastek ---
  function createAutoCookieAnimation(numCookies) {
    const buttonRect = cookieBtn.getBoundingClientRect();
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;

    for (let i = 0; i < numCookies; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 50 + 50;
      const deltaX = Math.cos(angle) * distance;
      const deltaY = Math.sin(angle) * distance;

      const cookie = document.createElement('div');
      cookie.className = 'auto-cookie';
      cookie.style.left = `${centerX}px`;
      cookie.style.top = `${centerY}px`;
      cookie.textContent = '🍪';
      
      document.body.appendChild(cookie);

      requestAnimationFrame(() => {
        cookie.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.5)`;
        cookie.style.opacity = '0';
      });

      setTimeout(() => cookie.remove(), 1000);
    }
  }



  // --- Aktualizacja wyświetlanych wartości ---
  function updateDisplay() {
    countEl.textContent = formatNumber(count);
    cpsEl.textContent = (cps * eventMultiplier).toFixed(1);
    clickValueEl.textContent = formatNumber(clickValue);
    multiplierEl.textContent = eventMultiplier.toFixed(2) + "x";
    sessionCountEl.textContent = formatNumber(cookiesBakedThisAscension);
    updateButtons();
    playTimeEl.textContent = formatPlayTime(playTimeSeconds);
  }

  function formatPlayTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm ' : ''}${s}s`;
  }

  function updateButtons() {
    upgrades.forEach(upg => {
      const buttons = upgradesDiv.querySelectorAll('button');
      buttons.forEach(btn => {
        if(btn.previousSibling.textContent.includes(upg.name)) {
          btn.disabled = count < upg.cost;
        }
      });
    });
    cursorUpgrades.forEach(upg => {
      const buttons = cursorUpgradesDiv.querySelectorAll('button');
      buttons.forEach(btn => {
        if(btn.previousSibling.textContent.includes(upg.name)) {
          btn.disabled = count < upg.cost;
        }
      });
    });
  }

  // --- Tworzenie animacji "latającego" ciasteczka ---
  function createFlyingCookie(x, y) {
    const span = document.createElement('span');
    span.className = 'flying-cookie';
    span.style.left = (x - 20) + 'px';
    span.style.top = (y - 20) + 'px';
    span.textContent = '+' + clickValue;
    document.body.appendChild(span);
    setTimeout(() => {
      span.remove();
    }, 1500);
  }

  // --- Obsługa eventów losowych ---
  const eventBox = document.getElementById('eventBox');

  function startRandomEvent() {
    if(eventActive) return;
    const rand = Math.random();
    if(rand < 0.01) { // 1% szans na event
      eventActive = true;
      eventMultiplier = 2;
      showEvent('Wydarzenie: Podwójne ciastka przez 10 sekund!');
      setTimeout(() => {
        eventMultiplier = 1;
        eventActive = false;
        hideEvent();
      }, 10000);
    }
  }

  function showEvent(message) {
    eventBox.textContent = message;
    eventBox.classList.add('show');
  }

  function hideEvent() {
    eventBox.classList.remove('show');
  }

  // --- Sprawdzanie osiągnięć ---
  const achievementsList = document.getElementById('achievementsList');

  function checkAchievements() {
    let changed = false;
    achievements.forEach(ach => {
      if(!ach.unlocked && ach.condition()) {
        ach.unlocked = true;
        changed = true;
        showEvent(`Osiągnięcie odblokowane: ${ach.name}!`);
      }
    });
    if(changed) renderAchievements();
  }

  function renderAchievements() {
    achievementsList.innerHTML = '';
    achievements.forEach(ach => {
      const div = document.createElement('div');
      div.className = 'achievement' + (ach.unlocked ? ' unlocked' : '');
      div.textContent = ach.name + (ach.unlocked ? ' ✓' : '');
      achievementsList.appendChild(div);
    });
  }

  function generateRandomName() {
    const firstParts = ['Złota', 'Słodka', 'Stara', 'Nowa', 'Tajemnicza', 'Kosmiczna', 'Wiejska', 'Miodowa', 'Magiczna', 'Puchata'];
    const secondParts = ['Piekarnia', 'Cukiernia', 'Ciastkarnia', 'Pracownia', 'Manufaktura', 'Wypiekarnia', 'Słodkości', 'Chlebożeria'];
    const suffixes = ['Babci Basi', 'u Krzysia', 'Oli', 'Julki', 'z Galaktyki', 'Marzeń', 'z Lasu', 'Pawoxa', 'z Przyszłości'];

    const first = firstParts[Math.floor(Math.random() * firstParts.length)];
    const second = secondParts[Math.floor(Math.random() * secondParts.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

    return `${first} ${second} ${suffix}`;
  }

  function setBakeryName(name) {
    bakeryOwnerEl.textContent = name;
  }

  bakeryNameEl.addEventListener('click', () => {
    const newName = prompt('Podaj nazwę swojej piekarni:');
    if (newName && newName.trim()) {
      setBakeryName(newName.trim());
    }
  });

  // Obsługa zmiany głośności
  volumeControl.addEventListener('input', () => {
    backgroundMusic.volume = volumeControl.value;
  });

  // Obsługa wyciszenia
  muteButton.addEventListener('click', () => {
    if (backgroundMusic.muted) {
      backgroundMusic.muted = false;
      muteButton.textContent = 'Wycisz muzykę';
    } else {
      backgroundMusic.muted = true;
      muteButton.textContent = 'Odcisz muzykę';
    }
  });

  // Obsługa menu ustawień
    const settingsToggle = document.getElementById('settingsToggle');
    
    settingsToggle.addEventListener('click', () => {
        const isVisible = settingsMenu.style.display === 'block';
        settingsMenu.style.display = isVisible ? 'none' : 'block';
    });

    enableMusicButton.addEventListener('click', () => {
        backgroundMusic.play().then(() => {
            volumeSection.style.display = 'block';
            enableMusicButton.style.display = 'none';
        });
    });

  
  // --- Pętla gry ---
  setInterval(() => {
    addCookiesPerSecond();
    startRandomEvent();
  }, 100);
  
  setInterval(() => {
    playTimeSeconds++;
    updateDisplay();
  }, 1000);

// --- Inicjalizacja ---
renderUpgrades();
updateDisplay();
renderAchievements();
setBakeryName(generateRandomName());