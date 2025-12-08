/* --- script.js --- */

/* 1. LOAD PROJECTS FROM CMS (Local Storage) */
const STORAGE_KEY = 'pawlos_portfolio_projects';
const defaultProjects = [
    { title: "Modern Villa", category: "arch", img: "photo_5_2025-11-10_15-23-30.jpg", desc: "A luxurious villa design emphasizing open spaces.", link: "project-villa.html" },
    { title: "Urban Complex", category: "arch", img: "dd15655392.png", desc: "Mixed-use development combining residential units.", link: "project-urban.html" },
    { title: "Portfolio V1", category: "dev", img: "web-project-1.jpg", desc: "Responsive personal portfolio with 3D animations.", link: "#" }
];

function renderProjects() {
    const container = document.querySelector('.projects-grid');
    if(!container) return; // Stop if we aren't on the main page

    // Get data or use default
    const storedData = localStorage.getItem(STORAGE_KEY);
    const projects = storedData ? JSON.parse(storedData) : defaultProjects;

    container.innerHTML = ''; // Clear existing hardcoded HTML

    projects.forEach(proj => {
        const card = document.createElement('a');
        card.href = proj.link;
        card.className = 'project-card tilt-card'; // Add tilt class
        card.setAttribute('data-category', proj.category); // For filtering
        
        // Add animation class for filter
        card.classList.add('show');

        card.innerHTML = `
            <img alt="${proj.title}" src="${proj.img}" onerror="this.src='https://placehold.co/600x400/013328/ede9d6?text=Project'"/>
            <h3>${proj.title}</h3>
            <p>${proj.desc}</p>
        `;
        container.appendChild(card);
    });

    // Re-initialize Tilt Effect on new cards
    initTilt();
}

/* 2. FILTER FUNCTION */
function filterProjects(category) {
    const cards = document.querySelectorAll('.project-card');
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase().includes(category === 'arch' ? 'architecture' : category === 'dev' ? 'development' : 'all')) {
            btn.classList.add('active');
        }
    });

    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            setTimeout(() => card.style.opacity = '1', 50);
        } else {
            card.style.display = 'none';
            card.style.opacity = '0';
        }
    });
}

/* 3. TILT EFFECT & UTILS */
function initTilt() {
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10; 
            const rotateY = ((x - centerX) / centerX) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'; });
    });
}

// Run on load
document.addEventListener('DOMContentLoaded', () => {
    renderProjects(); // Render from storage
    
    // Existing Scroll Logic
    const backBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => { 
        if(backBtn) window.scrollY > 300 ? backBtn.classList.add('show') : backBtn.classList.remove('show'); 
    });
    
    // Existing Skills Animation
    const skillSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.progress-bar-fill');
    let animated = false;
    window.addEventListener('scroll', () => {
        if(skillSection && skillSection.getBoundingClientRect().top < window.innerHeight / 1.3 && !animated) {
            progressBars.forEach(bar => { const w = bar.style.width; bar.style.width = '0'; setTimeout(() => bar.style.width = w, 100); });
            animated = true;
        }
    });
});

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.overlay');
    const isOpen = navLinks.classList.contains('show');
    isOpen ? (navLinks.classList.remove('show'), overlay.style.display = 'none') : (navLinks.classList.add('show'), overlay.style.display = 'block');
}

function scrollToTop(){ window.scrollTo({ top: 0, behavior: 'smooth' }); }
