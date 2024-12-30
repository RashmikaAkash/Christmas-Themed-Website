const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg-canvas'),
  antialias: true,
  alpha: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Create particle system
const particlesCount = 3000;
const positions = new Float32Array(particlesCount * 3);
const colors = new Float32Array(particlesCount * 3);
const sizes = new Float32Array(particlesCount);

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 100;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
  
  colors[i * 3] = Math.random();
  colors[i * 3 + 1] = Math.random() * 0.2;
  colors[i * 3 + 2] = Math.random() * 0.2;
  
  sizes[i] = Math.random() * 2;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

const material = new THREE.ShaderMaterial({
  vertexShader: `
    attribute float size;
    varying vec3 vColor;
    
    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    
    void main() {
      float strength = distance(gl_PointCoord, vec2(0.5));
      strength = 1.0 - strength;
      strength = pow(strength, 3.0);
      
      vec3 color = mix(vec3(0.0), vColor, strength);
      gl_FragColor = vec4(color, strength);
    }
  `,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Mouse interaction
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Animation
const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();
  
  particles.rotation.x = elapsedTime * 0.1;
  particles.rotation.y = elapsedTime * 0.15;
  
  particles.rotation.x += (mouseY * 0.1 - particles.rotation.x) * 0.05;
  particles.rotation.y += (mouseX * 0.1 - particles.rotation.y) * 0.05;
  
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Parallax effect
const parallaxElements = document.querySelectorAll('.card, .hero, .event-image');
window.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  
  parallaxElements.forEach(element => {
    const speed = element.dataset.speed || 0.05;
    const rotateX = (y - 0.5) * 10 * speed;
    const rotateY = (x - 0.5) * 10 * speed;
    
    element.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateZ(10px)
    `;
  });
});