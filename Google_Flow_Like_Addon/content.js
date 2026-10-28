(() => {
  "use strict";

  const FAVORITE_KEY = "\\";

  console.log("[Flow Favorite] Script started.");

  // ---------------------------------------------------------
  // REMOVE PREVIOUS EVENT LISTENER
  // ---------------------------------------------------------

  if (window.__flowFavoriteListener) {
    document.removeEventListener(
      "keydown",
      window.__flowFavoriteListener,
      false,
    );

    console.log("[Flow Favorite] Previous listener removed.");
  }

  // ---------------------------------------------------------
  // CREATE NEW EVENT LISTENER
  // ---------------------------------------------------------

  window.__flowFavoriteListener = (event) => {
    // =======================================================
    // 1. CHECK KEY
    // =======================================================

    console.log("[Flow Favorite] Key pressed:", event.key);

    if (event.key !== FAVORITE_KEY) {
      console.log("[Flow Favorite] Not the favorite key. Stop.");
      return;
    }

    console.log('[Flow Favorite] STEP 1: "\\" pressed.');

    // Don't run while typing
    const target = event.target;
    const tagName = target?.tagName?.toLowerCase();

    if (
      tagName === "input" ||
      tagName === "textarea" ||
      tagName === "select" ||
      target?.isContentEditable
    ) {
      console.log("[Flow Favorite] User is typing. Stop.");
      return;
    }

    // =======================================================
    // 2. SEARCH FOR ELEMENT
    // =======================================================

    console.log("[Flow Favorite] STEP 2: Searching for Favorite...");

    let favoriteElement = null;

    // First: aria-label="Favorite"
    const ariaElements = document.querySelectorAll("[aria-label]");

    for (const element of ariaElements) {
      const name = String(element.getAttribute("aria-label") || "")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();

      if (name === "favorite") {
        favoriteElement = element;
        break;
      }
    }

    // Second: title="Favorite"
    if (!favoriteElement) {
      const titleElements = document.querySelectorAll("[title]");

      for (const element of titleElements) {
        const name = String(element.getAttribute("title") || "")
          .trim()
          .replace(/\s+/g, " ")
          .toLowerCase();

        if (name === "favorite") {
          favoriteElement = element;
          break;
        }
      }
    }

    // Third: mat-icon="favorite"
    if (!favoriteElement) {
      const clickableElements = document.querySelectorAll(
        'button, [role="button"]',
      );

      for (const element of clickableElements) {
        const icon = element.querySelector("mat-icon");

        if (!icon) {
          continue;
        }

        const iconName = String(icon.textContent || "")
          .trim()
          .replace(/\s+/g, " ")
          .toLowerCase();

        if (iconName === "favorite") {
          favoriteElement = element;
          break;
        }
      }
    }

    if (!favoriteElement) {
      console.log("[Flow Favorite] Favorite element NOT found. Stop.");
      return;
    }

    console.log(
      "[Flow Favorite] STEP 2 complete: Element found.",
      favoriteElement,
    );

    // =======================================================
    // 3. CHECK VISIBILITY
    // =======================================================

    console.log("[Flow Favorite] STEP 3: Checking visibility...");

    if (!favoriteElement.isConnected) {
      console.log("[Flow Favorite] Element is no longer connected. Stop.");
      return;
    }

    if (favoriteElement.offsetParent === null) {
      console.log("[Flow Favorite] Element is NOT visible. Stop.");
      return;
    }

    const style = getComputedStyle(favoriteElement);

    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      style.opacity === "0"
    ) {
      console.log("[Flow Favorite] Element is NOT visible. Stop.");
      return;
    }

    console.log("[Flow Favorite] STEP 3 complete: Element is visible.");

    // =======================================================
    // 4. CHECK CLICKABILITY
    // =======================================================

    console.log("[Flow Favorite] STEP 4: Checking clickability...");

    const favoriteTag = favoriteElement.tagName?.toLowerCase();

    if (
      favoriteElement.disabled === true ||
      favoriteElement.getAttribute("aria-disabled") === "true" ||
      style.pointerEvents === "none"
    ) {
      console.log("[Flow Favorite] Element is NOT clickable. Stop.");
      return;
    }

    if (
      favoriteTag !== "button" &&
      favoriteElement.getAttribute("role") !== "button"
    ) {
      console.log("[Flow Favorite] Element is not a button/control. Stop.");
      return;
    }

    console.log("[Flow Favorite] STEP 4 complete: Element is clickable.");

    // =======================================================
    // 5. CLICK + BEEP
    // =======================================================

    console.log("[Flow Favorite] STEP 5: Clicking Favorite...");

    event.preventDefault();

    favoriteElement.click();

    console.log("[Flow Favorite] Favorite clicked.");

    // -------------------------------------------------------
    // Short beep
    // -------------------------------------------------------

    console.log("[Flow Favorite] Generating beep...");

    try {
      const audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gain.gain.setValueAtTime(0.08, audioContext.currentTime);

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.08,
      );

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.08);

      console.log("[Flow Favorite] Beep complete.");
    } catch (error) {
      console.log("[Flow Favorite] Beep failed:", error);
    }

    console.log("[Flow Favorite] Sequence complete.");
  };

  // ---------------------------------------------------------
  // ADD ONE DOCUMENT LISTENER
  // ---------------------------------------------------------

  document.addEventListener("keydown", window.__flowFavoriteListener, false);

  console.log("[Flow Favorite] New document listener installed.");
})();
