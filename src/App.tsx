import React, { useMemo, useState } from 'react';
import PhWidget, { GradientMode } from './PhWidget';

// App simples para simular configurações que futuramente seriam mapeadas
// para opções de painel do Grafana.
const App: React.FC = () => {
  const [value, setValue] = useState(7);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(14);
  const [decimals, setDecimals] = useState(2);
  const [animate, setAnimate] = useState(true);
  const [showPointer, setShowPointer] = useState(true);
  const [gradientMode, setGradientMode] = useState<GradientMode>('three');
  const [startColor, setStartColor] = useState('#F87171');
  const [midColor, setMidColor] = useState('#60A5FA');
  const [endColor, setEndColor] = useState('#34D399');
  const [pointerImage, setPointerImage] = useState('');
  const [pointerColor, setPointerColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(40);
  const [heightPct, setHeightPct] = useState(25);
  const [background, setBackground] = useState('#0B1220');

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: '#0B1220',
    color: '#E5EDF9',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    padding: '24px',
    boxSizing: 'border-box',
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  };

  const panelStyle: React.CSSProperties = {
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: '16px',
    background,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '320px',
  };

  const controlsStyle: React.CSSProperties = {
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: '16px',
    background: '#0F172A',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: 14,
  };

  const safeValue = useMemo(() => Math.min(Math.max(value, min), max), [value, min, max]);

  const inputStyle: React.CSSProperties = {
    background: '#111827',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#E5EDF9',
    padding: '8px',
    borderRadius: 6,
  };

  const fieldGroup: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  };

  return (
    <div style={containerStyle}>
      <div style={panelStyle}>
        <PhWidget
          value={safeValue}
          min={min}
          max={max}
          decimals={decimals}
          animate={animate}
          showPointer={showPointer}
          gradientMode={gradientMode}
          startColor={startColor}
          midColor={midColor}
          endColor={endColor}
          pointerImage={pointerImage}
          pointerColor={pointerColor}
          background={background}
          fontSize={fontSize}
          heightPct={heightPct}
        />
      </div>

      <div style={controlsStyle}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Painel de Configuração</h2>
        <div style={labelStyle}>
          <label>Valor de pH: {safeValue.toFixed(decimals)}</label>
          <input
            type="range"
            min={min}
            max={max}
            step={1 / 10 ** decimals}
            value={safeValue}
            onChange={(e) => setValue(parseFloat(e.target.value))}
          />
        </div>

        <div style={fieldGroup}>
          <div style={labelStyle}>
            <label>Min</label>
            <input
              style={inputStyle}
              type="number"
              value={min}
              onChange={(e) => setMin(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div style={labelStyle}>
            <label>Max</label>
            <input
              style={inputStyle}
              type="number"
              value={max}
              onChange={(e) => setMax(parseFloat(e.target.value) || 1)}
            />
          </div>
        </div>

        <div style={fieldGroup}>
          <div style={labelStyle}>
            <label>Decimais</label>
            <input
              style={inputStyle}
              type="number"
              min={0}
              max={4}
              value={decimals}
              onChange={(e) => setDecimals(Math.max(0, Math.min(4, parseInt(e.target.value, 10) || 0)))}
            />
          </div>
          <div style={labelStyle}>
            <label>Tamanho da fonte</label>
            <input
              style={inputStyle}
              type="number"
              min={12}
              max={80}
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value, 10) || 12)}
            />
          </div>
        </div>

        <div style={fieldGroup}>
          <div style={labelStyle}>
            <label>Altura da barra (%)</label>
            <input
              style={inputStyle}
              type="number"
              min={10}
              max={80}
              value={heightPct}
              onChange={(e) => setHeightPct(parseInt(e.target.value, 10) || 25)}
            />
          </div>
          <div style={labelStyle}>
            <label>Cor de fundo</label>
            <input style={inputStyle} type="color" value={background} onChange={(e) => setBackground(e.target.value)} />
          </div>
        </div>

        <div style={fieldGroup}>
          <div style={labelStyle}>
            <label>Cor inicial</label>
            <input style={inputStyle} type="color" value={startColor} onChange={(e) => setStartColor(e.target.value)} />
          </div>
          <div style={labelStyle}>
            <label>Cor final</label>
            <input style={inputStyle} type="color" value={endColor} onChange={(e) => setEndColor(e.target.value)} />
          </div>
        </div>

        {gradientMode === 'three' && (
          <div style={labelStyle}>
            <label>Cor intermediária</label>
            <input style={inputStyle} type="color" value={midColor} onChange={(e) => setMidColor(e.target.value)} />
          </div>
        )}

        <div style={labelStyle}>
          <label>URL da imagem do ponteiro (PNG/SVG)</label>
          <input
            style={inputStyle}
            type="text"
            placeholder="https://..."
            value={pointerImage}
            onChange={(e) => setPointerImage(e.target.value)}
          />
        </div>

        <div style={fieldGroup}>
          <div style={labelStyle}>
            <label>Cor do ponteiro fallback</label>
            <input style={inputStyle} type="color" value={pointerColor} onChange={(e) => setPointerColor(e.target.value)} />
          </div>
          <div style={labelStyle}>
            <label>Modo do degradê</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input
                  type="radio"
                  name="gradient"
                  value="two"
                  checked={gradientMode === 'two'}
                  onChange={() => setGradientMode('two')}
                />
                Duas cores
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input
                  type="radio"
                  name="gradient"
                  value="three"
                  checked={gradientMode === 'three'}
                  onChange={() => setGradientMode('three')}
                />
                Três cores
              </label>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input type="checkbox" checked={animate} onChange={(e) => setAnimate(e.target.checked)} />
            Animar ponteiro
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input type="checkbox" checked={showPointer} onChange={(e) => setShowPointer(e.target.checked)} />
            Mostrar ponteiro
          </label>
        </div>

        <div style={{ fontSize: 12, opacity: 0.65, lineHeight: 1.5 }}>
          Ajuste os controles para simular as opções de configuração que o painel Grafana exporia.
          Todas as cores, animações e imagem do ponteiro podem ser mapeadas para opções do plugin.
        </div>
      </div>
    </div>
  );
};

export default App;
