// Inject CSS for confetti and emoji
const style = document.createElement('style')
style.textContent = `
  .confetti {
    position: absolute;
    opacity: 0;
    animation: confetti-explode 4s ease forwards;
    z-index: 100;
    border-radius: 50%;

    --rotateX-start: 0deg;
    --rotateY-start: 0deg;
    --rotateZ-start: 0deg;
    --rotateX-end: 360deg;
    --rotateY-end: 360deg;
    --rotateZ-end: 360deg;
    --translateZ-start: 0px;
    --translateZ-end: 500px;
  }

  .emoji-confetti {
    animation: confetti-explode-emoji 4s ease forwards;
  }


  @keyframes confetti-explode {
    0% {
        opacity: 1;
        transform: translate(0, 0) scale(1) rotateX(var(--rotateX-start)) rotateY(var(--rotateY-start)) translateZ(var(--translateZ-start));
    }
    50% {
        opacity: 1;
        transform: translate(var(--x-move), var(--y-move)) scale(1.5) rotateX(calc(var(--rotateX-end) / 2)) rotateY(calc(var(--rotateY-end) / 2)) translateZ(calc(var(--translateZ-end) / 2));
    }
    100% {
        opacity: 1;
        transform: translate(var(--x-move-end), 100vh) scale(1) rotateX(var(--rotateX-end)) rotateY(var(--rotateY-end)) translateZ(var(--translateZ-end));
    }
  }

  @keyframes confetti-explode-emoji {
    0% {
      opacity: 1;
      transform: translate(0, 0) rotate(0deg) scale(1);
    }
    50% {
      opacity: 1;
      transform: translate(var(--x-move), var(--y-move)) rotate(var(--rotate-middle))  scale(3);
    }
    100% {
      opacity: 1;
      transform: translate(var(--x-move-end), 100vh) rotate(-90deg) scale(1);
    }
  }

  .emoji {
    position: fixed;
    display: none;
    z-index: 300;
    left: 20%;
    bottom: 40%;
    transform: translate(-50%, 0);
  }

  dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: transparent !important;/* Set to transparent */
    border: none !important; /* Remove any default border */
    z-index: 2;
    display: block; /* Ensure the dialog is shown */
    overflow: hidden;
  }

  dialog[open]::backdrop {
    background-color: transparent;
  }

  dialog:focus-visible {
    outline: none
  }
`
document.head.appendChild(style)

chrome.storage.sync.get('isExtensionOn', (data) => {
  if (data.isExtensionOn) {
    enableOverlay()
  }
})

chrome.storage.onChanged.addListener((changes) => {
  if (changes.isExtensionOn) {
    if (changes.isExtensionOn.newValue) {
      enableOverlay()
    } else {
      disableOverlay()
    }
  }
})

function enableOverlay() {
  document.addEventListener('keydown', handleKeydown)
}

function disableOverlay() {
  document.removeEventListener('keydown', handleKeydown)
}

function handleKeydown(event) {
  if (event.key === 'Enter') {
    // Create the dialog
    const dialog = document.createElement('dialog')
    document.body.appendChild(dialog)

    // Calculate viewport dimensions
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Function to create a single confetti element
    function createConfetti() {
      const confetti = document.createElement('div')
      confetti.classList.add('confetti')

      const randomRotateXStart = Math.random() * 360 + 'deg'
      const randomRotateYStart = Math.random() * 360 + 'deg'
      const randomRotateZStart = Math.random() * 360 + 'deg'
      const randomRotateXEnd = Math.random() * 360 + 'deg'
      const randomRotateYEnd = Math.random() * 360 + 'deg'
      const randomRotateZEnd = Math.random() * 360 + 'deg'
      const randomTranslateZStart = Math.random() * 100 + 'px'
      const randomTranslateZEnd = Math.random() * 500 + 'px'

      // Start position: center of the viewport
      const startX = viewportWidth / 2
      const startY = viewportHeight / 2

      // Random end positions within the viewport
      const xMove = Math.random() * viewportWidth - viewportWidth / 2
      const yMove = Math.random() * viewportHeight - viewportHeight / 2
      const xMoveEnd = Math.random() * viewportWidth - viewportWidth / 2
      const yMoveEnd = Math.random() * viewportHeight - viewportHeight / 2
      const dimensions = Math.floor(Math.random() * 21) + 30

      confetti.style.left = `${startX}px`
      confetti.style.top = `${startY}px`
      confetti.style.setProperty('--x-move', `${xMove}px`)
      confetti.style.setProperty('--y-move', `${yMove}px`)
      confetti.style.setProperty('--x-move-end', `${xMoveEnd}px`)
      confetti.style.setProperty('--y-move-end', `${yMoveEnd}px`)
      confetti.style.setProperty('width', `${dimensions}px`)
      confetti.style.setProperty('height', `${dimensions}px`)
      confetti.style.setProperty('--rotateX-start', randomRotateXStart)
      confetti.style.setProperty('--rotateY-start', randomRotateYStart)
      confetti.style.setProperty('--rotateZ-start', randomRotateZStart)
      confetti.style.setProperty('--rotateX-end', randomRotateXEnd)
      confetti.style.setProperty('--rotateY-end', randomRotateYEnd)
      confetti.style.setProperty('--rotateZ-end', randomRotateZEnd)
      confetti.style.setProperty('--translateZ-start', randomTranslateZStart)
      confetti.style.setProperty('--translateZ-end', randomTranslateZEnd)

      const emoji = addEmoji()
      if (emoji) {
        const randomRotateMiddle = Math.random() * -60 + 'deg'

        confetti.classList.add('emoji-confetti')
        confetti.style.setProperty('--rotate-middle', randomRotateMiddle)
        confetti.innerHTML = emoji
        console.log('HERE', confetti)
      } else {
        confetti.style.backgroundColor = getRandomColor()
      }

      dialog.appendChild(confetti)
    }

    // Create multiple confetti elements
    for (let i = 0; i < 300; i++) {
      createConfetti()
    }

    function addEmoji() {
      const shouldAddEmoji = Math.random() < 1 / 7
      return shouldAddEmoji ? '🥳' : ''
    }

    function getRandomColor() {
      const colors = [
        '#ff0',
        '#0f0',
        '#00f',
        '#f00',
        '#0ff',
        '#f0f',
        '#ffa500',
        '#800080',
        '#ffd700', // Gold
      ]
      return colors[Math.floor(Math.random() * colors.length)]
    }

    // Show the dialog
    dialog.showModal()

    // Close the dialog and remove it from the DOM after 4 seconds
    setTimeout(() => {
      dialog.close()
      document.body.removeChild(dialog)

      // Trigger the button's click event
      event.target.click()
    }, 4000)
  }
}
