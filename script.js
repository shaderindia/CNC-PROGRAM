// script.js

// Setup Three.js Scene
const container = document.getElementById('simulation-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);

// Add Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Add Grid Helper
const gridHelper = new THREE.GridHelper(200, 20);
scene.add(gridHelper);

// Add Toolpath Line
const toolpathMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const toolpathGeometry = new THREE.BufferGeometry();
let points = [];
let toolpathLine = null;

// Tool Visual Representation
const toolGeometry = new THREE.SphereGeometry(2, 32, 32);
const toolMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const tool = new THREE.Mesh(toolGeometry, toolMaterial);
scene.add(tool);

// Camera Position
camera.position.set(100, 100, 100);
controls.update();

// Parse G-code and Animate Toolpath
function animateToolpath(gcode) {
    points = [];
    const lines = gcode.split('\n');
    let x = 0, y = 0, z = 0;

    lines.forEach(line => {
        if (line.startsWith('G01')) {
            const match = line.match(/X([-\d.]+)|Y([-\d.]+)|Z([-\d.]+)/g);
            if (match) {
                match.forEach(coord => {
                    if (coord.startsWith('X')) x = parseFloat(coord.slice(1));
                    if (coord.startsWith('Y')) y = parseFloat(coord.slice(1));
                    if (coord.startsWith('Z')) z = parseFloat(coord.slice(1));
                });
                points.push(new THREE.Vector3(x, y, z));
            }
        }
    });

    toolpathGeometry.setFromPoints(points);
    if (toolpathLine) scene.remove(toolpathLine);
    toolpathLine = new THREE.Line(toolpathGeometry, toolpathMaterial);
    scene.add(toolpathLine);

    // Animate Tool
    let index = 0;
    function animate() {
        if (index < points.length) {
            tool.position.copy(points[index]);
            index++;
            requestAnimationFrame(animate);
        }
    }
    animate();
}

// Generate G-code and Start Simulation
document.getElementById('cnc-form').addEventListener('submit', event => {
    event.preventDefault();

    const gcode = `
G90
G01 X0 Y0 Z0 F500
G01 X50 Y0 Z0
G01 X50 Y50 Z0
G01 X0 Y50 Z0
G01 X0 Y0 Z0
`;
    document.getElementById('gcode-preview').textContent = gcode;
    animateToolpath(gcode);
});

// Render Loop
function render() {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
}
render();
