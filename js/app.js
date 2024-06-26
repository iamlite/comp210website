const typewriter = new Typewriter("#typewriter-text", {
  loop: false,
  delay: 75,
  deleteSpeed: 50,
});

typewriter
  .typeString("Welcome to the ultimate guide on ...")
  .pauseFor(500)
  .deleteChars(3)
  .typeString("<strong>trendy tech terms</strong>")
  .pauseFor(1000)
  .deleteAll()
  .typeString("Unravel the mysteries of modern concepts...")
  .pauseFor(500)
  .deleteChars(18)
  .typeString("futuristic trends.")
  .pauseFor(1000)
  .deleteAll()
  .typeString("Brace yourself for knowledge.")
  .pauseFor(1000)
  .deleteAll()
  .typeString("Ready to dive in?")
  .pauseFor(500)
  .typeString(" <strong>Let's go!</strong>")
  .pauseFor(1000)
  .start();


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
  console.log("Updating links for currentPage:", currentPage);
  const links = document.querySelectorAll("#links a");
  const homeLink = document.getElementById("home-link");
  const tl = gsap.timeline();

  links.forEach(link => {
    const linkHref = link.getAttribute("href").split('/').pop().split('.').shift();
    console.log("Link Href:", linkHref);
    if (linkHref === currentPage) {
      link.style.opacity = 0;
      link.classList.add("hidden");
    } else {
      link.classList.remove("hidden");
      tl.fromTo(link, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    }
  });

  homeLink.classList.toggle("hidden", currentPage === "index");
}

// Content and animation management when clicking links
document.querySelectorAll("#links a").forEach(link => {
  link.addEventListener('click', async (event) => {
    event.preventDefault();
    const url = new URL(event.target.href);
    const currentPage = url.pathname.split('/').pop().split('.').shift();
    const menuWrapper = document.getElementById("menu-wrapper");
    const contentDiv = document.getElementById("content");
    const typerDiv = document.getElementById("typer");

    console.log("Navigating to:", currentPage);

    if (currentPage === 'index') {
      resetToHome();
    } else {
      gsap.to([menuWrapper, contentDiv], { opacity: 0, duration: 0.5, onComplete: async () => {
        const response = await fetch(url.pathname);
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
  gsap.to(typerDiv, { opacity: 1, duration: 0.3 });
  gsap.to(menuWrapper, { justifyContent: "center", opacity: 1, duration: 1 });
  document.getElementById("main-container").classList.add('justify-center');
  document.getElementById("main-container").classList.remove('justify-start');
}

// Theme switcher with GSAP
const innerBody = document.getElementById("inner-body");
const themeController = document.getElementById("theme-controller");

// Function to apply theme
function applyTheme(theme) {
    innerBody.setAttribute("data-theme", theme);
    themeController.checked = (theme === "dark");
    gsap.to(innerBody, { opacity: 1, duration: 0.3 });
}

// Event listener for theme change
themeController.addEventListener("change", () => {
    const newTheme = themeController.checked ? "dark" : "pastel";
    
    // Save the theme choice to localStorage
    localStorage.setItem("theme", newTheme);
    
    // Animate and change theme
    gsap.to(innerBody, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => applyTheme(newTheme)
    });
});

// Check for saved theme in localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "pastel"; // Default to 'pastel' if nothing is saved
    applyTheme(savedTheme);
});


// Load terms content dynamically with pagination
async function loadTermsContent(page = 1, termsPerPage = 6) {
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
      <div class="card shadow-md flex flex-col min-h-[300px] bg-base-200">
          <div class="card-body flex flex-col h-full">
              <h2 class="card-title">${term.number}. ${term.term}</h2>
              <div class="flex-grow"></div>
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
  const currentPage = window.location.pathname.split("/").pop().split(".").shift() || "index";
  console.log("Current Page on Load:", currentPage);
  updateMenuLinks(currentPage);
  if (currentPage === "index") {
    resetToHome();
  }
});


