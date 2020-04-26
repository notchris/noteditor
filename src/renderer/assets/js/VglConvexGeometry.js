/* eslint-disable no-nested-ternary */
import {Vector2, Vector3, Shape, Path, ExtrudeGeometry} from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import {VglGeometry }from 'vue-gl';

export default {
  mixins: [VglGeometry],
  props: {
    type: { default: 'block' },
    points: { default: [
      [1, 1, 1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, 1, 1],
      [1, -1, 1],
      [1, -1, -1],
      [-1, -1, -1],
      [-1, -1, 1]
    ]}
  },
  computed: {
    inst() {
      const pointArr = [];
      if (this.points.length) {
        this.points.forEach((p) => {
          pointArr.push(new Vector3(p[0], p[1], p[2]))
        })
      }

      const geometry = new ConvexGeometry(
        pointArr
      );

      // Update Normals
      if (!geometry.boundingBox) geometry.computeBoundingBox();
      const sz = geometry.boundingBox.getSize(new Vector3());
      // eslint-disable-next-line prefer-destructuring
      const min = geometry.boundingBox.min;
      if (geometry.faceVertexUvs[0].length === 0) {
          for (let i = 0; i < geometry.faces.length; i += 1) {
              geometry.faceVertexUvs[0].push([new Vector2(), new Vector2(), new Vector2()]);
          }
      }
      for (let j = 0; j < geometry.faces.length; j += 1) {
          const faceUVs = geometry.faceVertexUvs[0][j]
          const va = geometry.vertices[geometry.faces[j].a]
          const vb = geometry.vertices[geometry.faces[j].b]
          const vc = geometry.vertices[geometry.faces[j].c]
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
      geometry.elementsNeedUpdate = geometry.verticesNeedUpdate = true;
      geometry.uvsNeedUpdate = true;

      return geometry;
    }
  }
};