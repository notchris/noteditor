/* eslint-disable no-console */
import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import * as CANNON from 'cannon-es';
import CameraControls from 'camera-controls';
import Sky from './Sky';
import GolfBall from './GolfBall';

import parseObjects from './Parser';

CameraControls.install({THREE});

let speedEl;
let renderEl;
let forceEl;

export default class Game {
    constructor(data, canvas, renderElement, speedElement) {
        renderEl = renderElement;
        speedEl = speedElement;

        this.map = data.map;
        this.textures = data.textures;

        // Clock
        this.clock = new THREE.Clock();

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            context: canvas.getContext('3d'),
            antialias: true
        });
        this.renderer.autoClear = false;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.shadowMap.width = 1024;
        this.renderer.shadowMap.height = 1024;

        // Scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0xFFFFFF, 0.03);
    
        // Camera
        this.camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 10000);
        this.camera.position.z = 5;
        this.camera.position.y = 5;
        this.scene.add(this.camera);

        // Controls
        this.controls = new OrbitControls(this.camera, renderEl);
        
        // Light, Shadows
        this.light = new THREE.AmbientLight(0xF1F1F1, 0.7);
        this.scene.add(this.light);
        this.dlight = new THREE.DirectionalLight(0xEEEEEE, 0.5);
        this.dlight.position.y = 5;
        this.dlight.position.multiplyScalar(1.5);
        this.dlight.castShadow = true;
        this.dlight.shadow.camera.left = -50;
        this.dlight.shadow.camera.right = 50;
        this.dlight.shadow.camera.top = 50;
        this.dlight.shadow.camera.bottom = -50;
        this.dlight.shadow.camera.far = 1000;
        this.scene.add(this.dlight);

        // Spawn
        this.spawn = new THREE.Vector3(0, 0, 0);
        this.spawnDirection = new THREE.Vector3(0, 0, 0);

        // Raycast Mouse
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.tempDir = new THREE.Vector3();

        // Velocity
        this.lastVelocity = new CANNON.Vec3(0, 1, 0);

        // World
        this.world = new CANNON.World();
        this.world.gravity.set(0,-10,0);
        this.world.quatNormalizeSkip = 0;
        this.world.quatNormalizeFast = false;
        this.world.defaultContactMaterial.contactEquationStiffness = 1e7;
        this.world.defaultContactMaterial.contactEquationRelaxation = 4;
        this.world.solver.iterations = 20;
        this.world.solver.tolerance = 0.0;

        // Contact Materials
        this.wallMaterial = new CANNON.Material();

        // Force Bar
        this.forceContainer = forceEl;

        // Defaults
        this.meshes = [];
        this.bodies = [];
        this.obj = new THREE.Object3D();
        this.ground = null;
        this.groundMesh = null;
        this.ball = null;
        this.holePosition = null;
        this.stroke = 1;
        this.initialCheck = false;
        this.didCheck = false;
        this.isStroke = false;
        this.lastDirection = null;
        this.lastForce = null;
        this.force = {
            val: 0
        };
        this.showForce = false;


        // Renderer Mouse move
        renderEl.addEventListener('mousemove', (event) => {
            this.mouse.set(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1
            );
        });

        this.init();
    }


    init () {
        // Ground
        this.groundMesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(100, 100),
            new THREE.MeshBasicMaterial({
                color: '#5F7430',
                side: THREE.DoubleSide
            })
        );
        this.scene.add(this.groundMesh);
        this.groundMesh.geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
        this.groundMesh.visible = false;

        // Sky
        const sky = new Sky(500);
        this.scene.add(sky);

        // Parse Objects
        parseObjects(this, this.map.objects);
        this.scene.add(this.obj);
        this.bounds = new THREE.Box3().setFromObject(this.obj);

        // Ball
        const s = this.map.spawn.split(' ');
        this.map.spawn = new THREE.Vector3(parseFloat(s[0]), parseFloat(s[1]), parseFloat(s[2]));
        this.ball = new GolfBall(0.1, this.map.spawn);
        this.world.addBody(this.ball.body);
        this.ball.body.velocity.set(0, 1, 0);
        this.scene.add(this.ball.mesh);

        // Contact Materials
        const materialTest = new CANNON.ContactMaterial(this.wallMaterial, this.ball.physics, { friction: 0.0, restitution: 0.7 });
        this.world.addContactMaterial(materialTest);

        // Test force on ball via mouse click
        renderEl.addEventListener('click', () => {
            this.ball.hit(this.tempDir, 30);
        });

        this.update();
    }

    updateArrow (target) {
        if (this.arrowHelper) {
            this.scene.remove(this.arrowHelper);
            this.arrowHelper = null;
        }
        if (!this.ball || this.ball.moving) return;
        
        target.y = this.ball.mesh.position.y;
        this.tempDir = new THREE.Vector3();
        this.tempDir.subVectors(target, this.ball.mesh.position).normalize();
        // Hide arrow if ball moving
        this.arrowHelper = new THREE.ArrowHelper(
            this.tempDir,
            new THREE.Vector3().copy(this.ball.mesh.position),
            1,
            0xff0000,
            0.25,
            0.25
        );
        this.scene.add(this.arrowHelper);
    }

    rayCast () {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObject(this.groundMesh);
        if (intersects.length > 0) {
            const v = new THREE.Vector3().copy(intersects[0].point).add(intersects[0].face.normal);
            if (this.lastDirection) return;
            this.updateArrow(v);
        }
    }

    updatePhysics () {
        if (this.clock) {
            this.world.step(1 / 120, this.clock.elapsedTime, 15);
            this.ball.mesh.position.copy(this.ball.body.position);
            this.ball.mesh.quaternion.copy(this.ball.body.quaternion);
    
            this.meshes.forEach((m, i) => {
                m.position.copy(this.bodies[i].position);
                m.quaternion.copy(this.bodies[i].quaternion);
            });
            if (this.ball.body.position.y < -5) {
                this.ball.setSpawn();
                return;
            }
            if (this.ball.body.velocity.length() < 0.01) {
                this.ball.body.velocity.set(0, 0, 0);
                this.ball.moving = false;
            } else {
                this.ball.moving = true;
                const speed = Math.sqrt(
                    this.ball.body.velocity.x * this.ball.body.velocity.x + 
                    this.ball.body.velocity.y * this.ball.body.velocity.y
                );
                speedEl.innerText = speed.toFixed(2);
            }
        }
    }

    update () {
        requestAnimationFrame(() => this.update());
        this.rayCast();
        this.updatePhysics();
        this.render();
    }

    render () {
        this.renderer.render(this.scene, this.camera);
    }
}

