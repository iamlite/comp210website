// Typewriter Effect
const typewriter = new Typewriter('#typewriter-text', {
  loop: false,
  delay: 75,
});

typewriter
  .typeString('A very well made, A+ material, website for COMP210')
  .start();

// Confetti Effect
function launchConfetti() {
  confetti({
    particleCount: 500,
    spread: 360,
    origin: { z: 1 },
    gravity: 0.05,
    drift: -1,
    angle: 0,
  });
}
