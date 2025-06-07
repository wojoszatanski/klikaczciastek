// --- Zmienne podstawowe ---
let count = 0;
let cps = 0;
let clickValue = 1;
let eventMultiplier = 1;
let eventActive = false;
let accumulatedCookies = 0;
let playTimeSeconds = 0;
let lastSaveTime = null;
let cookieCounter = 0;
let musicEnabledFlag = true;
let firstClickOccurred = false;
let isResuming = false;
let lastEventTime = 0;
const MIN_EVENT_INTERVAL = 300000; // Minimalny interwał między eventami (5 minut)

// --- Nowy licznik ciastek upieczonych w sesji ---
let cookiesBakedThisAscension = 0;

// --- Licznik całkowitej liczby ciastek zdobytych z kliknięć ---
let totalFromClicks = 0;

// --- Zmienne prestiżu ---
let heavenlyChips = 0;
let heavenlyChipsThisAscension = 0;
let ascensionCount = 0;
const ASCENSION_THRESHOLD = 1000000; // Minimalna liczba ciastek w sesji do ascension

// --- Ulepszenia prestiżowe ---
const heavenlyUpgrades = [
  { id: 'hc1', name: 'Boski Palec', description: '+1 do wartości kliknięcia na zawsze', cost: 1, effect: { clickValue: 1 }, purchased: false },
  { id: 'hc2', name: 'Niebiańska Receptura', description: '+1% do ciastek na sekundę na zawsze', cost: 5, effect: { cpsMultiplier: 0.01 }, purchased: false },
  { id: 'hc3', name: 'Cudowny Ferment', description: '+5% do ciastek na sekundę na zawsze', cost: 20, effect: { cpsMultiplier: 0.05 }, purchased: false },
  { id: 'hc4', name: 'Anielskie Ciasto', description: '+10% do ciastek na sekundę na zawsze', cost: 50, effect: { cpsMultiplier: 0.1 }, purchased: false },
  { id: 'hc5', name: 'Boskiego Dotyku', description: '+10 do wartości kliknięcia na zawsze', cost: 100, effect: { clickValue: 10 }, purchased: false },
  { id: 'hc6', name: 'Niebiańska Inwestycja', description: 'Ulepszenia produkcji są tańsze o 5%', cost: 200, effect: { costReduction: 0.05 }, purchased: false },
  { id: 'hc7', name: 'Rajskie Zbiory', description: 'Eventy losowe występują 50% częściej', cost: 500, effect: { eventChance: 0.5 }, purchased: false },
  { id: 'hc8', name: 'Boska Cierpliwość', description: '+25% do ciastek na sekundę na zawsze', cost: 1000, effect: { cpsMultiplier: 0.25 }, purchased: false },
  { id: 'hc9', name: 'Eonowe Doświadczenie', description: '+50% do ciastek na sekundę na zawsze', cost: 5000, effect: { cpsMultiplier: 0.5 }, purchased: false },
  { id: 'hc10', name: 'Ostateczna Doskonałość', description: '+100% do ciastek na sekundę na zawsze', cost: 10000, effect: { cpsMultiplier: 1.0 }, purchased: false }
];

// --- Kody promocyjne ---
const promoCodes = [
  { code: 'STARTERPACK', reward: 1000, message: 'Otrzymujesz 1000 ciastek! Witamy w grze!', used: false }
];

let usedPromoCodes = JSON.parse(localStorage.getItem('cookieClickerUsedPromoCodes') || '[]');

// Inicjalizacja użytych kodów
function initPromoCodes() {
  promoCodes.forEach(promo => {
    promo.used = usedPromoCodes.includes(promo.code);
  });
}

// Obsługa realizacji kodu
document.getElementById('redeemPromoCode').addEventListener('click', function() {
  const input = document.getElementById('promoCodeInput');
  const message = document.getElementById('promoCodeMessage');
  const code = input.value.trim();
  
  if (!code) {
    message.textContent = 'Wprowadź kod promocyjny.';
    // Ukryj wiadomość po 5 sekundach
    setTimeout(() => {
      message.textContent = '';
      message.style.minHeight = '0'; // Dodane: reset minimalnej wysokości
    }, 5000);
    return;
  }

  
  // Sprawdź czy kod został już wykorzystany
  if (usedPromoCodes.some(usedCode => usedCode === code)) {
    message.textContent = 'Ten kod został już wykorzystany.';
    // Ukryj wiadomość po 5 sekundach
    setTimeout(() => {
      message.textContent = '';
      message.style.minHeight = '0'; // Dodane: reset minimalnej wysokości
    }, 5000);
    return;
  }
  
  // Znajdź kod w dostępnych promocjach
  const promo = promoCodes.find(p => p.code === code);
  
  if (promo) {
    // Przyznaj nagrodę
    count += promo.reward;
    cookiesBakedThisAscension += promo.reward;
    promo.used = true;
    usedPromoCodes.push(code);
    localStorage.setItem('cookieClickerUsedPromoCodes', JSON.stringify(usedPromoCodes));
    saveGame(); 
    
    message.textContent = promo.message;
    // Ukryj wiadomość po 5 sekundach
    setTimeout(() => {
      message.textContent = '';
      message.style.minHeight = '0'; // Dodane: reset minimalnej wysokości
    }, 5000);
    
    updateDisplay();
    checkAchievements();
        
    // Wyczyść pole wprowadzania
    input.value = '';
  } else {
    message.textContent = 'Nieprawidłowy kod promocyjny.';
    // Ukryj wiadomość po 5 sekundach
    setTimeout(() => {
      message.textContent = '';
      message.style.minHeight = '0'; // Dodane: reset minimalnej wysokości
    }, 5000);
  }
});

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
const settingsMenu = document.getElementById('settingsMenu');
const enableMusicButton = document.getElementById('enableMusicButton');
const volumeControl = document.getElementById('volumeControl');
volumeControl.value = 1;
const muteButton = document.getElementById('muteButton');
const clickSound = document.getElementById('clickSound');
const buySound = document.getElementById('buySound');
const achievementSound = document.getElementById('achievementSound');
const eventSound = document.getElementById('eventSound');
const effectsMuteButton = document.getElementById('effectsMuteButton');
const effectsVolumeControl = document.getElementById('effectsVolumeControl');
const buyHeavenlySound = document.getElementById('buyHeavenlySound');
const ascendSound = document.getElementById('ascendSound');
const backgroundMusic = document.getElementById('backgroundMusic');
const shuffleButton = document.getElementById('shuffleButton');

// --- Playlista ---
const playlist = [
  { title: "Ye - WW3", src: "piosenka1.mp3"},
  { title: "DJ Smokey - legalizenukes", src: "piosenka2.mp3"},
  { title: "Burzum - Dunkelheit", src: "piosenka3.mp3"},
  { title: "Skrillex - SPITFIRE", src: "piosenka4.mp3"},
  { title: "Playboi Carti - EVIL J0RDAN", src: "piosenka5.mp3"},
  { title: "The Prodigy - Omen", src: "piosenka6.mp3"},
  { title: "¥$ - CARNIVAL", src: "piosenka7.mp3"},
  { title: "Lady Gaga - Poker Face", src: "piosenka8.mp3"},
  { title: "Linkin Park - Heavy Is the Crown", src: "piosenka9.mp3"},
  { title: "Charli xcx - Von dutch", src: "piosenka10.mp3"},
  { title: "Pendulum - Tarantula", src: "piosenka11.mp3"},
  { title: "Limb Bizkit - Dad Vibes", src: "piosenka12.mp3"},
  { title: "Big Pun - Twinz", src: "piosenka13.mp3"},
  { title: "Knocked Loose - Suffocate", src: "piosenka14.mp3"},
  { title: "Hechizeros Band - El Sonidito", src: "piosenka15.mp3"},
  { title: "Sabrina Carpenter - Espresso", src: "piosenka16.mp3"},
  { title: "Kizo - KIEROWNIK", src: "piosenka17.mp3"}
];

// --- Zmienne do obsługi playlisty ---
let currentTrackIndex = 0;
let isShuffle = false;
let isPlaying = false;
let trackChangedDuringPause = false;

// --- Referencje do elementów kontroli muzyki ---
const currentTrackEl = document.getElementById('currentTrack');
const playPauseBtn = document.getElementById('playPause');
const prevTrackBtn = document.getElementById('prevTrack');
const nextTrackBtn = document.getElementById('nextTrack');

// --- Funkcje do obsługi playlisty ---
function playRandomTrack() {
  if (isShuffle) {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * playlist.length);
    } while (newIndex === currentTrackIndex && playlist.length > 1);
    
    currentTrackIndex = newIndex;
  } else {
    // Normalna kolejność - przejście do następnego utworu
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  }

  playCurrentTrack();
}

function playCurrentTrack() {
  backgroundMusic.src = playlist[currentTrackIndex].src;
  backgroundMusic.load();
  
  // Jeśli muzyka powinna być odtwarzana, spróbuj włączyć
  if (isPlaying) {
    backgroundMusic.play()
      .then(() => {
        playPauseBtn.textContent = '⏸';
        if (!isResuming) showNowPlayingNotification();
        isResuming = false;
      })
      .catch(e => console.log("Błąd odtwarzania w playCurrentTrack:", e));
  }
  
  updateTrackDisplay();
  saveSoundSettings();
  trackChangedDuringPause = false;
}

function updateTrackDisplay() {
  currentTrackEl.textContent = playlist[currentTrackIndex].title;
  
  // Ustawienie okładki albumu
  const albumCover = document.getElementById('albumCover');
  const coverIndex = currentTrackIndex + 1;
  albumCover.src = `piosenka${coverIndex}.jpg`;
  albumCover.style.display = 'block';
}

function togglePlayPause() {
    if (isPlaying) {
        backgroundMusic.pause();
        playPauseBtn.textContent = '⏯';
        isPlaying = false;
        isResuming = true;
        musicEnabledFlag = false; // Ustaw na false przy pauzowaniu
    } else {
        // Ustaw flagę na true przy włączaniu odtwarzania
        musicEnabledFlag = true;
        
        if (!firstClickOccurred) {
            handleFirstInteraction();
        } else {
            backgroundMusic.play()
                .then(() => {
                    playPauseBtn.textContent = '⏸';
                    isPlaying = true;
                    if (trackChangedDuringPause || !isResuming) {
                        showNowPlayingNotification();
                        trackChangedDuringPause = false; // Resetuj flagę
                    }
                    isResuming = false;
                })
                .catch(e => {
                    console.log("Błąd odtwarzania:", e);
                    playPauseBtn.textContent = '⏯';
                    isPlaying = false;
                });
        }
    }
    saveSoundSettings();
}

// --- Funkcja do przełączania trybu shuffle ---
function toggleShuffle() {
  isShuffle = !isShuffle;
  shuffleButton.textContent = isShuffle ? '🔀 (ON)' : '🔀 (OFF)';
  shuffleButton.style.color = isShuffle ? 'green' : 'red';
  saveSoundSettings();
}

// --- Funkcje do obsługi playlisty ---
function playNextTrack() {
  // Zapamiętaj czy muzyka była odtwarzana przed zmianą
  const wasPlaying = isPlaying;
  trackChangedDuringPause = !wasPlaying; // Ustaw flagę jeśli zmiana podczas pauzy

  if (isShuffle) {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * playlist.length);
    } while (newIndex === currentTrackIndex && playlist.length > 1);
    currentTrackIndex = newIndex;
  } else {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  }
  
  playCurrentTrack();
  
  // Jeśli muzyka była odtwarzana, wznów odtwarzanie
  if (wasPlaying) {
    backgroundMusic.play()
      .then(() => {
        isPlaying = true;
        playPauseBtn.textContent = '⏸';
        showNowPlayingNotification();
      })
      .catch(e => console.log("Błąd odtwarzania po next:", e));
  }
  
  saveSoundSettings();
}

function playPrevTrack() {
  // Zapamiętaj czy muzyka była odtwarzana przed zmianą
  const wasPlaying = isPlaying;
  trackChangedDuringPause = !wasPlaying; // Ustaw flagę jeśli zmiana podczas pauzy


  if (isShuffle) {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * playlist.length);
    } while (newIndex === currentTrackIndex && playlist.length > 1);
    currentTrackIndex = newIndex;
  } else {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  }
  
  playCurrentTrack();
  
  // Jeśli muzyka była odtwarzana, wznów odtwarzanie
  if (wasPlaying) {
    backgroundMusic.play()
      .then(() => {
        isPlaying = true;
        playPauseBtn.textContent = '⏸';
        showNowPlayingNotification();
      })
      .catch(e => console.log("Błąd odtwarzania po prev:", e));
  }
  
  saveSoundSettings();
}
// --- Inicjalizacja odtwarzacza ---
function initMusicPlayer() {
  backgroundMusic.addEventListener('ended', () => {
    playNextTrack();
    if (isPlaying && firstClickOccurred) {
      backgroundMusic.play()
        .then(() => {
          playPauseBtn.textContent = '⏸';
          showNowPlayingNotification();
        })
        .catch(e => console.log("Błąd odtwarzania po zakończeniu:", e));
    }
  });

  playPauseBtn.addEventListener('click', togglePlayPause);
  prevTrackBtn.addEventListener('click', playPrevTrack);
  nextTrackBtn.addEventListener('click', playNextTrack);
  shuffleButton.addEventListener('click', toggleShuffle);

  updateTrackDisplay();
}

// --- Ustawienia początkowe głośności ---
[clickSound, buySound, achievementSound, eventSound, buyHeavenlySound, ascendSound].forEach(sound => {
  sound.volume = effectsVolumeControl.value;
});

// --- Obsługa zmian głośności muzyki ---
volumeControl.addEventListener('input', () => {
  backgroundMusic.volume = volumeControl.value;
  saveSoundSettings();
});

// Obsługa zmian głośności efektów
effectsVolumeControl.addEventListener('input', () => {
  const volume = effectsVolumeControl.value;
  [clickSound, buySound, achievementSound, eventSound, buyHeavenlySound, ascendSound].forEach(sound => {
    sound.volume = volume;
  });
  saveSoundSettings();
});

// --- Obsługa wyciszenia efektów ---
effectsMuteButton.addEventListener('click', () => {
  const isMuted = clickSound.muted;
  [clickSound, buySound, achievementSound, eventSound, buyHeavenlySound, ascendSound].forEach(sound => {
    sound.muted = !isMuted;
  });
  effectsMuteButton.textContent = isMuted ? 'Wycisz efekty' : 'Odcisz efekty';
  saveSoundSettings();
});

// --- Inicjalizacja stanu przycisku ---
[clickSound, buySound, achievementSound, eventSound].forEach(sound => {
  sound.muted = false;
});
effectsMuteButton.textContent = 'Wycisz efekty';

// --- Zmienne do przechowywania ustawień dźwięku ---
let soundSettings = {
  musicVolume: 1,
  musicMuted: false,
  effectsVolume: 1,
  effectsMuted: false
};

// --- Funkcje do obsługi ustawień dźwięku ---
function saveSoundSettings() {
  soundSettings = {
    musicVolume: volumeControl.value,
    musicMuted: backgroundMusic.muted,
    effectsVolume: effectsVolumeControl.value,
    effectsMuted: clickSound.muted,
    musicEnabled: musicEnabledFlag,
    isPlaying: isPlaying,
    isShuffle: isShuffle,
    currentTrackIndex: currentTrackIndex
  };
  localStorage.setItem('cookieClickerSoundSettings', JSON.stringify(soundSettings));
}

function loadSoundSettings() {
  const savedSettings = localStorage.getItem('cookieClickerSoundSettings');
  if (savedSettings) {
    soundSettings = JSON.parse(savedSettings);
    
    musicEnabledFlag = soundSettings.musicEnabled || false;
    currentTrackIndex = soundSettings.currentTrackIndex || 0;
    isPlaying = soundSettings.isPlaying || false;
    isShuffle = soundSettings.isShuffle || false;

    // Ustawienia muzyki
    volumeControl.value = soundSettings.musicVolume;
    backgroundMusic.volume = soundSettings.musicVolume;
    backgroundMusic.muted = soundSettings.musicMuted;
    muteButton.textContent = backgroundMusic.muted ? 'Odcisz muzykę' : 'Wycisz muzykę';
    
    // Ustawienia efektów
    effectsVolumeControl.value = soundSettings.effectsVolume;
    [clickSound, buySound, achievementSound, eventSound, buyHeavenlySound, ascendSound].forEach(sound => {
      sound.volume = soundSettings.effectsVolume;
      sound.muted = soundSettings.effectsMuted;
    });
    effectsMuteButton.textContent = soundSettings.effectsMuted ? 'Odcisz efekty' : 'Wycisz efekty';
    
    // Wczytaj ustawienia shuffle
    isShuffle = soundSettings.isShuffle || false;
    shuffleButton.textContent = isShuffle ? '🔀 (ON)' : '🔀 (OFF)';
    shuffleButton.style.color = isShuffle ? 'green' : 'red';

    backgroundMusic.src = playlist[currentTrackIndex].src;
    backgroundMusic.load();
    
    playPauseBtn.textContent = isPlaying ? '⏸' : '⏯';
    
    updateTrackDisplay();
    
  } else {
    playPauseBtn.textContent = '⏯';
    shuffleButton.textContent = '🔀';
  }
}

// Funkcja obsługująca pierwsze kliknięcie
function handleFirstInteraction() {
    if (firstClickOccurred) return;
    firstClickOccurred = true;
    
    if (musicEnabledFlag) {
        backgroundMusic.play()
            .then(() => {
                playPauseBtn.textContent = '⏸';
                isPlaying = true;
                showNowPlayingNotification();
            })
            .catch(e => console.log("Błąd odtwarzania po kliknięciu:", e));
    }
}

// Nasłuchiwanie na pierwsze kliknięcie w dowolnym miejscu
document.addEventListener('click', handleFirstInteraction);
document.addEventListener('touchstart', handleFirstInteraction);

function showNowPlayingNotification() {
  if (!backgroundMusic || backgroundMusic.paused) return;
  const nowPlaying = document.getElementById('nowPlaying');
  const nowPlayingCover = document.getElementById('nowPlayingCover');
  const nowPlayingTrack = document.getElementById('nowPlayingTrack');
  
  const track = playlist[currentTrackIndex];
  const coverIndex = currentTrackIndex + 1;
  
  nowPlayingCover.src = `piosenka${coverIndex}.jpg`;
  nowPlayingTrack.textContent = track.title;
  
  setTimeout(() => {
    nowPlaying.classList.add('show');
  });

  setTimeout(() => {
    nowPlaying.classList.remove('show');
  }, 5000);
}

// --- Ulepszenia produkcji ---
const upgrades = [
  { id: 'cursor', name: 'Kursor', cost: 15, cps: 0.1, count: 0, initialCost: 15 },
  { id: 'grandma', name: 'Babcia', cost: 100, cps: 1, count: 0, initialCost: 100 },
  { id: 'farm', name: 'Farm', cost: 1100, cps: 8, count: 0, initialCost: 1100 },
  { id: 'factory', name: 'Fabryka', cost: 12000, cps: 47, count: 0, initialCost: 12000 },
  { id: 'bank', name: 'Bank', cost: 130000, cps: 260, count: 0, initialCost: 130000 },
  { id: 'temple', name: 'Świątynia', cost: 1400000, cps: 1400, count: 0, initialCost: 1400000 },
  { id: 'wizardTower', name: 'Wieża czarodzieja', cost: 20000000, cps: 7800, count: 0, initialCost: 20000000 },
  { id: 'shipment', name: 'Przesyłka', cost: 330000000, cps: 44000, count: 0, initialCost: 330000000 },
  { id: 'alchemyLab', name: 'Laboratorium alchemiczne', cost: 5100000000, cps: 260000, count: 0, initialCost: 5100000000 },
  { id: 'portal', name: 'Portal', cost: 75000000000, cps: 1600000, count: 0, initialCost: 75000000000 }
];

// --- Ulepszenia kliknięć ---
const cursorUpgrades = [
  { id: 'fingerStrength', name: 'Siła palca', cost: 100, clickValue: 1, count: 0, initialCost: 100 },
  { id: 'doubleFinger', name: 'Podwójny palec', cost: 1000, clickValue: 5, count: 0, initialCost: 1000 },
  { id: 'thirdFinger', name: 'Trzeci palec', cost: 15000, clickValue: 10, count: 0, initialCost: 15000 }
];

// --- Osiągnięcia ---
const achievements = [
  { id: 'firstCookie', name: 'Pierwsze ciastko', description: 'Zdobądź pierwsze ciastko', condition: () => count >= 1, unlocked: false },
  { id: 'clickMaster', name: 'Mistrz kliknięć', description: 'Zwiększ wartość kliknięcia do co najmniej 10', condition: () => clickValue >= 10, unlocked: false },
  { id: 'cookieTycoon', name: 'Ciastkowy magnat', description: 'Zdobądź 1000 ciastek jednocześnie', condition: () => count >= 1000, unlocked: false },
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
  { id: 'casualBaking', name: 'Luźne pieczenie', description: 'Piecz 1 ciastko na sekundę', condition: () => cps * eventMultiplier * getHeavenlyMultiplier() >= 1, unlocked: false },
  { id: 'hardcoreBaking', name: 'Hardkorowe pieczenie', description: 'Piecz 10 ciastek na sekundę', condition: () => cps * eventMultiplier * getHeavenlyMultiplier() >= 10, unlocked: false },
  { id: 'steadyStream', name: 'Stały, smaczny strumień', description: 'Piecz 100 ciastek na sekundę', condition: () => cps * eventMultiplier * getHeavenlyMultiplier() >= 100, unlocked: false },
  { id: 'cookieMonster', name: 'Potwór na ciastka', description: 'Piecz 1 000 ciastek na sekundę', condition: () => cps * eventMultiplier * getHeavenlyMultiplier() >= 1e3, unlocked: false },
  { id: 'massProducer', name: 'Masowy producent', description: 'Piecz 10 000 ciastek na sekundę', condition: () => cps * eventMultiplier * getHeavenlyMultiplier() >= 1e4, unlocked: false },
  { id: 'cookieVortex', name: 'Wir ciastek', description: 'Piecz 1 milion ciastek na sekundę', condition: () => cps * eventMultiplier * getHeavenlyMultiplier() >= 1e6, unlocked: false },
  { id: 'cookiePulsar', name: 'Ciasteczkowy pulsar', description: 'Piecz 10 milionów ciastek na sekundę', condition: () => cps * eventMultiplier * getHeavenlyMultiplier() >= 1e7, unlocked: false },
  { id: 'cookieQuasar', name: 'Ciasteczkowy kwazar', description: 'Piecz 100 milionów ciastek na sekundę', condition: () => cps * eventMultiplier * getHeavenlyMultiplier() >= 1e8, unlocked: false },
  { id: 'stillHere', name: 'O, nadal tu jesteś', description: 'Piecz 1 miliard ciastek na sekundę', condition: () => cps * eventMultiplier * getHeavenlyMultiplier() >= 1e9, unlocked: false },
  { id: 'neverBakeAgain', name: 'Nigdy więcej pieczenia', description: 'Piecz 10 miliardów ciastek na sekundę', condition: () => cps * eventMultiplier * getHeavenlyMultiplier() >= 1e10, unlocked: false },
  { id: 'cookieWorld', name: 'Świat pełen ciastek', description: 'Piecz 1 bilion ciastek na sekundę', condition: () => cps * eventMultiplier * getHeavenlyMultiplier() >= 1e12, unlocked: false },
  { id: 'backToTheFuture', name: 'Gdy ta maszyna osiągnie 36 biliardów ciastek na godzinę...', description: 'Piecz 10 bilionów ciastek na sekundę', condition: () => cps * eventMultiplier * getHeavenlyMultiplier() >= 1e13, unlocked: false },
  { id: 'fastAndDelicious', name: 'Szybkie i pyszne', description: 'Piecz 100 bilionów ciastek na sekundę', condition: () => cps * eventMultiplier * getHeavenlyMultiplier() >= 1e14, unlocked: false },
  { id: 'cookieHertz', name: 'Ciasteczkowy herc', description: 'Piecz 1 biliard ciastek na sekundę. "Smaczniejsze niż pączek z hercem."', condition: () => cps * eventMultiplier * getHeavenlyMultiplier() >= 1e15, unlocked: false },
  { id: 'solveHunger', name: 'Ups, rozwiązałeś głód na świecie', description: 'Piecz 10 biliardów ciastek na sekundę', condition: () => cps * eventMultiplier * getHeavenlyMultiplier() >= 1e16, unlocked: false },
  { id: 'clicktastic', name: 'Klikastyczne', description: 'Zdobądź 1 000 ciastek z kliknięć', condition: () => totalFromClicks >= 1e3, unlocked: false },
  { id: 'clickathlon', name: 'Klikatlon', description: 'Zdobądź 100 000 ciastek z kliknięć', condition: () => totalFromClicks >= 1e5, unlocked: false },
  { id: 'clickolympics', name: 'Klikolimpiada', description: 'Zdobądź 10 milionów ciastek z kliknięć', condition: () => totalFromClicks >= 1e7, unlocked: false },
  { id: 'clickorama', name: 'Klikorama', description: 'Zdobądź 1 miliard ciastek z kliknięć', condition: () => totalFromClicks >= 1e9, unlocked: false },
  { id: 'clickasmic', name: 'Klikazmiczne', description: 'Zdobądź 100 miliardów ciastek z kliknięć', condition: () => totalFromClicks >= 1e11, unlocked: false },
  { id: 'clickageddon', name: 'Klikagedon', description: 'Zdobądź 10 bilionów ciastek z kliknięć', condition: () => totalFromClicks >= 1e13, unlocked: false },
  { id: 'clicknarok', name: 'Kliknarok', description: 'Zdobądź 1 biliard ciastek z kliknięć', condition: () => totalFromClicks >= 1e15, unlocked: false },
  { id: 'clickastrophe', name: 'Klikastrofa', description: 'Zdobądź 100 biliardów ciastek z kliknięć', condition: () => totalFromClicks >= 1e17, unlocked: false },
  { id: 'clickataclysm', name: 'Klikataklizm', description: 'Zdobądź 10 tryliardów ciastek z kliknięć', condition: () => totalFromClicks >= 1e19, unlocked: false },
  { id: 'ascensionMaster', name: 'Mistrz Wniebowstąpienia', description: 'Dokonaj pierwszego Wniebowstąpienia', condition: () => ascensionCount >= 1, unlocked: false },
  { id: 'heavenlyBaker', name: 'Niebiański Piekarz', description: 'Zdobądź 10 Niebiańskich Chipów', condition: () => heavenlyChips >= 10, unlocked: false },
  { id: 'divineBaker', name: 'Boski Piekarz', description: 'Zdobądź 100 Niebiańskich Chipów', condition: () => heavenlyChips >= 100, unlocked: false },
  { id: 'celestialBaker', name: 'Niebiański Mistrz', description: 'Zdobądź 1000 Niebiańskich Chipów', condition: () => heavenlyChips >= 1000, unlocked: false },
  { id: 'promoUsed', name: 'Kod na start', description: 'Wykorzystaj kod promocyjny', condition: () => usedPromoCodes.length > 0, unlocked: false }
];

// --- Wyświetlanie ulepszeń ---
const upgradesDiv = document.getElementById('upgrades');
const cursorUpgradesDiv = document.getElementById('cursorUpgrades');
const ascensionMenu = document.getElementById('ascensionMenu');

// --- Funkcja do obsługi sufiksów w języku polskim ---
function getPolishSuffixForm(number, forms) {
  // forms: [pojedyncza, mnoga, dopełniacz]
  number = Math.abs(number);
  if (number === 1) return forms[0];
  if (number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) return forms[1];
  return forms[2];
}

function formatNumber(num) {
  // Obsługa liczb bardzo bliskich zeru
  if (Math.abs(num) < 0.00001) return "0";

  // Obsługa liczb ułamkowych (0 < num < 1)
  if (num < 1) {
    return num.toFixed(2).replace(/\.?0+$/, '');
  }

  // Sprawdzenie czy liczba jest "prawie całkowita"
  const rounded = Math.round(num);
  if (Math.abs(num - rounded) < 0.0001) {
    num = rounded;
  }

  // Obsługa liczb całkowitych < 1000
  if (Number.isInteger(num) && num < 1000) {
    return num.toString();
  }

  // Obsługa liczb < 1000 z częścią ułamkową
  if (num < 1000) {
    return num.toFixed(1).replace(/\.0$/, '');
  }

  // Obsługa dużych liczb z przyrostkami
  const suffixes = [
    { value: 1e36, forms: [' undecylion', ' undecyliony', ' undecylionów'] },
    { value: 1e33, forms: [' decylion', ' decyliony', ' decylionów'] },
    { value: 1e30, forms: [' nonylion', ' nonyliony', ' nonylionów'] },
    { value: 1e27, forms: [' oktylion', ' oktyliony', ' oktylionów'] },
    { value: 1e24, forms: [' septylion', ' septyliony', ' septylionów'] },
    { value: 1e21, forms: [' sekstylion', ' sekstyliony', ' sekstylionów'] },
    { value: 1e18, forms: [' kwintylion', ' kwintyliony', ' kwintylionów'] },
    { value: 1e15, forms: [' kwadrylion', ' kwadryliony', ' kwadrylionów'] },
    { value: 1e12, forms: [' trylion', ' tryliony', ' trylionów'] },
    { value: 1e9, forms: [' mld', ' mld', ' mld'] },
    { value: 1e6, forms: [' mln', ' mln', ' mln'] },
    { value: 1e3, forms: [' tys.', ' tys.', ' tys.'] }
  ];

  for (const { value, forms } of suffixes) {
    if (num >= value) {
      const divided = num / value;
      
      // Sprawdź czy wynik dzielenia jest prawie całkowity
      const roundedDivided = Math.round(divided);
      if (Math.abs(divided - roundedDivided) < 0.0001) {
        return roundedDivided + getPolishSuffixForm(roundedDivided, forms);
      }
      
      // Formatuj z 2 miejscami po przecinku
      return divided.toFixed(2).replace(/\.?0+$/, '') + getPolishSuffixForm(Math.floor(divided), forms);
    }
  }

  // Domyślne formatowanie dla liczb < 1000
  return num.toFixed(1).replace(/\.0$/, '');
}

function createUpgradeItem(upgrade, container, type) {
  const div = document.createElement('div');
  div.className = 'upgrade-item';
  const span = document.createElement('span');
  
  // Uwzględnij redukcję kosztów z ulepszeń prestiżowych
  const costReduction = getHeavenlyCostReduction();
  const actualCost = Math.ceil(upgrade.cost * (1 - costReduction));
  
  if (type === 'production') {
    span.textContent = `${upgrade.name} (x${upgrade.count}) - ${upgrade.cps.toFixed(1)} cps - koszt: ${formatNumber(actualCost)} ciastek`;
  } else if (type === 'click') {
    span.textContent = `${upgrade.name} (x${upgrade.count}) - +${upgrade.clickValue} za klik - koszt: ${formatNumber(actualCost)} ciastek`;
  }
  
  const btn = document.createElement('button');
  btn.textContent = 'Kup';
  btn.disabled = count < actualCost;
  btn.addEventListener('click', () => {
    if (count >= actualCost) {
      count -= actualCost;
      if(type === 'production') {
        upgrade.count++;
        cps += upgrade.cps;
        upgrade.cost = Math.ceil(upgrade.cost * 1.2);
      } else if(type === 'click') {
        upgrade.count++;
        clickValue += upgrade.clickValue;
        upgrade.cost = Math.ceil(upgrade.cost * 2.5);
      }
      buySound.currentTime = 0;
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

// --- Funkcje prestiżowe ---
function calculateHeavenlyChips() {
  return Math.floor(Math.floor(cookiesBakedThisAscension / 1000000));
}

function updateHeavenlyChipsDisplay() {
  document.getElementById('heavenlyChipsCount').textContent = formatNumber(heavenlyChips);
  document.getElementById('heavenlyChipsThisAscension').textContent = formatNumber(heavenlyChipsThisAscension);
  document.getElementById('ascensionCount').textContent = ascensionCount;
}

function renderHeavenlyUpgrades() {
  const container = document.getElementById('heavenlyUpgradesContainer');
  container.innerHTML = '<h3>Niebiańskie Ulepszenia</h3>';
  
  heavenlyUpgrades.forEach(upg => {
    const div = document.createElement('div');
    div.className = 'heavenly-upgrade' + (upg.purchased ? ' purchased' : '');
    
    const title = document.createElement('div');
    title.className = 'heavenly-title';
    title.textContent = upg.name;
    
    const desc = document.createElement('div');
    desc.className = 'heavenly-desc';
    desc.textContent = upg.description;
    
    const cost = document.createElement('div');
    cost.className = 'heavenly-cost';
    cost.textContent = `Koszt: ${formatNumber(upg.cost)} NC`;
    
    const btn = document.createElement('button');
    
    if (upg.purchased) {
      btn.textContent = 'Kupione ✓';
      btn.disabled = true;
    } else {
      if (heavenlyChips < upg.cost) {
        btn.textContent = 'Kup';
        btn.disabled = true;
      } else {
        btn.textContent = 'Kup';
        btn.disabled = false;
      }
    }
    
    btn.addEventListener('click', () => buyHeavenlyUpgrade(upg));
    
    div.appendChild(title);
    div.appendChild(desc);
    div.appendChild(cost);
    div.appendChild(btn);
    
    container.appendChild(div);
  });
}

function buyHeavenlyUpgrade(upg) {
  if (heavenlyChips >= upg.cost && !upg.purchased) {
    heavenlyChips -= upg.cost;
    upg.purchased = true;
    updateHeavenlyChipsDisplay();
    renderHeavenlyUpgrades();
    saveGame();

    // Dodaj odtworzenie dźwięku zakupu niebiańskiego ulepszenia
    buyHeavenlySound.currentTime = 0;
    buyHeavenlySound.play();
  }
}

function getHeavenlyMultiplier() {
  let multiplier = 1;
  heavenlyUpgrades.forEach(upg => {
    if (upg.purchased && upg.effect.cpsMultiplier) {
      multiplier += upg.effect.cpsMultiplier;
    }
  });
  return multiplier;
}

function getHeavenlyClickValue() {
  let value = 0;
  heavenlyUpgrades.forEach(upg => {
    if (upg.purchased && upg.effect.clickValue) {
      value += upg.effect.clickValue;
    }
  });
  return value;
}

function getHeavenlyCostReduction() {
  let reduction = 0;
  heavenlyUpgrades.forEach(upg => {
    if (upg.purchased && upg.effect.costReduction) {
      reduction += upg.effect.costReduction;
    }
  });
  return reduction;
}

function getEventChanceMultiplier() {
  let multiplier = 1;
  heavenlyUpgrades.forEach(upg => {
    if (upg.purchased && upg.effect.eventChance) {
      multiplier += upg.effect.eventChance;
    }
  });
  return multiplier;
}

function ascend() {
  const hcGained = calculateHeavenlyChips();
  if (!confirm(`Czy na pewno chcesz dokonać Wniebowstąpienia? Otrzymasz ${hcGained} Niebiańskich Chipów, ale zresetujesz swój obecny postęp (ciastka, ulepszenia).`)) {
    return;
  }

  // Tworzymy flashujący overlay
  const overlay = document.createElement('div');
  overlay.id = 'ascensionOverlay';
  document.body.appendChild(overlay);

  // Przewijanie do góry strony
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  // --- Ścisz muzykę na czas animacji ---
  const previousVolume = backgroundMusic.volume;
  backgroundMusic.volume = 0;

  heavenlyChips += hcGained;
  heavenlyChipsThisAscension = hcGained;
  ascensionCount++;

  // Reset gry z zachowaniem prestiżu
  resetForAscension();

  // Odtwarzamy dźwięk wniebowstąpienia
  ascendSound.currentTime = 0;
  ascendSound.play();
  
  saveGame();
  renderHeavenlyUpgrades();
  updateHeavenlyChipsDisplay();
  showEvent(`Dokonałeś Wniebowstąpienia i zdobyłeś ${hcGained} Niebiańskich Ciastek!`, 'ascension');
  checkAchievements();

  // Usuwamy overlay po 5 sekundach
  setTimeout(() => {
    overlay.remove();
    backgroundMusic.volume = previousVolume;
    saveSoundSettings();
  }, 5000);
}

function resetForAscension() {
  // Resetujemy stan gry, ale nie prestiż
  count = 0;
  cps = 0;
  clickValue = 1;
  accumulatedCookies = 0;
  cookiesBakedThisAscension = 0;
  eventMultiplier = 1;
  eventActive = false;

  // Reset ulepszeń produkcji
  upgrades.forEach(upg => {
    upg.count = 0;
    upg.cost = upg.initialCost;
  });

  // Reset ulepszeń kliknięć
  cursorUpgrades.forEach(upg => {
    upg.count = 0;
    upg.cost = upg.initialCost;
  });

  // Aktualizacja wyświetlacza
  updateDisplay();
  renderUpgrades();
}

// --- Obsługa kliknięcia ciasteczka ---
cookieBtn.addEventListener('click', e => {
  const heavenlyClickValue = getHeavenlyClickValue();
  const actualClickValue = (clickValue + heavenlyClickValue) * eventMultiplier;
  
  count += actualClickValue;
  cookiesBakedThisAscension += actualClickValue;
  totalFromClicks += actualClickValue;
  
  createFlyingCookie(e.clientX, e.clientY, clickValue + heavenlyClickValue);
  clickSound.currentTime = 0;
  clickSound.play();
  updateDisplay();
  checkAchievements();
});

// --- Dodawanie ciastek na sekundę ---
function addCookiesPerSecond() {
  const heavenlyMultiplier = getHeavenlyMultiplier();
  const amount = (cps * eventMultiplier * heavenlyMultiplier) / 10;
  count += amount;
  cookiesBakedThisAscension += amount;

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
    
    // Tylko co drugie ciastko będzie niebieskie podczas eventu
    if (eventMultiplier > 1 && cookieCounter % 2 === 0) {
      cookie.style.filter = "invert(44%) sepia(37%) saturate(1117%) hue-rotate(181deg) brightness(104%) contrast(109%)";
      cookie.style.opacity = "0.5";
    }

    cookieCounter++; // Zwiększ licznik po każdym ciastku

    offsetParent.appendChild(cookie);

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
  
  const heavenlyMultiplier = getHeavenlyMultiplier();
  const cpsValue = cps * eventMultiplier * heavenlyMultiplier;
  cpsEl.textContent = formatNumber(cpsValue);
  
  const heavenlyClickValue = getHeavenlyClickValue();
  const clickValueTotal = (clickValue + heavenlyClickValue) * eventMultiplier;
  clickValueEl.textContent = formatNumber(clickValueTotal);
  
  multiplierEl.textContent = Number.isInteger(eventMultiplier) ? eventMultiplier + "x" : eventMultiplier.toFixed(2) + "x";
  sessionCountEl.textContent = formatNumber(cookiesBakedThisAscension);
  updateButtons();
  playTimeEl.textContent = formatPlayTime(playTimeSeconds);
  
  const ascendBtn = document.getElementById('ascendBtn');
  const canAscend = cookiesBakedThisAscension >= ASCENSION_THRESHOLD;
  
  if (canAscend) {
    const hcGained = calculateHeavenlyChips();
    ascendBtn.title = `Kliknij, aby otrzymać ${formatNumber(hcGained)} Niebiańskich Ciastek!`;
    ascendBtn.disabled = false;
    ascendBtn.innerHTML = 'Dokonaj Wniebowstąpienia';
    ascendBtn.classList.remove('disabled');
  } else {
    ascendBtn.title = '';
    ascendBtn.disabled = true;
    const remaining = ASCENSION_THRESHOLD - cookiesBakedThisAscension;
    ascendBtn.innerHTML = `Musisz zebrać jeszcze ${formatNumber(remaining > 0 ? remaining : 0)} ciastek`;
    ascendBtn.classList.add('disabled');
  }
  
  if (eventMultiplier > 1) {
    cpsEl.style.color = '#3a86ff';
    clickValueEl.style.color = '#3a86ff';
    multiplierEl.style.color = '#3a86ff';
  } else {
    cpsEl.style.color = '#5d3a00';
    clickValueEl.style.color = '#5d3a00';
    multiplierEl.style.color = '#5d3a00';
  }
}

function formatPlayTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h > 0 ? h + 'h ' : ''}${m > 0 ? m + 'm ' : ''}${s}s`;
}

function updateButtons() {
  const costReduction = getHeavenlyCostReduction();
  
  upgrades.forEach(upg => {
    const buttons = upgradesDiv.querySelectorAll('button');
    buttons.forEach(btn => {
      if(btn.previousSibling.textContent.includes(upg.name)) {
        const actualCost = Math.ceil(upg.cost * (1 - costReduction));
        btn.disabled = count < actualCost;
      }
    });
  });
  
  cursorUpgrades.forEach(upg => {
    const buttons = cursorUpgradesDiv.querySelectorAll('button');
    buttons.forEach(btn => {
      if(btn.previousSibling.textContent.includes(upg.name)) {
        const actualCost = Math.ceil(upg.cost * (1 - costReduction));
        btn.disabled = count < actualCost;
      }
    });
  });
}

// --- Tworzenie animacji "latającego" ciasteczka ---
function createFlyingCookie(x, y, baseValue) {
  const span = document.createElement('span');
  span.className = 'flying-cookie';
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;
  
  span.style.left = `${x + scrollX - 20}px`;
  span.style.top = `${y + scrollY - 20}px`;
  
  // Uwzględnij mnożnik eventu
  const displayValue = baseValue * eventMultiplier;
  span.textContent = '+' + formatNumber(displayValue);
  
  // Zmień kolor na niebieski podczas eventu
  if (eventMultiplier > 1) {
    span.style.color = '#3a86ff';
    span.style.textShadow = '1px 1px 1px #000';
  }
  
  document.body.appendChild(span);
  setTimeout(() => {
    span.remove();
  }, 1500);
}

// --- Obsługa eventów losowych ---
const eventBox = document.getElementById('eventBox');

function startRandomEvent() {
  // Sprawdź czy minął wymagany czas od ostatniego eventu
  const now = Date.now();
  if (eventActive || (now - lastEventTime) < MIN_EVENT_INTERVAL) return;
  
  const baseChance = 0.001;
  const eventChanceMultiplier = getEventChanceMultiplier();
  const actualChance = baseChance * eventChanceMultiplier;
  
  const rand = Math.random();
  if (rand < actualChance) {
    eventActive = true;
    eventMultiplier = 2;
    lastEventTime = now; // Zapisz czas wystąpienia eventu
    
    eventSound.currentTime = 0;
    eventSound.play();
    
    // Dodaj informację o czasie trwania eventu
    const eventDuration = 30000;
    showEvent(`Wydarzenie: Podwójne ciastka przez ${eventDuration/1000} sekund!`, 'event');
    
    setTimeout(() => {
      eventMultiplier = 1;
      eventActive = false;
      hideEvent();
    }, eventDuration);
  }
}

function showEvent(message, type, duration) {
  eventBox.textContent = message;
  eventBox.classList.add('show');
  
  // Resetujemy wszystkie klasy kolorów
  eventBox.classList.remove('event-type', 'achievement-type', 'ascension-type');
  
  // Dodajemy odpowiednią klasę w zależności od typu
  if (type === 'achievement') {
    eventBox.classList.add('achievement-type');
    // Ukryj eventBox po 5 sekundach
    setTimeout(() => {
      hideEvent();
    }, 5000);
  } else if (type === 'ascension') {
    eventBox.classList.add('ascension-type');
  } else {
    eventBox.classList.add('event-type');
    
    // Dodaj licznik czasu dla eventów
    if (duration) {
      const timer = document.createElement('div');
      timer.id = 'eventTimer';
      timer.style.marginTop = '5px';
      timer.style.fontSize = '0.8em';
      eventBox.appendChild(timer);
      
      // Aktualizuj licznik co sekundę
      const updateTimer = () => {
        const secondsLeft = Math.ceil(duration / 1000);
        timer.textContent = `Kończy się za: ${secondsLeft}s`;
        duration -= 1000;
        
        if (duration > 0) {
          setTimeout(updateTimer, 1000);
        } else {
          timer.remove();
        }
      };
      
      updateTimer();
    }
  }
}

function hideEvent() {
  const timer = document.getElementById('eventTimer');
  if (timer) timer.remove();
  
  eventBox.classList.remove('show');
  eventBox.innerHTML = ''; // Wyczyść zawartość
}

// --- Sprawdzanie osiągnięć ---
const achievementsList = document.getElementById('achievementsList');

function checkAchievements() {
  let changed = false;
  achievements.forEach(ach => {
    if(!ach.unlocked && ach.condition()) {
      ach.unlocked = true;
      changed = true;
      achievementSound.currentTime = 0;
      achievementSound.play();
      showEvent(`Osiągnięcie odblokowane: ${ach.name}!`, 'achievement');
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
  backgroundMusic.muted = !backgroundMusic.muted;
  muteButton.textContent = backgroundMusic.muted ? 'Odcisz muzykę' : 'Wycisz muzykę';
  saveSoundSettings();
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
    lastSaveTime: new Date().getTime(),
    heavenlyChips: heavenlyChips,
    heavenlyChipsThisAscension: heavenlyChipsThisAscension,
    ascensionCount: ascensionCount,
    heavenlyUpgrades: heavenlyUpgrades.map(upg => ({ 
      id: upg.id, 
      purchased: upg.purchased 
    })),
    usedPromoCodes: usedPromoCodes,
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
    
    count = gameState.count || 0;
    cps = gameState.cps || 0;
    clickValue = gameState.clickValue || 1;
    playTimeSeconds = gameState.playTimeSeconds || 0;
    cookiesBakedThisAscension = gameState.cookiesBakedThisAscension || 0;
    totalFromClicks = gameState.totalFromClicks || 0;
    lastSaveTime = gameState.lastSaveTime || null;
    heavenlyChips = gameState.heavenlyChips || 0;
    heavenlyChipsThisAscension = gameState.heavenlyChipsThisAscension || 0;
    ascensionCount = gameState.ascensionCount || 0;

    gameState.upgrades.forEach(savedUpg => {
      const upg = upgrades.find(u => u.id === savedUpg.id);
      if (upg) {
        upg.count = savedUpg.count;
        upg.cost = savedUpg.cost;
      }
    });

    gameState.cursorUpgrades.forEach(savedUpg => {
      const upg = cursorUpgrades.find(u => u.id === savedUpg.id);
      if (upg) {
        upg.count = savedUpg.count;
        upg.cost = savedUpg.cost;
      }
    });

    gameState.achievements.forEach(savedAch => {
      const ach = achievements.find(a => a.id === savedAch.id);
      if (ach) {
        ach.unlocked = savedAch.unlocked;
      }
    });

    if (gameState.heavenlyUpgrades) {
      gameState.heavenlyUpgrades.forEach(savedUpg => {
        const upg = heavenlyUpgrades.find(u => u.id === savedUpg.id);
        if (upg) {
          upg.purchased = savedUpg.purchased;
        }
      });
    }

    usedPromoCodes = gameState.usedPromoCodes || [];
    localStorage.setItem('cookieClickerUsedPromoCodes', JSON.stringify(usedPromoCodes));

    setBakeryName(gameState.bakeryName || generateRandomName());
    updateDisplay();
    renderUpgrades();
    renderAchievements();
    renderHeavenlyUpgrades();
    updateHeavenlyChipsDisplay();
    updateLastSaveTimeDisplay();
    loadSoundSettings();
    initMusicPlayer();
    initPromoCodes();

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
  a.download = `klikacz_ciastek_zapis_${new Date().toISOString().slice(0,10)}.txt`;
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
      if (typeof gameState.count !== 'number' || 
          !Array.isArray(gameState.upgrades)) {
        throw new Error('nieprawidłowy format pliku');
      }
      localStorage.setItem('cookieClickerSave', JSON.stringify(gameState));
      loadGame();
      // Zamknij menu ustawień po imporcie gry
      settingsMenu.style.display = 'none';
      alert('Postęp został pomyślnie zaimportowany!');
    } catch (error) {
      alert(`Błąd wczytywania pliku: ${error.message}.`);
    }
  };
  reader.readAsText(file);
});

// Autozapis co 5 minut
setInterval(saveGame, 5 * 60 * 1000);

// Throttling do zapisu przy zamknięciu
let isSaving = false;
window.addEventListener('beforeunload', () => {
  if (!isSaving) {
    isSaving = true;
    saveGame();
  }
});

// Zapisz przy zamknięciu strony
window.addEventListener('beforeunload', saveGame);

// Dodaj obsługę przycisku resetowania gry
document.getElementById('resetProgress').addEventListener('click', function() {
  if (confirm('Czy na pewno chcesz zresetować grę? Wszystkie postępy zostaną utracone i nie będzie można ich przywrócić.')) {
    resetGame();
  }
});

function resetGame() {
  count = 0;
  cps = 0;
  clickValue = 1;
  eventMultiplier = 1;
  eventActive = false;
  accumulatedCookies = 0;
  playTimeSeconds = 0;
  cookiesBakedThisAscension = 0;
  totalFromClicks = 0;
  heavenlyChips = 0;
  heavenlyChipsThisAscension = 0;
  ascensionCount = 0;
  cookieCounter = 0;

  [clickSound, buySound, achievementSound, eventSound, buyHeavenlySound, ascendSound].forEach(sound => {
    sound.currentTime = 0;
    sound.muted = false;
  });
  
  upgrades.forEach(upgrade => {
    upgrade.count = 0;
    upgrade.cost = upgrade.initialCost;
  });
  
  cursorUpgrades.forEach(upgrade => {
    upgrade.count = 0;
    upgrade.cost = upgrade.initialCost;
  });
  
  achievements.forEach(achievement => {
    achievement.unlocked = false;
  });
  
  heavenlyUpgrades.forEach(upgrade => {
    upgrade.purchased = false;
  });

  // Reset kodów promocyjnych
  usedPromoCodes = [];
  localStorage.removeItem('cookieClickerUsedPromoCodes');
  initPromoCodes();
  
  setBakeryName(generateRandomName());
  
  localStorage.removeItem('cookieClickerSave');
  
  updateDisplay();
  renderUpgrades();
  renderAchievements();
  renderHeavenlyUpgrades();
  updateHeavenlyChipsDisplay();
  updateLastSaveTimeDisplay();

  settingsMenu.style.display = 'none';

  alert('Gra została zresetowana! Możesz zacząć od nowa.');
}

// --- Pętla gry ---
setInterval(() => {
  addCookiesPerSecond();
}, 100);

// Sprawdzaj eventy tylko co sekundę
setInterval(() => {
  startRandomEvent();
}, 1000);

setInterval(() => {
  playTimeSeconds++;
  updateDisplay();
}, 1000);

// --- Inicjalizacja ---
renderUpgrades();
renderHeavenlyUpgrades();
updateDisplay();
renderAchievements();
setBakeryName(generateRandomName());
loadSoundSettings();
loadGame();
initMusicPlayer(); 
initPromoCodes();

// Dodaj obsługę przycisku ascension
document.getElementById('ascendBtn').addEventListener('click', ascend);