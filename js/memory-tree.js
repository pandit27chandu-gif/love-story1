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

document.addEventListener("DOMContentLoaded", function () {
    const memories = {
        1: {
            title: "The First Wish ❤️",
            text: `Jab maine tumhe pehli baar Krishna Coaching Classes mein dekha tha na, tabhi pata nahi kyun dil mein ek thought aa gaya tha...

"Kaash iska mere school mein admission ho jaye..." 🥹

Aur sirf itna hi nahi... dil mein ye bhi tha ki bas ye meri ho jaye aur sirf mujhe hi attention de 😅❤️

Us time mujhe kya pata tha ki jo wish maine itni innocently ki thi, woh ek din meri life ki sabse beautiful story ban jayegi. ✨`
        },
        2: {
            title: "The Proposal I Didn't Take Seriously 😂",
            text: `School mein maine itne kaand kiye the ki jab finally main tumhe propose karne gaya...

Tumne serious hoke "HA" bol diya. 🥹❤️

Aur pata hai maine kya kiya?

Maine khud hi mazaak samajh ke chhod diya! 😂😭

Aaj sochta hoon toh lagta hai...

Chandan bhai, tu kitna bada idiot tha! 🤦‍♂️😂❤️`
        },
        3: {
            title: "Tumhari Woh Kasam 🥺",
            text: `Uske baad tumne promise kar liya tha ki ab kabhi mujhe HA nahi bologi. 😭

Lekin main bhi kaha rukne wala tha... 😅

Main try karta raha, baar-baar try karta raha...

Kyunki pata nahi kyun, dil ko lagta tha ki tumhare saath wali story abhi khatam nahi hui hai. ❤️`
        },
        4: {
            title: "That Little Heart ❤️",
            text: `Maine tumhe woh heart wala locket diya tha...

Aur sabse special baat?

Woh aaj bhi tumhare paas hai. ❤️

Shayad tumhare liye woh ek simple locket ho...

But mere liye usmein ek poori memory hai. 🫶

Itna time beetne ke baad bhi tumne usse sambhal ke rakha...

Mere liye ye bahut badi baat hai. ❤️`
        },
        5: {
            title: "My Many Proposals 😂❤️",
            text: `Maine tumhe kitni baar propose kiya hai, mujhe khud exact count nahi pata. 😭😂

Class mein... 🏫

School mein... 📚

Bank ke saamne... 🏦

Har jagah bas ek hi mission tha:

"Sneha ko HA bolwana hai." 😂❤️

Aur dekho... itne attempts ke baad bhi main laga raha. 😅`
        },
        6: {
            title: "Maybe It Was God's Plan 🙏❤️",
            text: `Honestly, school ke baad maine kabhi seriously nahi socha tha ki tum mujhe dobara milogi. 🥺

Mujhe laga tha shayad bas wahi tak thi hamari story...

But maybe God had other plans. 🙏✨

Main toh Commerce lene wala tha...

But somehow Science mil gayi...

Aur phir...

usi class mein tum mujhe dobara mil gayi. ❤️

Kabhi-kabhi sochta hoon...

"Ye coincidence tha ya God's plan?" 🌙

Mujhe toh lagta hai...

God was like — "Beta, story abhi baaki hai." 😂❤️`
        },
        7: {
            title: "Trying To Win You Back ❤️",
            text: `Tum dobara meri life mein aayi toh mere andar phir wahi purana Chandan activate ho gaya. 😂

Main phir tumhe impress karne laga...

Phir se wohi harkatein... 😅

Bas ek hi goal tha:

"Kisi tarah Sneha ko phir se meri life ka part banana hai." ❤️

Shayad main perfect nahi tha...

But one thing was always real —

I genuinely wanted you in my life. 🫶`
        },
        8: {
            title: "The SMRK Vada Pav Incident 😂",
            text: `Mujhe woh moment abhi tak yaad hai... 😭😂

Tum apni friends ke saath vada pav khane ja rahi thi. 🌭😂

Aur main wahan...

"Chandan! Chandan!" 😭😭

Itna zor se bola ki tum thoda bura feel karke...

wapas hi laut gayi. 😂😭

Aaj yaad karta hoon toh hasi bhi aati hai...

aur thoda regret bhi. 🥲❤️

Sorry Sneha... 😭🫶

Mera intention tumhe bura feel karwana nahi tha.`
        },
        9: {
            title: "Finally... You Said YES ❤️",
            text: `Itni baar try karne ke baad...

Tumne mujhe finally HA bol hi diya. 😭❤️

Aur phir hum relationship mein aa gaye. 🫶

The girl I had wished would come to my school...

The girl I kept trying for...

The girl I didn't want to give up on...

Finally meri girlfriend ban gayi. ❤️🥹

But unfortunately, overthinking aur kuch situations ki wajah se hum phir alag ho gaye. 💔

6 months later...

Tumhara call aaya...

Aur phir tumne dobara HA bol diya. 🥹❤️

Maybe some stories really are meant to find their way back. ✨`
        },
        10: {
            title: "So Many Beautiful Moments ❤️",
            text: `Uske baad humne saath mein itne saare special moments enjoy kiye... 🫶

Itni baar mile... ❤️

Itna hasse... 😂

Itna enjoy kiya... 🥹

Itni saari baatein ki... 🌙

Sachi bolu toh...

Tumhare saath spend kiya hua time mere favorite memories mein se hai. ❤️

Har meeting perfect nahi thi...

Har moment perfect nahi tha...

But being with you always felt special. 🫶

Aur sabse beautiful baat ye hai ki...

hamari story abhi khatam nahi hui. ❤️

There are still so many memories left to make... ✨🌳❤️`
        }
    };

    function showMemory(number) {
        const memory = memories[number];
        const popup = document.getElementById("memoryPopup");
        const popupNumber = document.getElementById("popupNumber");
        const popupTitle = document.getElementById("popupTitle");
        const popupText = document.getElementById("popupText");

        if (!memory || !popup || !popupNumber || !popupTitle || !popupText) {
            console.error("Memory popup elements are missing.");
            return;
        }

        popupNumber.textContent = "MEMORY " + number;
        popupTitle.textContent = memory.title;
        popupText.textContent = memory.text;

        popup.classList.add("active");
        popup.setAttribute("aria-hidden", "false");
        document.body.classList.add("popup-open");
    }

    function closeMemory() {
        const popup = document.getElementById("memoryPopup");
        if (!popup) return;

        popup.classList.remove("active");
        popup.setAttribute("aria-hidden", "true");
        document.body.classList.remove("popup-open");
    }

    window.showMemory = showMemory;
    window.closeMemory = closeMemory;

    document.querySelectorAll(".memory").forEach(function (flower) {
        flower.addEventListener("click", function () {
            const match = flower.className.match(/memory-(\d+)/);
            if (match) showMemory(Number(match[1]));
        });
    });

    const popup = document.getElementById("memoryPopup");
    const closeButton = document.getElementById("popupClose");
    const closeButton2 = document.getElementById("popupCloseButton");

    if (closeButton) closeButton.addEventListener("click", closeMemory);
    if (closeButton2) closeButton2.addEventListener("click", closeMemory);

    if (popup) {
        popup.addEventListener("click", function (event) {
            if (event.target === popup) closeMemory();
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeMemory();
    });
});
