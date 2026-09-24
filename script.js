// Editable settings near the top.
// Change these values to personalize the story quickly.
const HER_NAME = "DARSANI B";
const CHILDHOOD_YEAR = "2016";
const PRESENT_YEAR = "2026";
const BIRTHDAY_MESSAGE =
  "Thank you for being part of so many chapters of my life.";
const CHILDHOOD_IMAGE = "assets/childhood.jpg";
const PRESENT_IMAGE = "assets/present.jpg";
const MUSIC_FILE = "assets/music.mp3";
const STORY_TITLE = "Birthday Surprise";

// Edit colors and animation timing here if you want a different cinematic mood.
const ACCENT_COLORS = {
  glow: "rgba(217, 180, 255, 0.25)",
  text: "#f5f5f5",
  muted: "rgba(255, 255, 255, 0.72)",
};
const ANIMATION_SPEED = {
  section: 900,
  reveal: 1200,
  confetti: 4000,
};

const sceneCount = 16;
const scenes = [...document.querySelectorAll(".scene")];
const progressCurrent = document.getElementById("progress-current");
const progressTotal = document.getElementById("progress-total");
const beginButton = document.querySelector("[data-begin]");
const replayButton = document.querySelector(".replay-button");
const nextButton = document.querySelector(".page-next-button");
const birthdayName = document.getElementById("birthday-name");
const audio = document.getElementById("story-audio");
const musicToggle = document.querySelector(".music-toggle");
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxClose = document.querySelector(".lightbox-close");

progressTotal.textContent = String(sceneCount).padStart(2, "0");

document.title = STORY_TITLE;
birthdayName.textContent = HER_NAME;

const birthdayMessageEl = document.querySelector(".birthday-message");
if (birthdayMessageEl) {
  birthdayMessageEl.textContent = BIRTHDAY_MESSAGE;
}

const presentYear = document.getElementById("present-year");
if (presentYear) {
  presentYear.textContent = PRESENT_YEAR;
}

const childhoodYearText = document.querySelector(".caption-top span");
if (childhoodYearText) {
  childhoodYearText.textContent = `${CHILDHOOD_YEAR} — ${Number(CHILDHOOD_YEAR) + 1}`;
}

const childhoodImageNodes = document.querySelectorAll(
  'img[src="assets/childhood.jpg"]',
);
childhoodImageNodes.forEach((img) => {
  img.src = CHILDHOOD_IMAGE;
});

const presentImageNodes = document.querySelectorAll(
  'img[src="assets/present.jpg"]',
);
presentImageNodes.forEach((img) => {
  img.src = PRESENT_IMAGE;
});

const goToNextScene = () => {
  const activeScene = document.querySelector(".scene.active");
  const currentIndex = scenes.indexOf(activeScene);

  if (currentIndex < 0) {
    const firstScene = scenes[0];
    firstScene?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const targetScene = scenes[Math.min(currentIndex + 1, scenes.length - 1)];

  if (targetScene) {
    targetScene.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }
};

const smoothSceneFocus = (scene) => {
  if (!scene) return;

  scene.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
};

const setActiveScene = (index) => {
  scenes.forEach((scene, sceneIndex) => {
    scene.classList.toggle("active", sceneIndex === index);
  });

  const current = Math.min(Math.max(index + 1, 1), sceneCount);
  progressCurrent.textContent = String(current).padStart(2, "0");

  if (!nextButton) return;

  const isLastScene = current >= sceneCount;
  nextButton.classList.toggle("hidden", isLastScene);

  if (isLastScene) {
    nextButton.setAttribute("aria-hidden", "true");
  } else {
    nextButton.setAttribute("aria-hidden", "false");
  }
};

const options = {
  root: null,
  threshold: 0.6,
};

const observer = new IntersectionObserver((entries) => {
  const visibleEntries = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

  if (visibleEntries.length > 0) {
    const visibleScene = visibleEntries[0].target;
    const sceneIndex = scenes.indexOf(visibleScene);

    if (sceneIndex >= 0) {
      setActiveScene(sceneIndex);
    }
  }
}, options);

scenes.forEach((scene) => observer.observe(scene));

if (beginButton) {
  beginButton.addEventListener("click", () => {
    const nextScene = document.getElementById("scene-2");
    smoothSceneFocus(nextScene);
  });
}

if (nextButton) {
  nextButton.addEventListener("click", goToNextScene);
}

if (replayButton) {
  replayButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setActiveScene(0), 120);
  });
}

const openLightbox = (imageSrc) => {
  if (!imageSrc) return;
  lightboxImage.src = imageSrc;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
};

const closeLightbox = () => {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
};

const lightboxTriggers = document.querySelectorAll(
  "[data-lightbox-trigger] img",
);
lightboxTriggers.forEach((img) => {
  img.addEventListener("click", () => openLightbox(img.src));
});

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

window.addEventListener("keydown", (event) => {
  const activeTag = document.activeElement?.tagName;
  const isTypingField =
    activeTag === "INPUT" || activeTag === "TEXTAREA" || activeTag === "SELECT";
  const isButton =
    event.target instanceof HTMLElement && event.target.closest("button");

  if (event.key === "Enter" && !event.repeat && !isTypingField && !isButton) {
    event.preventDefault();
    return;
  }

  if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
    closeLightbox();
  }
});

const setupAudio = () => {
  if (!musicToggle) return;

  audio.src = MUSIC_FILE;
  let isPlaying = false;

  const updateMusicState = () => {
    musicToggle.classList.toggle("is-muted", !isPlaying);
    musicToggle.setAttribute("aria-pressed", String(isPlaying));
  };

  musicToggle.addEventListener("click", async () => {
    try {
      if (!isPlaying) {
        await audio.play();
        isPlaying = true;
      } else {
        audio.pause();
        isPlaying = false;
      }
      updateMusicState();
    } catch (error) {
      console.warn(
        "Audio interaction was blocked or the file is missing:",
        error,
      );
      isPlaying = false;
      updateMusicState();
    }
  });

  audio.addEventListener("ended", () => {
    isPlaying = false;
    updateMusicState();
  });

  audio.addEventListener("error", () => {
    musicToggle.style.display = "none";
    musicToggle.setAttribute("aria-hidden", "true");
    console.warn("Music file is missing or failed to load.");
  });

  updateMusicState();
};

if (typeof gsap !== "undefined") {
  gsap.from(".scene-intro .fade-up", {
    y: 24,
    opacity: 0,
    duration: 1.1,
    ease: "power2.out",
    stagger: 0.15,
  });

  gsap.from(".chess-piece", {
    x: -20,
    opacity: 0,
    duration: 1.2,
    ease: "power2.out",
    stagger: 0.25,
  });
}

setupAudio();
setActiveScene(0);

window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("ready");
});
