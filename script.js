/* ================================
   COSMOS - ENHANCED 3D INTERACTIVE SPACE WEBSITE
   Real-time NASA API Integration
   ================================ */

// NASA API Configuration
const NASA_API_KEY = 'DEMO_KEY'; // Replace with your API key from https://api.nasa.gov/
const NASA_APOD_URL = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;
const ISS_LOCATION_URL = 'http://api.open-notify.org/iss-now.json';
const PEOPLE_IN_SPACE_URL = 'http://api.open-notify.org/astros.json';

// Global Variables
let scene, camera, renderer, stars, particles, planetMesh;
let issUpdateInterval;
let scrollAnimationObserver;

/* ================================
   LOADING SCREEN
   ================================ */

function initLoadingScreen() {
    const loadingProgress = document.getElementById('loading-progress');
    const loadingScreen = document.getElementById('loading-screen');
    const loadingStatus = document.querySelector('.loading-subtitle');

    let progress = 0;
    const loadingSteps = [
        { progress: 20, text: 'Loading 3D engine...' },
        { progress: 40, text: 'Connecting to NASA APIs...' },
        { progress: 60, text: 'Fetching space data...' },
        { progress: 80, text: 'Initializing solar system...' },
        { progress: 100, text: 'Ready for launch!' }
    ];

    let currentStep = 0;

    const loadingInterval = setInterval(() => {
        if (currentStep < loadingSteps.length) {
            progress = loadingSteps[currentStep].progress;
            loadingProgress.style.width = progress + '%';
            loadingStatus.textContent = loadingSteps[currentStep].text;
            currentStep++;
        } else {
            clearInterval(loadingInterval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                initAnimations();
            }, 500);
        }
    }, 400);
}

/* ================================
   THREE.JS 3D SPACE BACKGROUND
   ================================ */

function initSpace() {
    const canvas = document.getElementById('space-canvas');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    // Create advanced star field
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    const starColors = [];

    for (let i = 0; i < 5000; i++) {
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * 100;
        starVertices.push(x, y, z);

        // Varying star colors
        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.1 + 0.05, 0.5, Math.random() * 0.5 + 0.5);
        starColors.push(color.r, color.g, color.b);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Larger particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleVertices = [];

    for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 80;
        const y = (Math.random() - 0.5) * 80;
        const z = (Math.random() - 0.5) * 80;
        particleVertices.push(x, y, z);
    }

    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particleVertices, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.15,
        color: 0xC8853F,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Ambient and directional lighting
    const ambientLight = new THREE.AmbientLight(0xF6F1E8, 0.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xC8853F, 1.5, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Initialize planet canvas
    initPlanetCanvas();

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Smooth rotation
    if (stars) {
        stars.rotation.y += 0.0001;
        stars.rotation.x += 0.00005;
    }

    if (particles) {
        particles.rotation.y -= 0.0002;
        particles.rotation.x -= 0.0001;
    }

    renderer.render(scene, camera);
}

/* ================================
   3D PLANET CANVAS
   ================================ */

function initPlanetCanvas() {
    const planetCanvas = document.getElementById('planet-canvas');
    if (!planetCanvas) return;

    const planetScene = new THREE.Scene();
    const planetCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    const planetRenderer = new THREE.WebGLRenderer({
        canvas: planetCanvas,
        alpha: true,
        antialias: true
    });

    const size = planetCanvas.offsetWidth;
    planetRenderer.setSize(size, size);
    planetRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    planetCamera.position.z = 3;

    // Create Earth-like planet
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshPhongMaterial({
        color: 0x4A90E2,
        emissive: 0x112244,
        shininess: 30,
        transparent: true,
        opacity: 0.9
    });

    planetMesh = new THREE.Mesh(geometry, material);
    planetScene.add(planetMesh);

    // Add atmosphere glow
    const glowGeometry = new THREE.SphereGeometry(1.1, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xC8853F,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    planetScene.add(glow);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 3, 5);
    planetScene.add(light);

    const ambLight = new THREE.AmbientLight(0x404040);
    planetScene.add(ambLight);

    function animatePlanet() {
        requestAnimationFrame(animatePlanet);
        planetMesh.rotation.y += 0.005;
        glow.rotation.y -= 0.003;
        planetRenderer.render(planetScene, planetCamera);
    }
    animatePlanet();
}

/* ================================
   WINDOW RESIZE HANDLER
   ================================ */

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ================================
   CURSOR GLOW EFFECT
   ================================ */

const cursorGlow = document.getElementById('cursor-glow');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    gsap.to(cursorGlow, {
        x: mouseX,
        y: mouseY,
        duration: 0.5,
        ease: 'power2.out'
    });
});

/* ================================
   SMOOTH SCROLL & NAVIGATION
   ================================ */

const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Parallax effect
    const scrollY = window.scrollY;
    if (stars && particles) {
        stars.rotation.y = scrollY * 0.0001;
        particles.rotation.x = scrollY * 0.0002;
    }
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            gsap.to(window, {
                scrollTo: {
                    y: targetSection,
                    offsetY: 80
                },
                duration: 1,
                ease: 'power2.inOut'
            });

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

/* ================================
   SCROLL ANIMATIONS WITH GSAP
   ================================ */

function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero animations
    gsap.to('.hero-left', {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.to('.hero-right', {
        opacity: 1,
        x: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });

    // Animate title lines
    gsap.to('.title-line', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.5,
        ease: 'power3.out'
    });

    // Animate stats counter
    animateStats();

    // Scroll trigger animations
    gsap.utils.toArray('[data-scroll-animation]').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Planet cards stagger animation
    gsap.from('.planet-card', {
        scrollTrigger: {
            trigger: '.planets-grid',
            start: 'top 70%'
        },
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out'
    });
}

/* ================================
   ANIMATED COUNTERS
   ================================ */

function animateStats() {
    const stats = document.querySelectorAll('.stat-item');

    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const numberElement = stat.querySelector('.stat-number');

        gsap.to({ val: 0 }, {
            val: target,
            duration: 2,
            delay: 1,
            ease: 'power2.out',
            onUpdate: function() {
                numberElement.textContent = Math.floor(this.targets()[0].val);
            }
        });
    });
}

/* ================================
   REAL-TIME CLOCK
   ================================ */

function updateClock() {
    const clockElement = document.getElementById('current-time');
    if (clockElement) {
        const now = new Date();
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds} UTC`;
    }
}

setInterval(updateClock, 1000);
updateClock();

/* ================================
   PLANETS DATA
   ================================ */

const planetsData = [
    {
        name: 'Mercury',
        type: 'Terrestrial',
        icon: '☿️',
        description: 'The smallest planet with extreme temperatures and a heavily cratered surface.',
        distance: '57.9M km',
        diameter: '4,879 km',
        orbitalPeriod: '88 days',
        moons: '0'
    },
    {
        name: 'Venus',
        type: 'Terrestrial',
        icon: '♀️',
        description: 'The hottest planet with a thick toxic atmosphere and volcanic surface.',
        distance: '108.2M km',
        diameter: '12,104 km',
        orbitalPeriod: '225 days',
        moons: '0'
    },
    {
        name: 'Earth',
        type: 'Terrestrial',
        icon: '🌍',
        description: 'Our home planet, the only known world to harbor life in the universe.',
        distance: '149.6M km',
        diameter: '12,742 km',
        orbitalPeriod: '365 days',
        moons: '1'
    },
    {
        name: 'Mars',
        type: 'Terrestrial',
        icon: '♂️',
        description: 'The Red Planet with polar ice caps and the largest volcano in the solar system.',
        distance: '227.9M km',
        diameter: '6,779 km',
        orbitalPeriod: '687 days',
        moons: '2'
    },
    {
        name: 'Jupiter',
        type: 'Gas Giant',
        icon: '♃',
        description: 'The largest planet with a Great Red Spot storm larger than Earth.',
        distance: '778.5M km',
        diameter: '139,820 km',
        orbitalPeriod: '12 years',
        moons: '95'
    },
    {
        name: 'Saturn',
        type: 'Gas Giant',
        icon: '♄',
        description: 'Famous for its spectacular ring system made of ice and rock particles.',
        distance: '1.4B km',
        diameter: '116,460 km',
        orbitalPeriod: '29 years',
        moons: '146'
    },
    {
        name: 'Uranus',
        type: 'Ice Giant',
        icon: '♅',
        description: 'An ice giant that rotates on its side with 13 known rings.',
        distance: '2.9B km',
        diameter: '50,724 km',
        orbitalPeriod: '84 years',
        moons: '27'
    },
    {
        name: 'Neptune',
        type: 'Ice Giant',
        icon: '♆',
        description: 'The windiest planet with supersonic winds up to 2,100 km/h.',
        distance: '4.5B km',
        diameter: '49,244 km',
        orbitalPeriod: '165 years',
        moons: '14'
    }
];

function populatePlanets() {
    const planetsGrid = document.getElementById('planets-grid');
    if (!planetsGrid) return;

    planetsGrid.innerHTML = planetsData.map(planet => `
        <div class="planet-card">
            <span class="planet-icon">${planet.icon}</span>
            <h3 class="planet-name">${planet.name}</h3>
            <div class="planet-type">${planet.type}</div>
            <p class="planet-description">${planet.description}</p>
            <div class="planet-details">
                <div class="detail-item">
                    <div class="detail-label">Distance</div>
                    <div class="detail-value">${planet.distance}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Diameter</div>
                    <div class="detail-value">${planet.diameter}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Year</div>
                    <div class="detail-value">${planet.orbitalPeriod}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Moons</div>
                    <div class="detail-value">${planet.moons}</div>
                </div>
            </div>
        </div>
    `).join('');
}

/* ================================
   NASA APOD - REAL-TIME DATA
   ================================ */

async function fetchAPOD() {
    const apodImage = document.getElementById('apod-image');
    const apodTitle = document.getElementById('apod-title');
    const apodExplanation = document.getElementById('apod-explanation');
    const apodDate = document.getElementById('apod-date');
    const apodCopyright = document.getElementById('apod-copyright');
    const apodLoader = document.getElementById('apod-loader');

    try {
        const response = await fetch(NASA_APOD_URL);
        const data = await response.json();

        apodImage.src = data.url;
        apodImage.onload = () => {
            apodLoader.style.display = 'none';
            apodImage.classList.add('loaded');
        };

        apodTitle.textContent = data.title;
        apodExplanation.textContent = data.explanation;
        apodDate.textContent = new Date(data.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        apodCopyright.textContent = data.copyright || 'NASA';
    } catch (error) {
        console.error('Error fetching APOD:', error);
        apodLoader.innerHTML = '<p style="color: var(--text-muted);">Unable to load today\'s image. Please check your connection.</p>';
    }
}

/* ================================
   ISS TRACKING - REAL-TIME
   ================================ */

async function updateISSLocation() {
    try {
        const response = await fetch(ISS_LOCATION_URL);
        const data = await response.json();

        const lat = parseFloat(data.iss_position.latitude).toFixed(2);
        const lon = parseFloat(data.iss_position.longitude).toFixed(2);

        document.getElementById('iss-lat').textContent = `${lat}°`;
        document.getElementById('iss-lon').textContent = `${lon}°`;
        document.getElementById('iss-altitude').textContent = '408 km';
        document.getElementById('iss-velocity').textContent = '27,600 km/h';
        document.getElementById('iss-speed').textContent = '27,600 km/h';

        // Update marker position on map
        const marker = document.getElementById('iss-marker');
        if (marker) {
            // Convert lat/lon to pixel position (simplified)
            const x = ((parseFloat(lon) + 180) / 360) * 100;
            const y = ((90 - parseFloat(lat)) / 180) * 100;
            marker.style.left = `${x}%`;
            marker.style.top = `${y}%`;
        }

        // Update live status
        const liveStatus = document.getElementById('live-status');
        if (liveStatus) {
            liveStatus.textContent = 'Live data connected • Real-time tracking';
        }
    } catch (error) {
        console.error('Error fetching ISS location:', error);
        document.getElementById('iss-lat').textContent = '--°';
        document.getElementById('iss-lon').textContent = '--°';
    }
}

/* ================================
   PEOPLE IN SPACE
   ================================ */

async function fetchPeopleInSpace() {
    try {
        const response = await fetch(PEOPLE_IN_SPACE_URL);
        const data = await response.json();

        document.getElementById('people-in-space').textContent = data.number;

        const astronautList = document.getElementById('astronaut-list');
        astronautList.innerHTML = data.people
            .filter(person => person.craft === 'ISS')
            .slice(0, 5)
            .map(person => `
                <div class="astronaut-item">
                    👨‍🚀 ${person.name}
                </div>
            `).join('');
    } catch (error) {
        console.error('Error fetching people in space:', error);
    }
}

/* ================================
   MISSIONS DATA (SIMULATED)
   ================================ */

function populateMissions() {
    const missionsGrid = document.getElementById('missions-grid');
    if (!missionsGrid) return;

    const missions = [
        {
            icon: '🛰️',
            name: 'James Webb Space Telescope',
            description: 'Observing the universe in infrared light, revealing the earliest galaxies and stellar nurseries.',
            location: 'L2 Lagrange Point',
            status: 'Active',
            launched: '2021',
            featured: true
        },
        {
            icon: '🔴',
            name: 'Mars Perseverance Rover',
            description: 'Searching for signs of ancient microbial life and collecting rock samples on Mars.',
            location: 'Jezero Crater, Mars',
            status: 'Active',
            launched: '2020',
            featured: false
        },
        {
            icon: '🌊',
            name: 'Europa Clipper',
            description: 'Investigating Jupiter\'s moon Europa and its subsurface ocean for potential habitability.',
            location: 'En Route to Jupiter',
            status: 'Transit',
            launched: '2024',
            featured: false
        },
        {
            icon: '🛸',
            name: 'Parker Solar Probe',
            description: 'Making historic close approaches to the Sun to study its corona and solar wind.',
            location: 'Solar Orbit',
            status: 'Active',
            launched: '2018',
            featured: false
        },
        {
            icon: '🌙',
            name: 'Artemis Program',
            description: 'Preparing to return humans to the Moon and establish a sustainable presence.',
            location: 'Earth/Moon',
            status: 'In Development',
            launched: '2024+',
            featured: false
        },
        {
            icon: '🔭',
            name: 'Hubble Space Telescope',
            description: 'Continuing its legendary observations of deep space phenomena after 30+ years.',
            location: 'Low Earth Orbit',
            status: 'Active',
            launched: '1990',
            featured: false
        }
    ];

    missionsGrid.innerHTML = missions.map(mission => `
        <div class="mission-card ${mission.featured ? 'featured' : ''}">
            ${mission.featured ? '<div class="mission-status">Most Active</div>' : ''}
            <div class="mission-icon">${mission.icon}</div>
            <h3 class="mission-name">${mission.name}</h3>
            <p class="mission-description">${mission.description}</p>
            <div class="mission-meta">
                <span class="meta-item">📍 ${mission.location}</span>
                <span class="meta-item">🚀 ${mission.launched}</span>
                <span class="meta-item">⚡ ${mission.status}</span>
            </div>
            <button class="mission-btn">View Mission Data</button>
        </div>
    `).join('');
}

/* ================================
   FOOTER UPDATE TIME
   ================================ */

function updateFooterTime() {
    const lastUpdated = document.getElementById('last-updated');
    if (lastUpdated) {
        const now = new Date();
        lastUpdated.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }) + ' UTC';
    }
}

/* ================================
   THEME TOGGLE
   ================================ */

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        // Theme toggle functionality can be added here
        gsap.to(themeToggle, {
            rotation: '+=360',
            duration: 0.5,
            ease: 'power2.out'
        });
    });
}

/* ================================
   INITIALIZATION
   ================================ */

function init() {
    initLoadingScreen();
    initSpace();
    populatePlanets();
    populateMissions();
    fetchAPOD();
    updateISSLocation();
    fetchPeopleInSpace();
    updateFooterTime();

    // Update ISS location every 5 seconds
    issUpdateInterval = setInterval(() => {
        updateISSLocation();
        updateFooterTime();
    }, 5000);

    // Update people in space every minute
    setInterval(fetchPeopleInSpace, 60000);
}

// Start everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

/* ================================
   CLEANUP
   ================================ */

window.addEventListener('beforeunload', () => {
    if (issUpdateInterval) {
        clearInterval(issUpdateInterval);
    }
});