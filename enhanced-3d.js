/* ================================
   ULTRA 3D ENHANCEMENTS
   Advanced particle systems, depth effects, and animations
   ================================ */

// Enhanced 3D Scene with Multiple Layers
let nebula, galaxy, asteroids;
let mousePosition = { x: 0, y: 0 };
let targetCameraPosition = { x: 0, y: 0 };

/* ================================
   NEBULA CLOUD SYSTEM
   ================================ */

function createNebulaCloud() {
    const nebulaGeometry = new THREE.BufferGeometry();
    const nebulaVertices = [];
    const nebulaColors = [];
    const nebulaSizes = [];

    for (let i = 0; i < 2000; i++) {
        const x = (Math.random() - 0.5) * 150;
        const y = (Math.random() - 0.5) * 150;
        const z = (Math.random() - 0.5) * 150;
        nebulaVertices.push(x, y, z);

        // Purple/pink nebula colors
        const color = new THREE.Color();
        color.setHSL(0.7 + Math.random() * 0.1, 0.8, 0.5 + Math.random() * 0.3);
        nebulaColors.push(color.r, color.g, color.b);

        nebulaSizes.push(Math.random() * 3 + 1);
    }

    nebulaGeometry.setAttribute('position', new THREE.Float32BufferAttribute(nebulaVertices, 3));
    nebulaGeometry.setAttribute('color', new THREE.Float32BufferAttribute(nebulaColors, 3));
    nebulaGeometry.setAttribute('size', new THREE.Float32BufferAttribute(nebulaSizes, 1));

    const nebulaMaterial = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
    scene.add(nebula);
}

/* ================================
   GALAXY SPIRAL
   ================================ */

function createGalaxySpiral() {
    const galaxyGeometry = new THREE.BufferGeometry();
    const galaxyVertices = [];
    const galaxyColors = [];

    const arms = 3;
    const particlesPerArm = 500;

    for (let arm = 0; arm < arms; arm++) {
        for (let i = 0; i < particlesPerArm; i++) {
            const radius = Math.random() * 50 + 10;
            const angle = (arm / arms) * Math.PI * 2 + (i / particlesPerArm) * Math.PI * 4;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = (Math.random() - 0.5) * 5;

            galaxyVertices.push(x, y, z);

            const color = new THREE.Color();
            color.setHSL(0.55 + Math.random() * 0.1, 0.7, 0.6);
            galaxyColors.push(color.r, color.g, color.b);
        }
    }

    galaxyGeometry.setAttribute('position', new THREE.Float32BufferAttribute(galaxyVertices, 3));
    galaxyGeometry.setAttribute('color', new THREE.Float32BufferAttribute(galaxyColors, 3));

    const galaxyMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
    galaxy.rotation.x = Math.PI / 4;
    scene.add(galaxy);
}

/* ================================
   ASTEROID FIELD
   ================================ */

function createAsteroidField() {
    asteroids = new THREE.Group();

    for (let i = 0; i < 50; i++) {
        const size = Math.random() * 0.3 + 0.1;
        const geometry = new THREE.DodecahedronGeometry(size, 0);
        const material = new THREE.MeshPhongMaterial({
            color: 0x8B7355,
            flatShading: true,
            shininess: 10
        });

        const asteroid = new THREE.Mesh(geometry, material);
        asteroid.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 50
        );

        asteroid.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        asteroid.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            }
        };

        asteroids.add(asteroid);
    }

    scene.add(asteroids);
}

/* ================================
   ENHANCED ANIMATION LOOP
   ================================ */

function enhancedAnimate() {
    requestAnimationFrame(enhancedAnimate);

    const time = Date.now() * 0.0001;

    // Nebula movement
    if (nebula) {
        nebula.rotation.y += 0.0001;
        nebula.rotation.x = Math.sin(time * 0.5) * 0.05;
    }

    // Galaxy rotation
    if (galaxy) {
        galaxy.rotation.z += 0.0003;
        galaxy.position.y = Math.sin(time * 0.3) * 2;
    }

    // Asteroid rotation and orbit
    if (asteroids) {
        asteroids.rotation.y += 0.0002;
        asteroids.children.forEach(asteroid => {
            asteroid.rotation.x += asteroid.userData.rotationSpeed.x;
            asteroid.rotation.y += asteroid.userData.rotationSpeed.y;
            asteroid.rotation.z += asteroid.userData.rotationSpeed.z;
        });
    }

    // Smooth camera follow mouse
    targetCameraPosition.x += (mousePosition.x - targetCameraPosition.x) * 0.05;
    targetCameraPosition.y += (mousePosition.y - targetCameraPosition.y) * 0.05;

    camera.position.x = targetCameraPosition.x * 2;
    camera.position.y = targetCameraPosition.y * 2;
    camera.lookAt(scene.position);
}

/* ================================
   3D CARD TILT EFFECT
   ================================ */

function init3DCardEffects() {
    const cards = document.querySelectorAll('.planet-card, .mission-card, .data-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
}

/* ================================
   FLOATING PARTICLES ON HOVER
   ================================ */

function createFloatingParticles(element) {
    const particleCount = 20;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, var(--accent-amber), transparent);
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
        `;
        element.appendChild(particle);
        particles.push(particle);
    }

    element.addEventListener('mouseenter', () => {
        particles.forEach((particle, i) => {
            const delay = i * 0.02;
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            gsap.to(particle, {
                x: x,
                y: y,
                opacity: 0.6,
                duration: 0.6,
                delay: delay,
                ease: 'power2.out'
            });

            gsap.to(particle, {
                opacity: 0,
                duration: 0.3,
                delay: delay + 0.6,
                ease: 'power2.in'
            });
        });
    });
}

/* ================================
   RIPPLE EFFECT ON CLICK
   ================================ */

function createRippleEffect(e, element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(200, 133, 63, 0.3);
        transform: translate(-50%, -50%);
        pointer-events: none;
    `;

    element.appendChild(ripple);

    gsap.to(ripple, {
        width: 300,
        height: 300,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => ripple.remove()
    });
}

/* ================================
   MAGNETIC BUTTON EFFECT
   ================================ */

function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-3d');

    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(button, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });

        button.addEventListener('click', (e) => {
            createRippleEffect(e, button);
        });
    });
}

/* ================================
   TEXT REVEAL ANIMATION
   ================================ */

function initTextReveal() {
    const titles = document.querySelectorAll('.section-title');

    titles.forEach(title => {
        const text = title.textContent;
        title.innerHTML = '';

        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? ' ' : char;
            span.style.cssText = `
                display: inline-block;
                opacity: 0;
                transform: translateY(20px) rotateX(-90deg);
            `;
            title.appendChild(span);

            gsap.to(span, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%'
                },
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 0.5,
                delay: i * 0.02,
                ease: 'back.out(1.7)'
            });
        });
    });
}

/* ================================
   SCROLL PROGRESS INDICATOR
   ================================ */

function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--accent-amber), #E4A558);
        z-index: 10000;
        box-shadow: 0 0 10px var(--accent-amber);
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

/* ================================
   PARALLAX LAYERS
   ================================ */

function initParallaxLayers() {
    const layers = [
        { selector: '.gradient-orb', speed: 0.5 },
        { selector: '.floating-cards', speed: 0.3 },
        { selector: '.hero-3d-container', speed: 0.2 }
    ];

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        layers.forEach(layer => {
            const elements = document.querySelectorAll(layer.selector);
            elements.forEach(element => {
                const speed = layer.speed;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    });
}

/* ================================
   METEOR SHOWER EFFECT
   ================================ */

function createMeteorShower() {
    setInterval(() => {
        if (Math.random() > 0.7) {
            const meteor = document.createElement('div');
            meteor.className = 'meteor';
            meteor.style.cssText = `
                position: fixed;
                width: 2px;
                height: 80px;
                background: linear-gradient(to bottom, transparent, var(--accent-amber), transparent);
                top: ${Math.random() * 50}%;
                left: ${Math.random() * 100}%;
                transform: rotate(-45deg);
                pointer-events: none;
                z-index: 1;
                opacity: 0.8;
                box-shadow: 0 0 10px var(--accent-amber);
            `;
            document.body.appendChild(meteor);

            gsap.to(meteor, {
                x: 300,
                y: 300,
                opacity: 0,
                duration: 1,
                ease: 'power2.in',
                onComplete: () => meteor.remove()
            });
        }
    }, 3000);
}

/* ================================
   INIT ALL ENHANCED 3D EFFECTS
   ================================ */

function initEnhanced3D() {
    // Wait for main scene to be ready
    const checkScene = setInterval(() => {
        if (typeof scene !== 'undefined' && scene) {
            clearInterval(checkScene);

            // Add new 3D elements to scene
            createNebulaCloud();
            createGalaxySpiral();
            createAsteroidField();
            enhancedAnimate();
        }
    }, 100);

    // UI enhancements (these don't need scene)
    setTimeout(() => {
        init3DCardEffects();
        initMagneticButtons();
        createScrollProgress();
        initParallaxLayers();
        createMeteorShower();

        // Add floating particles to buttons
        document.querySelectorAll('.btn-3d').forEach(btn => {
            createFloatingParticles(btn);
        });
    }, 2000);

    // Track mouse for camera movement
    document.addEventListener('mousemove', (e) => {
        mousePosition.x = (e.clientX / window.innerWidth) - 0.5;
        mousePosition.y = (e.clientY / window.innerHeight) - 0.5;
    });
}

// Initialize when DOM and main script are ready
window.addEventListener('load', () => {
    setTimeout(initEnhanced3D, 2000);
});