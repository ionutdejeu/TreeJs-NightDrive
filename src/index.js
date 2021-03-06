import {
  EffectComposer,
  BloomEffect,
  SMAAEffect,
  RenderPass,
  EffectPass
} from 'postprocessing'
import { 
  WebGLRenderer, 
  Scene, 
  PerspectiveCamera, 
  HemisphereLight, 
  PointLight,
  Fog,
  Vector3,
  LinearToneMapping,
  PCFSoftShadowMap } from 'three'
import { preloader } from './loader'
import { TextureResolver } from './loader/resolvers/TextureResolver'
import { ImageResolver } from './loader/resolvers/ImageResolver'
import { GLTFResolver } from './loader/resolvers/GLTFResolver'
import {Map} from './objects/Map';
import {Car} from './objects/Car';

/* Custom settings */
const SETTINGS = {
  useComposer: true
}
let composer
let stats

/* Init renderer and canvas */
const container = document.body
const renderer = new WebGLRenderer({ antialias: true })
container.style.overflow = 'hidden'
container.style.margin = 0
container.appendChild(renderer.domElement)
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x242426 );

renderer.toneMapping = LinearToneMapping;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;

/* Main scene and camera */
const scene = new Scene();
scene.fog = new Fog(0x242426, 20, 600);
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10,600);
camera.position.z = 90


/* Lights */
let hemiLight = new HemisphereLight( 0xEBF7FD, 0xEBF7FD, 0.2 );
hemiLight.position.set( 0, 20, 20 );
scene.add( hemiLight );

/* Map */
let m = new Map();
scene.add(m.mesh);

let car  = new Car(camera);
scene.add(car);


/* Various event listeners */
window.addEventListener('resize', onResize)

/* Preloader */
preloader.init(new ImageResolver(), new GLTFResolver(), new TextureResolver())
preloader.load([
  { id: 'searchImage', type: 'image', url: SMAAEffect.searchImageDataURL },
  { id: 'areaImage', type: 'image', url: SMAAEffect.areaImageDataURL },
]).then(() => {
  initPostProcessing()
  onResize()
  animate()
  

})

/* some stuff with gui */
if (DEVELOPMENT) {
  const guigui = require('guigui')
  guigui.add(SETTINGS, 'useComposer')

  const Stats = require('stats.js')
  stats = new Stats()
  stats.showPanel(0)
  container.appendChild(stats.domElement)
  stats.domElement.style.position = 'absolute'
  stats.domElement.style.top = 0
  stats.domElement.style.left = 0
}

/* -------------------------------------------------------------------------------- */
function initPostProcessing () {
  composer = new EffectComposer(renderer);
  const bloomEffect = new BloomEffect()
  const smaaEffect = new SMAAEffect(preloader.get('searchImage'), preloader.get('areaImage'))
  const effectPass = new EffectPass(camera, smaaEffect, bloomEffect)
  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)
  composer.addPass(effectPass)
  effectPass.renderToScreen = true
}

/**
  Resize canvas
*/
function onResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
}

/**
  RAF
*/
function animate() {
  window.requestAnimationFrame(animate)
  render()

}


/**
 * Animate the
 */

/**
  Render loop
*/
function render () {
  if (DEVELOPMENT) {
    stats.begin()
  }
  car.update();
  renderer.toneMappingExposure = Math.pow( 0.91, 5.0 );
  if (SETTINGS.useComposer) {
    composer.render()
  } else {
    renderer.clear()
    renderer.render(scene, camera)
  }
  
  if (DEVELOPMENT) {
    stats.end()
  }
}
