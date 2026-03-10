// ============================================================
// Hero 3D Tilt - Mouse tracking for avatar card
// ============================================================

(function () {
    const container = document.getElementById('avatarContainer');
    if (!container) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    const TILT_MAX = 15; // Max degrees of tilt
    const hero = document.querySelector('.hero');

    // Mouse tracking on the hero section
    document.addEventListener('mousemove', (e) => {
        // Get mouse position relative to center of viewport
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const relX = (e.clientX - centerX) / centerX; // -1 to +1
        const relY = (e.clientY - centerY) / centerY; // -1 to +1

        targetX = relY * TILT_MAX;   // rotateX (up/down tilt)
        targetY = -relX * TILT_MAX;  // rotateY (left/right tilt)
    });

    // Reset on mouse leave
    document.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
    });

    // Smooth lerp animation loop
    function lerp(a, b, t) { return a + (b - a) * t; }

    function animateTilt() {
        // Smoothly interpolate current to target
        currentX = lerp(currentX, targetX, 0.08);
        currentY = lerp(currentY, targetY, 0.08);

        // Apply the transform — combine with float animation via CSS vars
        container.style.transform =
            `perspective(1000px) rotateX(${currentX}deg) rotateY(${currentY}deg)`;

        requestAnimationFrame(animateTilt);
    }

    animateTilt();

    // Mobile: gyroscope tilt
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e) => {
            if (e.beta !== null && e.gamma !== null) {
                const gX = Math.max(-TILT_MAX, Math.min(TILT_MAX, e.beta * 0.3));
                const gY = Math.max(-TILT_MAX, Math.min(TILT_MAX, e.gamma * 0.3));
                targetX = gX;
                targetY = gY;
            }
        });
    }
})();
