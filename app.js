/* ==========================================================================
   INTERACTIVE ENGINE // PORTFOLIO v3.0
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

    // 2. Local Time Display
    const updateTime = () => {
        const timeDisplay = document.getElementById("time-display");
        if (timeDisplay) {
            const now = new Date();
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, "0");
            const seconds = String(now.getSeconds()).padStart(2, "0");
            const ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            const formattedHours = String(hours).padStart(2, "0");
            timeDisplay.textContent = `${formattedHours}:${minutes}:${seconds} ${ampm}`;
        }
    };
    setInterval(updateTime, 1000);
    updateTime();

    // 3. Custom Cursor Mechanics
    const cursorDot = document.getElementById("custom-cursor");
    const cursorRing = document.getElementById("custom-cursor-ring");
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = window.innerWidth / 2;
    let ringY = window.innerHeight / 2;
    
    let isHovering = false;
    let isViewing = false;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate position for center dot
        gsap.to(cursorDot, {
            x: mouseX,
            y: mouseY,
            duration: 0.05,
            overwrite: "auto"
        });

        // Set global variables for interactive grid background spotlight
        document.documentElement.style.setProperty("--global-mouse-x", `${mouseX}px`);
        document.documentElement.style.setProperty("--global-mouse-y", `${mouseY}px`);
    });

    // Inertial lag rendering loop for outer ring
    const renderCursorRing = () => {
        const dx = mouseX - ringX;
        const dy = mouseY - ringY;
        ringX += dx * 0.12; // Lags the mouse position by 88%
        ringY += dy * 0.12;

        gsap.set(cursorRing, {
            x: ringX,
            y: ringY
        });
        
        requestAnimationFrame(renderCursorRing);
    };
    renderCursorRing();

    // Hover modifiers
    const hoverTargets = document.querySelectorAll("a:not(.cursor-view), button, .nav-toggle, .hero-scroll-indicator, .status-item");
    hoverTargets.forEach((target) => {
        target.addEventListener("mouseenter", () => {
            document.body.classList.add("cursor-hover");
        });
        target.addEventListener("mouseleave", () => {
            document.body.classList.remove("cursor-hover");
        });
    });

    const viewTargets = document.querySelectorAll(".cursor-view");
    viewTargets.forEach((target) => {
        target.addEventListener("mouseenter", () => {
            document.body.classList.add("cursor-view");
        });
        target.addEventListener("mouseleave", () => {
            document.body.classList.remove("cursor-view");
        });
    });

    // 4. Preloader System
    const loaderPercentage = document.getElementById("loader-percentage");
    const loaderFill = document.getElementById("loader-fill");
    const loaderKeyword = document.getElementById("loader-keyword");
    const preloader = document.getElementById("preloader");
    
    let count = 0;
    let currentKeyword = "optimising";

    const countInterval = setInterval(() => {
        count += Math.floor(Math.random() * 4) + 1;
        if (count >= 100) {
            count = 100;
            clearInterval(countInterval);
            
            // Trigger preloader close reveal
            setTimeout(() => {
                closeLoader();
            }, 600);
        }
        
        // Progress-based keyword thresholds
        let nextKeyword = "optimising";
        if (count >= 35 && count < 75) {
            nextKeyword = "loading animation";
        } else if (count >= 75) {
            nextKeyword = "welcome";
        }

        // Animate keyword changes smoothly
        if (loaderKeyword && nextKeyword !== currentKeyword) {
            currentKeyword = nextKeyword;
            gsap.to(loaderKeyword, {
                opacity: 0,
                duration: 0.18,
                onComplete: () => {
                    loaderKeyword.textContent = currentKeyword;
                    gsap.to(loaderKeyword, { opacity: 1, duration: 0.18 });
                }
            });
        }

        if (loaderPercentage) {
            loaderPercentage.textContent = String(count).padStart(2, "0");
        }
        if (loaderFill) {
            loaderFill.style.width = `${count}%`;
        }
    }, 50);

    const closeLoader = () => {
        // Futuristic content power-down sequence
        gsap.timeline()
            .to(".loader-content", {
                opacity: 0,
                y: -40,
                scale: 0.94,
                filter: "blur(12px)",
                duration: 0.65,
                ease: "power3.in"
            })
            .to(preloader, {
                clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
                duration: 1.1,
                ease: "power4.inOut",
                onComplete: () => {
                    preloader.style.display = "none";
                    initializePageAnimations();
                }
            }, "-=0.35");
    };

    // 5. Page Animation Controller
    const initializePageAnimations = () => {
        // Register ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Smooth Scroll (Lenis) initialization
        const lenis = new Lenis({
            duration: 1.3,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
            wheelMultiplier: 1.1,
            smoothWheel: true,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Connect Lenis with ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        // Split hero title lines into individual characters for high-end interactivity
        const heroLines = document.querySelectorAll(".hero-line");
        heroLines.forEach(line => {
            const text = line.textContent.trim();
            line.innerHTML = text.split("").map(char => `<span class="hero-char">${char}</span>`).join("");
        });

        // A. Hero Reveal Timeline (Calm & Luxurious Slow Reveal)
        const heroTl = gsap.timeline();
        heroTl.from(".logo", {
            y: -40,
            opacity: 0,
            duration: 1.5,
            ease: "power3.out"
        })
        .from(".status-indicators", {
            x: 40,
            opacity: 0,
            duration: 1.5,
            ease: "power3.out"
        }, "-=1.2")
        .from(".header-right .local-time", {
            y: -25,
            opacity: 0,
            duration: 1.5,
            ease: "power3.out"
        }, "-=1.2")
        .from(".mac-dock-container", {
            y: 80,
            scale: 0.85,
            opacity: 0,
            duration: 2.0,
            ease: "power3.out"
        }, "-=1.4")
        .from(".hero-tagline", {
            y: 25,
            opacity: 0,
            duration: 1.5,
            ease: "power3.out"
        }, "-=1.2")
        .from(".hero-line", {
            y: 100,
            opacity: 0,
            stagger: 0.22,
            duration: 1.8,
            ease: "power4.out"
        }, "-=1.2")
        .from(".hero-description p, .hero-scroll-indicator", {
            y: 30,
            opacity: 0,
            stagger: 0.18,
            duration: 1.6,
            ease: "power3.out"
        }, "-=1.4");

        // A2. Interactive Hero Title Cursor Proximity Effect
        const heroSection = document.querySelector(".hero-section");
        const heroTitle = document.querySelector(".hero-main-title");
        const chars = document.querySelectorAll(".hero-char");
        
        if (heroSection && heroTitle && chars.length) {
            // Expand cursor ring when hovering over the main title block
            heroTitle.addEventListener("mouseenter", () => {
                document.body.classList.add("cursor-interact");
            });
            heroTitle.addEventListener("mouseleave", () => {
                document.body.classList.remove("cursor-interact");
            });

            // Tracking and spring physics on mouse move
            heroSection.addEventListener("mousemove", (e) => {
                const mX = e.clientX;
                const mY = e.clientY;
                
                chars.forEach(char => {
                    const rect = char.getBoundingClientRect();
                    const cX = rect.left + rect.width / 2;
                    const cY = rect.top + rect.height / 2;
                    
                    const dist = Math.hypot(mX - cX, mY - cY);
                    
                    if (dist < 180) {
                        // Calculate angle and proximity factor
                        const force = (180 - dist) / 180; // 0 to 1
                        const angle = Math.atan2(cY - mY, cX - mX); // angle away from mouse
                        
                        // Push away from mouse
                        const pushDist = force * 24; // max 24px push
                        const moveX = Math.cos(angle) * pushDist;
                        const moveY = Math.sin(angle) * pushDist;
                        
                        gsap.to(char, {
                            x: moveX,
                            y: moveY,
                            scale: 1 + force * 0.35, // up to 1.35x scale
                            rotate: moveX * 0.4, // subtle rotation
                            color: "var(--color-accent)",
                            duration: 0.3,
                            ease: "power2.out",
                            overwrite: "auto"
                        });
                    } else {
                        // Return to normal
                        gsap.to(char, {
                            x: 0,
                            y: 0,
                            scale: 1,
                            rotate: 0,
                            color: "",
                            duration: 0.6,
                            ease: "power3.out",
                            overwrite: "auto"
                        });
                    }
                });
            });
            
            heroSection.addEventListener("mouseleave", () => {
                chars.forEach(char => {
                    gsap.to(char, {
                        x: 0,
                        y: 0,
                        scale: 1,
                        rotate: 0,
                        color: "",
                        duration: 0.8,
                        ease: "elastic.out(1, 0.3)",
                        overwrite: "auto"
                    });
                });
            });
        }

        // B. Scroll Highlight Text (About Section)
        const aboutParagraph = document.querySelector(".about-highlight-paragraph");
        if (aboutParagraph) {
            const words = aboutParagraph.textContent.trim().split(/\s+/);
            aboutParagraph.innerHTML = words.map(w => `<span class="word-span">${w}</span>`).join(" ");
            
            const wordSpans = aboutParagraph.querySelectorAll(".word-span");
            gsap.to(wordSpans, {
                color: "var(--color-text-primary)",
                stagger: 0.05,
                ease: "power1.out",
                scrollTrigger: {
                    trigger: ".about-section",
                    start: "top 70%",
                    end: "bottom 50%",
                    scrub: 0.5,
                }
            });
        }

        // C. Horizontal Scroll Pinning (Projects Section)
        const projectsWrapper = document.getElementById("projects");
        const slider = document.querySelector(".projects-horizontal-slider");
        const titleBlock = document.querySelector(".projects-title-block");
        
        if (projectsWrapper && slider) {
            // Horizontal scrolling calculation
            const getScrollAmount = () => {
                let rWidth = slider.scrollWidth;
                return rWidth - window.innerWidth + titleBlock.offsetWidth + 160;
            };

            gsap.to(slider, {
                x: () => -getScrollAmount(),
                ease: "none",
                scrollTrigger: {
                    trigger: "#projects",
                    pin: true,
                    scrub: 1,
                    start: "top top",
                    end: () => `+=${getScrollAmount()}`,
                    invalidateOnRefresh: true,
                }
            });
        }

        // D. SVG Timeline Path Drawing
        const timelinePath = document.getElementById("timeline-path");
        if (timelinePath) {
            // Force browser to layout SVG to get exact path length
            const pathLength = timelinePath.getTotalLength();
            
            // Set dash arrays
            gsap.set(timelinePath, {
                strokeDasharray: pathLength,
                strokeDashoffset: pathLength
            });

            gsap.to(timelinePath, {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: ".timeline-container",
                    start: "top 40%",
                    end: "bottom 90%",
                    scrub: 1.5,
                }
            });
        }

        // E. "Fit the Spot" Scroll Animations & Staggered Card Formation (Luxurious Slow Transition)
        const bentoGrid = document.querySelector("#bento-skills");
        if (bentoGrid) {
            const bentoCardsList = document.querySelectorAll("#bento-skills .bento-card");
            
            const bentoTl = gsap.timeline({
                scrollTrigger: {
                    trigger: bentoGrid,
                    start: "top 85%", // Trigger early when bento section top enters viewport
                    toggleActions: "play none none none"
                }
            });

            bentoCardsList.forEach((card, index) => {
                let xFrom = 0, yFrom = 0, rotFrom = 0, scaleFrom = 1;
                
                if (index === 0) { xFrom = -200; rotFrom = -10; }
                else if (index === 1) { yFrom = 150; rotFrom = 8; }
                else if (index === 2) { xFrom = 200; rotFrom = 12; }
                else if (index === 3) { xFrom = -150; }
                else if (index === 4) { yFrom = 120; scaleFrom = 0.95; }
                
                // Card slot snaps into spot with a slower duration (1.8s) and higher stagger (0.35s)
                bentoTl.from(card, {
                    x: xFrom,
                    y: yFrom,
                    rotate: rotFrom,
                    scale: scaleFrom,
                    opacity: 0,
                    duration: 1.8,
                    ease: "power3.out"
                }, index * 0.35);
                
                // Card inner details form staggered with a delay (0.6s offset)
                const innerElements = card.querySelectorAll(".bento-icon, .bento-title, .bento-desc, .bento-footer-tags span, .statement-lbl, .statement-text");
                if (innerElements.length) {
                    bentoTl.from(innerElements, {
                        y: 15,
                        opacity: 0,
                        scale: 0.98,
                        stagger: 0.08,
                        duration: 1.0,
                        ease: "power2.out"
                    }, (index * 0.35) + 0.6);
                }
            });
        }


        // About metrics - 3D rotate flip-up and lock in spot
        gsap.from(".about-metric", {
            rotateX: -90,
            y: 80,
            opacity: 0,
            stagger: 0.25,
            duration: 1.2,
            ease: "back.out(1.5)",
            scrollTrigger: {
                trigger: ".about-details",
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });


        // Contact Section - elements come from opposite directions and fit the grid
        gsap.from(".contact-info-block", {
            x: -120,
            opacity: 0,
            duration: 1.4,
            ease: "power4.out",
            scrollTrigger: {
                trigger: ".contact-grid",
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });
        
        gsap.from(".contact-form-block", {
            x: 120,
            opacity: 0,
            duration: 1.4,
            ease: "power4.out",
            scrollTrigger: {
                trigger: ".contact-grid",
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });
    };

    // 6. Bento Grid Glow Interaction
    const bentoCards = document.querySelectorAll(".bento-glow-effect");
    bentoCards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });

    // 7. Magnet Cursor Physics Effect
    const magnets = document.querySelectorAll(".magnet");
    magnets.forEach((el) => {
        el.addEventListener("mousemove", (e) => {
            const rect = el.getBoundingClientRect();
            // Get center point of elements
            const elemX = rect.left + rect.width / 2;
            const elemY = rect.top + rect.height / 2;
            
            // Calculate distance between cursor and element center
            const x = e.clientX - elemX;
            const y = e.clientY - elemY;
            
            // Move item towards the cursor (magnet pull)
            gsap.to(el, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: "power2.out"
            });
            
            // Subtly skew/tilt custom cursor ring for extra physics responsiveness
            if (cursorRing) {
                gsap.to(cursorRing, {
                    scale: 1.15,
                    borderWidth: "1.5px",
                    borderColor: "rgba(255,255,255,0.7)",
                    duration: 0.2
                });
            }
        });
        
        el.addEventListener("mouseleave", () => {
            // Restore magnet position with elegant bounce/elastic back
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: "elastic.out(1, 0.3)"
            });
            
            // Restore custom cursor ring
            if (cursorRing) {
                gsap.to(cursorRing, {
                    scale: 1,
                    borderWidth: "1px",
                    borderColor: "rgba(255,255,255,0.3)",
                    duration: 0.2
                });
            }
        });
    });

    // 8. macOS Dock Magnification & Control
    const dock = document.querySelector(".mac-dock");
    const dockItems = document.querySelectorAll(".dock-item");
    if (dock && dockItems.length) {
        // macOS magnification effect
        dock.addEventListener("mousemove", (e) => {
            const mouseX = e.clientX;
            dockItems.forEach(item => {
                const rect = item.getBoundingClientRect();
                const itemCenter = rect.left + rect.width / 2;
                const distance = Math.abs(mouseX - itemCenter);
                
                // macOS dock style scale logic based on proximity
                let scale = 1;
                if (distance < 160) {
                    scale = 1 + (160 - distance) / 160 * 0.45; // Max scale 1.45
                }
                
                gsap.to(item, {
                    scale: scale,
                    y: (scale - 1) * -12, // Pull up slightly on hover like macOS
                    duration: 0.15,
                    overwrite: "auto"
                });
            });
        });

        dock.addEventListener("mouseleave", () => {
            dockItems.forEach(item => {
                gsap.to(item, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    overwrite: "auto"
                });
            });
        });

        // Active state indicator observer (IntersectionObserver)
        const observerOptions = {
            root: null,
            rootMargin: "-25% 0px -45% 0px", // Trigger when section occupies the main view
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    dockItems.forEach(item => {
                        const href = item.getAttribute("href");
                        if (href === `#${id}`) {
                            item.classList.add("active");
                        } else {
                            item.classList.remove("active");
                        }
                    });
                }
            });
        }, observerOptions);

        document.querySelectorAll("section").forEach(section => {
            observer.observe(section);
        });

        // Scroll shrink logic
        let scrollTimeout;
        window.addEventListener("scroll", () => {
            dock.classList.add("shrunk");
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                dock.classList.remove("shrunk");
            }, 350);
        });
        
        // Add hover listener to dock to trigger cursor modifiers
        dock.addEventListener("mouseenter", () => {
            document.body.classList.add("cursor-hover");
        });
        dock.addEventListener("mouseleave", () => {
            document.body.classList.remove("cursor-hover");
        });
    }

    // 9. Toast System (WiFi & Video interactions)
    const createToast = (title, message, iconType) => {
        const container = document.getElementById("toast-container");
        if (!container) return;
        
        const toast = document.createElement("div");
        toast.className = "toast";
        
        let iconHtml = "";
        if (iconType === "wifi") {
            iconHtml = `<div class="toast-icon wifi-icon"><i data-lucide="wifi-off"></i></div>`;
        } else if (iconType === "video") {
            iconHtml = `<div class="toast-icon video-icon"><i data-lucide="video-off"></i></div>`;
        }
        
        toast.innerHTML = `
            ${iconHtml}
            <div class="toast-content">
                <span class="toast-title">${title}</span>
                <span class="toast-desc">${message}</span>
            </div>
        `;
        
        container.appendChild(toast);
        
        // Re-run lucide on the new element
        if (typeof lucide !== "undefined") {
            lucide.createIcons({
                attrs: {
                    class: 'lucide-icon'
                },
                node: toast
            });
        }
        
        // Remove toast from DOM after animations complete (4.6 seconds)
        setTimeout(() => {
            toast.remove();
        }, 4600);
    };

    const wifiBtn = document.getElementById("wifi-btn");
    if (wifiBtn) {
        wifiBtn.addEventListener("click", (e) => {
            e.preventDefault();
            createToast("SYSTEM: OFFLINE", "No active internet connection. Switched to offline preview database.", "wifi");
        });
    }

    const videoBtn = document.getElementById("video-btn");
    if (videoBtn) {
        videoBtn.addEventListener("click", (e) => {
            e.preventDefault();
            createToast("ACCESS BLOCKED", "Camera device blocked. Camera hardware permissions denied in browser sandbox.", "video");
        });
    }

    // 10. Media Showcase Video Cards & Cinema Modal System
    const mediaPlaylist = [
        { src: "assets/z-900.mp4", num: "01/", hud: "CAM_01 ● 4K 60FPS", title: "KAWASAKI Z900 REEL", desc: "High-octane motorcycle cinematography, speed ramps, and aggressive sound pacing." },
        { src: "assets/peak.mp4", num: "02/", hud: "CAM_02 ● COLOR GRADE", title: "PEAK PERFORMANCE", desc: "Cinematic grading, high dynamic range highlights, and precision motion tracking." },
        { src: "assets/pc.mp4", num: "03/", hud: "CAM_03 ● TECH RIG", title: "BATTLESTATION SETUP", desc: "Minimalist battlestation showcase, ambient lighting design, and industrial hardware cut." },
        { src: "assets/frame 1.mp4", num: "04/", hud: "CAM_04 ● VFX COMP", title: "FRAME FLOW // MOTION", desc: "Seamless transitions, bespoke typography animation, and kinetic visual sequences." },
        { src: "assets/lv_0_20250309094352.mp4", num: "05/", hud: "CAM_05 ● SYNC CUT", title: "DYNAMIC VISUAL REEL I", desc: "High-energy visual pacing, rhythmic beat matching, and modern stylistic color work." },
        { src: "assets/lv_0_20250914170503.mp4", num: "06/", hud: "CAM_06 ● SPEED RAMP", title: "STREET CULTURE CUT", desc: "Urban vibe sequencing, glitch overlays, and quick-cut temporal shifts." },
        { src: "assets/lv_0_20251109005341.mp4", num: "07/", hud: "CAM_07 ● SOUND DESIGN", title: "CINEMATIC SEQUENCE", desc: "Immersive audio landscape with layered foley, sub-bass impacts, and visual storytelling." },
        { src: "assets/lv_0_20251114161400.mp4", num: "08/", hud: "CAM_08 ● MASTER GRADE", title: "VISUAL SHOWCASE 04", desc: "Full-spectrum visual edit blending motion graphics, clean typography, and cinematic flare." }
    ];

    const mediaCards = document.querySelectorAll(".media-card");
    const videoModal = document.getElementById("video-modal");
    const modalVideo = document.getElementById("modal-video-element");
    const modalHud = document.getElementById("modal-video-hud");
    const modalCounter = document.getElementById("modal-video-counter");
    const modalTitle = document.getElementById("modal-video-title");
    const modalDesc = document.getElementById("modal-video-desc");
    const modalPlayOverlay = document.getElementById("modal-play-overlay");
    const modalPlayPauseBtn = document.getElementById("modal-play-pause-btn");
    const modalSoundBtn = document.getElementById("modal-sound-btn");
    const modalSoundIcon = document.getElementById("modal-sound-icon");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modalBackdrop = document.getElementById("video-modal-backdrop");
    const modalPrevBtn = document.getElementById("modal-prev-btn");
    const modalNextBtn = document.getElementById("modal-next-btn");
    const modalProgressWrap = document.getElementById("modal-progress-wrap");
    const modalProgressFill = document.getElementById("modal-progress-fill");
    const modalTimeDisplay = document.getElementById("modal-time-display");
    const modalFullscreenBtn = document.getElementById("modal-fullscreen-btn");

    let currentVideoIndex = 0;

    // Format seconds to mm:ss
    const formatTime = (seconds) => {
        if (isNaN(seconds)) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    // Card Hover: Play preview video softly on hover
    mediaCards.forEach((card) => {
        const video = card.querySelector(".media-card-video");
        if (video) {
            card.addEventListener("mouseenter", () => {
                video.play().catch(() => {});
            });
            card.addEventListener("mouseleave", () => {
                video.pause();
            });
        }

        // Card Click: Open Cinema Video Modal
        card.addEventListener("click", () => {
            const index = parseInt(card.getAttribute("data-index"), 10) || 0;
            openVideoModal(index);
        });
    });

    const loadModalVideo = (index) => {
        if (!modalVideo || !mediaPlaylist[index]) return;
        currentVideoIndex = index;
        const item = mediaPlaylist[index];

        modalVideo.src = item.src;
        if (modalHud) modalHud.textContent = item.hud;
        if (modalCounter) modalCounter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(mediaPlaylist.length).padStart(2, "0")}`;
        if (modalTitle) modalTitle.textContent = item.title;
        if (modalDesc) modalDesc.textContent = item.desc;

        if (modalProgressFill) modalProgressFill.style.width = "0%";
        if (modalTimeDisplay) modalTimeDisplay.textContent = "00:00 / 00:00";

        modalVideo.muted = false;
        if (modalSoundIcon) {
            modalSoundIcon.setAttribute("data-lucide", "volume-2");
            if (typeof lucide !== "undefined") lucide.createIcons();
        }

        modalVideo.play().then(() => {
            if (modalPlayOverlay) modalPlayOverlay.classList.remove("show-play");
            updatePlayIcons(true);
        }).catch(() => {
            // Autoplay with audio was prevented, fallback to muted play
            modalVideo.muted = true;
            if (modalSoundIcon) modalSoundIcon.setAttribute("data-lucide", "volume-x");
            if (typeof lucide !== "undefined") lucide.createIcons();
            modalVideo.play().catch(() => {});
        });
    };

    const updatePlayIcons = (isPlaying) => {
        const subIcon = document.getElementById("modal-sub-play-icon");
        const playIcon = document.getElementById("modal-play-icon");
        const iconName = isPlaying ? "pause" : "play";
        if (subIcon) subIcon.setAttribute("data-lucide", iconName);
        if (playIcon) playIcon.setAttribute("data-lucide", iconName);
        if (typeof lucide !== "undefined") lucide.createIcons();
    };

    const togglePlayPause = () => {
        if (!modalVideo) return;
        if (modalVideo.paused) {
            modalVideo.play();
            if (modalPlayOverlay) modalPlayOverlay.classList.remove("show-play");
            updatePlayIcons(true);
        } else {
            modalVideo.pause();
            if (modalPlayOverlay) modalPlayOverlay.classList.add("show-play");
            updatePlayIcons(false);
        }
    };

    const openVideoModal = (index) => {
        if (!videoModal) return;
        loadModalVideo(index);
        videoModal.classList.add("active");
        videoModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    };

    const closeVideoModal = () => {
        if (!videoModal) return;
        videoModal.classList.remove("active");
        videoModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (modalVideo) {
            modalVideo.pause();
            modalVideo.src = "";
        }
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeVideoModal);
    if (modalBackdrop) modalBackdrop.addEventListener("click", closeVideoModal);

    if (modalPlayOverlay) modalPlayOverlay.addEventListener("click", togglePlayPause);
    if (modalPlayPauseBtn) modalPlayPauseBtn.addEventListener("click", togglePlayPause);

    if (modalSoundBtn) {
        modalSoundBtn.addEventListener("click", () => {
            if (!modalVideo) return;
            modalVideo.muted = !modalVideo.muted;
            if (modalSoundIcon) {
                modalSoundIcon.setAttribute("data-lucide", modalVideo.muted ? "volume-x" : "volume-2");
                if (typeof lucide !== "undefined") lucide.createIcons();
            }
        });
    }

    if (modalPrevBtn) {
        modalPrevBtn.addEventListener("click", () => {
            const nextIdx = (currentVideoIndex - 1 + mediaPlaylist.length) % mediaPlaylist.length;
            loadModalVideo(nextIdx);
        });
    }

    if (modalNextBtn) {
        modalNextBtn.addEventListener("click", () => {
            const nextIdx = (currentVideoIndex + 1) % mediaPlaylist.length;
            loadModalVideo(nextIdx);
        });
    }

    // Modal Video Time & Progress Updates
    if (modalVideo) {
        modalVideo.addEventListener("timeupdate", () => {
            if (modalVideo.duration) {
                const percent = (modalVideo.currentTime / modalVideo.duration) * 100;
                if (modalProgressFill) modalProgressFill.style.width = `${percent}%`;
                if (modalTimeDisplay) {
                    modalTimeDisplay.textContent = `${formatTime(modalVideo.currentTime)} / ${formatTime(modalVideo.duration)}`;
                }
            }
        });

        modalVideo.addEventListener("ended", () => {
            // Auto advance to next video in playlist
            const nextIdx = (currentVideoIndex + 1) % mediaPlaylist.length;
            loadModalVideo(nextIdx);
        });
    }

    // Scrubber click to seek
    if (modalProgressWrap && modalVideo) {
        modalProgressWrap.addEventListener("click", (e) => {
            const rect = modalProgressWrap.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            if (modalVideo.duration) {
                modalVideo.currentTime = clickPos * modalVideo.duration;
            }
        });
    }

    // Fullscreen toggle
    if (modalFullscreenBtn && modalVideo) {
        modalFullscreenBtn.addEventListener("click", () => {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            } else {
                const wrap = document.querySelector(".video-modal-player-wrap");
                if (wrap && wrap.requestFullscreen) {
                    wrap.requestFullscreen().catch(() => {});
                } else if (modalVideo.requestFullscreen) {
                    modalVideo.requestFullscreen().catch(() => {});
                }
            }
        });
    }

    // Keyboard Shortcuts for Modal
    window.addEventListener("keydown", (e) => {
        if (!videoModal || !videoModal.classList.contains("active")) return;
        if (e.key === "Escape") {
            closeVideoModal();
        } else if (e.key === "ArrowLeft") {
            const nextIdx = (currentVideoIndex - 1 + mediaPlaylist.length) % mediaPlaylist.length;
            loadModalVideo(nextIdx);
        } else if (e.key === "ArrowRight") {
            const nextIdx = (currentVideoIndex + 1) % mediaPlaylist.length;
            loadModalVideo(nextIdx);
        } else if (e.key === " " && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
            e.preventDefault();
            togglePlayPause();
        }
    });

    // 11. Media Slider Loop Auto-Scroll Ticker
    const mediaWrapper = document.querySelector(".media-ticker-track-wrapper");
    
    if (mediaWrapper) {
        let autoScrollSpeed = 0.65; // smooth moving animation speed
        let isPaused = false;

        // Custom ticker animation loop (requestAnimationFrame for steady fluid scroll)
        const autoScrollTick = () => {
            if (!isPaused && (!videoModal || !videoModal.classList.contains("active"))) {
                mediaWrapper.scrollLeft += autoScrollSpeed;
                
                // Seamless wrap: duplicate threshold is half of the scrollWidth
                const halfScrollWidth = mediaWrapper.scrollWidth / 2;
                if (mediaWrapper.scrollLeft >= halfScrollWidth) {
                    mediaWrapper.scrollLeft = 0;
                }
            }
            requestAnimationFrame(autoScrollTick);
        };
        
        // Start auto-scroll ticker loop
        requestAnimationFrame(autoScrollTick);

        // Hover mouse modifiers to pause on mouse enter and resume on leave
        mediaWrapper.addEventListener("mouseenter", () => {
            isPaused = true;
        });
        
        mediaWrapper.addEventListener("mouseleave", () => {
            isPaused = false;
        });
    }
});

