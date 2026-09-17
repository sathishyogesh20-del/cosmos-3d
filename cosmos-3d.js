/* ================================
   COSMOS 3D - MAIN JAVASCRIPT
   ISRO & NASA Space Explorer
   ================================ */

// Configuration
const NASA_API_KEY = 'DEMO_KEY'; // Replace with your NASA API key from api.nasa.gov
const ISS_API = 'http://api.open-notify.org/iss-now.json';
const PEOPLE_API = 'http://api.open-notify.org/astros.json';
const APOD_API = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;

// Global variables
let scene, camera, renderer;
let starfield, heroScene;
let planetsScene, currentPlanet;
let isLoading = true;

/* ================================
   LOADING SCREEN
   ================================ */

function initLoading() {
    const loadingBar = document.getElementById('loading-bar');
    const loadingPercent = document.getElementById('loading-percent');
    const loadingText = document.getElementById('loading-text');
    const loadingScreen = document.getElementById('loading-screen');

    const messages = [
        'Connecting to space agencies...',
        'Loading ISRO missions...',
        'Loading NASA data...',
        'Initializing 3D engine...',
        'Rendering starfield...',
        'Almost ready...'
    ];

    let progress = 0;
    let messageIndex = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;

        loadingBar.style.width = progress + '%';
        loadingPercent.textContent = Math.floor(progress) + '%';

        if (progress > messageIndex * 16.6 && messageIndex < messages.length) {
            loadingText.textContent = messages[messageIndex];
            messageIndex++;
        }

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                isLoading = false;
                initEverything();
            }, 500);
        }
    }, 200);
}

/* ================================
   STARFIELD BACKGROUND
   ================================ */

function initStarfield() {
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = [];
    const numStars = 500;

    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.1,
            opacity: Math.random()
        });
    }

    function animate() {
        ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();

            // Twinkling effect
            star.opacity += (Math.random() - 0.5) * 0.05;
            star.opacity = Math.max(0.1, Math.min(1, star.opacity));

            // Move stars
            star.y += star.speed;
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }
        });

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

/* ================================
   SPACE PARTICLES
   ================================ */

function createSpaceParticles() {
    const container = document.getElementById('space-particles');
    const numParticles = 50;

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: radial-gradient(circle, rgba(0, 212, 255, 0.8), transparent);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particle-float ${Math.random() * 10 + 5}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
            opacity: ${Math.random() * 0.5 + 0.2};
        `;
        container.appendChild(particle);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes particle-float {
            0%, 100% {
                transform: translate(0, 0);
            }
            25% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
            }
            50% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
            }
            75% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
            }
        }
    `;
    document.head.appendChild(style);
}

/* ================================
   HERO 3D SCENE
   ================================ */

function initHero3D() {
    const container = document.getElementById('hero-3d');
    if (!container) return;

    // Scene setup
    heroScene = new THREE.Scene();
    const heroCamera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const heroRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    heroRenderer.setSize(container.offsetWidth, container.offsetHeight);
    heroRenderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(heroRenderer.domElement);

    // Create rotating Earth
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const textureLoader = new THREE.TextureLoader();

    // Create a gradient material as fallback
    const material = new THREE.MeshPhongMaterial({
        color: 0x0ea5e9,
        emissive: 0x006699,
        shininess: 50,
        wireframe: false
    });

    const earth = new THREE.Mesh(geometry, material);
    heroScene.add(earth);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    heroScene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00d4ff, 1, 100);
    pointLight.position.set(10, 10, 10);
    heroScene.add(pointLight);

    // Add stars around Earth
    const starsGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 50;
        const y = (Math.random() - 0.5) * 50;
        const z = (Math.random() - 0.5) * 50;
        starVertices.push(x, y, z);
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    heroScene.add(stars);

    heroCamera.position.z = 5;

    // Animation
    function animateHero() {
        requestAnimationFrame(animateHero);
        earth.rotation.y += 0.002;
        stars.rotation.y += 0.0005;
        heroRenderer.render(heroScene, heroCamera);
    }
    animateHero();

    // Handle resize
    window.addEventListener('resize', () => {
        heroCamera.aspect = container.offsetWidth / container.offsetHeight;
        heroCamera.updateProjectionMatrix();
        heroRenderer.setSize(container.offsetWidth, container.offsetHeight);
    });
}

/* ================================
   PLANETS 3D VIEWER
   ================================ */

const planetsData = {
    mercury: { name: 'Mercury', color: 0x8c7853, size: 0.8, type: 'Terrestrial', distance: '57.9M km', diameter: '4,879 km', moons: '0' },
    venus: { name: 'Venus', color: 0xffc649, size: 1, type: 'Terrestrial', distance: '108.2M km', diameter: '12,104 km', moons: '0' },
    earth: { name: 'Earth', color: 0x0ea5e9, size: 1, type: 'Terrestrial', distance: '149.6M km', diameter: '12,742 km', moons: '1' },
    mars: { name: 'Mars', color: 0xdc2626, size: 0.9, type: 'Terrestrial', distance: '227.9M km', diameter: '6,779 km', moons: '2' },
    jupiter: { name: 'Jupiter', color: 0xd97706, size: 2, type: 'Gas Giant', distance: '778.5M km', diameter: '139,820 km', moons: '95' },
    saturn: { name: 'Saturn', color: 0xfbbf24, size: 1.8, type: 'Gas Giant', distance: '1.4B km', diameter: '116,460 km', moons: '146' },
    uranus: { name: 'Uranus', color: 0x06b6d4, size: 1.3, type: 'Ice Giant', distance: '2.9B km', diameter: '50,724 km', moons: '27' },
    neptune: { name: 'Neptune', color: 0x3b82f6, size: 1.3, type: 'Ice Giant', distance: '4.5B km', diameter: '49,244 km', moons: '14' }
};

function initPlanets3D() {
    const canvas = document.getElementById('planets-canvas');
    if (!canvas) return;

    planetsScene = new THREE.Scene();
    const planetsCamera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    const planetsRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    planetsRenderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    planetsRenderer.setPixelRatio(window.devicePixelRatio);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    planetsScene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(5, 5, 5);
    planetsScene.add(pointLight);

    planetsCamera.position.z = 5;

    // Create initial planet (Earth)
    switchPlanet('earth');

    // Planet buttons
    const planetButtons = document.querySelectorAll('.planet-btn');
    planetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            planetButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const planetName = btn.dataset.planet;
            switchPlanet(planetName);
        });
    });

    // Animation
    function animatePlanets() {
        requestAnimationFrame(animatePlanets);
        if (currentPlanet) {
            currentPlanet.rotation.y += 0.005;
        }
        planetsRenderer.render(planetsScene, planetsCamera);
    }
    animatePlanets();

    // Handle resize
    window.addEventListener('resize', () => {
        planetsCamera.aspect = canvas.offsetWidth / canvas.offsetHeight;
        planetsCamera.updateProjectionMatrix();
        planetsRenderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    });
}

function switchPlanet(planetName) {
    if (currentPlanet) {
        planetsScene.remove(currentPlanet);
    }

    const data = planetsData[planetName];
    const geometry = new THREE.SphereGeometry(data.size, 64, 64);
    const material = new THREE.MeshPhongMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.2,
        shininess: 30
    });

    currentPlanet = new THREE.Mesh(geometry, material);
    planetsScene.add(currentPlanet);

    // Update info panel
    const infoPanel = document.getElementById('planet-info');
    if (infoPanel) {
        infoPanel.querySelector('.planet-name').textContent = data.name;
        const details = infoPanel.querySelectorAll('.detail');
        details[0].innerHTML = `<span>Type:</span> ${data.type}`;
        details[1].innerHTML = `<span>Distance:</span> ${data.distance}`;
        details[2].innerHTML = `<span>Diameter:</span> ${data.diameter}`;
        details[3].innerHTML = `<span>Moons:</span> ${data.moons}`;
    }
}

/* ================================
   MISSIONS DATA
   ================================ */

const missionsData = [
    {
        name: 'Chandrayaan-3',
        agency: 'ISRO',
        icon: '🌕',
        status: 'Success',
        description: 'India\'s third lunar mission achieved a historic soft landing near the Moon\'s south pole.',
        location: 'Moon - South Pole',
        year: '2023'
    },
    {
        name: 'James Webb Telescope',
        agency: 'NASA',
        icon: '🔭',
        status: 'Active',
        description: 'Revolutionary space telescope observing the universe in infrared wavelengths.',
        location: 'L2 Lagrange Point',
        year: '2021'
    },
    {
        name: 'Aditya-L1',
        agency: 'ISRO',
        icon: '☀️',
        status: 'Active',
        description: 'India\'s first solar mission studying the Sun\'s corona and solar winds.',
        location: 'L1 Lagrange Point',
        year: '2023'
    },
    {
        name: 'Mars Perseverance',
        agency: 'NASA',
        icon: '🔴',
        status: 'Active',
        description: 'Advanced rover searching for signs of ancient microbial life on Mars.',
        location: 'Jezero Crater, Mars',
        year: '2020'
    },
    {
        name: 'Gaganyaan',
        agency: 'ISRO',
        icon: '🚀',
        status: 'Upcoming',
        description: 'India\'s first crewed spaceflight mission to low Earth orbit.',
        location: 'LEO',
        year: '2025'
    },
    {
        name: 'Artemis Program',
        agency: 'NASA',
        icon: '🌙',
        status: 'In Progress',
        description: 'NASA\'s ambitious program to return humans to the Moon and establish sustainable presence.',
        location: 'Moon',
        year: 'Ongoing'
    }
];

function loadMissions() {
    const container = document.getElementById('missions-grid');
    if (!container) return;

    missionsData.forEach(mission => {
        const card = document.createElement('div');
        card.className = 'mission-card';
        card.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">${mission.icon}</div>
            <h3 style="font-family: 'Orbitron', sans-serif; font-size: 1.5rem; margin-bottom: 0.5rem;">${mission.name}</h3>
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                <span style="background: ${mission.agency === 'ISRO' ? 'rgba(0, 212, 255, 0.2)' : 'rgba(255, 107, 53, 0.2)'}; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700;">${mission.agency}</span>
                <span style="background: ${mission.status === 'Active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(168, 85, 247, 0.2)'}; color: ${mission.status === 'Active' ? '#22c55e' : '#a855f7'}; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 700;">${mission.status}</span>
            </div>
            <p style="color: #94a3b8; margin-bottom: 1.5rem; line-height: 1.6;">${mission.description}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                <div>
                    <div style="font-size: 0.75rem; color: #94a3b8;">Location</div>
                    <div style="font-weight: 600; color: #00d4ff;">${mission.location}</div>
                </div>
                <div>
                    <div style="font-size: 0.75rem; color: #94a3b8;">Year</div>
                    <div style="font-weight: 600; color: #00d4ff;">${mission.year}</div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

/* ================================
   LIVE DATA - ISS TRACKING
   ================================ */

function updateISSPosition() {
    fetch(ISS_API)
        .then(response => response.json())
        .then(data => {
            const lat = parseFloat(data.iss_position.latitude).toFixed(2);
            const lon = parseFloat(data.iss_position.longitude).toFixed(2);

            document.getElementById('iss-lat').textContent = lat + '°';
            document.getElementById('iss-lon').textContent = lon + '°';

            // Update marker position (simplified map)
            const marker = document.getElementById('iss-marker');
            if (marker) {
                const x = ((parseFloat(lon) + 180) / 360) * 100;
                const y = ((90 - parseFloat(lat)) / 180) * 100;
                marker.style.left = x + '%';
                marker.style.top = y + '%';
            }
        })
        .catch(error => console.log('ISS API Error:', error));
}

/* ================================
   LIVE DATA - PEOPLE IN SPACE
   ================================ */

function updateAstronauts() {
    fetch(PEOPLE_API)
        .then(response => response.json())
        .then(data => {
            const count = data.number;
            document.getElementById('people-in-space').textContent = count;
            document.getElementById('astronaut-count').textContent = count;

            const list = document.getElementById('astronaut-list');
            if (list) {
                list.innerHTML = '';
                data.people.forEach(person => {
                    const item = document.createElement('div');
                    item.className = 'astronaut-item';
                    item.innerHTML = `
                        <div style="font-weight: 600; margin-bottom: 0.25rem;">👨‍🚀 ${person.name}</div>
                        <div style="font-size: 0.875rem; color: #94a3b8;">${person.craft}</div>
                    `;
                    list.appendChild(item);
                });
            }
        })
        .catch(error => console.log('Astronauts API Error:', error));
}

/* ================================
   LIVE DATA - NASA APOD
   ================================ */

function loadAPOD() {
    fetch(APOD_API)
        .then(response => response.json())
        .then(data => {
            const image = document.getElementById('apod-image');
            const title = document.getElementById('apod-title');
            const description = document.getElementById('apod-description');
            const date = document.getElementById('apod-date');

            if (data.media_type === 'image') {
                image.src = data.url;
            } else {
                image.src = data.thumbnail_url || 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800';
            }

            title.textContent = data.title;
            description.textContent = data.explanation.substring(0, 150) + '...';
            date.textContent = data.date;
        })
        .catch(error => {
            console.log('APOD API Error:', error);
            document.getElementById('apod-title').textContent = 'Space Image Unavailable';
            document.getElementById('apod-description').textContent = 'Unable to fetch NASA\'s Astronomy Picture of the Day.';
        });
}

/* ================================
   STAT COUNTERS ANIMATION
   ================================ */

function animateCounters() {
    const counters = document.querySelectorAll('.stat-value');
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target) || 0;
        if (target === 0) return;

        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 30);
    });
}

/* ================================
   NAVIGATION
   ================================ */

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navItems = document.querySelectorAll('.nav-item');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scroll
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                navMenu.classList.remove('active');
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });
}

/* ================================
   GSAP SCROLL ANIMATIONS
   ================================ */

function initScrollAnimations() {
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Fade in sections
    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 50%',
                scrub: 1
            }
        });
    });

    // Cards animation
    gsap.utils.toArray('.agency-card, .mission-card, .live-card').forEach(card => {
        gsap.from(card, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            }
        });
    });
}

/* ================================
   UPDATE LAST UPDATE TIME
   ================================ */

function updateLastUpdateTime() {
    const element = document.getElementById('last-update');
    if (element) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        element.textContent = timeString;
    }
}

/* ================================
   INITIALIZE EVERYTHING
   ================================ */

function initEverything() {
    initStarfield();
    createSpaceParticles();
    initHero3D();
    initPlanets3D();
    loadMissions();
    initNavigation();
    animateCounters();

    // Load live data
    updateISSPosition();
    updateAstronauts();
    loadAPOD();
    updateLastUpdateTime();

    // Update live data every 5 seconds
    setInterval(updateISSPosition, 5000);
    setInterval(updateAstronauts, 30000);
    setInterval(updateLastUpdateTime, 60000);

    // Initialize GSAP animations
    setTimeout(initScrollAnimations, 1000);
}

/* ================================
   START APPLICATION
   ================================ */

window.addEventListener('DOMContentLoaded', () => {
    initLoading();
});