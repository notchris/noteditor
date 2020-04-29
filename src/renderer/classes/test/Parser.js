/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import GeometryHelper from './GeometryHelper';

// Textures

export default function parseObjects (game, objects) {
    objects.forEach((object) => {
        if (object.category === 'entity') {
            // 
        } else if (object.category === 'block') {
            const s = object.position.split(' ');
            const pos = new THREE.Vector3(parseFloat(s[0]), parseFloat(s[1]), parseFloat(s[2]))
            const geometry = new GeometryHelper(object.type);
        
            const g = geometry.clone();
            const verts = g.vertices.map((v) => new CANNON.Vec3(v.x, v.y, v.z));
            const faces = g.faces.map((f) => [f.a, f.b, f.c]);
            const shape = new CANNON.ConvexPolyhedron({
                vertices: verts,
                faces
            });
            shape.collisionFilterGroup = 1;
            shape.collisionFilterMask = -1;
            let physicsMat;
            if (object.type === 'wall' || object.type === 'half_wall') {
                physicsMat = game.wallMaterial
            } else {
                physicsMat = null;
            }
            const body = new CANNON.Body({ mass: 0, material: physicsMat });
            body.addShape(shape);
            body.position.copy(pos);

            const rot = object.rotation.split(' ');
            const r = new THREE.Quaternion().setFromEuler(new THREE.Euler(parseFloat(rot[0]), parseFloat(rot[1]), parseFloat(rot[2])))
            body.quaternion.copy(r);
            game.world.addBody(body);
            game.bodies.push(body);
            const tex = game.textures.filter((t) => t.name === object.texture);
            const mat = new THREE.MeshToonMaterial({
                color: object.color || '#CCCCCC',
                map: tex.length ? new THREE.TextureLoader().load(tex[0].data) : null
            });

            const mesh = new THREE.Mesh(g,mat);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.type = object.type;
            game.obj.add(mesh);
            mesh.position.copy(pos)
            game.meshes.push(mesh);
        } else {
            console.log('model i think');
        }
    });
}