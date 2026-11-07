import React, { useState, useEffect } from 'react';
import { MaterialCanvas, GeometryType, EnvironmentType } from './components/MaterialCanvas';
import { MaterialSidebar } from './components/MaterialSidebar';
import { MaterialDef, MATERIALS_LIBRARY } from './data/materialsData';

export const App: React.FC = () => {
  const [activeMaterial, setActiveMaterial] = useState<MaterialDef>(MATERIALS_LIBRARY[0]);
  const [selectedGeometry, setSelectedGeometry] = useState<GeometryType>('sphere');
  const [selectedEnv, setSelectedEnv] = useState<EnvironmentType>('studio');
  const [autoRotate, setAutoRotate] = useState(true);

  // Live Tweaks
  const [roughness, setRoughness] = useState<number>(MATERIALS_LIBRARY[0].roughness);
  const [metalness, setMetalness] = useState<number>(MATERIALS_LIBRARY[0].metalness);
  const [clearcoat, setClearcoat] = useState<number>(MATERIALS_LIBRARY[0].clearcoat ?? 0);
  const [transmission, setTransmission] = useState<number>(MATERIALS_LIBRARY[0].transmission ?? 0);
  const [normalStrength, setNormalStrength] = useState<number>(MATERIALS_LIBRARY[0].normalStrength ?? 1.0);
  const [color, setColor] = useState<string>(MATERIALS_LIBRARY[0].color);

  // When active material changes, update tweak defaults
  useEffect(() => {
    setRoughness(activeMaterial.roughness);
    setMetalness(activeMaterial.metalness);
    setClearcoat(activeMaterial.clearcoat ?? 0);
    setTransmission(activeMaterial.transmission ?? 0);
    setNormalStrength(activeMaterial.normalStrength ?? 1.0);
    setColor(activeMaterial.color);
  }, [activeMaterial]);

  const handleResetTweaks = () => {
    setRoughness(activeMaterial.roughness);
    setMetalness(activeMaterial.metalness);
    setClearcoat(activeMaterial.clearcoat ?? 0);
    setTransmission(activeMaterial.transmission ?? 0);
    setNormalStrength(activeMaterial.normalStrength ?? 1.0);
    setColor(activeMaterial.color);
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      backgroundColor: '#070913',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Left Sidebar */}
      <MaterialSidebar
        activeMaterial={activeMaterial}
        onSelectMaterial={(mat) => setActiveMaterial(mat)}
        selectedGeometry={selectedGeometry}
        onChangeGeometry={(geo) => setSelectedGeometry(geo)}
        selectedEnv={selectedEnv}
        onChangeEnv={(env) => setSelectedEnv(env)}
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
        roughness={roughness}
        onChangeRoughness={setRoughness}
        metalness={metalness}
        onChangeMetalness={setMetalness}
        clearcoat={clearcoat}
        onChangeClearcoat={setClearcoat}
        transmission={transmission}
        onChangeTransmission={setTransmission}
        normalStrength={normalStrength}
        onChangeNormalStrength={setNormalStrength}
        color={color}
        onChangeColor={setColor}
        onResetTweaks={handleResetTweaks}
      />

      {/* Main 3D Viewport */}
      <main style={{ flex: 1, height: '100%', position: 'relative' }}>
        <MaterialCanvas
          currentMaterial={activeMaterial}
          selectedGeometry={selectedGeometry}
          selectedEnv={selectedEnv}
          autoRotate={autoRotate}
          roughnessTweak={roughness}
          metalnessTweak={metalness}
          clearcoatTweak={clearcoat}
          transmissionTweak={transmission}
          normalStrengthTweak={normalStrength}
          colorTweak={color}
        />

        {/* Floating Top Info Overlay */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '24px',
          background: 'rgba(10, 14, 28, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
          pointerEvents: 'none'
        }}>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff' }}>
              {activeMaterial.name}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              {activeMaterial.category} · IOR {activeMaterial.ior ?? 1.5} · Roughness {roughness.toFixed(2)}
            </div>
          </div>

          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: color,
            border: '2px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 0 12px rgba(255, 255, 255, 0.15)'
          }} />
        </div>

        {/* Floating Bottom Navigation Hint */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '24px',
          fontSize: '0.72rem',
          color: '#64748b',
          background: 'rgba(10, 14, 28, 0.6)',
          backdropFilter: 'blur(8px)',
          padding: '6px 12px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          pointerEvents: 'none'
        }}>
          Left Click + Drag: Orbit · Right Click: Pan · Scroll: Zoom
        </div>
      </main>
    </div>
  );
};
