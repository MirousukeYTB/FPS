// Initialisation des variables de base
let scene, camera, renderer;
let controls;
let bullets = [];
const moveSpeed = 0.1;
const bulletSpeed = 0.2;
const clock = new THREE.Clock();

// Initialiser la scène
function init() {
    // Créer la scène
    scene = new THREE.Scene();
    
    // Créer une caméra à la première personne
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Ajouter un sol
    const floorGeometry = new THREE.PlaneGeometry(200, 200);
    const floorMaterial = new THREE.MeshBasicMaterial({color: 0x333333, side: THREE.DoubleSide});
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = - Math.PI / 2;
    scene.add(floor);

    // Ajouter un cube comme cible
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 0.5, -5);
    scene.add(cube);
    
    // Ajouter un éclairage basique
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10).normalize();
    scene.add(light);
    
    // Initialiser le renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("game-container").appendChild(renderer.domElement);
    
    // Contrôle du pointeur (Pointer Lock API)
    document.body.addEventListener("click", () => {
        document.body.requestPointerLock();
    });

    document.addEventListener('pointerlockchange', () => {
        if (document.pointerLockElement === document.body) {
            document.addEventListener("mousemove", onMouseMove, false);
        } else {
            document.removeEventListener("mousemove", onMouseMove, false);
        }
    });

    // Ajouter un événement de tir avec la souris
    document.addEventListener("click", shootBullet);

    // Ajuster la taille du canvas quand la fenêtre change
    window.addEventListener('resize', onWindowResize, false);
}

// Fonction pour gérer les mouvements de la caméra avec la souris
function onMouseMove(event) {
    const movementX = event.movementX || 0;
    const movementY = event.movementY || 0;

    camera.rotation.y -= movementX * 0.002;
    camera.rotation.x -= movementY * 0.002;
}

// Fonction pour tirer une "balle"
function shootBullet() {
    const bulletGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const bulletMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    
    bullet.position.set(camera.position.x, camera.position.y, camera.position.z);
    bullet.direction = new THREE.Vector3();
    camera.getWorldDirection(bullet.direction);
    
    bullets.push(bullet);
    scene.add(bullet);
}

// Fonction pour redimensionner le renderer lors du redimensionnement de la fenêtre
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Mise à jour des positions des balles et de la scène
function update() {
    const delta = clock.getDelta();

    bullets.forEach((bullet, index) => {
        bullet.position.add(bullet.direction.clone().multiplyScalar(bulletSpeed));
        
        // Si la balle dépasse une certaine distance, on la supprime
        if (bullet.position.length() > 100) {
            scene.remove(bullet);
            bullets.splice(index, 1);
        }
    });

    renderer.render(scene, camera);
}

// Boucle d'animation
function animate() {
    requestAnimationFrame(animate);
    update();
}

// Initialiser et démarrer le jeu
init();
animate();
