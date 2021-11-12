// import * as THREE from 'three';
import * as THREE from '../../build/three.module.js';

// import {
//   Scene,
//   PerspectiveCamera,
//   WebGLRenderer,
//   // MeshLambertMaterial,
//   AmbientLight,
//   DirectionalLight,
//   Box3,
//   Vector3,
//   MOUSE,
// } from 'three';
import {
  Box3,
  Vector3,
  MOUSE,
  MeshLambertMaterial,
  AmbientLight,
  DirectionalLight,
} from '../../build/three.module.js';
// import OrbitControls from 'orbit-controls-es6';

import { OrbitControls } from '../../libs/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../../libs/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from '../../libs/jsm/loaders/DRACOLoader.js';
import { OBJLoader } from '../../libs/jsm/loaders/OBJLoader.js';
import { MTLLoader } from '../../libs/jsm/loaders/MTLLoader.js';
import { getData } from '../../api/models';
// import { VRButton } from '../../libs/webxr/VRButton.js';

// 定义全局变量
var camera,
  renderer,
  controls,
  scene,
  loadingId = null,
  obj_material,
  loader,
  objloader,
  mtlLoader,
  center,
  manager,
  layoutBox,
  meshList = [],
  app = 'v1';

function init() {
  initLoading.call(this);
  initScene();
  initCamera();
  initRenderer();
  initLight();
  initControls();
  initLoader.call(this);
}

// 加载等待
function initLoading() {
  const LOADINGTIME = 3000;
  let time = LOADINGTIME;
  const LOADINGUNIT = 40;
  loadingId = setInterval(() => {
    if (time > 0) {
      time -= LOADINGUNIT;
    }
    this.progress = parseInt(
      ((LOADINGTIME - time) / LOADINGTIME).toFixed(2) * 99 // 最多到达99
    );
  }, LOADINGUNIT);
}

// 初始化场景
function initScene() {
  scene = new THREE.Scene();
}

// 初始化渲染器
function initRenderer() {
  renderer = new THREE.WebGLRenderer({
    antialias: true, //抗割齿
    alpha: true,
    powerPreference: 'high-performance', //选择高性能GPU渲染
  });
  renderer.setClearColor(0xffffff);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearAlpha(0.1);
  document.getElementById('container').appendChild(renderer.domElement);
  renderer.shadowMap.enabled = true; //渲染阴影
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
  renderer.gammaOutput = true;
  renderer.gammaFactor = 10; //着色校正
}

// 初始化相机
function initCamera() {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
}

// 初始化轨迹球控件
function initControls() {
  controls = new OrbitControls(camera, renderer.domElement);
  camera.updateProjectionMatrix();
  controls.update();
}

// 设置轨迹球控件
function setControls(size, center) {
  controls.reset();
  // 此处将旋转和平移的键设反
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.ROTATE,
  };

  // 是否有阻尼作用
  controls.enableDamping = true;
  // 阻尼参数
  controls.dampingFactor = 0.5;

  // 视角最远距离
  controls.maxDistance = size * 20;
  // 视角最小距离
  controls.minDistance = 10;
  // 最大角度
  controls.maxPolarAngle = Math.PI / 1.1;
  controls.target = new THREE.Vector3(50, 50, 0);

  camera.near = size / 100;
  camera.far = size * 1000;
  camera.position.copy(center);
  camera.position.z += size; //size / 2.0;
  camera.lookAt(center);
  camera.updateProjectionMatrix();

  controls.update();
}

// 初始化灯光
function initLight() {
  // 环境光 影响整个场景的光源
  var ambientLight = new AmbientLight(0xbcbcbc, 0.6);
  scene.add(ambientLight);

  // 太阳光 模拟远处类似太阳的光源
  var directionalLight = new DirectionalLight(0xffffff, 0.5, 100);
  directionalLight.position.set(0, 10, 10).normalize();
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 512;
  directionalLight.shadow.mapSize.height = 512;
  // directionalLight.shadow.camera = new THREE.OrthographicCamera(
  //   -50000,
  //   50000,
  //   10000,
  //   0,
  //   0.1,
  //   880000
  // );
  console.log(directionalLight.shadow.camera);

  console.log(camera);
  scene.add(directionalLight);
}

// 初始化模型
async function initLoader() {
  let that = this;
  manager = new THREE.LoadingManager();
  manager.onStart = function(url, itemsLoaded, itemsTotal) {
    console.log(
      'Started loading file: ' +
        url +
        '.\nLoaded ' +
        itemsLoaded +
        ' of ' +
        itemsTotal +
        ' files.'
    );
  };

  manager.onLoad = function() {
    console.log('Loading complete!');
    // 微调模型
    // meshList.forEach((mesh) => {
    //   mesh.position.z -= layoutBox.z / 2;
    // });
    animate();
    clearInterval(loadingId);
    that.loadingFinished = true;
  };

  manager.onProgress = function(url, itemsLoaded, itemsTotal) {
    console.log(
      'Loading file: ' +
        url +
        '.\nLoaded ' +
        itemsLoaded +
        ' of ' +
        itemsTotal +
        ' files.'
    );
  };

  manager.onError = function(url) {
    console.error('There was an error loading ' + url);

    that.showError = true;
    that.loadingFinished = true;
  };
  //load model

  //gltf
  loader = new GLTFLoader(manager);
  var dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('./js/libs/draco/');
  loader.setDRACOLoader(dracoLoader);

  //obj
  objloader = new OBJLoader(manager);

  //mtl
  mtlLoader = new MTLLoader(manager);

  // 先加载货架模型
  loader.load(getApi('gltf'), function(gltf) {
    that.progress = 100;
    const obj = gltf.scene || gltf.scenes[0];
    const box = new Box3().setFromObject(obj);
    const size = box.getSize(new Vector3()).length();
    console.log('size#: ', box.getSize());
    layoutBox = box.getSize();
    center = box.getCenter(new Vector3());
    console.log('box: ', box);
    console.log('obj: ', obj);
    console.log('center: ', center);
    // obj.position.x += obj.position.x - center.x;
    // obj.position.y += obj.position.y - center.y;
    obj.position.z += box.getSize().z / 2;
    // if (app === 'v1') {
    //   obj.position.z -= 350; //老版本 减去地板厚度
    // } else {
    //   // obj.position.z -= 2100; //新版本 减去地板厚度
    // }

    // 模型中心
    // geometry.computeBoundingBox();
    // geometry.center()

    console.log('obj.position: ', obj.position);

    gltf.scene.traverse((child) => {
      //set material for gltf file to reflect ambientlight
      if (child.material) {
        child.material.metalness = 0.2;
        child.material.transparent = true;
        child.material.opacity = 0.9;
        child.geometry.center(); // 让模型居中
      }
    });

    // obj.rotation.x -= Math.PI / 2;

    setControls(size, center);

    scene.add(obj);
  });

  if (app) {
    let res = await getData(getApi('fixtures'), app);
    console.log('res: ', res);
    let statics;
    if (app === 'v1') {
      statics = res.static;
    } else {
      statics = res.data.static;
    }
    console.log('statics: ', statics);

    // 加载额外模型
    for (let fixture of statics) {
      //obj format loader
      let path = getModelPath(fixture.model);
      console.log('path: ', path);

      mtlLoader.load(path.mtl, function(materials) {
        materials.preload();
        let objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        var black_material = new THREE.MeshLambertMaterial({ color: 0x333333 });
        var red_material = new THREE.MeshLambertMaterial({ color: 0x993333 });
        objLoader.load(path.obj, function(object) {
          let mesh = object;

          mesh.scale.set(fixture.scale[0], fixture.scale[1], fixture.scale[2]);
          mesh.rotation.x = fixture.direction[0];
          mesh.rotation.y = fixture.direction[1];
          mesh.rotation.z = fixture.direction[2];
          mesh.castShadow = true;

          const box = new Box3().setFromObject(mesh);
          const b_center = box.getCenter(new Vector3());
          console.log('object: ', mesh);
          console.log('center: ', b_center);

          mesh.children.forEach(function(child) {
            if (
              child.name.includes('Torus') ||
              child.name.includes('Plane') ||
              child.name.includes('Box024') ||
              child.name.includes('Box025') ||
              child.name.includes('Box001') ||
              child.name.includes('Box007') ||
              child.name.includes('Box009')
            ) {
              child.material = black_material;
            } else if (
              child.name.includes('Box') ||
              child.name.includes('Cylinder001')
            ) {
              child.material = red_material;
            } else if (
              child.name.includes('Cylinder') ||
              child.name.includes('Cylinder002')
            ) {
              child.material = black_material;
            }
          });

          mesh.position.x = fixture.position[0];
          mesh.position.y = fixture.position[1];
          mesh.position.z = fixture.position[2];
          console.log('############box.getSize().z: ', box.getSize().z);
          // mesh.position.z = box.getSize().z;

          console.log('mesh.position: ', mesh.position);
          meshList.push(mesh);
          scene.add(mesh);
        });
      });
    }
  }
}
// 获取额外模型地址
function getModelPath(type) {
  let base_path =
    process.env.NODE_ENV === 'production' ? '/static-3d/models/' : '/models/';

  // let base_path = '/models/';
  // let q = 'static-3d'
  let obj = '';
  let mtl = '';
  switch (type) {
    case 'platform':
      // platform
      obj = 'Workstation.obj';
      mtl = 'Workstation.mtl';
      // obj = 'forklift.obj'
      // mtl = 'forklift.mtl'
      break;
    case 'forklift':
      // Forklift
      obj = '0311-Forklift.obj';
      mtl = '0311-Forklift.mtl';
      // obj = 'AGV.obj'
      // mtl = 'AGV.mtl'
      break;
    case 'AGV':
      // AGV
      // obj = 'forklift.obj';
      // mtl = 'forklift.mtl';
      obj = 'AGV.obj';
      mtl = 'AGV.mtl';
      break;
    case 'convey_line':
      // convey_line
      obj = 'conveyor.obj';
      mtl = 'conveyor.mtl';
      break;
    case 'manup_truck':
      // manup_truck
      obj = 'manup_truck.obj';
      mtl = 'manup_truck.mtl';
      // obj = 'forklift.obj';
      // mtl = 'forklift.mtl';
      break;
    default:
      break;
  }
  return {
    obj: base_path + obj,
    mtl: base_path + mtl,
  };
}

// 动画
function animate() {
  renderer.setAnimationLoop(render);
}

// 渲染
function render() {
  // meshList.forEach((mesh, index) => {
  //   mesh.position.x += (index+1)*50;
  // })
  // console.log('camera.position: ', camera.position);
  renderer.render(scene, camera);
}

// 获取货架模型的api
function getApi(type) {
  const url = new URL(location.href);
  console.log('url: ', url);
  const project_id = url.searchParams.get('project_id');
  const session_id = url.searchParams.get('session_id');
  let path = url.searchParams.get('path');
  let fixtures = url.searchParams.get('fixtures');
  let appName = url.searchParams.get('app');
  if (appName) {
    app = appName;
  }
  console.log('app: ', app);
  let random = `${Math.random()}.${Math.floor(Date.now() / 1000)}`;
  let api;
  if (type === 'gltf') {
    if (app === 'v1') {
      api = `/api/event/file/download?type=1&project_id=${project_id}&session_id=${session_id}&path=${path}&result=0&random=${random}`;
      if (!project_id || !session_id || !path) {
        api = '/api/design.gltf';
      }
    } else {
      api = `/api/project/download3D?project_id=${project_id}&random=${random}`;
    }
  } else {
    if (app === 'v1') {
      api = `type=1&project_id=${project_id}&session_id=${session_id}&path=${fixtures}&result=0&random=${random}`;
    } else {
      api = `id=${project_id}&type=static_fixtures&random=${random}`;
    }
  }
  console.log(api);
  return api;
}

export { init };
