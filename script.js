const API_BASE_URL = "https://birthday-backend-yvlv.onrender.com"; // Your Render backend URL

window.onload = function () {
  var duration = 3 * 1000; // Confetti will last for 3 seconds
  var end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 10, // Number of particles per frame
      spread: 160, // Spread wider to cover full screen
      startVelocity: 50, // Faster confetti explosion
      origin: {
        x: Math.random(), // Random horizontal position
        y: Math.random() - 0.2, // Random vertical position, starting higher
      },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};

document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("bg-music");

    // Restore previous playback time (if available)
    const savedTime = localStorage.getItem("music-time");
    if (savedTime !== null) {
        audio.currentTime = parseFloat(savedTime);
    }

    // Try playing the music automatically
    function tryPlayMusic() {
        audio.play().catch(() => {
            console.log("Autoplay blocked! Click anywhere to start the music.");
        });
    }

    // Save playback time when the user leaves the page
    window.addEventListener("beforeunload", function () {
        localStorage.setItem("music-time", audio.currentTime);
    });

    // First attempt to play music
    tryPlayMusic();

    // Ensure clicking anywhere starts the music if blocked
    document.addEventListener("click", function () {
        audio.play();
    }, { once: true }); // Runs only once
});

function scrollToSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
}

document
  .getElementById("wishForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const message = document.getElementById("message").value;

    fetch(`${API_BASE_URL}/submit-wish`, { // Use the Render backend URL here
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          loadWishes();
          document.getElementById("wishForm").reset();
          scrollToSection("messages");
        }
      })
      .catch((error) => console.error("Error:", error));
  });

function loadWishes() {
  fetch(`${API_BASE_URL}/get-wishes`) // Use the Render backend URL here
    .then((response) => response.json())
    .then((data) => {
      const wishesContainer = document.getElementById("wishes");
      wishesContainer.innerHTML = "";
      data.forEach((wish) => {
        const wishElement = document.createElement("div");
        wishElement.innerHTML = `<strong>From ${wish.name}:</strong> ${wish.message}`;
        wishesContainer.appendChild(wishElement);
      });
    })
    .catch((error) => console.error("Error:", error));
}

// Load wishes when the page loads
loadWishes();
