// Global variables
let scene, camera, renderer, globe, controls;
let globeRadius = 2;
let pointsGroup = new THREE.Group();
let connectionsGroup = new THREE.Group();
let sceneReady = false;
let currentScrollSection = 0;
const totalSections = 5;
let isScrolling = false;
let scrollTimeout;
let particleSystem;

// DOM elements
const loadingScreen = document.querySelector(".loading-screen");
const titleContainer = document.querySelector(".title-container");
const introPanel = document.querySelector(".intro-panel");
const sponsorsBar = document.querySelector(".sponsors-bar");
const judgesPanel = document.querySelector(".judges-panel");
const registerCta = document.querySelector(".register-cta");
const navDots = document.querySelectorAll(".nav-dot");
const starsContainer = document.getElementById("stars");

// Initialize the scene
function init() {
  // Create scene
  scene = new THREE.Scene();

  // Create starry background
  createStars();

  // Create camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Create renderer
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("globeCanvas"),
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x0c0521, 1);

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 3, 5);
  scene.add(directionalLight);

  // Add point light for glow
  const pointLight = new THREE.PointLight(0x3566a8, 1, 10);
  pointLight.position.set(-5, 0, 5);
  scene.add(pointLight);

  // Create controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.5;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;

  // Create Earth globe
  createGlobe();

  // Add particle ring
  createParticleRing();

  // Add population center points
  createPopulationPoints();

  // Add event listeners
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("wheel", onScroll);
  navDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      navigateToSection(parseInt(dot.dataset.index));
    });
  });

  // Start animation loop
  animate();

  // Simulate loading
  setTimeout(() => {
    hideLoading();
    showSection(0);
  }, 3000);
}

// Create stars in the background
function createStars() {
  const starCount = 200;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.className = "star";

    // Random position
    const top = Math.random() * 100;
    const left = Math.random() * 100;

    // Random size
    const size = Math.random() * 3;

    // Random delay for twinkling
    const delay = Math.random() * 5;

    // Set styles
    star.style.top = `${top}%`;
    star.style.left = `${left}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDelay = `${delay}s`;

    // Add to container
    starsContainer.appendChild(star);
  }
}

// Create the Earth globe
function createGlobe() {
  // Create Earth with texture
  const globeGeometry = new THREE.SphereGeometry(globeRadius, 64, 64);
  const loader = new THREE.TextureLoader();

  // Load Earth textures
  const earthTexture = loader.load("https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg");
  const bumpMap = loader.load("https://unpkg.com/three-globe/example/img/earth-topology.png");
  const specularMap = loader.load("https://unpkg.com/three-globe/example/img/earth-water.png");
  const cloudsTexture = loader.load("https://unpkg.com/three-globe/example/img/earth-clouds.png");

  // Create globe material
  const globeMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture,
    bumpMap: bumpMap,
    bumpScale: 0.1,
    specularMap: specularMap,
    specular: new THREE.Color(0x333333),
    shininess: 5,
  });

  // Create globe mesh
  globe = new THREE.Mesh(globeGeometry, globeMaterial);
  scene.add(globe);

  // Add subtle atmosphere
  const atmosphereGeometry = new THREE.SphereGeometry(globeRadius * 1.02, 64, 64);
  const atmosphereMaterial = new THREE.MeshPhongMaterial({
    color: 0x3566a8,
    transparent: true,
    opacity: 0.15,
    side: THREE.BackSide,
  });

  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  scene.add(atmosphere);

  // Add clouds layer
  const cloudsGeometry = new THREE.SphereGeometry(globeRadius * 1.01, 64, 64);
  const cloudsMaterial = new THREE.MeshPhongMaterial({
    map: cloudsTexture,
    transparent: true,
    opacity: 0.6,
  });

  const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
  scene.add(clouds);

  // Animate clouds rotation slightly faster than the Earth
  setInterval(() => {
    clouds.rotation.y += 0.0003;
  }, 10);

  // Add point groups
  scene.add(pointsGroup);
  scene.add(connectionsGroup);
}

// Create particle ring around the globe
function createParticleRing() {
  const particleCount = 1000;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const ringRadius = globeRadius * 1.5;
  const thickness = 0.5;

  const colorOptions = [new THREE.Color(0xff9a9e), new THREE.Color(0xa18cd1), new THREE.Color(0x00ffcc)];

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const angle = Math.random() * Math.PI * 2;
    const radius = ringRadius + (Math.random() - 0.5) * thickness;

    // Position
    positions[i3] = Math.cos(angle) * radius;
    positions[i3 + 1] = (Math.random() - 0.5) * thickness;
    positions[i3 + 2] = Math.sin(angle) * radius;

    // Color
    const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
  });

  particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);
}

// Create population center points
function createPopulationPoints() {
  // Combine both population arrays
  const centers = [...populationCenters, ...techHubs];

  // Create points for each center
  centers.forEach((center) => {
    addPointToGlobe(center);
  });
}

// Convert lat/lng to 3D position
function latLongToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

// Add a point to the globe
function addPointToGlobe(center) {
  const position = latLongToVector3(center.lat, center.lng, globeRadius);

  // Create point geometry
  const pointGeometry = new THREE.SphereGeometry(center.size / 100, 16, 16);
  const pointMaterial = new THREE.MeshBasicMaterial({
    color: center.color,
    transparent: true,
    opacity: 0.8,
  });

  // Create point mesh
  const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
  pointMesh.position.copy(position);
  pointMesh.userData = { center };
  pointsGroup.add(pointMesh);

  // Add glow to point
  const pointGlowGeometry = new THREE.SphereGeometry((center.size / 100) * 2, 16, 16);
  const pointGlowMaterial = new THREE.MeshBasicMaterial({
    color: center.color,
    transparent: true,
    opacity: 0.3,
  });

  const pointGlowMesh = new THREE.Mesh(pointGlowGeometry, pointGlowMaterial);
  pointGlowMesh.position.copy(position);
  pointsGroup.add(pointGlowMesh);
}

// Create connection between points
function createConnection(startPoint, endPoint, color = 0xffffff) {
  const startPosition = startPoint.position.clone();
  const endPosition = endPoint.position.clone();

  // Create curve between points (above the surface)
  const distance = startPosition.distanceTo(endPosition);
  const midPoint = startPosition.clone().lerp(endPosition, 0.5);
  const midElevation = globeRadius * 0.2;
  midPoint.normalize().multiplyScalar(globeRadius + midElevation + distance * 0.1);

  // Create curve
  const curve = new THREE.QuadraticBezierCurve3(startPosition.clone(), midPoint, endPosition.clone());

  // Create curve geometry
  const points = curve.getPoints(50);
  const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);

  // Create curve material
  const curveMaterial = new THREE.LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.5,
    linewidth: 1,
  });

  // Create curve mesh
  const curveMesh = new THREE.Line(curveGeometry, curveMaterial);
  connectionsGroup.add(curveMesh);

  return curveMesh;
}

// Window resize handler
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Smooth scroll handler with debounce
function onScroll(event) {
  if (!sceneReady || isScrolling) return;

  // Prevent rapid scrolling
  isScrolling = true;

  // Calculate the direction of scroll
  const delta = Math.sign(event.deltaY);
  const newSection = Math.max(0, Math.min(totalSections - 1, currentScrollSection + delta));

  if (newSection !== currentScrollSection) {
    navigateToSection(newSection);
  }

  // Debounce scroll events
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    isScrolling = false;
  }, 1000); // Allow next scroll after 1 second
}

// Navigate to a specific section with smooth camera transitions
function navigateToSection(sectionIndex) {
  // Don't do anything if we're already at this section
  if (sectionIndex === currentScrollSection && isScrolling) return;

  currentScrollSection = sectionIndex;

  // Update navigation dots
  navDots.forEach((dot, index) => {
    dot.classList.toggle("active", index === sectionIndex);
  });

  // Transition between sections
  showSection(sectionIndex);
}

// Camera positions for each section
const cameraPositions = [
  { position: { x: 0, y: 0, z: 5 }, rotation: { x: 0, y: 0, z: 0 } },
  { position: { x: 0, y: -0.5, z: 6 }, rotation: { x: 0, y: 0, z: 0 } },
  { position: { x: -4, y: 2, z: 3 }, rotation: { x: -0.3, y: 0.7, z: 0 } },
  { position: { x: 0, y: 0, z: 5 }, rotation: { x: 0, y: 0, z: 0 } },
  { position: { x: 0, y: 3, z: 4 }, rotation: { x: -0.5, y: 0, z: 0 } },
];

// Show a specific section with smooth transitions
function showSection(sectionIndex) {
  // Hide all sections first with smooth transitions
  if (titleContainer.style.opacity > 0) {
    titleContainer.style.opacity = 0;
  }
  if (introPanel.style.opacity > 0) {
    introPanel.style.opacity = 0;
  }
  if (sponsorsBar.style.opacity > 0) {
    sponsorsBar.style.opacity = 0;
  }
  if (judgesPanel.style.opacity > 0) {
    judgesPanel.style.opacity = 0;
    judgesPanel.style.pointerEvents = "none";
  }
  if (registerCta.style.opacity > 0) {
    registerCta.style.opacity = 0;
  }

  // Small delay before showing new section
  setTimeout(() => {
    // Reset globe and connections
    controls.autoRotateSpeed = 0.5;
    connectionsGroup.clear();

    // Handle title position
    if (sectionIndex === 1) {
      // Move title up for the intro section
      titleContainer.classList.add("title-top");
    } else {
      // Reset title position for other sections
      titleContainer.classList.remove("title-top");
    }

    // Show relevant sections based on index
    switch (sectionIndex) {
      case 0: // Initial view
        titleContainer.style.opacity = 1;
        break;

      case 1: // Introduction
        titleContainer.style.opacity = 1;
        introPanel.style.opacity = 1;
        introPanel.classList.add("intro-centered");
        break;

      case 2: // Network Connections
        titleContainer.style.opacity = 0.5;
        sponsorsBar.style.opacity = 1;
        introPanel.classList.remove("intro-centered");
        controls.autoRotateSpeed = 0.2;

        // Create connections between tech hubs
        const techHubPoints = pointsGroup.children.filter((point) => point.userData && point.userData.center && point.userData.center.color === 0x00ffff);

        for (let i = 0; i < techHubPoints.length; i += 2) {
          if (techHubPoints[i] && techHubPoints[i + 1]) {
            createConnection(techHubPoints[i], techHubPoints[i + 1], 0x00ffff);
          }
        }
        break;

      case 3: // Judges
        judgesPanel.style.opacity = 1;
        judgesPanel.style.pointerEvents = "auto";
        introPanel.classList.remove("intro-centered");
        controls.autoRotateSpeed = 0.1;
        break;

      case 4: // Registration
        registerCta.style.opacity = 1;
        introPanel.classList.remove("intro-centered");
        controls.autoRotateSpeed = 1;

        // Create a burst of connections
        const randomPoints = getRandomPoints(10);
        for (let i = 0; i < randomPoints.length - 1; i++) {
          createConnection(randomPoints[i], randomPoints[i + 1], 0xff9a9e);
        }
        break;
    }
  }, 300);

  // Smoothly animate camera to new position
  animateCameraToPosition(cameraPositions[sectionIndex]);
}

// Smoothly animate camera to a new position
function animateCameraToPosition(targetPosition) {
  const startPosition = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
  };

  // Use an animation library or simple animation function
  // For simplicity, we'll use a direct lerp with setTimeout
  const duration = 1500; // ms
  const startTime = Date.now();

  function updateCamera() {
    const now = Date.now();
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease in-out function
    const easeProgress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

    // Interpolate position
    camera.position.x = startPosition.x + (targetPosition.position.x - startPosition.x) * easeProgress;
    camera.position.y = startPosition.y + (targetPosition.position.y - startPosition.y) * easeProgress;
    camera.position.z = startPosition.z + (targetPosition.position.z - startPosition.z) * easeProgress;

    // Continue animation if not complete
    if (progress < 1) {
      requestAnimationFrame(updateCamera);
    }
  }

  // Start the animation
  updateCamera();
}

// Get random points from the pointsGroup
function getRandomPoints(count) {
  const points = [];
  const availablePoints = pointsGroup.children.filter((child) => child.geometry.type === "SphereGeometry");

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * availablePoints.length);
    points.push(availablePoints[randomIndex]);
  }

  return points;
}

// Hide loading screen
function hideLoading() {
  loadingScreen.style.opacity = 0;
  loadingScreen.style.visibility = "hidden";
  sceneReady = true;

  // Make sure title is visible after loading
  titleContainer.style.opacity = 1;

  // Start prize animation after a delay
  setTimeout(() => {
    animatePrizeAmount();
  }, 1500);
}

// Animate prize amount with a simple count-up
function animatePrizeAmount() {
  const prizeCounter = document.getElementById("prize-counter");
  if (!prizeCounter) return;

  const finalValue = 1000000;
  const duration = 3000; // 3 seconds
  const startTime = Date.now();
  const startValue = 0;

  function updateCounter() {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Use an easing function for more natural animation (easeOutExpo)
    const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

    // Calculate current value
    const currentValue = Math.floor(startValue + (finalValue - startValue) * easedProgress);

    // Format as currency
    const formattedValue = "$" + currentValue.toLocaleString();
    prizeCounter.textContent = formattedValue;

    // Add pulse effect at specific milestones
    if (currentValue % 250000 === 0 || progress === 1) {
      prizeCounter.style.transform = "scale(1.05)";
      setTimeout(() => {
        prizeCounter.style.transform = "scale(1)";
      }, 150);
    }

    // Continue animation if not complete
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }

  // Start the animation
  updateCounter();
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (controls) controls.update();

  // Rotate particle ring
  if (particleSystem) {
    particleSystem.rotation.y += 0.001;
    particleSystem.rotation.x += 0.0005;
  }

  // Pulse effect for points
  pointsGroup.children.forEach((point, index) => {
    if (point.geometry.type === "SphereGeometry") {
      const time = Date.now() * 0.001;
      const pulse = Math.sin(time + index) * 0.1 + 0.9;
      point.scale.set(pulse, pulse, pulse);
    }
  });

  // Render the scene
  renderer.render(scene, camera);
}

// Start the application
window.addEventListener("load", init);
