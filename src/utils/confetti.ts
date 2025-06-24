export const createConfetti = (element: HTMLElement) => {
  const colors = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];
  const confettiCount = 30;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'absolute';
    confetti.style.width = '6px';
    confetti.style.height = '6px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    
    const rect = element.getBoundingClientRect();
    confetti.style.left = (rect.left + rect.width / 2) + 'px';
    confetti.style.top = (rect.top + rect.height / 2) + 'px';
    
    document.body.appendChild(confetti);
    
    // Animation
    const angle = (Math.PI * 2 * i) / confettiCount;
    const velocity = 50 + Math.random() * 50;
    let vx = Math.cos(angle) * velocity;
    let vy = Math.sin(angle) * velocity - 100;
    
    let x = 0;
    let y = 0;
    let opacity = 1;
    
    const animate = () => {
      x += vx * 0.02;
      y += vy * 0.02;
      vy += 3; // gravity
      opacity -= 0.02;
      
      confetti.style.transform = `translate(${x}px, ${y}px)`;
      confetti.style.opacity = opacity.toString();
      
      if (opacity > 0) {
        requestAnimationFrame(animate);
      } else {
        document.body.removeChild(confetti);
      }
    };
    
    requestAnimationFrame(animate);
  }
};