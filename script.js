 function toggleTheme() { document.body.classList.toggle('dark-mode'); }
    function toggleMenu() {
      const navLinks = document.querySelector('.nav-links');
      const overlay = document.querySelector('.overlay');
      const isOpen = navLinks.classList.toggle('show');
      overlay.style.display = isOpen ? 'block' : 'none';
    }
    function scrollToTop(){ window.scrollTo({ top: 0, behavior: 'smooth' }); }
    const backBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
      const show = window.scrollY > 300;
      backBtn.classList.toggle('show', show);
    });

    // 3D Tilt Effect for Cards
const cards = document.querySelectorAll('.tilt-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});
