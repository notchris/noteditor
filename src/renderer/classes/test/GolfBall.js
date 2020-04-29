import { Sphere, Body, Material } from 'cannon-es';
import { SphereBufferGeometry, MeshToonMaterial, Mesh, Vector3 } from 'three';

export default class GolfBall {
    constructor (size, spawn) {
        this.size = size;
        this.spawn = spawn;
        this.moving = false;

        this.physics = new Material();
        const shape = new Sphere(this.size);
        this.body = new Body({ mass: 5, material: this.physics, ccdSpeedThreshold: 2, ccdIterations: 10 });
        this.body.linearDamping = 0.9;
        this.body.addShape(shape);

        // Ball collides with hole sensor
        this.body.addEventListener("collide", (e) => {
            if (e.body.id === 'hole') {
                // 
            }
        });

        // Mesh
        this.mesh = new Mesh(
            new SphereBufferGeometry(this.size, 32, 32),
            new MeshToonMaterial({
                color: '#F1F1F1',
                flatShading: true
            })
        );
        this.mesh.castShadow = true;
        this.mesh.geometry.computeBoundingBox();

        this.setSpawn();

        return this;
    }

    setSpawn () {
        const v = new Vector3().copy(this.spawn);
        this.body.position.copy(new Vector3(v.x, v.y + 0.5, v.z));
        this.body.velocity.set(0,0,0);
        this.body.angularVelocity.set(0,0,0);
        this.body.linearDamping = 0.9;
        this.mesh.position.copy(new Vector3(v.x, v.y + 0.5, v.z));
    }

    hit (direction, force) {
        if (this.moving) return;
        this.body.velocity.set(direction.x * force / 1.5, 0, direction.z * force / 1.5);
    }
}