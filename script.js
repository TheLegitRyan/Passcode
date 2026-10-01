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


    const scale =
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

  }


  /* =========================
     ENTER DIGIT
     ========================= */

  function pressKey(button) {

    if (transitioning)
      return;


    if (
      enteredCode.length >=
      CODE_LENGTH
    ) {
      return;
    }


    flashKey(button);


    enteredCode +=
      button.dataset.key;


    const dot =
      dots[enteredCode.length - 1];


    if (dot) {

      dot.classList.add("filled");

    }


    /* Haptic feedback */

    if (navigator.vibrate) {

      try {

        navigator.vibrate(8);

      } catch (_) {}

    }


    /* SIXTH DIGIT */

    if (
      enteredCode.length ===
      CODE_LENGTH
    ) {

      finishEntry();

    }

  }


  /* =========================
     FINISH / FADE
     ========================= */

  function finishEntry() {

    if (transitioning)
      return;


    transitioning = true;


    setTimeout(() => {

      viewport.classList.add(
        "transitioning"
      );


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
     KEYPAD
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
     SECRET TOP-LEFT BUTTON
     ========================= */

  revealCodeButton.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      event.stopPropagation();


      /*
       * Show the actual digits
       * entered into the keypad.
       */

      if (enteredCode.length > 0) {

        revealedCode.textContent =
          enteredCode;

      } else {

        revealedCode.textContent =
          "Nothing entered";

      }


      codePanel.classList.add(
        "visible"
      );

    }
  );


  /* =========================
     CLOSE
     ========================= */

  closeCodePanel.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      codePanel.classList.remove(
        "visible"
      );

    }
  );


  /* Tap outside the box */

  codePanel.addEventListener(
    "pointerdown",
    event => {

      if (
        event.target ===
        codePanel
      ) {

        codePanel.classList.remove(
          "visible"
        );

      }

    }
  );


  /* =========================
     RESIZE
     ========================= */

  window.addEventListener(
    "resize",
    resizeStage
  );


  window.addEventListener(
    "orientationchange",
    resizeStage
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

    } catch (_) {}

  }


  viewport.addEventListener(
    "pointerdown",
    enterFullscreen,
    { once: true }
  );


  resizeStage();

})();
