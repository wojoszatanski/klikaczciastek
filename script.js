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

  // --- Licznik całkowitej liczby ciastek zdobytych z kliknięć ---
  let totalFromClicks = 0;

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
    { id: 'firstCookie', name: 'Pierwsze ciastko', description: 'Zdobądź pierwsze ciastko', condition: () => count >= 1, unlocked: false },
    { id: 'clickMaster', name: 'Mistrz kliknięć', description: 'Zwiększ wartość kliknięcia do co najmniej 10', condition: () => clickValue >= 10, unlocked: false },
    { id: 'cookieTycoon', name: 'Ciastkowy magnat', description: 'Zdobądź 1000 ciastek jednocześnie', condition: () => count >= 1000, unlocked: false },
    // Nowe osiągnięcia "Bake X cookies in one ascension" - sesji:
    { id: 'wakeAndBake', name: 'Obudź się i piecz', description: 'Upiecz 1 ciastko podczas jednej sesji', condition: () => cookiesBakedThisAscension >= 1, unlocked: false },
    { id: 'makingSomeDough', name: 'Trochę ciasta', description: 'Upiecz 1 000 ciastek podczas jednej sesji', condition: () => cookiesBakedThisAscension >= 1e3, unlocked: false },
    { id: 'soBakedRightNow', name: 'Totalnie upieczony', description: 'Upiecz 100 000 ciastek podczas jednej sesji', condition: () => cookiesBakedThisAscension >= 1e5, unlocked: false },
    { id: 'fledglingBakery', name: 'Młoda piekarnia', description: 'Upiecz 1 000 000 ciastek podczas jednej sesji', condition: () => cookiesBakedThisAscension >= 1e6, unlocked: false },
    { id: 'affluentBakery', name: 'Bogata piekarnia', description: 'Upiecz 100 000 000 ciastek podczas jednej sesji', condition: () => cookiesBakedThisAscension >= 1e8, unlocked: false },
    { id: 'worldFamousBakery', name: 'Światowej sławy piekarnia', description: 'Upiecz 1 000 000 000 ciastek podczas jednej sesji', condition: () => cookiesBakedThisAscension >= 1e9, unlocked: false },
    { id: 'cosmicBakery', name: 'Kosmiczna piekarnia', description: 'Upiecz 100 000 000 000 ciastek podczas jednej sesji', condition: () => cookiesBakedThisAscension >= 1e11, unlocked: false },
    { id: 'galacticBakery', name: 'Galaktyczna piekarnia', description: 'Upiecz 1 000 000 000 000 ciastek podczas jednej sesji', condition: () => cookiesBakedThisAscension >= 1e12, unlocked: false },
    { id: 'universalBakery', name: 'Uniwersalna piekarnia', description: 'Upiecz 100 000 000 000 000 ciastek podczas jednej sesji', condition: () => cookiesBakedThisAscension >= 1e14, unlocked: false },
    { id: 'timelessBakery', name: 'Ponadczasowa piekarnia', description: 'Upiecz 1 000 000 000 000 000 ciastek podczas jednej sesji', condition: () => cookiesBakedThisAscension >= 1e15, unlocked: false },
    { id: 'infiniteBakery', name: 'Nieskończona piekarnia', description: 'Upiecz 100 000 000 000 000 000 ciastek podczas jednej sesji', condition: () => cookiesBakedThisAscension >= 1e17, unlocked: false },
    { id: 'immortalBakery', name: 'Nieśmiertelna piekarnia', description: 'Upiecz 1 000 000 000 000 000 000 ciastek podczas jednej sesji', condition: () => cookiesBakedThisAscension >= 1e18, unlocked: false },
    { id: 'dontStopMeNow', name: 'Nie zatrzymasz mnie', description: 'Upiecz 100 000 000 000 000 000 000 ciastek podczas jednej sesji', condition: () => cookiesBakedThisAscension >= 1e20, unlocked: false },
    { id: 'youCanStopNow', name: 'Możesz przestać', description: 'Upiecz 1 000 000 000 000 000 000 000 ciastek podczas jednej sesji', condition: () => cookiesBakedThisAscension >= 1e21, unlocked: false },
    { id: 'cookiesAllTheWayDown', name: 'Ciasteczka wszędzie', description: 'Upiecz 100 000 000 000 000 000 000 000 ciastek podczas jednej sesji', condition: () => cookiesBakedThisAscension >= 1e23, unlocked: false },
    { id: 'overdose', name: 'Przedawkowanie', description: 'Upiecz 1 000 000 000 000 000 000 000 000 000 ciastek podczas jednej sesji', condition: () => cookiesBakedThisAscension >= 1e24, unlocked: false },

    // Osiągnięcia CPS (ciastek na sekundę)
    { id: 'casualBaking', name: 'Luźne pieczenie', description: 'Piecz 1 ciastko na sekundę', condition: () => cps * eventMultiplier >= 1, unlocked: false },
    { id: 'hardcoreBaking', name: 'Hardkorowe pieczenie', description: 'Piecz 10 ciastek na sekundę', condition: () => cps * eventMultiplier >= 10, unlocked: false },
    { id: 'steadyStream', name: 'Stały, smaczny strumień', description: 'Piecz 100 ciastek na sekundę', condition: () => cps * eventMultiplier >= 100, unlocked: false },
    { id: 'cookieMonster', name: 'Potwór na ciastka', description: 'Piecz 1 000 ciastek na sekundę', condition: () => cps * eventMultiplier >= 1e3, unlocked: false },
    { id: 'massProducer', name: 'Masowy producent', description: 'Piecz 10 000 ciastek na sekundę', condition: () => cps * eventMultiplier >= 1e4, unlocked: false },
    { id: 'cookieVortex', name: 'Wir ciastek', description: 'Piecz 1 milion ciastek na sekundę', condition: () => cps * eventMultiplier >= 1e6, unlocked: false },
    { id: 'cookiePulsar', name: 'Ciasteczkowy pulsar', description: 'Piecz 10 milionów ciastek na sekundę', condition: () => cps * eventMultiplier >= 1e7, unlocked: false },
    { id: 'cookieQuasar', name: 'Ciasteczkowy kwazar', description: 'Piecz 100 milionów ciastek na sekundę', condition: () => cps * eventMultiplier >= 1e8, unlocked: false },
    { id: 'stillHere', name: 'O, nadal tu jesteś', description: 'Piecz 1 miliard ciastek na sekundę', condition: () => cps * eventMultiplier >= 1e9, unlocked: false },
    { id: 'neverBakeAgain', name: 'Nigdy więcej pieczenia', description: 'Piecz 10 miliardów ciastek na sekundę', condition: () => cps * eventMultiplier >= 1e10, unlocked: false },
    { id: 'cookieWorld', name: 'Świat pełen ciastek', description: 'Piecz 1 bilion ciastek na sekundę', condition: () => cps * eventMultiplier >= 1e12, unlocked: false },
    { id: 'backToTheFuture', name: 'Gdy ta maszyna osiągnie 36 biliardów ciastek na godzinę...', description: 'Piecz 10 bilionów ciastek na sekundę', condition: () => cps * eventMultiplier >= 1e13, unlocked: false },
    { id: 'fastAndDelicious', name: 'Szybkie i pyszne', description: 'Piecz 100 bilionów ciastek na sekundę', condition: () => cps * eventMultiplier >= 1e14, unlocked: false },
    { id: 'cookieHertz', name: 'Ciasteczkowy herc', description: 'Piecz 1 biliard ciastek na sekundę. "Smaczniejsze niż pączek z hercem."', condition: () => cps * eventMultiplier >= 1e15, unlocked: false },
    { id: 'solveHunger', name: 'Ups, rozwiązałeś głód na świecie', description: 'Piecz 10 biliardów ciastek na sekundę', condition: () => cps * eventMultiplier >= 1e16, unlocked: false },

    // Osiągnięcia kliknięć
    { id: 'clicktastic', name: 'Klikastyczne', description: 'Zdobądź 1 000 ciastek z kliknięć', condition: () => totalFromClicks >= 1e3, unlocked: false },
    { id: 'clickathlon', name: 'Klikatlon', description: 'Zdobądź 100 000 ciastek z kliknięć', condition: () => totalFromClicks >= 1e5, unlocked: false },
    { id: 'clickolympics', name: 'Klikolimpiada', description: 'Zdobądź 10 milionów ciastek z kliknięć', condition: () => totalFromClicks >= 1e7, unlocked: false },
    { id: 'clickorama', name: 'Klikorama', description: 'Zdobądź 1 miliard ciastek z kliknięć', condition: () => totalFromClicks >= 1e9, unlocked: false },
    { id: 'clickasmic', name: 'Klikazmiczne', description: 'Zdobądź 100 miliardów ciastek z kliknięć', condition: () => totalFromClicks >= 1e11, unlocked: false },
    { id: 'clickageddon', name: 'Klikagedon', description: 'Zdobądź 10 bilionów ciastek z kliknięć', condition: () => totalFromClicks >= 1e13, unlocked: false },
    { id: 'clicknarok', name: 'Kliknarok', description: 'Zdobądź 1 biliard ciastek z kliknięć', condition: () => totalFromClicks >= 1e15, unlocked: false },
    { id: 'clickastrophe', name: 'Klikastrofa', description: 'Zdobądź 100 biliardów ciastek z kliknięć', condition: () => totalFromClicks >= 1e17, unlocked: false },
    { id: 'clickataclysm', name: 'Klikataklizm', description: 'Zdobądź 10 tryliardów ciastek z kliknięć', condition: () => totalFromClicks >= 1e19, unlocked: false }
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
    totalFromClicks += clickValue;
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

function createAutoCookieAnimation(numCookies) {
  const buttonRect = cookieBtn.getBoundingClientRect();
  const offsetParent = cookieBtn.offsetParent;
  const parentRect = offsetParent.getBoundingClientRect();

  // współrzędne względem offsetParent
  const centerX = cookieBtn.offsetLeft + cookieBtn.offsetWidth / 2;
  const centerY = cookieBtn.offsetTop + cookieBtn.offsetHeight / 2;

  for (let i = 0; i < numCookies; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 50 + 50;
    const deltaX = Math.cos(angle) * distance;
    const deltaY = Math.sin(angle) * distance;

    const cookie = document.createElement('div');
    cookie.className = 'auto-cookie';
    cookie.style.position = 'absolute';
    cookie.style.left = `${centerX}px`;
    cookie.style.top = `${centerY}px`;
    cookie.textContent = '🍪';

    offsetParent.appendChild(cookie); // zamiast document.body

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
      const title = document.createElement('div');
    title.textContent = ach.name + (ach.unlocked ? ' ✓' : '');
    const description = document.createElement('div');
    description.textContent = ach.description;
    description.style.fontSize = '12px';
    description.style.color = '#88cc88';
    div.appendChild(title);
    div.appendChild(description);
      div.title = ach.description;
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

    document.getElementById('closeSettings').addEventListener('click', function() {
      document.getElementById('settingsMenu').style.display = 'none';
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