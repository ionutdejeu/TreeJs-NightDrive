
import { 
    Texture,
    RepeatWrapping,
    PlaneGeometry,
    MeshPhongMaterial,
    Mesh,
    SmoothShading,
    Object3D
} from 'three'
import 'simplex-noise'

export class Waves extends Object3D{
    constructor(scene,conf){
        super();
        this.conf= {
            fov: 75,
            cameraZ: 75,
            xyCoef: 50,
            zCoef: 10,
            lightIntensity: 0.9,
            ambientColor: 0x000000,
            light1Color: 0x0E09DC,
            light2Color: 0x1CD1E1,
            light3Color: 0x18C02C,
            light4Color: 0xee3bcf,
            ...conf
        };
        this.scene.add(this);
    }

    createPlane(){
        let plane;
        const simplex = new SimplexNoise();

    }

    initLights(scene){
        const r = 30;
        const y = 10;
        const lightDistance = 500;
    
        light1 = new PointLight(this.conf.light1Color, this.conf.lightIntensity, lightDistance);
        light1.position.set(0, y, r);
        scene.add(light1);
        light2 = new PointLight(this.conf.light2Color, this.conf.lightIntensity, lightDistance);
        light2.position.set(0, -y, -r);
        scene.add(light2);
        light3 = new PointLight(this.conf.light3Color, this.conf.lightIntensity, lightDistance);
        light3.position.set(r, y, 0);
        scene.add(light3);
        light4 = new PointLight(this.conf.light4Color, this.conf.lightIntensity, lightDistance);
        light4.position.set(-r, y, 0);
        scene.add(light4);
    }
}