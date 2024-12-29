
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

// Create snow particles
const snowGeometry = new THREE.BufferGeometry();
const snowCount = 5000;
const positions = new Float32Array(snowCount * 3);

for (let i = 0; i < snowCount * 3; i += 3) {
    positions[i] = Math.random() * 2000 - 1000;
    positions[i + 1] = Math.random() * 2000 - 1000;
    positions[i + 2] = Math.random() * 2000 - 1000;
}

snowGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const snowMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 4,
    transparent: true
});

const snow = new THREE.Points(snowGeometry, snowMaterial);
scene.add(snow);
camera.position.z = 1000;

// Animation
function animate() {
    requestAnimationFrame(animate);

    const positions = snow.geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 2; // Snow falling speed

        if (positions[i + 1] < -1000) {
            positions[i + 1] = 1000;
        }
    }

    snow.geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

