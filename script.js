// ==================== SCENE MANAGEMENT ====================

const scene0 = document.getElementById('scene-0');
const scene1 = document.getElementById('scene-1');
const scene2 = document.getElementById('scene-2');
const scene3 = document.getElementById('scene-3');
const scene4 = document.getElementById('scene-4');
const scene5 = document.getElementById('scene-5');
const scene6 = document.getElementById('scene-6');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const celebrationOverlay = document.getElementById('celebration-overlay');
const continueBtn = document.getElementById('continue-btn');
const scene3ContinueBtn = document.getElementById('scene3-continue-btn');
const scene4ContinueBtn = document.getElementById('scene4-continue-btn');
const scene5HeartTrigger = document.getElementById('scene5-heart-trigger');
const scene6ReplayBtn = document.getElementById('scene6-replay-btn');
const introCountdownNumber = document.getElementById('intro-countdown-number');
const scene3LetterCopy = document.querySelector('.letter-copy');
const scene3LetterParagraphs = scene3LetterCopy ? Array.from(scene3LetterCopy.querySelectorAll('p')) : [];
const scene3LetterSignoff = document.querySelector('.letter-signoff');

const scene3TypewriterDuration = 10000;
let scene3TypewriterTimer = null;
let scene3StoredParagraphTexts = [];
let scene3StoredSignoffText = '';
let scene3TypewriterInitialized = false;

let scene0Duration = 2500; // 2.5 seconds
let currentScene = 0;
let introTimerIds = [];

function clearIntroTimers() {
    introTimerIds.forEach((timerId) => clearTimeout(timerId));
    introTimerIds = [];
}

function resetScene1State() {
    yesBtnScale = 1;
    noInteractionStarted = false;

    if (yesBtn) {
        yesBtn.style.transform = 'scale(1)';
    }

    if (noBtn) {
        noBtn.style.left = '';
        noBtn.style.top = '';
        noBtn.removeAttribute('data-state');
    }
}

function runIntroCountdown() {
    currentScene = 0;
    const countdownSteps = ['3', '2', '1'];
    const countdownStepDuration = scene0Duration / countdownSteps.length;

    if (introCountdownNumber) {
        introCountdownNumber.classList.remove('count-pop');
        void introCountdownNumber.offsetWidth;
        introCountdownNumber.textContent = countdownSteps[0];
        introCountdownNumber.classList.add('count-pop');

        countdownSteps.slice(1).forEach((value, index) => {
            const timerId = setTimeout(() => {
                introCountdownNumber.classList.remove('count-pop');
                void introCountdownNumber.offsetWidth;
                introCountdownNumber.textContent = value;
                introCountdownNumber.classList.add('count-pop');
            }, countdownStepDuration * (index + 1));

            introTimerIds.push(timerId);
        });
    }

    introTimerIds.push(setTimeout(() => {
        goToScene(1);
    }, scene0Duration));
}

function clearScene3Typewriter() {
    if (scene3TypewriterTimer) {
        clearTimeout(scene3TypewriterTimer);
        scene3TypewriterTimer = null;
    }
}

function initScene3TypewriterContent() {
    if (scene3TypewriterInitialized || !scene3LetterParagraphs.length || !scene3LetterSignoff) return;

    scene3StoredParagraphTexts = scene3LetterParagraphs.map((paragraph) => paragraph.textContent.trim());
    scene3StoredSignoffText = scene3LetterSignoff.textContent.replace(/\s+/g, ' ').trim();
    scene3TypewriterInitialized = true;
}

function removeScene3Cursor() {
    if (!scene3LetterCopy) return;
    const existingCursor = scene3LetterCopy.querySelector('.typewriter-cursor');
    if (existingCursor) existingCursor.remove();
}

function addScene3Cursor(targetElement) {
    if (!targetElement) return;
    removeScene3Cursor();
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    targetElement.appendChild(cursor);
}

function startScene3Typewriter() {
    if (!scene3LetterParagraphs.length || !scene3LetterSignoff) return;

    initScene3TypewriterContent();
    clearScene3Typewriter();

    const scene3ScrollArea = document.querySelector('.letter-message-scroll');
    if (scene3ScrollArea) {
        scene3ScrollArea.scrollTop = 0;
    }

    scene3LetterParagraphs.forEach((paragraph) => {
        paragraph.textContent = '';
    });
    scene3LetterSignoff.innerHTML = '';

    const fullParts = [...scene3StoredParagraphTexts, scene3StoredSignoffText];
    const totalChars = fullParts.reduce((sum, text) => sum + text.length, 0) || 1;
    const stepDuration = Math.max(8, Math.floor(scene3TypewriterDuration / totalChars));

    let partIndex = 0;
    let charIndex = 0;

    function revealNextCharacter() {
        const isSignoff = partIndex === scene3StoredParagraphTexts.length;
        const currentText = isSignoff ? scene3StoredSignoffText : scene3StoredParagraphTexts[partIndex];
        const targetElement = isSignoff ? scene3LetterSignoff : scene3LetterParagraphs[partIndex];

        if (!targetElement) return;

        if (charIndex < currentText.length) {
            if (isSignoff) {
                const textWithoutHeart = currentText.endsWith('♡') ? currentText.slice(0, -1) : currentText;
                const visibleText = currentText.slice(0, charIndex + 1);

                if (visibleText.endsWith('♡')) {
                    scene3LetterSignoff.innerHTML = textWithoutHeart + '<span>♡</span>';
                } else {
                    scene3LetterSignoff.textContent = visibleText;
                }
            } else {
                targetElement.textContent = currentText.slice(0, charIndex + 1);
            }

            addScene3Cursor(targetElement);
            charIndex += 1;
            scene3TypewriterTimer = setTimeout(revealNextCharacter, stepDuration);
            return;
        }

        partIndex += 1;
        charIndex = 0;

        if (partIndex < fullParts.length) {
            scene3TypewriterTimer = setTimeout(revealNextCharacter, stepDuration);
        } else {
            if (scene3StoredSignoffText.endsWith('♡')) {
                const signoffWithoutHeart = scene3StoredSignoffText.slice(0, -1);
                scene3LetterSignoff.innerHTML = signoffWithoutHeart + '<span>♡</span>';
            } else {
                scene3LetterSignoff.textContent = scene3StoredSignoffText;
            }
            removeScene3Cursor();
            scene3TypewriterTimer = null;
        }
    }

    revealNextCharacter();
}

function startIntroSequence(fromReplay = false) {
    clearIntroTimers();
    resetScene1State();

    if (fromReplay) {
        goToScene(0);
        introTimerIds.push(setTimeout(() => {
            runIntroCountdown();
        }, 450));
    } else {
        runIntroCountdown();
    }
}

// Transition from Scene 0 to Scene 1 automatically
window.addEventListener('load', () => {
    startIntroSequence(false);
});

function goToScene(sceneNumber) {
    const scenes = [scene0, scene1, scene2, scene3, scene4, scene5, scene6];
    const targetScene = scenes[sceneNumber];
    
    // If scene doesn't exist yet, don't navigate
    if (!targetScene) {
        console.log('Scene ' + sceneNumber + ' does not exist yet.');
        return;
    }
    
    currentScene = sceneNumber;
    transitionToScene(targetScene);
}

function transitionToScene(targetScene) {
    // Deactivate all scenes with fade-out
    document.querySelectorAll('.scene').forEach(scene => {
        if (scene.classList.contains('active')) {
            scene.style.transition = 'opacity 0.4s ease, visibility 0.4s ease';
            scene.style.opacity = '0';
            scene.style.visibility = 'hidden';
            
            setTimeout(() => {
                scene.classList.remove('active');
            }, 400);
        }
    });

    // Activate target scene with fade-in
    setTimeout(() => {
        targetScene.classList.add('active');
        targetScene.style.transition = 'opacity 0.4s ease, visibility 0.4s ease';
        targetScene.style.opacity = '1';
        targetScene.style.visibility = 'visible';

        if (targetScene.id === 'scene-3') {
            startScene3Typewriter();
        } else {
            clearScene3Typewriter();
            removeScene3Cursor();
        }
    }, 400);
}

// ==================== YES BUTTON INTERACTION ====================

yesBtn.addEventListener('click', () => {
    // Start background music directly from the YES tap/click.
    // This is a valid user gesture on mobile browsers, so playback is allowed.
    startBackgroundMusic();
    triggerCelebration();
});

function triggerCelebration() {
    // Show celebration overlay
    celebrationOverlay.classList.remove('hidden');

    // Trigger animations by removing and re-adding animation classes
    const sparkles = document.querySelectorAll('.sparkle');
    const hearts = document.querySelectorAll('.heart');
    const confetti = document.querySelectorAll('.confetti-piece');

    // Reset animations
    [sparkles, hearts, confetti].forEach(elements => {
        elements.forEach(el => {
            el.style.animation = 'none';
            setTimeout(() => {
                el.style.animation = '';
            }, 10);
        });
    });

    // Hide celebration and transition to Scene 2 after animation completes
    setTimeout(() => {
        celebrationOverlay.classList.add('hidden');
        // Transition from Scene 1 to Scene 2 smoothly
        goToScene(2);
    }, 2000);
}

// ==================== NO BUTTON INTERACTION ====================

let yesBtnScale = 1;
const yesScaleIncrement = 0.1; // Grow by 10% every time NO escapes; intentionally no maximum.
let noInteractionStarted = false;

function activateNoButton() {
    if (noInteractionStarted) return;
    noInteractionStarted = true;
    noBtn.setAttribute('data-state', 'active');
}

function moveNoButton() {
    // Activate NO button if not already activated
    activateNoButton();

    // Generate random position within safe bounds
    const padding = 20;
    const scene1 = document.getElementById('scene-1');
    const scene1Rect = scene1.getBoundingClientRect();
    
    // Account for viewport size and button dimensions
    const maxX = window.innerWidth - noBtn.offsetWidth - padding;
    const maxY = window.innerHeight - noBtn.offsetHeight - padding;
    
    let randomX = Math.random() * maxX;
    let randomY = Math.random() * maxY;
    
    // Ensure NO button doesn't overlap important content
    randomX = Math.max(padding, Math.min(randomX, maxX));
    randomY = Math.max(padding + 80, Math.min(randomY, maxY)); // Account for heading space
    
    // Set position
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';

    // Increase YES button size
    increaseYesButtonSize();
}

function increaseYesButtonSize() {
    yesBtnScale += yesScaleIncrement;
    yesBtn.style.transform = 'scale(' + yesBtnScale.toFixed(2) + ')';
}

// Desktop: NO button moves on mouseenter and pointer proximity
if (window.innerWidth > 768) {
    noBtn.addEventListener('mouseenter', moveNoButton);
    
    // Also track pointer movement for close proximity
    document.addEventListener('pointermove', (e) => {
        if (!noInteractionStarted || !noBtn.offsetParent) return;
        
        const noRect = noBtn.getBoundingClientRect();
        const proximityDistance = 50; // pixels
        
        const distance = Math.sqrt(
            Math.pow(e.clientX - (noRect.left + noRect.width / 2), 2) +
            Math.pow(e.clientY - (noRect.top + noRect.height / 2), 2)
        );
        
        if (distance < proximityDistance) {
            moveNoButton();
        }
    });
}
// Mobile: NO button moves before tap/touch
else {
    noBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        moveNoButton();
    });
    
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton();
    });
}

// ==================== RESPONSIVE ADJUSTMENTS ====================

window.addEventListener('resize', () => {
    // Reset state if window resizes to different breakpoint
    if (window.innerWidth > 768) {
        noBtn.removeEventListener('pointerdown', moveNoButton);
        noBtn.removeEventListener('touchstart', moveNoButton);
        noBtn.addEventListener('mouseenter', moveNoButton);
    } else {
        noBtn.removeEventListener('mouseenter', moveNoButton);
        noBtn.addEventListener('pointerdown', moveNoButton);
        noBtn.addEventListener('touchstart', moveNoButton);
    }
});

// ==================== SCENE 2 CONTINUE BUTTON ====================

if (continueBtn) {
    continueBtn.addEventListener('click', () => {
        // Try to go to Scene 3
        // If Scene 3 doesn't exist, this function will silently fail
        goToScene(3);
    });
}


// ==================== SCENE 3 CONTINUE BUTTON ====================
if (scene3ContinueBtn) {
    scene3ContinueBtn.addEventListener('click', () => {
        if (scene4) goToScene(4);
    });
}

if (scene4ContinueBtn) {
    scene4ContinueBtn.addEventListener('click', () => {
        if (scene5) {
            goToScene(5);
        }
    });
}


if (scene5HeartTrigger) {
    scene5HeartTrigger.addEventListener('click', () => {
        if (scene6) {
            goToScene(6);
        }
    });
}


if (scene6ReplayBtn) {
    scene6ReplayBtn.addEventListener('click', () => {
        startIntroSequence(true);
    });
}


// ==================== BACKGROUND MUSIC ====================
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const musicToggleIcon = document.getElementById('music-toggle-icon');

let backgroundMusicStarted = false;
let backgroundMusicMuted = false;

if (bgMusic) {
    bgMusic.volume = 0.55;
}

function updateMusicButton() {
    if (!musicToggle || !musicToggleIcon) return;

    if (!backgroundMusicStarted) {
        musicToggleIcon.textContent = '🎵';
        musicToggle.classList.add('music-waiting');
        musicToggle.setAttribute('aria-label', 'Play background music');
        return;
    }

    musicToggle.classList.remove('music-waiting');

    if (backgroundMusicMuted || (bgMusic && bgMusic.muted)) {
        musicToggleIcon.textContent = '🔇';
        musicToggle.setAttribute('aria-label', 'Unmute background music');
    } else {
        musicToggleIcon.textContent = '🔊';
        musicToggle.setAttribute('aria-label', 'Mute background music');
    }
}

async function startBackgroundMusic() {
    if (!bgMusic || backgroundMusicStarted) return;

    try {
        bgMusic.muted = false;
        await bgMusic.play();
        backgroundMusicStarted = true;
        backgroundMusicMuted = false;
        updateMusicButton();
    } catch (error) {
        // Mobile browsers can block audio until a valid user gesture.
        updateMusicButton();
    }
}

function handleFirstMusicInteraction(event) {
    if (event.target.closest && event.target.closest('#music-toggle')) return;

    startBackgroundMusic();

    document.removeEventListener('pointerdown', handleFirstMusicInteraction, true);
    document.removeEventListener('touchstart', handleFirstMusicInteraction, true);
    document.removeEventListener('click', handleFirstMusicInteraction, true);
}

document.addEventListener('pointerdown', handleFirstMusicInteraction, true);
document.addEventListener('touchstart', handleFirstMusicInteraction, true);
document.addEventListener('click', handleFirstMusicInteraction, true);

if (musicToggle) {
    musicToggle.addEventListener('click', async (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!backgroundMusicStarted) {
            await startBackgroundMusic();
            return;
        }

        backgroundMusicMuted = !backgroundMusicMuted;

        if (bgMusic) {
            bgMusic.muted = backgroundMusicMuted;
        }

        updateMusicButton();
    });
}

if (bgMusic) {
    bgMusic.addEventListener('play', () => {
        backgroundMusicStarted = true;
        updateMusicButton();
    });

    bgMusic.addEventListener('pause', () => {
        // Keep the state so the mute control does not visually reset.
        updateMusicButton();
    });
}

updateMusicButton();
