// Space Scroll Animations using GSAP + ScrollTrigger

document.addEventListener("DOMContentLoaded", () => {
    // Check if GSAP is loaded
    if (typeof gsap === "undefined") {
        console.warn("GSAP not found. Space animations will not run.");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // 1. Interactive Star Parallax
    // Moves star layers at different speeds to create 3D depth
    gsap.to(".stars-far", {
        yPercent: -20, // Moves slowly
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        }
    });

    gsap.to(".stars-mid", {
        yPercent: -50, // Moves medium speed
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        }
    });

    gsap.to(".stars-near", {
        yPercent: -80, // Moves fast (feels closer)
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        }
    });

    // 2. Hero Section "Blast Off" Effect
    // Text fades out and scales down as you scroll away
    const heroContent = document.querySelector(".hero-content");
    if (heroContent) {
        gsap.to(heroContent, {
            opacity: 0,
            scale: 0.8,
            y: 100,
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }

    // 3. Section Reveal Animations
    // Text slides up and fades in
    const sections = document.querySelectorAll("section:not(.hero)");
    sections.forEach(section => {
        const heading = section.querySelector(".section-title");
        const content = section.querySelector(".container");

        if (heading) {
            gsap.fromTo(heading,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%", // Triggers when top of section hits 80% viewport height
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }
    });

    // 4. Project Cards Stagger
    // Cards fly in one by one
    const projectCards = document.querySelectorAll(".project-card");
    if (projectCards.length > 0) {
        gsap.fromTo(projectCards,
            { opacity: 0, y: 100 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.2, // 0.2s delay between each card
                ease: "power2.out",
                scrollTrigger: {
                    trigger: "#projects",
                    start: "top 70%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }

    // 5. Skill Bars Fill
    // Replaces the IntersectionObserver logic with GSAP for smoother animation
    const skillBars = document.querySelectorAll(".skill-bar-fill");
    skillBars.forEach(bar => {
        const width = bar.getAttribute("data-width");
        gsap.fromTo(bar,
            { width: "0%" },
            {
                width: width + "%",
                duration: 1.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: bar,
                    start: "top 85%"
                }
            }
        );
    });
});
