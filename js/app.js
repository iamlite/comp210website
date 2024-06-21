// Typewriter Effect
const typewriter = new Typewriter("#typewriter-text", { loop: false, delay: 75 });
typewriter.typeString("A very well made, A+ material, website for COMP210").start();

// Confetti Effect
function launchConfetti(event) {
  const x = event.clientX / window.innerWidth;
  const y = event.clientY / window.innerHeight;
  confetti({
    particleCount: 500,
    spread: 360,
    origin: { x: x, y: y },
    gravity: 0,
    drift: -1,
    scalar: 0.2,
    angle: 0,
    startVelocity: 20,
  });
}
document.addEventListener("click", launchConfetti);

// Function to update menu links dynamically
function updateMenuLinks(currentPage) {
  const links = document.querySelectorAll("#links a");
  const homeLink = document.getElementById("home-link");
  const tl = gsap.timeline();

  links.forEach(link => {
    if (link.getAttribute("href").includes(currentPage)) {
      link.style.opacity = 0;
      link.classList.add("hidden");
    } else {
      link.classList.remove("hidden");
      tl.fromTo(link, { opacity: 0 }, { opacity: 1, duration: 0.5 });
    }
  });

  homeLink.classList.toggle("hidden", currentPage === "index");
}

// Content and animation management when clicking links
document.querySelectorAll("#links a").forEach(link => {
  link.addEventListener('click', async (event) => {
    event.preventDefault();
    const url = event.target.href;
    const currentPage = url.split('/').pop().split('.').shift();
    const menuWrapper = document.getElementById("menu-wrapper");
    const contentDiv = document.getElementById("content");
    const typerDiv = document.getElementById("typer");

    console.log("Navigating to:", currentPage);

    if (currentPage === 'index') {
      resetToHome();
    } else {
      gsap.to([menuWrapper, contentDiv], { opacity: 0, duration: 0.5, onComplete: async () => {
        const response = await fetch(url);
        const text = await response.text();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text;
        const newContent = tempDiv.querySelector('#content').innerHTML;

        contentDiv.innerHTML = newContent;
        contentDiv.classList.add('h-full');
        updateMenuLinks(currentPage);

        if (currentPage === 'terms') {
          loadTermsContent();
        }

        if (currentPage === 'trends') {
          const carouselItems = document.querySelectorAll('.carousel-item');
          carouselItems.forEach((item, index) => {
            item.style.display = index === 0 ? 'flex' : 'none';
          });

          document.querySelectorAll('.join a').forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              carouselItems.forEach(item => item.style.display = 'none');
              document.querySelector(btn.getAttribute('href')).style.display = 'flex';
            });
          });
        }

        if (currentPage === 'concepts') {
          const carouselItems = document.querySelectorAll('.carousel-item');
          carouselItems.forEach((item, index) => {
            item.style.display = index === 0 ? 'flex' : 'none';
          });

          document.querySelectorAll('.join a').forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              carouselItems.forEach(item => item.style.display = 'none');
              document.querySelector(btn.getAttribute('href')).style.display = 'flex';
            });
          });
        }

        gsap.to([menuWrapper, contentDiv], { opacity: 1, duration: 0.5 });
        typerDiv.classList.add('hidden');
        document.getElementById("main-container").classList.add('justify-start');
        document.getElementById("main-container").classList.remove('justify-center');
      }});
    }
  });
});

// Reset to home function
function resetToHome() {
  const contentDiv = document.getElementById('content');
  const typerDiv = document.getElementById("typer");
  const menuWrapper = document.getElementById("menu-wrapper");

  contentDiv.innerHTML = ''; 
  contentDiv.classList.remove('h-full');

  updateMenuLinks('index');

  typerDiv.classList.remove('hidden');
  gsap.to(typerDiv, { opacity: 1, duration: 0.5 });
  gsap.to(menuWrapper, { justifyContent: "center", opacity: 1, duration: 1 });
  document.getElementById("main-container").classList.add('justify-center');
  document.getElementById("main-container").classList.remove('justify-start');
}

// Theme switcher with GSAP
document.getElementById("theme-controller").addEventListener("change", () => {
  gsap.to("body", {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      document.documentElement.setAttribute(
        "data-theme",
        document.getElementById("theme-controller").checked ? "dark" : "pastel"
      );
      gsap.to("body", { opacity: 1, duration: 0.5 });
    },
  });
});

// Load terms content dynamically with pagination
async function loadTermsContent(page = 1, termsPerPage = 9) {
  try {
    const response = await fetch('terms.json');
    const terms = await response.json();
    if (!Array.isArray(terms)) throw new Error('The JSON data is not an array');

    const termsContainer = document.querySelector('#terms-container');
    const paginationContainer = document.querySelector('#pagination');
    termsContainer.innerHTML = '';
    const totalTerms = terms.length;
    const totalPages = Math.ceil(totalTerms / termsPerPage);
    const start = (page - 1) * termsPerPage;
    const end = start + termsPerPage;
    const paginatedTerms = terms.slice(start, end);

    paginatedTerms.forEach(term => {
      const termElement = document.createElement('div');
      termElement.classList.add('m-4');
      termElement.innerHTML = `
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">${term.number}. ${term.term}</h2>
            <p class="text-xs">${term.definition}</p>
          </div>
        </div>`;
      termsContainer.appendChild(termElement);
    });

    paginationContainer.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.classList.add('join-item', 'btn');
      button.innerText = i;
      button.classList.toggle('btn-active', i === page);
      button.addEventListener('click', () => loadTermsContent(i, termsPerPage));
      paginationContainer.appendChild(button);
    }
  } catch (error) {
    console.error('Failed to load terms:', error);
    document.querySelector('#terms-container').innerHTML = '<p>Failed to load terms. Please try again later.</p>';
  }
}

// Ensure the correct handling of the home link separately
document.getElementById('home-link').addEventListener('click', (event) => {
  event.preventDefault();
  resetToHome();
});

// This ensures that the initial state is set correctly when the document is loaded
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop().split(".").shift();
  console.log("Current Page on Load:", currentPage);
  updateMenuLinks(currentPage);
  if (currentPage === "index") {
    resetToHome();
  }
});