import { useCallback, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import './Studio.css';
import { RingStage } from './RingStage';
import type { RingController } from './RingStage';

type Design = { metal: string; width: string; stone: string; carat: string; finish: string; engraving: string };
const initial: Design = { metal: 'Yellow gold', width: '100%', stone: 'Original', carat: '100%', finish: 'Polished', engraving: '' };
const asset = (name: string) => `${import.meta.env.BASE_URL}studio/${name}`;
const steps = ['Metal', 'Stone', 'Finish'];
function Icon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    save: <><path d="M12 3v12m-5-5 5 5 5-5"/><path d="M4 15v6h16v-6"/></>,
    reset: <><path d="M20 8a9 9 0 1 0 1 7M20 3v5h-5"/></>,
    undo: <><path d="m8 4-6 6 6 6M2 10h11a7 7 0 0 1 0 14"/></>,
    redo: <><path d="m16 4 6 6-6 6m6-6H11a7 7 0 0 0 0 14"/></>,
    arrow: <><path d="M3 12h18m-7-7 7 7-7 7"/></>,
    rotate: <><path d="M20 7A9 9 0 0 0 4 8M4 3v5h5m-5 9a9 9 0 0 0 16-1m0 5v-5h-5"/></>,
    ar: <><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/><rect x="9" y="9" width="6" height="6"/></>,
    expand: <><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M3 3l6 6m12-6-6 6M3 21l6-6m12 6-6-6"/></>,
    cube: <><path d="m12 2 10 6v10l-10 6-10-6V8zm0 0v12m10-6-10 6L2 8m10 6v10"/><circle cx="7" cy="12" r=".7"/><circle cx="17" cy="12" r=".7"/></>,
    close: <path d="m5 5 14 14M19 5 5 19"/>,
  };
  return <svg viewBox="0 0 24 26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
export function Studio() {
  const [panelOpen,setPanelOpen]=useState(true);
  const shapeLabel=(value:string)=>value==='shape'?'Octagonal':value==='shape024'?'Round (12-sided)':value;
  const [history, setHistory] = useState<Design[]>([{ ...initial }]);
  const [cursor, setCursor] = useState(0);
  const design = history[cursor];
  const [step, setStep] = useState(0);
  const [view, setViewState] = useState('hero');
  const [ringStatus, setRingStatus] = useState('Loading VictorShell ring…');
  const controller = useRef<RingController | null>(null);
  const onRingReady = useCallback((value: RingController) => { controller.current = value; }, []);
  const onRingStatus = useCallback((value: string) => setRingStatus(value), []);
  const [ringIndex, setRingIndex] = useState(0);
  const importInput = useRef<HTMLInputElement>(null);
  function switchRing(index: number) { setRingIndex(index);setHistory([...history.slice(0,cursor+1),{...design,stone:'Original',width:'100%',carat:'100%'}]);setCursor(cursor+1);void controller.current?.changeRing(index); }
  function setView(value: string) { setViewState(value); controller.current?.setView(value); }
  const [notice, setNotice] = useState('');
  const [review, setReview] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  function notify(message: string) {
    setNotice(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setNotice(''), 4200);
  }
  function update(key: keyof Design, value: string) {
    if (design[key] === value) return;
    setHistory([...history.slice(0, cursor + 1), { ...design, [key]: value }]);
    setCursor(cursor + 1);
  }
  function reset() {
    setRingIndex(0);void controller.current?.changeRing(0);
    setHistory([...history.slice(0, cursor + 1), { ...initial }]); setCursor(cursor + 1);
    setStep(0); setView('hero'); notify('Your design has been reset.');
  }
  function save() {
    const content = { collection: 'Studio noir', metal:design.metal, bandDepthScale:design.width, mainStoneCut:design.stone, stoneScale:design.carat, finish:design.finish, designNote:design.engraving, preview: 'VictorShell 3D model, visual configuration. Percentages are not physical measurements.' };
    const url = URL.createObjectURL(new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'studio-noir-design.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('Your design has been downloaded.');
  }
  async function fullscreen() {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
    catch { notify('Fullscreen is not available in this browser.'); }
  }
  const selection = (key: keyof Design, values: string[], kind = '') => <div className={`studio-options ${kind}`} role="group" aria-label={key}>{values.map(value => <button key={value} type="button" className={design[key] === value ? 'selected' : ''} aria-pressed={design[key] === value} onClick={() => update(key, value)}>{kind === 'materials' && <span className={`metal-orb ${value.toLowerCase().replace(' ', '-')}`} aria-hidden="true"/>}{key === 'finish' && <span className={`finish-orb finish-${value.toLowerCase()}`} aria-hidden="true"/>}{key === 'stone' && <span className={`stone-shape stone-${value.toLowerCase()}`} aria-hidden="true"/>}<span>{key === 'stone' ? shapeLabel(value) : value}</span></button>)}</div>;
  return <main className={`studio ${panelOpen?'panel-open':'panel-closed'}`} aria-label="Jewelry studio configurator">
    <div className="studio-photograph" aria-hidden="true"/>
    <header className="studio-header">
      <div className="studio-brand"><img src={asset('victorshell-brand.png')} alt="VictorShell"/><span className="studio-brand-divider"/><span>Jwellery Configurator</span></div>
      <div className="studio-header-actions"><button className="studio-reset" onClick={reset}><Icon name="reset"/><span>Reset</span></button><span className="studio-action-divider"/><button className="studio-save" onClick={save}><Icon name="save"/><span>Save</span></button></div>
    </header>
    <button className="studio-drawer-toggle" aria-label={panelOpen?'Hide customization panel':'Show customization panel'} aria-expanded={panelOpen} aria-controls="studio-controls" onClick={()=>setPanelOpen(!panelOpen)}><span aria-hidden="true">{panelOpen?'‹':'›'}</span><span>{panelOpen?'Hide panel':'Customize'}</span></button>
    <section className="studio-intro" aria-hidden={!panelOpen}><h1>A signature,<br/>uniquely yours.</h1><p className="studio-description">Build your bespoke ring.</p></section>
    <section className="studio-stage" aria-label="Interactive 3D ring preview">
      <div className="studio-pedestal" aria-hidden="true"/>
      <span className="studio-live-label">LIVE 3D · Drag to rotate</span><RingStage design={design} onReady={onRingReady} onStatus={onRingStatus}/>
      {ringStatus && <div className="studio-ring-status" role="status">{ringStatus}</div>}

      <div className="studio-tools">

        <button onClick={() => controller.current?.rotate()} aria-label="Toggle automatic rotation"><Icon name="rotate"/><span>360°</span></button>

        <button onClick={fullscreen} aria-label="Toggle fullscreen"><Icon name="expand"/></button>
      </div>
      <div className="studio-view-options"><button className={view !== 'side' ? 'selected' : ''} aria-pressed={view !== 'side'} onClick={() => setView(view === 'front' ? 'hero' : 'front')}><Icon name="cube"/><span>Front view</span></button><button className={view === 'side' ? 'selected' : ''} aria-pressed={view === 'side'} onClick={() => setView(view === 'side' ? 'hero' : 'side')}><Icon name="rotate"/><span>Side view</span></button></div>
    </section>
    <section id="studio-controls" className="studio-controls" aria-label="Customize your ring" inert={!panelOpen}>
      <nav className="studio-steps" aria-label="Design steps">{steps.map((label, index) => <button key={label} onClick={() => setStep(index)} className={index === step ? 'active' : ''} aria-current={index === step ? 'step' : undefined}><span className="step-number">0{index + 1}</span><span>{label}</span></button>)}</nav>
      <div className="studio-fields">
        {step === 0 && <><div className="studio-field"><h2>Metal</h2>{selection('metal', ['Rose gold', 'Yellow gold', 'Platinum'], 'materials')}</div><div className="studio-field"><h2>Band depth <span className="optional">Visual scale</span></h2>{selection('width', ['90%', '100%', '110%'])}</div></>}
        {step === 1 && <><div className="studio-field"><h2>Main stone cut</h2>{selection('stone', ['Original', 'shape', 'shape024'], 'materials stones')}</div><div className="studio-field"><h2>Stone size <span className="optional">Visual scale</span></h2>{selection('carat', ['90%', '100%', '110%'])}</div></>}
        {step === 2 && <><div className="studio-field"><h2>Finish</h2>{selection('finish', ['Polished', 'Satin', 'Brushed'], 'finish-options')}</div><div className="studio-field"><label htmlFor="engraving">Design note <span className="optional">Not engraved in 3D</span></label><input id="engraving" value={design.engraving} maxLength={24} onChange={event => update('engraving', event.target.value)} placeholder="Optional note for this design"/><span className="engraving-count">{design.engraving.length}/24 characters</span></div></>}
      </div>
      <button className="studio-continue" onClick={() => step < 2 ? setStep(step + 1) : setReview(true)}>{step === 0 ? 'Continue to stone' : step === 1 ? 'Continue to finish' : 'Review your design'}<Icon name="arrow"/></button>
      <div className="studio-ring-switch"><span>Ring</span><button aria-pressed={ringIndex===0} onClick={() => {switchRing(0);}}>Classic</button><button aria-pressed={ringIndex===1} onClick={() => {switchRing(1);}}>Halo</button><button onClick={() => importInput.current?.click()}>Import</button><button onClick={() => controller.current?.exportModel()}>Export GLB</button><input type="file" accept=".glb" ref={importInput} hidden onChange={event => {const file=event.target.files?.[0];if(file)void controller.current?.importModel(file);event.target.value='';}}/></div>
      <div className="studio-history"><button onClick={() => { setCursor(cursor - 1); }} disabled={cursor === 0}><Icon name="undo"/>Undo</button><span/><button onClick={() => setCursor(cursor + 1)} disabled={cursor >= history.length - 1}><Icon name="redo"/>Redo</button><button className="mobile-reset" onClick={reset}><Icon name="reset"/>Reset</button></div>
    </section>
    {notice && <div className="studio-notice" role="status">{notice}</div>}
    {review && <div className="studio-dialog-backdrop" onClick={() => setReview(false)}><section className="studio-dialog" role="dialog" aria-modal="true" aria-labelledby="review-title" onClick={event => event.stopPropagation()} onKeyDown={event => {
        if (event.key === 'Escape') { setReview(false); return; }
        if (event.key === 'Tab') {
          const controls = event.currentTarget.querySelectorAll<HTMLButtonElement>('button');
          const first = controls[0]; const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
      }}><button className="dialog-close" aria-label="Close review" onClick={() => setReview(false)} autoFocus><Icon name="close"/></button><p>STUDIO NOIR</p><h2 id="review-title">Uniquely yours.</h2><dl>{Object.entries(design).map(([key, value]) => <div key={key}><dt>{({width:"Band depth",carat:"Stone scale",engraving:"Design note"} as Record<string,string>)[key] || key}</dt><dd>{key==='stone'?shapeLabel(value):value || 'None'}</dd></div>)}</dl><p className="review-note">Your choices are applied to the VictorShell 3D ring. Scale values are visual percentages, not physical measurements. Design notes are not engraved. No order is placed.</p><button className="studio-continue" onClick={save}>Save your design<Icon name="save"/></button></section></div>}
  </main>;
}
