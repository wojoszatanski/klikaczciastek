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
let musicEnabledFlag = false;

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
const volumeSection = document.getElementById('volumeSection');
const enableMusicButton = document.getElementById('enableMusicButton');
const volumeControl = document.getElementById('volumeControl');
volumeControl.value = 1; // Ustaw domyślną głośność na 100%
enableMusicButton.style.display = 'inline-block';
volumeSection.style.display = 'none';
const muteButton = document.getElementById('muteButton');
const clickSound = document.getElementById('clickSound');
const buySound = document.getElementById('buySound');
const achievementSound = document.getElementById('achievementSound');
const eventSound = document.getElementById('eventSound');
const effectsMuteButton = document.getElementById('effectsMuteButton');
const effectsVolumeControl = document.getElementById('effectsVolumeControl');
const buyHeavenlySound = document.getElementById('buyHeavenlySound');
const ascendSound = document.getElementById('ascendSound');

// --- Playlista ---
const playlist = [
  { title: "Ye - WW3", src: "https://www.dropbox.com/scl/fi/44mea273gliafz0ow0h4a/piosenka.flac?rlkey=8gr7u7okgc9ed0ds9e7nbg8an&st=86by4y0u&dl=1"},
  { title: "DJ Smokey - legalizenukes", src: "https://www.dropbox.com/scl/fi/r8j0aokwkd6x10w86394p/piosenka2.flac?rlkey=cstgsiayedxc41sq6rapok16p&st=q0ni4ta6&dl=1"},
  { title: "Burzum - Dunkelheit", src: "https://www.dropbox.com/scl/fi/d8ecel8aylbp9zyw0wmfk/piosenka3.flac?rlkey=2xmgkge5os6ii3k7c1bsdw40e&st=myg4tncc&dl=1"},
  { title: "Skrillex - SPITFIRE", src: "https://www.dropbox.com/scl/fi/wua8ekowuqe60mcspba24/piosenka4.flac?rlkey=z4h0ekjau0a8cfp7r2c0oe940&st=nw4y7dhz&dl=1"},
  { title: "Playboi Carti - EVIL J0RDAN", src: "https://www.dropbox.com/scl/fi/5ydbuwmrdjdbrvhf2ke6t/piosenka5.flac?rlkey=948uaplt7louxzus2vx1okefo&st=mi5o8art&dl=1"},
  { title: "The Prodigy - Omen", src: "https://www.dropbox.com/scl/fi/nciwthq9qf3b79i6qlz8k/piosenka6.flac?rlkey=l1hh7f554nsj8iw9ye8i5v103&st=urhqjpxs&dl=1"},
  { title: "¥$ - CARNIVAL", src: "https://www.dropbox.com/scl/fi/4q8vzi85tdnolltdokkaz/piosenka7.flac?rlkey=yhymn53z09kqh7nrj6d06yxzl&st=2aa2zz83&dl=1"},
  { title: "Lady Gaga - Poker Face", src: "https://www.dropbox.com/scl/fi/rnxhbe8mwyivf08lw11kz/piosenka8.flac?rlkey=ek0n177aycci129s9no36unv1&st=e05m33lr&dl=1"},
  { title: "Linkin Park - Heavy Is the Crown", src: "https://www.dropbox.com/scl/fi/86pjmeoftnll98r2cz2k0/piosenka9.flac?rlkey=ekputmx54sz2dcl5dqp05gmy6&st=xdstztay&dl=1"},
  { title: "Charli xcx - Von dutch", src: "https://www.dropbox.com/scl/fi/157duhpb5mbzakwc00c0y/piosenka10.flac?rlkey=1djhvktnp1s6o16mi8gt9tr4g&st=5znk4g49&dl=1"},
  { title: "Pendulum - Tarantula", src: "https://www.dropbox.com/scl/fi/ii0p1yoodkptllqgx3608/piosenka11.flac?rlkey=x9oww4uy6jalvyr0hlt25tuw8&st=ni2qsbbw&dl=1" },
  { title: "Limb Bizkit - Dad Vibes", src: "https://www.dropbox.com/scl/fi/7vywnqc9vdvgmvenwvgws/piosenka12.flac?rlkey=6k8r14t3atmoeeb88cbwpj3bc&st=xo85mrsn&dl=1"},
  { title: "Big Pun - Twinz", src: "https://www.dropbox.com/scl/fi/ovwiqokz3udfjpye6ytlo/piosenka13.flac?rlkey=io8w4bw821uxqq1f98v3tqooo&st=c4qoaa7v&dl=1"},
  { title: "Knocked Loose - Suffocate", src: "https://www.dropbox.com/scl/fi/td1phc3yc6qi1dip5vknh/piosenka14.flac?rlkey=log3j4oo68k962in7wq2h76wc&st=xiv5ife6&dl=1"},
  { title: "Hechizeros Band - El Sonidito", src: "https://www.dropbox.com/scl/fi/mnbmwdgcbvt814x8tlpvl/piosenka15.flac?rlkey=hz0nafqt3oav65gbforgddyxj&st=2flmw7nl&dl=1"},
  { title: "Sabrina Carpenter - Espresso", src: "https://www.dropbox.com/scl/fi/t1qxqx6h7itkyfmkfqhrf/piosenka16.flac?rlkey=829ny8ko7ln6cjxp0ybremkx7&st=336a0tdi&dl=1"},
  { title: "Kizo - KIEROWNIK", src: "https://www.dropbox.com/scl/fi/u097yhh2ipu1rpzuhw90u/piosenka17.flac?rlkey=dirczsfgef0nkeond7e9jj6t1&st=h1cv4q40&dl=1"}
];

// --- Zmienne do obsługi playlisty ---
let currentTrackIndex = 0;
let isShuffle = false;
let isPlaying = false;

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
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  }
  
  playCurrentTrack();
}

function playCurrentTrack() {
  backgroundMusic.src = playlist[currentTrackIndex].src;
  backgroundMusic.load();
  
  if (isPlaying) {
    backgroundMusic.play().catch(e => console.log("Autoplay blocked"));
  }
  
  updateTrackDisplay();
  saveSoundSettings();
}

function updateTrackDisplay() {
  currentTrackEl.textContent = playlist[currentTrackIndex].title;
}

function togglePlayPause() {
  if (isPlaying) {
    backgroundMusic.pause();
    playPauseBtn.textContent = '⏯';
    isPlaying = false;
  } else {
    backgroundMusic.play()
      .then(() => {
        playPauseBtn.textContent = '⏸';
        isPlaying = true;
        window.musicPlayed = true;
      })
      .catch(e => console.log("Play error:", e));
  }
  saveSoundSettings();
}

// --- Inicjalizacja odtwarzacza ---
function initMusicPlayer() {
  backgroundMusic.addEventListener('ended', playRandomTrack);
  
  playPauseBtn.addEventListener('click', togglePlayPause);
  
  prevTrackBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    playCurrentTrack();
  });
  
  nextTrackBtn.addEventListener('click', playRandomTrack);
  
  // Ustaw początkowy utwór
  playCurrentTrack();
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
    currentTrackIndex: currentTrackIndex,
    isPlaying: isPlaying
  };
  localStorage.setItem('cookieClickerSoundSettings', JSON.stringify(soundSettings));
}

// Funkcja sprawdzająca możliwość autoodtwarzania
async function checkAutoplay() {
  try {
    await backgroundMusic.play();
    return true;
  } catch (e) {
    // Loguj błąd tylko jeśli nie był już logowany
    if (!window.autoplayErrorLogged) {
      console.log("Autoodtwarzanie zostało zablokowane przez przeglądarkę.");
      window.autoplayErrorLogged = true;
    }
    return false;
  }
}

async function loadSoundSettings() {
  const savedSettings = localStorage.getItem('cookieClickerSoundSettings');
  if (savedSettings) {
    soundSettings = JSON.parse(savedSettings);
    
    musicEnabledFlag = soundSettings.musicEnabled || false;
    currentTrackIndex = soundSettings.currentTrackIndex || 0;
    isPlaying = soundSettings.isPlaying || false;

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

    // Ustawienia playlisty
    if (musicEnabledFlag) {
      volumeSection.style.display = 'block';
      enableMusicButton.style.display = 'none';
      
      backgroundMusic.src = playlist[currentTrackIndex].src;
      backgroundMusic.load();
      
      if (isPlaying) {
        try {
          await backgroundMusic.play();
          playPauseBtn.textContent = '⏸';
        } catch (e) {
          console.log("Play error on load:", e);
          isPlaying = false;
          playPauseBtn.textContent = '⏯';
        }
      } else {
        playPauseBtn.textContent = '⏯';
      }
      
      updateTrackDisplay();
    }
  }
  
  // Aktualizuj przycisk play/pause
  playPauseBtn.textContent = isPlaying ? '⏸' : '⏯';
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
  { id: 'celestialBaker', name: 'Niebiański Mistrz', description: 'Zdobądź 1000 Niebiańskich Chipów', condition: () => heavenlyChips >= 1000, unlocked: false }
];

// --- Wyświetlanie ulepszeń ---
const upgradesDiv = document.getElementById('upgrades');
const cursorUpgradesDiv = document.getElementById('cursorUpgrades');
const ascensionMenu = document.getElementById('ascensionMenu');

function formatNumber(num) {
  if (num < 1000) return Math.floor(num).toString();
  
  const suffixes = [
    { value: 1e33, suffix: ' decylion' },
    { value: 1e30, suffix: ' nonylion' },
    { value: 1e27, suffix: ' oktylion' },
    { value: 1e24, suffix: ' septylion' },
    { value: 1e21, suffix: ' sekstylion' },
    { value: 1e18, suffix: ' kwintylion' },
    { value: 1e15, suffix: ' kwadrylion' },
    { value: 1e12, suffix: ' trylion' },
    { value: 1e9, suffix: ' mld' },
    { value: 1e6, suffix: ' mln' },
    { value: 1e3, suffix: ' tys.' }
  ];

  for (const { value, suffix } of suffixes) {
    if (num >= value) {
      const divided = num / value;
      // Jeśli liczba jest całkowita, wyświetl bez miejsc po przecinku
      if (Number.isInteger(divided)) {
        return Math.floor(divided) + suffix;
      }
      // W przeciwnym razie wyświetl z 2 miejscami po przecinku
      return divided.toFixed(2).replace(/\.?0+$/, '') + suffix;
    }
  }
  return Math.floor(num);
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
  return Math.floor(Math.sqrt(cookiesBakedThisAscension / 1000000));
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
  cpsEl.textContent = Number.isInteger(cpsValue) ? cpsValue : cpsValue.toFixed(1);
  
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
    ascendBtn.innerHTML = 'Potrzebujesz 1 mln ciastek';
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
  if(eventActive) return;
  
  const baseChance = 0.005;
  const eventChanceMultiplier = getEventChanceMultiplier();
  const actualChance = baseChance * eventChanceMultiplier;
  
  const rand = Math.random();
  if (rand < actualChance) {
    eventActive = true;
    eventMultiplier = 2;
    eventSound.currentTime = 0;
    eventSound.play();
    showEvent('Wydarzenie: Podwójne ciastka przez 10 sekund!', 'event');
    setTimeout(() => {
      eventMultiplier = 1;
      eventActive = false;
      hideEvent();
    }, 10000);
  }
}

function showEvent(message, type) {
  eventBox.textContent = message;
  eventBox.classList.add('show');
  
  // Resetujemy wszystkie klasy kolorów
  eventBox.classList.remove('event-type', 'achievement-type', 'ascension-type');
  
  // Dodajemy odpowiednią klasę w zależności od typu
  if (type === 'achievement') {
    eventBox.classList.add('achievement-type');
  } else if (type === 'ascension') {
    eventBox.classList.add('ascension-type');
  } else {
    eventBox.classList.add('event-type');
  }
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

enableMusicButton.addEventListener('click', async () => {
  try {
    musicEnabledFlag = true;
    volumeSection.style.display = 'block';
    enableMusicButton.style.display = 'none';
    
    backgroundMusic.src = playlist[currentTrackIndex].src;
    backgroundMusic.load();
    
    const result = await backgroundMusic.play();
    isPlaying = true;
    playPauseBtn.textContent = '⏸';
    saveSoundSettings();
    
    window.musicPlayed = true;
  } catch (e) {
    console.error("Błąd odtwarzania muzyki:", e);
    alert("Błąd odtwarzania muzyki. Upewnij się, że masz włączony dźwięk w przeglądarce i spróbuj ponownie.");
  }
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
    }))
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

    setBakeryName(gameState.bakeryName || generateRandomName());
    updateDisplay();
    renderUpgrades();
    renderAchievements();
    renderHeavenlyUpgrades();
    updateHeavenlyChipsDisplay();
    updateLastSaveTimeDisplay();
    loadSoundSettings();
    initMusicPlayer();

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
      if (typeof gameState.count !== 'number' || 
          !Array.isArray(gameState.upgrades)) {
        throw new Error('nieprawidłowy format pliku');
      }
      localStorage.setItem('cookieClickerSave', JSON.stringify(gameState));
      loadGame();
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
  
  setBakeryName(generateRandomName());
  
  localStorage.removeItem('cookieClickerSave');
  
  updateDisplay();
  renderUpgrades();
  renderAchievements();
  renderHeavenlyUpgrades();
  updateHeavenlyChipsDisplay();
  updateLastSaveTimeDisplay();

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
renderHeavenlyUpgrades();
updateDisplay();
renderAchievements();
setBakeryName(generateRandomName());
loadSoundSettings();
loadGame();

// Dodaj obsługę przycisku ascension
document.getElementById('ascendBtn').addEventListener('click', ascend);