document.addEventListener("DOMContentLoaded", function () {
    const music = document.getElementById("backgroundMusic");
    const musicButton = document.getElementById("musicButton");

    const MUSIC_STARTED = "loveMusicStarted";
    const MUSIC_TIME = "loveMusicTime";

    function saveMusicPosition() {
        if (!music) return;
        if (Number.isFinite(music.currentTime)) {
            localStorage.setItem(MUSIC_TIME, String(music.currentTime));
        }
    }

    function restoreMusicPosition() {
        if (!music) return;

        const saved = parseFloat(localStorage.getItem(MUSIC_TIME));
        if (!Number.isFinite(saved) || saved < 0) return;

        const apply = function () {
            if (!Number.isFinite(music.duration) || music.duration <= 0) return;
            if (saved >= music.duration) return;

            try {
                music.currentTime = saved;
            } catch (_) {}
        };

        if (music.readyState >= 1) {
            apply();
        } else {
            music.addEventListener("loadedmetadata", apply, { once: true });
        }
    }

    function updateMusicButton() {
        if (!music || !musicButton) return;

        if (!music.paused) {
            musicButton.textContent = "🔊";
            musicButton.classList.add("playing");
            musicButton.setAttribute("aria-label", "Pause music");
            musicButton.title = "Pause music";
        } else {
            musicButton.textContent = "🎵";
            musicButton.classList.remove("playing");
            musicButton.setAttribute("aria-label", "Play music");
            musicButton.title = "Play music";
        }
    }

    function startMusic() {
        if (!music) return Promise.reject(new Error("Music element not found"));

        restoreMusicPosition();

        return music.play().then(function () {
            localStorage.setItem(MUSIC_STARTED, "true");
            updateMusicButton();
        }).catch(function (error) {
            updateMusicButton();
            throw error;
        });
    }

    function prepareNavigation(event, target) {
        if (event) event.preventDefault();

        // Save the exact point where the user left the page.
        saveMusicPosition();

        // Try to play/resume during the user's click. If the browser allows it,
        // the next page will still restore the saved position.
        if (music && music.paused) {
            startMusic().catch(function () {});
        }

        window.location.href = target;
    }

    if (music) {
        restoreMusicPosition();

        music.addEventListener("play", updateMusicButton);
        music.addEventListener("pause", function () {
            saveMusicPosition();
            updateMusicButton();
        });
        music.addEventListener("timeupdate", function () {
            localStorage.setItem(MUSIC_TIME, String(music.currentTime));
        });
        music.addEventListener("ended", function () {
            localStorage.removeItem(MUSIC_TIME);
            updateMusicButton();
        });

        // Save when the browser is about to leave this page.
        window.addEventListener("beforeunload", saveMusicPosition);
        window.addEventListener("pagehide", saveMusicPosition);

        // Continue from the saved point when possible.
        if (localStorage.getItem(MUSIC_STARTED) === "true") {
            startMusic().catch(function () {
                // Browser autoplay policy may require one click on this page.
                updateMusicButton();
            });
        }
    }

    if (musicButton) {
        musicButton.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (music && music.paused) {
                startMusic().catch(function () {});
            } else if (music) {
                saveMusicPosition();
                music.pause();
            }
        });
    }

    // All chapter links: save the timestamp before changing documents.
    document.querySelectorAll('a[data-next-page]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            prepareNavigation(event, link.getAttribute("href"));
        });
    });

    window.startLoveMusic = startMusic;
    window.saveMusicPosition = saveMusicPosition;

    updateMusicButton();
});
