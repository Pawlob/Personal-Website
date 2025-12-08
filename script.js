/* --- script.js --- */

// 1. RENDER FUNCTION (Called directly by index.html when data arrives)
window.renderProjects = function(projects) {
    const container = document.querySelector('.projects-grid');
    if(!container) return; 

    container.innerHTML = ''; // Clear "Loading..." text
    
    // Handle empty data
    if (!projects || projects.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: #ccc; padding: 40px;">
                <i class="fas fa-folder-open" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                <p>No projects found in the database.</p>
                <a href="cms.html" target="_blank" style="color: #f4a261; text-decoration: underline;">Go to Admin CMS to add one</a>
            </div>
        `;
        return;
    }

    // Render Cards
    projects.forEach(proj => {
        const card = document.createElement('a');
        card.href = proj.link || '#';
        // Only open in new tab if it's a real link
        if(proj.link && proj.link.length > 1 && proj.link !== '#') {
            card.target = '_blank';
        }
        
        card.className = 'project-card tilt-card'; 
        card.setAttribute('data-category', proj.category); 
        
        // Add show class immediately for animation
        card.classList.add('show');

        // Handle missing fields gracefully
        const title = proj.title || 'Untitled Project';
        // Note: Field name is 'description' in Firestore, not 'desc'
        const desc = proj.description || proj.desc || 'No description provided.';
        const img = proj.img || 'https://via.placeholder.com/600x400/013328/ede9d6?text=No+Image';

        card.innerHTML = `
            <img alt="${title}" src="${img}" onerror="this.src='https://placehold.co/600x400/013328/ede9d6?text=Image+Error'"/>
            <h3>${title}</h3>
            <p>${desc}</p>
        `;
        container.appendChild(card);
    });

    // Re-initialize 3D Tilt Effect
    initTilt();
    
    // Re-apply current filter if one was selected
    const activeBtn = document.querySelector('.filter-btn.active');
    if(activeBtn) {
        let filterCat = 'all';
        const txt = activeBtn.innerText.toLowerCase();
        if(txt.includes('arch')) filterCat = 'arch';
        if(txt.includes('dev')) filterCat = 'dev';
        filterProjects(filterCat);
    }
};

// 2. FILTER LOGIC
function filterProjects(category) {
    const cards = document.querySelectorAll('.project-card');
    const buttons = document.querySelectorAll('.filter-btn');

    // Update buttons
    buttons.forEach(btn => {
        btn.classList.remove('active');
        const btnText = btn.innerText.toLowerCase();
        // Simple matching logic
        if (category === 'all' && btnText.includes('all')) btn.classList.add('active');
        else if (category === 'arch' && btnText.includes('arch')) btn.classList.add('active');
        else if (category === 'dev' && btnText.includes('dev')) btn.classList.add('active');
    });

    // Update cards with animation
    cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
            card.style.display = 'block';
            // Small delay to allow display:block to apply before opacity transition
            setTimeout(() => card.style.opacity = '1', 10);
        } else {
            card.style.opacity = '0';
            setTimeout(() => card.style.display = 'none', 300); // Wait for fade out
        }
    });
}
// Expose to window so HTML buttons can call it
window.filterProjects = filterProjects;

// 3. UI EFFECTS (Tilt, Scroll, Menu)
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
        card.addEventListener('mouseleave', () => { 
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'; 
        });
    });
}

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.overlay');
    if(!navLinks || !overlay) return;
    
    const isOpen = navLinks.classList.contains('show');
    if(isOpen) {
        navLinks.classList.remove('show');
        overlay.style.display = 'none';
    } else {
        navLinks.classList.add('show');
        overlay.style.display = 'block';
    }
}
window.toggleMenu = toggleMenu;

function scrollToTop(){ 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
}
window.scrollToTop = scrollToTop;

// Event Listeners for Static UI
document.addEventListener('DOMContentLoaded', () => {
    // Back to top button
    const backBtn = document.getElementById('backToTop');
    if(backBtn) {
        window.addEventListener('scroll', () => { 
            window.scrollY > 300 ? backBtn.classList.add('show') : backBtn.classList.remove('show'); 
        });
    }
    
    // Skills Animation
    const skillSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.progress-bar-fill');
    let animated = false;
    
    if(skillSection) {
        window.addEventListener('scroll', () => {
            if(!animated && skillSection.getBoundingClientRect().top < window.innerHeight / 1.3) {
                progressBars.forEach(bar => { 
                    const w = bar.style.width; 
                    bar.style.width = '0'; 
                    setTimeout(() => bar.style.width = w, 100); 
                });
                animated = true;
            }
        });
    }
});
