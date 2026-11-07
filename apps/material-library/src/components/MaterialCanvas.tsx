import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { MaterialDef } from '../data/materialsData';

export type GeometryType = 'sphere' | 'shaderball' | 'torusKnot' | 'cloth' | 'cylinder';
export type EnvironmentType = 'studio' | 'christmas' | 'neutral' | 'dark';

interface MaterialCanvasProps {
  currentMaterial: MaterialDef;
  onMaterialTweak?: (tweaked: Partial<MaterialDef>) => void;
  selectedGeometry: GeometryType;
  selectedEnv: EnvironmentType;
  autoRotate: boolean;
  roughnessTweak: number;
  metalnessTweak: number;
  clearcoatTweak: number;
  transmissionTweak: number;
  normalStrengthTweak: number;
  colorTweak: string;
}

export const MaterialCanvas: React.FC<MaterialCanvasProps> = ({
  currentMaterial,
  selectedGeometry,
  selectedEnv,
  autoRotate,
  roughnessTweak,
  metalnessTweak,
  clearcoatTweak,
  transmissionTweak,
  normalStrengthTweak,
  colorTweak
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const currentMeshGroupRef = useRef<THREE.Group | null>(null);
  const activePhysicalMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const textureLoaderRef = useRef<THREE.TextureLoader>(new THREE.TextureLoader());
  const envTextureCacheRef = useRef<Record<string, THREE.Texture>>({});
  const [isLoadingEnv, setIsLoadingEnv] = useState(false);

  // 1. Initial Scene Setup
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c16);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.0;
    controls.maxDistance = 10.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't go too low beneath floor
    controls.target.set(0, 0.8, 0);
    controlsRef.current = controls;

    // Studio Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.2);
    fillLight.position.set(-4, 3, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xa5b4fc, 2.0);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    // Studio Pedestal / Ground
    const floorGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.2, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x121526,
      roughness: 0.65,
      metalness: 0.1
    });
    const pedestal = new THREE.Mesh(floorGeo, floorMat);
    pedestal.position.set(0, -0.1, 0);
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Soft Contact Shadow Plane directly above pedestal top
    const shadowGeo = new THREE.PlaneGeometry(5, 5);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.45 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.005;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Mesh Group for inspected geometry
    const meshGroup = new THREE.Group();
    meshGroup.name = 'InspectedMeshGroup';
    scene.add(meshGroup);
    currentMeshGroupRef.current = meshGroup;

    // Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.autoRotate = autoRotate;
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // 2. Load Environment Map (IBL)
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    let envPath = '/environments/studio.exr';
    if (selectedEnv === 'christmas') {
      envPath = '/environments/christmas_photo_studio_04_1k.exr';
    } else if (selectedEnv === 'dark') {
      scene.environment = null;
      scene.background = new THREE.Color(0x060810);
      return;
    }

    if (envTextureCacheRef.current[envPath]) {
      scene.environment = envTextureCacheRef.current[envPath];
      scene.background = new THREE.Color(0x090b14);
      return;
    }

    setIsLoadingEnv(true);
    const exrLoader = new EXRLoader();
    exrLoader.load(
      envPath,
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        envTextureCacheRef.current[envPath] = texture;
        if (sceneRef.current) {
          sceneRef.current.environment = texture;
          sceneRef.current.background = new THREE.Color(0x090b14);
        }
        setIsLoadingEnv(false);
      },
      undefined,
      (err) => {
        console.warn('Could not load EXR environment, falling back to neutral lighting:', err);
        setIsLoadingEnv(false);
      }
    );
  }, [selectedEnv]);

  // 3. Update Auto Rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
      controlsRef.current.autoRotateSpeed = 1.5;
    }
  }, [autoRotate]);

  // 4. Build or Switch Geometry
  useEffect(() => {
    const group = currentMeshGroupRef.current;
    if (!group) return;

    // Clear existing meshes
    while (group.children.length > 0) {
      const child = group.children[0] as THREE.Mesh;
      if (child.geometry) child.geometry.dispose();
      group.remove(child);
    }

    // Material instance
    let mat = activePhysicalMatRef.current;
    if (!mat) {
      mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(currentMaterial.color),
        roughness: currentMaterial.roughness,
        metalness: currentMaterial.metalness
      });
      activePhysicalMatRef.current = mat;
    }

    if (selectedGeometry === 'sphere') {
      // High-poly sphere
      const sphereGeo = new THREE.SphereGeometry(1.0, 128, 64);
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(0, 1.05, 0);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    } else if (selectedGeometry === 'shaderball') {
      // Industry-standard Shaderball structure
      // Outer sphere with beveled/scooped cutout
      const outerSphere = new THREE.Mesh(new THREE.SphereGeometry(1.0, 96, 48, 0, Math.PI * 1.5), mat);
      outerSphere.position.set(0, 1.05, 0);
      outerSphere.rotation.y = Math.PI * 0.25;
      outerSphere.castShadow = true;
      outerSphere.receiveShadow = true;
      group.add(outerSphere);

      // Inner Core sphere
      const innerCore = new THREE.Mesh(new THREE.SphereGeometry(0.55, 64, 32), mat);
      innerCore.position.set(0, 1.05, 0);
      innerCore.castShadow = true;
      group.add(innerCore);

      // Shaderball stand/ring collar
      const collarGeo = new THREE.TorusGeometry(0.85, 0.08, 32, 64);
      const collar = new THREE.Mesh(collarGeo, mat);
      collar.rotation.x = Math.PI / 2;
      collar.position.set(0, 0.25, 0);
      collar.castShadow = true;
      group.add(collar);
    } else if (selectedGeometry === 'torusKnot') {
      const knotGeo = new THREE.TorusKnotGeometry(0.7, 0.24, 180, 32);
      const knot = new THREE.Mesh(knotGeo, mat);
      knot.position.set(0, 1.05, 0);
      knot.castShadow = true;
      knot.receiveShadow = true;
      group.add(knot);
    } else if (selectedGeometry === 'cloth') {
      // Curved draped fabric swatch
      const clothGeo = new THREE.PlaneGeometry(1.8, 1.8, 64, 64);
      // Displace vertices to create elegant flowing fabric curves
      const pos = clothGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);
        const z = Math.sin(u * 2.8) * 0.22 + Math.cos(v * 3.2) * 0.15;
        pos.setZ(i, z);
      }
      clothGeo.computeVertexNormals();
      const cloth = new THREE.Mesh(clothGeo, mat);
      cloth.position.set(0, 1.1, 0);
      cloth.rotation.x = -Math.PI * 0.15;
      cloth.castShadow = true;
      cloth.receiveShadow = true;
      group.add(cloth);
    } else if (selectedGeometry === 'cylinder') {
      const cylGeo = new THREE.CylinderGeometry(0.75, 0.75, 1.5, 64);
      const cyl = new THREE.Mesh(cylGeo, mat);
      cyl.position.set(0, 0.95, 0);
      cyl.castShadow = true;
      cyl.receiveShadow = true;
      group.add(cyl);
    }
  }, [selectedGeometry]);

  // 5. Update Material Parameters & Textures
  useEffect(() => {
    let mat = activePhysicalMatRef.current;
    if (!mat) {
      mat = new THREE.MeshPhysicalMaterial();
      activePhysicalMatRef.current = mat;
    }

    // Color
    const finalColor = colorTweak || currentMaterial.color;
    mat.color.set(finalColor);

    // Roughness & Metalness
    mat.roughness = roughnessTweak !== undefined ? roughnessTweak : currentMaterial.roughness;
    mat.metalness = metalnessTweak !== undefined ? metalnessTweak : currentMaterial.metalness;

    // Clearcoat
    const clearcoatVal = clearcoatTweak !== undefined ? clearcoatTweak : (currentMaterial.clearcoat ?? 0);
    mat.clearcoat = clearcoatVal;
    mat.clearcoatRoughness = currentMaterial.clearcoatRoughness ?? 0.05;

    // Transmission / Glass / Refraction
    const transVal = transmissionTweak !== undefined ? transmissionTweak : (currentMaterial.transmission ?? 0);
    mat.transmission = transVal;
    mat.ior = currentMaterial.ior ?? 1.5;
    mat.thickness = transVal > 0 ? 1.5 : 0;
    if (currentMaterial.attenuationColor) {
      mat.attenuationColor = new THREE.Color(currentMaterial.attenuationColor);
      mat.attenuationDistance = currentMaterial.attenuationDistance ?? 1.0;
    }

    // Sheen / Velvet / Fabric Micro-fuzz
    if (currentMaterial.sheen !== undefined) {
      mat.sheen = currentMaterial.sheen;
      mat.sheenRoughness = currentMaterial.sheenRoughness ?? 0.3;
      if (currentMaterial.sheenColor) {
        mat.sheenColor = new THREE.Color(currentMaterial.sheenColor);
      }
    } else {
      mat.sheen = 0;
    }

    // Textures & Normal Maps
    const loader = textureLoaderRef.current;
    if (currentMaterial.normalMapUrl) {
      loader.load(currentMaterial.normalMapUrl, (normalTex) => {
        normalTex.wrapS = THREE.RepeatWrapping;
        normalTex.wrapT = THREE.RepeatWrapping;
        const repeat = currentMaterial.normalRepeat ?? [8, 8];
        normalTex.repeat.set(repeat[0], repeat[1]);
        mat.normalMap = normalTex;
        const strength = normalStrengthTweak !== undefined ? normalStrengthTweak : (currentMaterial.normalStrength ?? 1.0);
        mat.normalScale.set(strength, strength);
        mat.needsUpdate = true;
      });
    } else {
      mat.normalMap = null;
    }

    if (currentMaterial.diffuseMapUrl) {
      loader.load(currentMaterial.diffuseMapUrl, (diffuseTex) => {
        diffuseTex.wrapS = THREE.RepeatWrapping;
        diffuseTex.wrapT = THREE.RepeatWrapping;
        const repeat = currentMaterial.normalRepeat ?? [8, 8];
        diffuseTex.repeat.set(repeat[0], repeat[1]);
        mat.map = diffuseTex;
        mat.needsUpdate = true;
      });
    } else {
      mat.map = null;
    }

    mat.needsUpdate = true;
  }, [
    currentMaterial,
    colorTweak,
    roughnessTweak,
    metalnessTweak,
    clearcoatTweak,
    transmissionTweak,
    normalStrengthTweak
  ]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', outline: 'none' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {isLoadingEnv && (
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          padding: '8px 14px',
          borderRadius: '8px',
          fontSize: '0.8rem',
          color: '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            border: '2px solid #6366f1',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Loading HDRI Environment...
        </div>
      )}
    </div>
  );
};
