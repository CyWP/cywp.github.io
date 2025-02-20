import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/postprocessing/ShaderPass.js';

// Pixelation shader
const defaultTexture = new THREE.TextureLoader().load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAgMBAAIA4vQdAAAAAElFTkSuQmCC');
window.themeColors = {
  light: new THREE.Color("#ffffff"), // bright/white theme
  dark: new THREE.Color("#222222")   // dark theme
};

const pixelationShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    pixelSize: { value: 8 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float pixelSize;
    varying vec2 vUv;
    void main() {
      vec2 p = floor(vUv * resolution / pixelSize) * pixelSize;
      gl_FragColor = texture2D(tDiffuse, p / resolution);
    }
  `
};

const boxBlurShader = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    blurSize: { value: 16 }, // Size of the blur
    aberrationStrength: { value: 8.0 } // Controls how strong the chromatic shift is
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float blurSize;
    uniform float aberrationStrength;
    varying vec2 vUv;
    
    void main() {
      vec2 texelSize = 1.0 / resolution;

      // Chromatic aberration offsets
      vec2 redOffset = vec2(aberrationStrength * texelSize.x, 0.0);
      vec2 blueOffset = vec2(-aberrationStrength * texelSize.x, 0.0);

      // Initialize color and alpha accumulators
      vec4 colorR = vec4(0.0);
      vec4 colorG = vec4(0.0);
      vec4 colorB = vec4(0.0);

      // Apply blur to each channel separately
      colorR += texture2D(tDiffuse, vUv + redOffset) * 0.2;
      colorR += texture2D(tDiffuse, vUv + redOffset + vec2(blurSize * texelSize.x, 0.0)) * 0.2;
      colorR += texture2D(tDiffuse, vUv + redOffset - vec2(blurSize * texelSize.x, 0.0)) * 0.2;
      colorR += texture2D(tDiffuse, vUv + redOffset + vec2(0.0, blurSize * texelSize.y)) * 0.2;
      colorR += texture2D(tDiffuse, vUv + redOffset - vec2(0.0, blurSize * texelSize.y)) * 0.2;

      colorG += texture2D(tDiffuse, vUv) * 0.2;
      colorG += texture2D(tDiffuse, vUv + vec2(blurSize * texelSize.x, 0.0)) * 0.2;
      colorG += texture2D(tDiffuse, vUv - vec2(blurSize * texelSize.x, 0.0)) * 0.2;
      colorG += texture2D(tDiffuse, vUv + vec2(0.0, blurSize * texelSize.y)) * 0.2;
      colorG += texture2D(tDiffuse, vUv - vec2(0.0, blurSize * texelSize.y)) * 0.2;

      colorB += texture2D(tDiffuse, vUv + blueOffset) * 0.2;
      colorB += texture2D(tDiffuse, vUv + blueOffset + vec2(blurSize * texelSize.x, 0.0)) * 0.2;
      colorB += texture2D(tDiffuse, vUv + blueOffset - vec2(blurSize * texelSize.x, 0.0)) * 0.2;
      colorB += texture2D(tDiffuse, vUv + blueOffset + vec2(0.0, blurSize * texelSize.y)) * 0.2;
      colorB += texture2D(tDiffuse, vUv + blueOffset - vec2(0.0, blurSize * texelSize.y)) * 0.2;

      // Blur the alpha channel the same way
      float alpha = 0.0;
      alpha += texture2D(tDiffuse, vUv).a * 0.2;
      alpha += texture2D(tDiffuse, vUv + vec2(blurSize * texelSize.x, 0.0)).a * 0.2;
      alpha += texture2D(tDiffuse, vUv - vec2(blurSize * texelSize.x, 0.0)).a * 0.2;
      alpha += texture2D(tDiffuse, vUv + vec2(0.0, blurSize * texelSize.y)).a * 0.2;
      alpha += texture2D(tDiffuse, vUv - vec2(0.0, blurSize * texelSize.y)).a * 0.2;

      // Combine channels with blurred alpha
      gl_FragColor = vec4(colorR.r, colorG.g, colorB.b, alpha);
    }
  `
};

function initThreeJS() {
  const container = document.getElementById("threejs-container");
  if (!container) {
    console.error("Three.js container not found!");
    return;
  }

  async function loadModels() {
    for (const path of modelPaths) {
      await new Promise((resolve, reject) => {
        loader.load(
          path,
          (gltf) => {
            const mesh = gltf.scene;
  
            // Compute bounding box of the mesh
            const box = new THREE.Box3().setFromObject(mesh);
            const size = new THREE.Vector3();
            box.getSize(size); // Get size of the bounding box
  
            // Calculate the scaling factor to make the largest dimension = 1
            const maxDimension = Math.max(size.x, size.y, size.z);
            const scaleFactor = getRandomValue(0.5, 1.2) / maxDimension;
  
            // Apply the scale to resize the model
            mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
  
            // Center the model by translating it so its bounding box center is at (0, 0, 0)
            box.setFromObject(mesh);
            const center = box.getCenter(new THREE.Vector3());
            mesh.position.sub(center); // Subtract center from the position to move the model to (0, 0, 0)
            mesh.position.add(new THREE.Vector3(getRandomValue(-maxdisp, maxdisp), getRandomValue(-maxdisp, maxdisp), getRandomValue(-maxdisp, maxdisp)))
            // Push mesh into baseMeshes array and add to the scene
            //Add shader
            mesh.traverse((child) => {
              if (child.isMesh) {
                const oldMat = child.material;
                const texture = oldMat.map || null; // use original texture if it exists
                child.material = new THREE.ShaderMaterial({
                  uniforms: {
                    uTexture: { value: texture },
                    uThemeColor: { value: window.themeColors[themeValue] },
                  },
                  vertexShader: `
                    varying vec3 vNormal;
                    varying vec2 vUv;
                    void main() {
                      vNormal = normalize(normalMatrix * normal);
                      vUv = uv;
                      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                  `,
                  fragmentShader: `
                    uniform sampler2D uTexture;
                    uniform vec3 uThemeColor;
                    varying vec3 vNormal;
                    varying vec2 vUv;

                    void main() {
                      // Always safe to sample, no null checks
                      vec3 texColor = texture2D(uTexture, vUv).rgb;
                      float facing = clamp(dot(vNormal, vec3(0.0, 0.0, 1.5)), 0.0, 1.0);
                      vec3 finalColor = mix(texColor, uThemeColor, facing);
                      gl_FragColor = vec4(finalColor, 1.0);
                    }
                  `
                });
                window.shaderMaterials.push(child.material)
              }
            });
            baseMeshes.push(mesh);
            scene.add(mesh);
  
            // Store random rotation values for later animation
            const rotation = {
              x: getRandomValue(-maxrot, maxrot),
              y: getRandomValue(-maxrot, maxrot),
              z: getRandomValue(-maxrot, maxrot),
            };
            rotations.push(rotation);
            
            const translation = {
              x: getRandomValue(-maxtrans, maxtrans),
              y: getRandomValue(-maxtrans, maxtrans),
              z: getRandomValue(-maxtrans, maxtrans),
            };
            translations.push(translation);
  
            resolve(); // Resolve after loading and processing the model
          },
          undefined,
          (error) => {
            console.error(`Error loading model: ${path}`, error);
            reject(error);
          }
        );
      });
    }
  }


  function getRandomValue(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Scene and camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(300, container.clientWidth / container.clientHeight, 0.1, 10000);
  camera.position.z = 2;
  const ambientLight = new THREE.AmbientLight(0xffffff, 2); // White light, intensity 1
  scene.add(ambientLight);

  // Load baseMeshes
  const modelPaths = [
    "/models/incakola.glb",
    "/models/muscle.glb",
    "/models/taxi.glb",
    "/models/dumbbell.glb",
    "/models/panton.glb",
    "/models/duchamp.glb",
    "/models/bosch_1.glb",
    "/models/bosch_2.glb",
    "/models/bosch_4.glb",
    "/models/bosch_5.glb",
    "/models/bosch_6.glb",
    "/models/bosch_7.glb",
    "/models/bosch_8.glb",
    "/models/bosch_9.glb",
    "/models/zucc.glb"
  ];
  const baseMeshes = [];
  const rotations = [];
  const translations = [];
  const loader = new GLTFLoader();
  const maxrot = 0.002;
  const maxdisp = 1.0;
  const mvmt_decay = 0.995;
  const maxtrans = 0.001;
  loadModels();

  for (let i = 0; i < baseMeshes.length; i++) {
      const mesh = baseMeshes[i];
      mesh.material = normalShaderMaterial}

  // Set up renderer with transparent background
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  renderer.setClearColor(0x000000, 0);

  // Set up post-processing
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const blurShaderPass = new ShaderPass(boxBlurShader);
  composer.addPass(blurShaderPass);
  blurShaderPass.renderToScreen = true;

  const pixelShaderPass = new ShaderPass(pixelationShader);
  composer.addPass(pixelShaderPass);
  pixelShaderPass.renderToScreen = true;
  
  // Values for transforming baseMeshes
  console.log(rotations);

  let running = true;   // pause / resume rendering
  let hasFocus = true;  // also track window focus

  function animate() {
    requestAnimationFrame(animate);

    if (!running || !hasFocus) return;

    // Apply rotation to each mesh
    for (let i = 0; i < baseMeshes.length; i++) {
      const mesh = baseMeshes[i];
      const rot = rotations[i];
      const tra = translations[i];

      if (rot) {
        mesh.rotation.x += rot.x;
        mesh.rotation.y += rot.y;
        mesh.rotation.z += rot.z;
      }

      if (tra) {
        mesh.position.x += tra.x;
        tra.x *= mvmt_decay;
        mesh.position.y += tra.y;
        tra.y *= mvmt_decay;
        mesh.position.z += tra.z;
        tra.z *= mvmt_decay;
      }
    }

    composer.render();
  }

  animate();

  // Update the renderer size on window resize
  window.addEventListener('resize', () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

  });
  // Pause when leaving page or switching tab
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
  });

  // Pause when window loses focus (optional, but smooth)
  window.addEventListener("blur", () => {
    hasFocus = false;
  });
  window.addEventListener("focus", () => {
    hasFocus = true;
  });
}
document.addEventListener("astro:page-load", initThreeJS);
