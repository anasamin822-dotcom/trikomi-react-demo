import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three/webgpu';
import { ThreeViewer, ViewerStore, OrbitControlsPlugin, EnvironmentPlugin, GLTFPlugin, CenterModelPlugin, ExportPlugin, DiamondPlugin } from '@trikomi/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
export type RingDesign = { metal: string; width: string; stone: string; carat: string; finish: string; engraving: string };
export type RingController = { setView: (view: string) => void; rotate: () => void; changeRing: (index: number) => Promise<void>; exportModel: () => void; importModel: (file: File) => Promise<void>; inspect: () => object };
type Props = { design: RingDesign; onReady: (controller: RingController) => void; onStatus: (status: string) => void };
// Own the plugin lifecycle in the app so asynchronous model/cut changes cannot race.
class StudioDiamondPlugin extends DiamondPlugin { onUpdate() {} }
// The packaged declarations mark these runtime lifecycle hooks private and narrow
// updateDiamondGeometry to InstancedMesh, although the supplied rings use Mesh.
// Keep that vendor mismatch in one app-side adapter; do not alter the SDK.
type DiamondLifecycle = {
 restoreOriginalMaterials: () => void;
 applyDiamondMaterial: () => Promise<void>;
 originalMaterials: Map<THREE.Mesh, unknown>;
 updateDiamondGeometry: (mesh: THREE.Mesh, geometry: THREE.BufferGeometry) => Promise<void>;
};
const diamondLifecycle = (plugin: DiamondPlugin) => plugin as unknown as DiamondLifecycle;
type GemMesh = THREE.Mesh & { userData: { studioScale?: THREE.Vector3; originalGeometry?: THREE.BufferGeometry; originalSize?: THREE.Vector3; studioCut?: string } };
export function RingStage({ design, onReady, onStatus }: Props) {
 const [diamondState,setDiamondState]=useState('awaiting-auth');
 const host = useRef<HTMLDivElement>(null); const viewerRef = useRef<ThreeViewer | null>(null); const modelRef = useRef<THREE.Object3D | null>(null); const gemsRef = useRef<GemMesh[]>([]); const metalsRef = useRef<THREE.Mesh[]>([]); const shapeRef = useRef<Record<string,THREE.BufferGeometry>>({}); const latest = useRef(design); const applyRef = useRef<() => void>(() => {});
 useEffect(() => { latest.current = design; }, [design]);
 useEffect(() => {
  if (!host.current) return;
  let disposed = false; let generation = 0; let diamond: StudioDiamondPlugin | null = null; let diamondFailed = false; let effectGeneration = 0; let effectQueue = Promise.resolve(); let effectTimer: ReturnType<typeof setTimeout> | undefined;
  const store = new ViewerStore();
  store.setSsgiEnabled(false); store.setSSREnabled(false); store.setProgressiveShadowEnabled(false); store.setBloomEnabled(false); store.setBackgroundColor('transparent'); store.setFloorTransparent(true); store.setUseEnvAsBackground(false); store.setShowEnvironment(true); store.setEnvIntensity(1.3); store.setLightIntensity(3); store.showStats = false;
  const viewer = new ThreeViewer(host.current, store, { enableOnDemandRendering: true }); viewerRef.current = viewer;
  viewer.addPlugin(new EnvironmentPlugin()); viewer.addPlugin(new OrbitControlsPlugin()); viewer.addPlugin(new GLTFPlugin()); viewer.addPlugin(new CenterModelPlugin());
  viewer.camera.position.set(0,2.5,4.5); viewer.camera.lookAt(0,0,0);
  const loader = new GLTFLoader(); const draco = new DRACOLoader(); draco.setDecoderPath(`${import.meta.env.BASE_URL}draco/gltf/`); loader.setDRACOLoader(draco);
  loader.load(`${import.meta.env.BASE_URL}models/diamonds.glb`, gltf => { if(disposed)return; gltf.scene.traverse(node => { if((node as THREE.Mesh).isMesh) shapeRef.current[node.name]=(node as THREE.Mesh).geometry; }); applyRef.current(); }, undefined, () => onStatus('Stone library could not load. Original stones are still available.'));
  function effectState(state:string) { if(disposed)return;setDiamondState(state);if(host.current)host.current.dataset.diamondEffect=state; }
  function restoreDiamonds() { if(diamond)diamondLifecycle(diamond).restoreOriginalMaterials(); }
  function refreshDiamonds(changedMesh?: GemMesh) {
   const version=++effectGeneration;
   clearTimeout(effectTimer);
   effectTimer=setTimeout(()=>{effectQueue=effectQueue.then(async()=>{
    if(disposed||version!==effectGeneration||!modelRef.current)return;if(diamondFailed){viewer.needsRender=true;viewer.play();return;}
    // Shader access follows the vendor's normal successful authentication, never a bypass.
    if(viewer.authStatus!=='AUTHORIZED') {effectState('awaiting-auth');viewer.play();return;}
    effectState('checking');
    if(!diamond){diamond=new StudioDiamondPlugin();viewer.addPlugin(diamond);}
    const renderer=viewer.renderer;
    let shaderFailed=false;
    const debug=renderer.debug;
    const previous=debug.onShaderError;
    debug.onShaderError=(...args: Parameters<NonNullable<typeof previous>>)=>{shaderFailed=true;console.warn('Studio: diamond shader could not compile; using supplied standard materials.');previous?.(...args);};
    try {
     // The plugin recognises diamond names. The supplied Halo uses Crystal instead.
     const renamed: {material:THREE.Material;name:string}[]=[];
     for(const mesh of gemsRef.current)for(const material of(Array.isArray(mesh.material)?mesh.material:[mesh.material]))if(!/diamond/i.test(material.name)){renamed.push({material,name:material.name});material.name='Diamond';}
     try{if(changedMesh&&diamondLifecycle(diamond).originalMaterials.has(changedMesh)){await diamondLifecycle(diamond).updateDiamondGeometry(changedMesh,changedMesh.geometry);}else{await diamondLifecycle(diamond).applyDiamondMaterial();}}finally{for(const entry of renamed)entry.material.name=entry.name;}
     if(disposed)return;
     viewer.pause();
     await renderer.compileAsync(viewer.scene,viewer.camera);
     renderer.render(viewer.scene,viewer.camera);
     if(shaderFailed)throw new Error('Diamond shader compilation failed');
     if(disposed||version!==effectGeneration){restoreDiamonds();return;}
     effectState('enabled');
    }catch(error){
     diamondFailed=true;restoreDiamonds();effectState('fallback');
     console.warn('Studio diamond effect unavailable on this renderer. Original materials restored.',error);
    }finally{debug.onShaderError=previous;viewer.needsRender=true;if(!disposed)viewer.play();}
   });},120);
  }
  function scan(model:THREE.Object3D) {
   modelRef.current=model; gemsRef.current=[]; metalsRef.current=[];
   model.traverse(node => { const mesh=node as GemMesh; if(!mesh.isMesh)return;
    const mats=Array.isArray(mesh.material)?mesh.material:[mesh.material];
    const gem=mats.some(mat=>/diamond|crystal|gem/i.test(mat.name));
    if(gem){mesh.userData.studioScale=mesh.scale.clone();mesh.userData.originalGeometry=mesh.geometry;mesh.geometry.computeBoundingBox();mesh.userData.originalSize=mesh.geometry.boundingBox?.getSize(new THREE.Vector3());gemsRef.current.push(mesh);}
    else metalsRef.current.push(mesh);
   });
  }
  applyRef.current=()=>{
   if(!modelRef.current)return;
   const current=latest.current;
   const colors:Record<string,string>={'Yellow gold':'#dca84d','Rose gold':'#ce8b6d','Platinum':'#dce1e8'};
   for(const mesh of metalsRef.current){for(const mat of (Array.isArray(mesh.material)?mesh.material:[mesh.material])){const metal=mat as THREE.MeshStandardMaterial;metal.color?.set(colors[current.metal] || '#dca84d');metal.metalness=1;metal.roughness=current.finish==='Satin'?.38:current.finish==='Brushed'?.58:.12;metal.needsUpdate=true;}}
   // These are explicit visual percentage scales, not physical mm or carat claims.
   const width=current.width==='90%'?.9:current.width==='110%'?1.1:1;
   for(const mesh of metalsRef.current){ if(!mesh.userData.studioScale)mesh.userData.studioScale=mesh.scale.clone();mesh.scale.z=mesh.userData.studioScale.z*width; }
   for(const mesh of gemsRef.current){const base=mesh.userData.studioScale;if(base){const scale=current.carat==='90%'?.9:current.carat==='110%'?1.1:1;mesh.scale.copy(base).multiplyScalar(scale);}}
   // Apply selected cuts to the main stone only. Side stones retain their original fit.
   const main=gemsRef.current.find(mesh=>mesh.parent?.name==='Main') || gemsRef.current[0];
   let cutChanged=false;
   if(main&&main.userData.studioCut!==current.stone){viewer.pause();cutChanged=true;main.userData.studioCut=current.stone;const source=current.stone==='Original'?main.userData.originalGeometry:shapeRef.current[current.stone];if(source&&main.userData.originalGeometry){if(main.geometry!==main.userData.originalGeometry)main.geometry.dispose();if(current.stone==='Original')main.geometry=source;else{const geometry=source.clone();geometry.computeBoundingBox();const size=geometry.boundingBox?.getSize(new THREE.Vector3());const target=main.userData.originalSize;if(size&&target){const ratio=Math.max(target.x,target.z)/Math.max(size.x,size.z);geometry.scale(ratio,ratio,ratio);}main.geometry=geometry;}}}
   if(cutChanged)refreshDiamonds(main);
   viewer.needsRender=true;
   if(host.current) host.current.dataset.ringState=JSON.stringify({metal:current.metal,finish:current.finish,metals:metalsRef.current.length,gems:gemsRef.current.length,shapes:Object.keys(shapeRef.current),color:((metalsRef.current[0]?.material as THREE.MeshStandardMaterial)?.color)?.getHexString(),roughness:(metalsRef.current[0]?.material as THREE.MeshStandardMaterial)?.roughness,stone:current.stone,auth:viewer.authStatus,mainVertices:main?.geometry.attributes.position?.count,gemScale:main?.scale.toArray(),bandScale:metalsRef.current[0]?.scale.toArray()});
  };
  async function load(url:string,name:string){ const myGeneration=++generation; onStatus('Loading VictorShell ring…'); ++effectGeneration;clearTimeout(effectTimer);await effectQueue;viewer.pause();restoreDiamonds(); try{const model=await viewer.getPlugin(GLTFPlugin)!.loadModel(url,name);if(disposed||myGeneration!==generation)return;scan(model);applyRef.current();refreshDiamonds();viewer.getPlugin(OrbitControlsPlugin)?.resetView();viewer.needsRender=true;onStatus('');}catch(error){if(!disposed)onStatus(`Ring could not load: ${error instanceof Error?error.message:'unknown error'}`);} }
  onReady({
   setView(view){const controls=viewer.getPlugin(OrbitControlsPlugin);if(view==='side')controls?.setView('X');else if(view==='front')controls?.setView('Z');else controls?.resetView();viewer.needsRender=true;if(host.current)host.current.dataset.camera=JSON.stringify(viewer.camera.position.toArray());},
   rotate(){store.setAutoRotate(!store.autoRotate);if(host.current)host.current.dataset.autoRotate=String(store.autoRotate);viewer.needsRender=true;},
   async changeRing(index){await load(`${import.meta.env.BASE_URL}models/${index?'ring2':'ring'}.glb`,index?'Halo Setting':'Classic Solitaire');},
   exportModel(){let plugin=viewer.getPlugin(ExportPlugin);if(!plugin){viewer.addPlugin(new ExportPlugin());plugin=viewer.getPlugin(ExportPlugin);}plugin?.exportGLTF();},
   async importModel(file){const url=URL.createObjectURL(file);try{await load(url,file.name);}finally{URL.revokeObjectURL(url);}},
   inspect(){return {authStatus:viewer.authStatus,model:store.activeModelName,metals:metalsRef.current.map(mesh=>({name:mesh.name,scale:mesh.scale.toArray(),materials:(Array.isArray(mesh.material)?mesh.material:[mesh.material]).map(mat=>({color:(mat as THREE.MeshStandardMaterial).color?.getHexString(),roughness:(mat as THREE.MeshStandardMaterial).roughness}))})),gems:gemsRef.current.length,shapes:Object.keys(shapeRef.current),camera:viewer.camera.position.toArray(),design:latest.current};}
  });
  const resizeObserver=new ResizeObserver(([entry])=>{const {width,height}=entry.contentRect;if(width&&height){viewer.camera.zoom=Math.min(1,width/height);viewer.camera.updateProjectionMatrix();viewer.needsRender=true;}});resizeObserver.observe(host.current!);
  const authTimer=setInterval(()=>{if(host.current){host.current.dataset.authStatus=viewer.authStatus;if(viewer.authStatus==='AUTHORIZED'&&host.current.dataset.diamondEffect==='awaiting-auth')refreshDiamonds();}},1000);
  // Preserve the vendor authentication flow. No domain or licensing override.
  void load(`${import.meta.env.BASE_URL}models/ring.glb`,'Classic Solitaire');
  return ()=>{disposed=true;generation++;effectGeneration++;resizeObserver.disconnect();clearTimeout(effectTimer);restoreDiamonds();clearInterval(authTimer);viewerRef.current=null;modelRef.current=null;draco.dispose();viewer.dispose();};
 },[onReady,onStatus]);
 useEffect(()=>{applyRef.current();},[design]);
 return <><div className="studio-live-canvas" ref={host} aria-label="Interactive VictorShell 3D ring. Drag to rotate and scroll to zoom."/>{diamondState==='fallback'&&<span className="studio-diamond-notice" role="status">Diamond effect unavailable on this renderer. Standard materials shown.</span>}</>;
}
