(() => {

  const viewport =
    document.getElementById("viewport");

  const stage =
    document.getElementById("stage");

  const keys =
    [...document.querySelectorAll(".key")];

  const dots =
    [...document.querySelectorAll(".dot")];

  const revealCodeButton =
    document.getElementById("revealCodeButton");

  const codePanel =
    document.getElementById("codePanel");

  const revealedCode =
    document.getElementById("revealedCode");

  const closeCodePanel =
    document.getElementById("closeCodePanel");

  const resultScreen =
    document.getElementById("resultScreen");


  const IMAGE_W = 1045;
  const IMAGE_H = 1506;

  const CODE_LENGTH = 6;


  let scale = 1;

  let enteredCode = "";

  let transitioning = false;


  /* =========================
     RESIZE
     ========================= */

  function resizeStage() {

    const vw =
      window.innerWidth;

    const vh =
      window.innerHeight;


    scale =
      Math.max(
        vw / IMAGE_W,
        vh / IMAGE_H
      );


    stage.style.width =
      `${IMAGE_W}px`;

    stage.style.height =
      `${IMAGE_H}px`;

    stage.style.transform =
      `translate(-50%, -50%) scale(${scale})`;

  }


  /* =========================
     BUTTON FLASH
     ========================= */

  function flashKey(button) {

    button.classList.remove("flash");

    void button.offsetWidth;

    button.classList.add("flash");


    button.addEventListener(
      "animationend",
      () => {

        button.classList.remove("flash");

      },
      { once: true }
    );

  }


  /* =========================
     FILL DOT
     ========================= */

  function fillNextDot() {

    const index =
      enteredCode.length - 1;


    if (
      index >= 0 &&
      index < dots.length
    ) {

      dots[index]
        .classList
        .add("filled");

    }

  }


  /* =========================
     CLEAR DOTS
     ========================= */

  function clearDots() {

    dots.forEach(
      dot =>
        dot.classList.remove("filled")
    );

  }


  /* =========================
     FINISH CODE
     ========================= */

  function finishEntry() {

    if (transitioning)
      return;


    transitioning = true;


    /* Store/display the complete code */
    revealedCode.textContent =
      enteredCode;


    /*
      Give the final dot a tiny moment
      before starting the transition.
    */

    setTimeout(() => {

      viewport.classList.add(
        "transitioning"
      );


      /*
        Once the fade has completed,
        permanently show the new image.
      */

      setTimeout(() => {

        stage.style.display =
          "none";

        viewport.classList.remove(
          "transitioning"
        );

        resultScreen.style.opacity =
          "1";

        resultScreen.style.visibility =
          "visible";

      }, 560);


    }, 110);

  }


  /* =========================
     KEYPRESS
     ========================= */

  function pressKey(button) {

    if (
      transitioning ||
      enteredCode.length >= CODE_LENGTH
    ) {
      return;
    }


    flashKey(button);


    enteredCode +=
      button.dataset.key;


    fillNextDot();


    /* Haptic feedback */

    if (navigator.vibrate) {

      try {

        navigator.vibrate(8);

      } catch (_) {}

    }


    /*
      SIXTH DIGIT ENTERED
      -> START TRANSITION
    */

    if (
      enteredCode.length ===
      CODE_LENGTH
    ) {

      finishEntry();

    }

  }


  /* =========================
     KEYPAD EVENTS
     ========================= */

  keys.forEach(button => {

    button.addEventListener(
      "pointerdown",
      event => {

        event.preventDefault();

        pressKey(button);

      }
    );

  });


  /* =========================
     TOP-LEFT SECRET BUTTON
     ========================= */

  revealCodeButton.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();


      revealedCode.textContent =
        enteredCode ||
        "Nothing entered";


      codePanel.classList.add(
        "visible"
      );


      codePanel.setAttribute(
        "aria-hidden",
        "false"
      );

    }
  );


  /* =========================
     CLOSE CODE PANEL
     ========================= */

  closeCodePanel.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();


      codePanel.classList.remove(
        "visible"
      );


      codePanel.setAttribute(
        "aria-hidden",
        "true"
      );

    }
  );


  /* Close by tapping outside panel */

  codePanel.addEventListener(
    "pointerdown",
    event => {

      if (
        event.target === codePanel
      ) {

        codePanel.classList.remove(
          "visible"
        );

        codePanel.setAttribute(
          "aria-hidden",
          "true"
        );

      }

    }
  );


  /* =========================
     RESIZE / ROTATION
     ========================= */

  window.addEventListener(
    "resize",
    resizeStage,
    { passive: true }
  );

  window.addEventListener(
    "orientationchange",
    resizeStage,
    { passive: true }
  );


  /* =========================
     FULLSCREEN
     ========================= */

  async function enterFullscreen() {

    try {

      if (
        !document.fullscreenElement &&
        document.documentElement.requestFullscreen
      ) {

        await document
          .documentElement
          .requestFullscreen();

      }

    } catch (_) {

      /*
        Fullscreen may be denied by
        the browser. The page still works.
      */

    }

  }


  viewport.addEventListener(
    "pointerdown",
    enterFullscreen,
    { once: true }
  );


  /* =========================
     INITIALIZE
     ========================= */

  resizeStage();

})();
 
