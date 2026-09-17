# 🚀 COSMOS 3D - ISRO & NASA Space Explorer

> An immersive 3D web experience dedicated to space exploration through ISRO and NASA missions

![Status](https://img.shields.io/badge/status-active-success)
![Version](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🎨 **Ultra 3D Visuals**
- **Animated Starfield** - 500+ twinkling stars with parallax effect
- **3D Rotating Earth** - Interactive Three.js planet in hero section
- **Interactive Solar System** - Switch between all 8 planets with real data
- **Floating Particles** - 50+ ambient particles with smooth animations
- **Glass Morphism UI** - Modern frosted glass effects throughout
- **Gradient Animations** - Dynamic color transitions

### 🛰️ **Real-Time Space Data**
1. **ISS Live Tracking** - Updates every 5 seconds
   - Current latitude/longitude
   - Live position on map
   - Altitude and velocity

2. **Astronauts in Space** - Live crew roster
   - Total count
   - Names and spacecraft
   - Updates every 30 seconds

3. **NASA APOD** - Astronomy Picture of the Day
   - Daily space images
   - Descriptions
   - Direct from NASA API

### 🚀 **ISRO & NASA Missions**
- **Chandrayaan-3** - Historic Moon landing
- **Aditya-L1** - Solar observation mission
- **Gaganyaan** - Upcoming crewed spaceflight
- **James Webb Telescope** - Deep space observation
- **Mars Perseverance** - Mars exploration
- **Artemis Program** - Return to the Moon

### 🪐 **Interactive Planets**
- All 8 planets with accurate:
  - Colors and sizes
  - Distance from Sun
  - Diameter measurements
  - Number of moons
  - Planet types

### 🎭 **Advanced Animations**
- Smooth scroll effects with GSAP
- Card hover 3D transforms
- Parallax scrolling
- Counter animations
- Loading screen with rocket animation
- Meteor shower effects
- Responsive mobile design

## 🎯 Technology Stack

```javascript
// Frontend
- HTML5 Canvas
- CSS3 (Advanced animations, Glass morphism)
- JavaScript (ES6+)

// 3D Graphics
- Three.js r128

// Animations
- GSAP 3.12.2
- ScrollTrigger

// APIs
- NASA Open APIs
- Open Notify (ISS tracking)
- Astronomy Picture of the Day

// Fonts
- Orbitron (Headings)
- Rajdhani (Body)
- Space Mono (Monospace)
```

## 📦 Installation

### Quick Start

1. **Clone or download** all files:
   ```
   index.html
   styles.css
   cosmos-3d.js
   ```

2. **Get NASA API Key** (Optional but recommended):
   - Visit [https://api.nasa.gov](https://api.nasa.gov)
   - Sign up for free API key
   - Replace `DEMO_KEY` in `cosmos-3d.js` line 9:
   ```javascript
   const NASA_API_KEY = 'YOUR_API_KEY_HERE';
   ```

3. **Open `index.html`** in your browser
   - Works offline (except live data)
   - No build process needed
   - No npm/node required

### Deploy to GitHub Pages

1. Create a new repository on GitHub
2. Upload all three files
3. Go to Settings → Pages
4. Select branch: `main` or `master`
5. Click Save
6. Your site will be live at: `https://yourusername.github.io/repository-name`

### Deploy to Netlify/Vercel

**Netlify:**
1. Drag and drop the folder to [netlify.com/drop](https://netlify.com/drop)
2. Instant deployment!

**Vercel:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts

## 🎮 Usage

### Navigation
- **Scroll** through sections
- **Click planet buttons** to switch 3D models
- **Hover cards** for 3D tilt effects
- **Mobile menu** responsive toggle

### Live Data Updates
- **ISS Position**: Every 5 seconds
- **Astronauts**: Every 30 seconds
- **APOD**: Once per load
- **Clock**: Every minute

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-dark: #0a0e27;
    --accent-blue: #00d4ff;
    --accent-purple: #a855f7;
    --accent-orange: #ff6b35;
}
```

### Add More Missions
Edit `missionsData` array in `cosmos-3d.js`:
```javascript
{
    name: 'Your Mission',
    agency: 'ISRO',
    icon: '🚀',
    status: 'Active',
    description: 'Mission description',
    location: 'Location',
    year: '2026'
}
```

### Modify Planets
Edit `planetsData` object in `cosmos-3d.js`:
```javascript
planetname: {
    name: 'Planet Name',
    color: 0xHEXCODE,
    size: 1.0,
    type: 'Type',
    distance: 'Distance',
    diameter: 'Diameter',
    moons: 'Count'
}
```

## 🔧 Configuration

### API Endpoints
```javascript
// ISS Tracking
http://api.open-notify.org/iss-now.json

// People in Space
http://api.open-notify.org/astros.json

// NASA APOD
https://api.nasa.gov/planetary/apod?api_key=YOUR_KEY
```

### Performance Settings

Adjust in `cosmos-3d.js`:
```javascript
// Starfield particles
const numStars = 500; // Reduce for slower devices

// Space particles
const numParticles = 50; // Reduce for slower devices

// Planet detail
const geometry = new THREE.SphereGeometry(size, 64, 64);
// Change 64 to 32 for better performance
```

## 📱 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Full Support |
| Firefox | 88+     | ✅ Full Support |
| Safari  | 14+     | ✅ Full Support |
| Edge    | 90+     | ✅ Full Support |
| Opera   | 76+     | ✅ Full Support |

**Requirements:**
- WebGL support
- ES6 JavaScript
- CSS3 animations
- Canvas API

## 🐛 Troubleshooting

### Issue: Blank screen
- Check browser console (F12)
- Ensure all 3 files are in same directory
- Try different browser
- Disable ad blockers

### Issue: No live data
- Check internet connection
- Verify API key (for APOD)
- Check browser console for errors
- Some corporate networks block APIs

### Issue: Slow performance
- Reduce particle counts
- Lower 3D geometry detail
- Close other browser tabs
- Update graphics drivers

### Issue: Mobile menu not working
- Check JavaScript is enabled
- Clear browser cache
- Try in private/incognito mode

## 📊 Performance Tips

1. **Optimize Images**
   - Gallery images load from Unsplash
   - Can replace with local optimized images

2. **Reduce Particles**
   ```javascript
   const numStars = 200; // Instead of 500
   const numParticles = 20; // Instead of 50
   ```

3. **Lower 3D Detail**
   ```javascript
   new THREE.SphereGeometry(size, 32, 32); // Instead of 64, 64
   ```

4. **Disable Some Effects**
   - Comment out particle system
   - Reduce GSAP animations
   - Remove background effects

## 🌟 Features Showcase

### Loading Screen
- Animated rocket with flame
- Progress bar with shimmer
- Dynamic status messages
- Smooth fade-out transition

### Hero Section
- 3D rotating Earth with stars
- Floating badge with pulse effect
- Gradient animated title
- Real-time astronaut counter
- Scroll indicator

### Agencies Cards
- Detailed ISRO information
- Detailed NASA information
- Mission highlights
- Statistics
- Hover effects with glow

### Missions Grid
- 6 featured missions
- Agency badges
- Status indicators
- Location and year info
- Smooth card animations

### 3D Planets
- 8 interactive planets
- Real data display
- Smooth transitions
- Information panel
- Rotating 3D models

### Live Data
- ISS real-time tracking
- Astronaut roster
- NASA picture of the day
- Auto-updating displays

## 📚 Resources

### APIs Used
- [NASA Open APIs](https://api.nasa.gov)
- [Open Notify](http://open-notify.org)
- [ISRO Official](https://www.isro.gov.in)

### Libraries
- [Three.js](https://threejs.org)
- [GSAP](https://greensock.com/gsap)
- [Google Fonts](https://fonts.google.com)

### Images
- [Unsplash](https://unsplash.com) - Space photography
- NASA Image Library

## 🤝 Contributing

Contributions welcome!

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Test thoroughly
5. Submit pull request

## 📝 License

MIT License - Feel free to use for personal or commercial projects

## 🎉 Credits

**Data Sources:**
- NASA Open APIs
- Open Notify ISS API
- ISRO Official Website

**Design Inspiration:**
- Modern space websites
- Glass morphism trend
- Cosmic color schemes

**Technologies:**
- Three.js team
- GSAP team
- Open source community

## 📞 Support

- Open an issue on GitHub
- Check browser console for errors
- Verify all files are present
- Test with different browsers

## 🚀 Future Enhancements

- [ ] More 3D models (satellites, rockets)
- [ ] Space weather data
- [ ] Exoplanet explorer
- [ ] AR/VR mode
- [ ] Dark/Light theme toggle
- [ ] Multilingual support
- [ ] Mission timeline visualization
- [ ] Real-time satellite tracking
- [ ] Space news integration
- [ ] Educational content sections

---

**Made with 💙 for space enthusiasts worldwide**

*Explore the cosmos. Dream beyond the stars.* 🌌