
import { 
    Texture,
    RepeatWrapping,
    PlaneGeometry,
    MeshPhongMaterial,
    Mesh,
    SmoothShading,
    Object3D,
    DoubleSide,
    PlaneBufferGeometry
} from 'three'
import 'simplex-noise'

export class Waves{
    constructor(scene,conf){
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
        this.scene = scene;
        this.createPlane(scene,100,100);
        this.lights = {
            light1:null,
            light2:null,
            light3:null,
            light4:null
        };
        this.initLights(this.scene);
    }

    createPlane(scene,planeWidht,planeHeight){
        let plane;
        this.simplex = new SimplexNoise();

        this.mat = new MeshLambertMaterial({ color: 0xffffff, side: DoubleSide });
        this.geo = new PlaneBufferGeometry(planeWidht,planeWidht,planeWidht/2,planeHeight/2);
        this.plane = new Mesh(this.geo,this.mat);
        
        scene.add(plane);
        
        this.plane.rotation.x = -Math.PI / 2 - 0.2;
        this.plane.position.y = -25;
        
    }

    initLights(scene){
        const r = 30;
        const y = 10;
        const lightDistance = 500;
    
        this.lights.light1 = new PointLight(this.conf.light1Color, this.conf.lightIntensity, lightDistance);
        this.lights.light1.position.set(0, y, r);
        scene.add(this.lights.light1);
        this.lights.light2 = new PointLight(this.conf.light2Color, this.conf.lightIntensity, lightDistance);
        this.lights.light2.position.set(0, -y, -r);
        scene.add(this.lights.light2);
        this.lights.light3 = new PointLight(this.conf.light3Color, this.conf.lightIntensity, lightDistance);
        this.lights.light3.position.set(r, y, 0);
        scene.add(this.lights.light3);
        this.lights.light4 = new PointLight(this.conf.light4Color, this.conf.lightIntensity, lightDistance);
        this.lights.light4.position.set(-r, y, 0);
        scene.add(this.lights.light4);
    }

    render(){
        animatePlane();
        animateLights();
    }

    animatePlane() {
        gArray = this.plane.geometry.attributes.position.array;
        const time = Date.now() * 0.0002;
        for (let i = 0; i < gArray.length; i += 3) {
          gArray[i + 2] = this.simplex.noise4D(gArray[i] / this.conf.xyCoef,
            gArray[i + 1] / this.conf.xyCoef, time, 2) * this.conf.zCoef;
        }
        this.plane.geometry.attributes.position.needsUpdate = true;
        // plane.geometry.computeBoundingSphere();
    }

    animateLights() {
        const time = Date.now() * 0.001;
        const d = 50;
        this.lights.light1.position.x = Math.sin(time * 0.1) * d;
        this.lights.light1.position.z = Math.cos(time * 0.2) * d;
        this.lights.light2.position.x = Math.cos(time * 0.3) * d;
        this.lights.light2.position.z = Math.sin(time * 0.4) * d;
        this.lights.light3.position.x = Math.sin(time * 0.5) * d;
        this.lights.light3.position.z = Math.sin(time * 0.6) * d;
        this.lights.light4.position.x = Math.sin(time * 0.7) * d;
        this.lights.light4.position.z = Math.cos(time * 0.8) * d;
      }
    
    updateLightsColors() {
        this.conf.light1Color = chroma.random().hex();
        this.conf.light2Color = chroma.random().hex();
        this.conf.light3Color = chroma.random().hex();
        this.conf.light4Color = chroma.random().hex();
        this.lights.light1.color = new Color(conf.light1Color);
        this.lights.light2.color = new Color(conf.light2Color);
        this.lights.light3.color = new Color(conf.light3Color);
        this.lights.light4.color = new Color(conf.light4Color);
        // console.log(conf);
    }
}