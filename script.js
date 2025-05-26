  // --- Zmienne podstawowe ---
  let count = 0;
  let cps = 0;
  let clickValue = 1;
  let eventMultiplier = 1;
  let eventActive = false;
  let accumulatedCookies = 0;
  let playTimeSeconds = 0;
  let lastSaveTime = null;


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
  const buySound = document.getElementById('buySound');
  const achievementSound = document.getElementById('achievementSound');
  const eventSound = document.getElementById('eventSound');
  const effectsMuteButton = document.getElementById('effectsMuteButton');

  // --- Referencje do kontrolek głośności ---
const effectsVolumeControl = document.getElementById('effectsVolumeControl');

// --- Ustawienia początkowe głośności ---
[clickSound, buySound, achievementSound, eventSound].forEach(sound => {
  sound.volume = effectsVolumeControl.value;
});

// --- Obsługa zmian głośności efektów ---
effectsVolumeControl.addEventListener('input', () => {
  [clickSound, buySound, achievementSound, eventSound].forEach(sound => {
    sound.volume = effectsVolumeControl.value;
  });
});

  cookieBtn.addEventListener('click', () => {
      clickSound.currentTime = 0; // Resetuj dźwięk, aby można było go odtworzyć wielokrotnie
      clickSound.play();
    });

// --- Obsługa wyciszenia efektów ---
effectsMuteButton.addEventListener('click', () => {
  const isMuted = clickSound.muted;
  [clickSound, buySound, achievementSound, eventSound].forEach(sound => {
    sound.muted = !isMuted;
  });
  effectsMuteButton.textContent = isMuted ? 'Wycisz efekty' : 'Odcisz efekty';
});

// --- Inicjalizacja stanu przycisku ---
// (Dodaj w miejscu gdzie inicjalizujesz inne elementy)
[clickSound, buySound, achievementSound, eventSound].forEach(sound => {
  sound.muted = false;
});
effectsMuteButton.textContent = 'Wycisz efekty';

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
        buySound.currentTime = 0; // Resetuj dźwięk
        buySound.play();
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
      const eventSound = document.getElementById('eventSound');
      eventSound.currentTime = 0;
      eventSound.play()
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
        achievementSound.currentTime = 0; // Resetuj dźwięk
        achievementSound.play();
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

function saveGame() {
  const gameState = {
    count: count,
    cps: cps,
    clickValue: clickValue,
    upgrades: upgrades.map(upg => ({ id: upg.id, count: upg.count, cost: upg.cost })),
    cursorUpgrades: cursorUpgrades.map(upg => ({ id: upg.id, count: upg.count, cost: upg.cost })),
    achievements: achievements.map(ach => ({ id: ach.id, unlocked: ach.unlocked })),
    playTimeSeconds: playTimeSeconds,
    cookiesBakedThisAscension: cookiesBakedThisAscension,
    totalFromClicks: totalFromClicks,
    bakeryName: bakeryOwnerEl.textContent,
    lastSaveTime: new Date().getTime()
  };
  
  localStorage.setItem('cookieClickerSave', JSON.stringify(gameState));
  lastSaveTime = gameState.lastSaveTime;
  updateLastSaveTimeDisplay();
}

function loadGame() {
  const savedData = localStorage.getItem('cookieClickerSave');
  if (!savedData) return false;

  try {
    const gameState = JSON.parse(savedData);
    
    // Ładowanie podstawowych wartości
    count = gameState.count || 0;
    cps = gameState.cps || 0;
    clickValue = gameState.clickValue || 1;
    playTimeSeconds = gameState.playTimeSeconds || 0;
    cookiesBakedThisAscension = gameState.cookiesBakedThisAscension || 0;
    totalFromClicks = gameState.totalFromClicks || 0;
    lastSaveTime = gameState.lastSaveTime || null;

    // Ładowanie ulepszeń
    gameState.upgrades.forEach(savedUpg => {
      const upg = upgrades.find(u => u.id === savedUpg.id);
      if (upg) {
        upg.count = savedUpg.count;
        upg.cost = savedUpg.cost;
      }
    });

    // Ładowanie ulepszeń kliknięć
    gameState.cursorUpgrades.forEach(savedUpg => {
      const upg = cursorUpgrades.find(u => u.id === savedUpg.id);
      if (upg) {
        upg.count = savedUpg.count;
        upg.cost = savedUpg.cost;
      }
    });

    // Ładowanie osiągnięć
    gameState.achievements.forEach(savedAch => {
      const ach = achievements.find(a => a.id === savedAch.id);
      if (ach) {
        ach.unlocked = savedAch.unlocked;
      }
    });

    // Aktualizacja UI
    setBakeryName(gameState.bakeryName || generateRandomName());
    updateDisplay();
    renderUpgrades();
    renderAchievements();
    updateLastSaveTimeDisplay();
    
    return true;
  } catch (e) {
    console.error('Błąd wczytywania zapisu:', e);
    return false;
  }
}

function updateLastSaveTimeDisplay() {
  const lastSaveTimeEl = document.getElementById('lastSaveTime');
  if (lastSaveTime) {
    const date = new Date(lastSaveTime);
    lastSaveTimeEl.textContent = date.toLocaleString();
  } else {
    lastSaveTimeEl.textContent = 'Nigdy';
  }
}

// Funkcje eksportu/importu
document.getElementById('exportProgress').addEventListener('click', () => {
  const gameState = JSON.parse(localStorage.getItem('cookieClickerSave') || '{}');
  const dataStr = JSON.stringify(gameState, null, 2);
  const blob = new Blob([dataStr], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cookie_clicker_save_${new Date().toISOString().slice(0,10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
});

document.getElementById('importProgress').addEventListener('click', () => {
  document.getElementById('importFile').click();
});

document.getElementById('importFile').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const gameState = JSON.parse(event.target.result);
      localStorage.setItem('cookieClickerSave', JSON.stringify(gameState));
      loadGame();
      alert('Postęp został pomyślnie zaimportowany!');
    } catch (error) {
      alert('Błąd podczas wczytywania pliku: nieprawidłowy format pliku.');
    }
  };
  reader.readAsText(file);
});

// Autozapis co 5 minut
setInterval(saveGame, 5 * 60 * 1000);

// Zapisz przy zamknięciu strony
window.addEventListener('beforeunload', saveGame);

// Dodaj obsługę przycisku resetowania gry
document.getElementById('resetProgress').addEventListener('click', function() {
    if (confirm('Czy na pewno chcesz zresetować grę? Wszystkie postępy zostaną utracone i nie będzie można ich przywrócić.')) {
        resetGame();
    }
});

function resetGame() {
    // Resetuj wszystkie zmienne gry
    count = 0;
    cps = 0;
    clickValue = 1;
    eventMultiplier = 1;
    eventActive = false;
    accumulatedCookies = 0;
    playTimeSeconds = 0;
    cookiesBakedThisAscension = 0;
    totalFromClicks = 0;
    
    // Resetuj ulepszenia produkcji
    upgrades.forEach(upgrade => {
        upgrade.count = 0;
        upgrade.cost = upgrade.id === 'cursor' ? 15 : 
                      upgrade.id === 'grandma' ? 100 : 
                      upgrade.id === 'farm' ? 1100 : 
                      upgrade.id === 'factory' ? 12000 : 
                      upgrade.id === 'bank' ? 130000 : 
                      upgrade.id === 'temple' ? 1400000 : 
                      upgrade.id === 'wizardTower' ? 20000000 : 
                      upgrade.id === 'shipment' ? 330000000 : 
                      upgrade.id === 'alchemyLab' ? 5100000000 : 
                      75000000000; // portal
    });
    
    // Resetuj ulepszenia kliknięć
    cursorUpgrades.forEach(upgrade => {
        upgrade.count = 0;
        upgrade.cost = upgrade.id === 'fingerStrength' ? 100 : 
                      upgrade.id === 'doubleFinger' ? 1000 : 
                      15000; // thirdFinger
    });
    
    // Resetuj osiągnięcia
    achievements.forEach(achievement => {
        achievement.unlocked = false;
    });
    
    // Resetuj nazwę piekarni
    setBakeryName(generateRandomName());
    
    // Usuń zapis gry z localStorage
    localStorage.removeItem('cookieClickerSave');
    
    // Zaktualizuj UI
    updateDisplay();
    renderUpgrades();
    renderAchievements();
    updateLastSaveTimeDisplay();
    
    // Wyświetl potwierdzenie
    alert('Gra została zresetowana! Możesz zacząć od nowa.');
}

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
loadGame();