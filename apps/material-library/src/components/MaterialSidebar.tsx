import React, { useState, useMemo } from 'react';
import { MaterialDef, CATEGORIES, MATERIALS_LIBRARY } from '../data/materialsData';
import { GeometryType, EnvironmentType } from './MaterialCanvas';

interface MaterialSidebarProps {
  activeMaterial: MaterialDef;
  onSelectMaterial: (mat: MaterialDef) => void;
  selectedGeometry: GeometryType;
  onChangeGeometry: (geo: GeometryType) => void;
  selectedEnv: EnvironmentType;
  onChangeEnv: (env: EnvironmentType) => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  // Tweaks
  roughness: number;
  onChangeRoughness: (val: number) => void;
  metalness: number;
  onChangeMetalness: (val: number) => void;
  clearcoat: number;
  onChangeClearcoat: (val: number) => void;
  transmission: number;
  onChangeTransmission: (val: number) => void;
  normalStrength: number;
  onChangeNormalStrength: (val: number) => void;
  color: string;
  onChangeColor: (val: string) => void;
  onResetTweaks: () => void;
}

export const MaterialSidebar: React.FC<MaterialSidebarProps> = ({
  activeMaterial,
  onSelectMaterial,
  selectedGeometry,
  onChangeGeometry,
  selectedEnv,
  onChangeEnv,
  autoRotate,
  onToggleAutoRotate,
  roughness,
  onChangeRoughness,
  metalness,
  onChangeMetalness,
  clearcoat,
  onChangeClearcoat,
  transmission,
  onChangeTransmission,
  normalStrength,
  onChangeNormalStrength,
  color,
  onChangeColor,
  onResetTweaks
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'library' | 'inspector'>('library');

  // Filtered Materials
  const filteredMaterials = useMemo(() => {
    return MATERIALS_LIBRARY.filter((mat) => {
      const matchesCat = selectedCategory === 'All' || mat.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        mat.name.toLowerCase().includes(q) ||
        mat.description.toLowerCase().includes(q) ||
        mat.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <aside style={{
      width: '380px',
      height: '100%',
      backgroundColor: 'rgba(10, 12, 22, 0.92)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 20,
      color: '#e2e8f0'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}>
              ✨
            </div>
            <div>
              <h1 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
                Material Library
              </h1>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0 }}>
                Three.js WebGPU PBR Showroom
              </p>
            </div>
          </div>

          <a
            href="/"
            title="Return to Trikomi Demo Hub"
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: '#a5b4fc',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            ← Hub
          </a>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '8px',
          padding: '3px'
        }}>
          <button
            onClick={() => setActiveTab('library')}
            style={{
              padding: '7px 0',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'library' ? '#6366f1' : 'transparent',
              color: activeTab === 'library' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.15s ease'
            }}
          >
            Materials ({MATERIALS_LIBRARY.length})
          </button>
          <button
            onClick={() => setActiveTab('inspector')}
            style={{
              padding: '7px 0',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'inspector' ? '#6366f1' : 'transparent',
              color: activeTab === 'inspector' ? '#ffffff' : '#94a3b8',
              transition: 'all 0.15s ease'
            }}
          >
            PBR Inspector
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'library' ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Search Bar */}
          <div style={{ padding: '12px 18px 8px' }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder="Search metals, fabrics, gems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 34px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
              <span style={{ position: 'absolute', left: '10px', fontSize: '13px', color: '#64748b' }}>
                🔍
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Chips Carousel */}
          <div style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            padding: '4px 18px 12px',
            scrollbarWidth: 'none'
          }}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    border: isSelected ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Materials Card List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '4px 18px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {filteredMaterials.map((mat) => {
              const isSelected = activeMaterial.id === mat.id;
              return (
                <div
                  key={mat.id}
                  onClick={() => onSelectMaterial(mat)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '1px solid rgba(99, 102, 241, 0.6)' : '1px solid rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 16px rgba(99, 102, 241, 0.2)' : 'none'
                  }}
                >
                  {/* Color / Texture Swatch */}
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: mat.thumbnailUrl ? `url(${mat.thumbnailUrl}) center/cover` : mat.color,
                    border: '2px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: isSelected ? '0 0 10px #6366f1' : 'inset 0 0 6px rgba(0,0,0,0.5)'
                  }} />

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isSelected ? '#fff' : '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {mat.name}
                      </span>
                      <span style={{
                        fontSize: '0.62rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        fontWeight: 600
                      }}>
                        {mat.category.split(' ')[0]}
                      </span>
                    </div>

                    <p style={{
                      fontSize: '0.72rem',
                      color: '#64748b',
                      margin: '2px 0 6px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {mat.description}
                    </p>

                    {/* Property badges */}
                    <div style={{ display: 'flex', gap: '6px', fontSize: '0.65rem' }}>
                      <span style={{ color: '#94a3b8' }}>
                        R: <strong style={{ color: '#e2e8f0' }}>{mat.roughness.toFixed(2)}</strong>
                      </span>
                      <span style={{ color: '#94a3b8' }}>
                        M: <strong style={{ color: '#e2e8f0' }}>{mat.metalness.toFixed(2)}</strong>
                      </span>
                      {mat.clearcoat !== undefined && mat.clearcoat > 0 && (
                        <span style={{ color: '#38bdf8' }}>Clearcoat</span>
                      )}
                      {mat.transmission !== undefined && mat.transmission > 0 && (
                        <span style={{ color: '#a855f7' }}>Glass</span>
                      )}
                      {mat.sheen !== undefined && mat.sheen > 0 && (
                        <span style={{ color: '#ec4899' }}>Velvet</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Inspector Tab */
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>
                Active Material
              </span>
              <button
                onClick={onResetTweaks}
                style={{
                  fontSize: '0.7rem',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#cbd5e1',
                  cursor: 'pointer'
                }}
              >
                Reset Tweaks
              </button>
            </div>
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <h3 style={{ fontSize: '0.92rem', color: '#fff', margin: 0, fontWeight: 700 }}>
                {activeMaterial.name}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '4px 0 0' }}>
                {activeMaterial.description}
              </p>
            </div>
          </div>

          {/* Color Picker Slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1' }}>Base Color</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#94a3b8' }}>{color}</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => onChangeColor(e.target.value)}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    background: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Roughness */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1' }}>Roughness</label>
              <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#a5b4fc' }}>{roughness.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={roughness}
              onChange={(e) => onChangeRoughness(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
            />
          </div>

          {/* Metalness */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1' }}>Metalness</label>
              <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#a5b4fc' }}>{metalness.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={metalness}
              onChange={(e) => onChangeMetalness(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
            />
          </div>

          {/* Clearcoat */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1' }}>Clearcoat Glaze</label>
              <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#a5b4fc' }}>{clearcoat.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={clearcoat}
              onChange={(e) => onChangeClearcoat(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
            />
          </div>

          {/* Transmission */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1' }}>Transmission (Glass)</label>
              <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#a5b4fc' }}>{transmission.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={transmission}
              onChange={(e) => onChangeTransmission(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
            />
          </div>

          {/* Normal Map Intensity */}
          {activeMaterial.normalMapUrl && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1' }}>Normal Relief Depth</label>
                <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#a5b4fc' }}>{normalStrength.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2.5"
                step="0.05"
                value={normalStrength}
                onChange={(e) => onChangeNormalStrength(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
              />
            </div>
          )}
        </div>
      )}

      {/* Bottom Viewport & Geometry Controls */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(5, 7, 14, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* Geometry Selector */}
        <div>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.04em' }}>
            Mesh Geometry
          </span>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '4px',
            marginTop: '6px'
          }}>
            {[
              { id: 'sphere', label: 'Sphere', icon: '⚪' },
              { id: 'shaderball', label: 'Ball', icon: '🔮' },
              { id: 'cloth', label: 'Cloth', icon: '🧣' },
              { id: 'torusKnot', label: 'Knot', icon: '🥨' },
              { id: 'cylinder', label: 'Cyl', icon: '🥫' }
            ].map((geo) => (
              <button
                key={geo.id}
                onClick={() => onChangeGeometry(geo.id as GeometryType)}
                style={{
                  padding: '6px 2px',
                  borderRadius: '6px',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  border: selectedGeometry === geo.id ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.06)',
                  background: selectedGeometry === geo.id ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.04)',
                  color: selectedGeometry === geo.id ? '#ffffff' : '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                <span>{geo.icon}</span>
                <span>{geo.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Environment & Turntable */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>HDRI:</span>
            <select
              value={selectedEnv}
              onChange={(e) => onChangeEnv(e.target.value as EnvironmentType)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="studio" style={{ background: '#111827' }}>Photo Studio</option>
              <option value="christmas" style={{ background: '#111827' }}>Warm Interior</option>
              <option value="dark" style={{ background: '#111827' }}>Dark Void</option>
            </select>
          </div>

          {/* Turntable Auto-rotate */}
          <button
            onClick={onToggleAutoRotate}
            style={{
              padding: '5px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 500,
              cursor: 'pointer',
              border: autoRotate ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
              background: autoRotate ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
              color: autoRotate ? '#ffffff' : '#94a3b8'
            }}
          >
            {autoRotate ? '⏸ Turntable' : '▶ Turntable'}
          </button>
        </div>
      </div>
    </aside>
  );
};
