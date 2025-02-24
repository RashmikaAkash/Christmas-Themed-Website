// Snow Scene
const snowScene = new THREE.Scene();
const snowCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const snowRenderer = new THREE.WebGLRenderer({ alpha: true });
snowRenderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(snowRenderer.domElement);

// Create snow particles for Snow Scene
const snowGeometry = new THREE.BufferGeometry();
const snowCount = 5000;
const snowPositions = new Float32Array(snowCount * 3);

for (let i = 0; i < snowCount * 3; i += 3) {
    snowPositions[i] = Math.random() * 2000 - 1000; // X
    snowPositions[i + 1] = Math.random() * 2000 - 1000; // Y
    snowPositions[i + 2] = Math.random() * 2000 - 1000; // Z
}

snowGeometry.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));
const snowMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 4,
    transparent: true,
});
const snow = new THREE.Points(snowGeometry, snowMaterial);
snowScene.add(snow);

snowCamera.position.z = 1000;

// Snow Animation
function animateSnow() {
    const snowArray = snow.geometry.attributes.position.array;

    for (let i = 0; i < snowArray.length; i += 3) {
        snowArray[i + 1] -= 2; // Falling speed
        if (snowArray[i + 1] < -1000) {
            snowArray[i + 1] = 1000; // Reset position
        }
    }

    snow.geometry.attributes.position.needsUpdate = true;
    snowRenderer.render(snowScene, snowCamera);
    requestAnimationFrame(animateSnow);
}

// Floating Particles Scene
const particlesScene = new THREE.Scene();
const particlesCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const particlesRenderer = new THREE.WebGLRenderer({ alpha: true });
particlesRenderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(particlesRenderer.domElement);

const particlesGroup = new THREE.Group();
const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
const particleMaterial = new THREE.MeshBasicMaterial({ color: 0xe31837 });

for (let i = 0; i < 100; i++) {
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    particle.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
    );
    particle.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
    );
    particlesGroup.add(particle);
}

particlesScene.add(particlesGroup);
particlesCamera.position.z = 30;

// Particles Animation
function animateParticles() {
    particlesGroup.children.forEach(particle => {
        particle.position.add(particle.velocity);

        if (Math.abs(particle.position.x) > 25) particle.velocity.x *= -1;
        if (Math.abs(particle.position.y) > 25) particle.velocity.y *= -1;
        if (Math.abs(particle.position.z) > 25) particle.velocity.z *= -1;
    });

    particlesGroup.rotation.x += 0.001;
    particlesGroup.rotation.y += 0.001;

    particlesRenderer.render(particlesScene, particlesCamera);
    requestAnimationFrame(animateParticles);
}

// Unified Window Resize Handler
window.addEventListener('resize', () => {
    // Update Snow Scene
    snowCamera.aspect = window.innerWidth / window.innerHeight;
    snowCamera.updateProjectionMatrix();
    snowRenderer.setSize(window.innerWidth, window.innerHeight);

    // Update Particles Scene
    particlesCamera.aspect = window.innerWidth / window.innerHeight;
    particlesCamera.updateProjectionMatrix();
    particlesRenderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animations
animateSnow();
animateParticles();
