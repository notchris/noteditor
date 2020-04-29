/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-destructuring */
import {Vector2, Vector3, Shape, Path, ExtrudeGeometry} from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import blockTypes from '../../assets/config/blocks.json';

export default class GeometryHelper {
    constructor(type) {
        this.type = type;
        this.geometry = null;
        this.points = [];

        blockTypes.forEach((block) => {
          if (block.id === this.type) {
            block.points.forEach((p) => {
              this.points.push(new Vector3(p[0], p[1], p[2]));
            });
          }
        });

        this.geometry = new ConvexGeometry(
          this.points
        );

        if (!this.geometry.boundingBox) this.geometry.computeBoundingBox();
        const sz = this.geometry.boundingBox.getSize(new Vector3());
        const min = this.geometry.boundingBox.min;
        if (this.geometry.faceVertexUvs[0].length === 0) {
            for (let i = 0; i < this.geometry.faces.length; i += 1) {
                this.geometry.faceVertexUvs[0].push([new Vector2(), new Vector2(), new Vector2()]);
            }
        }
        for (let j = 0; j < this.geometry.faces.length; j += 1) {
            const faceUVs = this.geometry.faceVertexUvs[0][j]
            const va = this.geometry.vertices[this.geometry.faces[j].a]
            const vb = this.geometry.vertices[this.geometry.faces[j].b]
            const vc = this.geometry.vertices[this.geometry.faces[j].c]
            const vab = new Vector3().copy(vb).sub(va)
            const vac = new Vector3().copy(vc).sub(va)
            const vcross = new Vector3().copy(vab).cross(vac);
            vcross.set(Math.abs(vcross.x), Math.abs(vcross.y), Math.abs(vcross.z))
            const majorAxis = vcross.x > vcross.y ? (vcross.x > vcross.z ? 'x' : vcross.y > vcross.z ? 'y' : vcross.y > vcross.z) : vcross.y > vcross.z ? 'y' : 'z'
            const uAxis = majorAxis === 'x' ? 'y' : majorAxis === 'y' ? 'x' : 'x';
            const vAxis = majorAxis === 'x' ? 'z' : majorAxis === 'y' ? 'z' : 'y';
            faceUVs[0].set((va[uAxis] - min[uAxis]) / sz[uAxis], (va[vAxis] - min[vAxis]) / sz[vAxis])
            faceUVs[1].set((vb[uAxis] - min[uAxis]) / sz[uAxis], (vb[vAxis] - min[vAxis]) / sz[vAxis])
            faceUVs[2].set((vc[uAxis] - min[uAxis]) / sz[uAxis], (vc[vAxis] - min[vAxis]) / sz[vAxis])
        }
        this.geometry.elementsNeedUpdate = this.geometry.verticesNeedUpdate = true;
        this.geometry.uvsNeedUpdate = true;
        return this.geometry;
    }
}