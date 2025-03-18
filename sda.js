window.addEventListener('DOMContentLoaded', () => {
  // Grab the container where we'll render the model
  const container = document.getElementById('model-container');
  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0C0A00);

  // Camera
  const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
  );
  camera.position.set(0, 1, 3);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // OrbitControls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = false; // Disable zoom on scroll
  controls.enablePan = false;  // Optional: disable panning
  controls.update();

  // Load model
  const loader = new THREE.GLTFLoader();
  loader.load(
      'controller.glb',
      (gltf) => {
          const model = gltf.scene;
          model.scale.set(2.5, 2.5, 2.5); // Scale up the model (adjust as needed)
          scene.add(model);
          console.log("Model loaded successfully");

          // Mouse movement logic
          let targetRotation = new THREE.Euler(0, 0, 0, 'XYZ');
          let currentRotation = new THREE.Euler(0, 0, 0, 'XYZ');

          document.addEventListener('mousemove', (event) => {
              const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
              const mouseY = (event.clientY / window.innerHeight) * 2 - 1;

              targetRotation.y = mouseX * Math.PI;
              targetRotation.x = mouseY * Math.PI * 0.5;

              currentRotation.x += (targetRotation.x - currentRotation.x) * 0.1;
              currentRotation.y += (targetRotation.y - currentRotation.y) * 0.1;

              model.rotation.set(currentRotation.x, currentRotation.y, 0);
          });
      },
      (xhr) => {
          console.log((xhr.loaded / xhr.total * 100).toFixed(2) + '% loaded');
      },
      (error) => {
          console.error('Error loading model:', error);
      }
  );

  // Handle resize (on window resize, NOT on scroll)
  function resizeRenderer() {
      const width = container.clientWidth;
      const height = container.clientHeight;

      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', resizeRenderer);

  // Animation loop
  function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
  }
  animate();
})

function toggleSidebar() {
    const sidebar = document.getElementById('sideNavbar');
    sidebar.classList.toggle('open'); // Toggle the 'open' class to slide in/out the sidebar
  }
  

// Select the container
const productsContainer = document.querySelector('.products');

// Scroll function
window.addEventListener('wheel', (event) => {
  const section = document.querySelector('.scroll-section');
  const rect = section.getBoundingClientRect();

  // If we're in the products section
  if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
    event.preventDefault(); // Stop vertical scroll
    productsContainer.scrollLeft += event.deltaY; // Move horizontally
  }
}, { passive: false });
