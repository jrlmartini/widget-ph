import React, { useMemo, useState } from 'react';
import PhWidget, { GradientMode } from './PhWidget';

const clampNumber = (value: number, min?: number, max?: number) => {
  let result = value;
  if (typeof min === 'number') result = Math.max(min, result);
  if (typeof max === 'number') result = Math.min(max, result);
  return result;
};

const normalizeNumber = (
  raw: string,
  fallback: number,
  { min, max, integer }: { min?: number; max?: number; integer?: boolean } = {}
) => {
  if (raw.trim() === '') return fallback;
  const parsed = integer ? parseInt(raw, 10) : parseFloat(raw);
  if (Number.isNaN(parsed)) return fallback;
  return clampNumber(parsed, min, max);
};

const useNumberControl = (
  initial: number,
  options: { min?: number; max?: number; integer?: boolean } = {}
) => {
  const [number, setNumber] = useState(initial);
  const [text, setText] = useState(String(initial));

  const handleChange = (raw: string) => {
    setText(raw);
    if (raw.trim() === '') return;
    const parsed = options.integer ? parseInt(raw, 10) : parseFloat(raw);
    if (!Number.isNaN(parsed)) {
      setNumber(clampNumber(parsed, options.min, options.max));
    }
  };

  const handleBlur = () => {
    const normalized = normalizeNumber(text, number, options);
    setNumber(normalized);
    setText(String(normalized));
  };

  return { number, text, setNumber, setText, handleChange, handleBlur } as const;
};

const normalizeHex = (raw: string) => {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const candidate = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  const hexRegex = /^#?[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?$/;
  return hexRegex.test(candidate.replace('#', '')) ? candidate : undefined;
};

// App simples para simular configurações que futuramente seriam mapeadas
// para opções de painel do Grafana.
const App: React.FC = () => {
  const [value, setValue] = useState(7);
  const minControl = useNumberControl(0);
  const maxControl = useNumberControl(14);
  const decimalsControl = useNumberControl(2, { min: 0, max: 4, integer: true });
  const [animate, setAnimate] = useState(true);
  const [showPointer, setShowPointer] = useState(true);
  const [gradientMode, setGradientMode] = useState<GradientMode>('three');
  const [startColor, setStartColor] = useState('#F87171');
  const [startColorInput, setStartColorInput] = useState('#F87171');
  const [midColor, setMidColor] = useState('#60A5FA');
  const [midColorInput, setMidColorInput] = useState('#60A5FA');
  const [endColor, setEndColor] = useState('#34D399');
  const [endColorInput, setEndColorInput] = useState('#34D399');
  const [pointerImage, setPointerImage] = useState('');
  const [pointerColor, setPointerColor] = useState('#ffffff');
  const [pointerColorInput, setPointerColorInput] = useState('#ffffff');
  const fontSizeControl = useNumberControl(40, { min: 12, max: 80, integer: true });
  const labelFontSizeControl = useNumberControl(14, { min: 8, max: 48, integer: true });
  const heightControl = useNumberControl(25, { min: 10, max: 80 });
  const [background, setBackground] = useState('#0B1220');
  const [backgroundInput, setBackgroundInput] = useState('#0B1220');
  const panelWidthControl = useNumberControl(460, { min: 240, max: 1200 });
  const panelHeightControl = useNumberControl(320, { min: 220, max: 800 });
  const pointerSizeControl = useNumberControl(28, { min: 10, max: 72 });
  const pointerOffsetControl = useNumberControl(0, { min: -50, max: 50 });

  const handleColorChange = (
    raw: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    setColor: React.Dispatch<React.SetStateAction<string>>,
    fallback: string
  ) => {
    setInput(raw);
    const normalized = normalizeHex(raw);
    if (normalized) {
      setColor(normalized);
    } else if (raw.trim() === '') {
      setColor(fallback);
    }
  };

  const handleColorBlur = (
    input: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    setColor: React.Dispatch<React.SetStateAction<string>>,
    fallback: string
  ) => {
    const normalized = normalizeHex(input);
    if (normalized) {
      setColor(normalized);
      setInput(normalized);
    } else {
      setInput(fallback);
    }
  };

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
    width: `${panelWidthControl.number}px`,
    height: `${panelHeightControl.number}px`,
    minHeight: '240px',
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

  const safeValue = useMemo(
    () => clampNumber(value, minControl.number, maxControl.number),
    [value, minControl.number, maxControl.number]
  );

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
          min={minControl.number}
          max={maxControl.number}
          decimals={decimalsControl.number}
          animate={animate}
          showPointer={showPointer}
          gradientMode={gradientMode}
          startColor={startColor}
          midColor={midColor}
          endColor={endColor}
          pointerImage={pointerImage}
          pointerColor={pointerColor}
          background={background}
          fontSize={fontSizeControl.number}
          labelFontSize={labelFontSizeControl.number}
          heightPct={heightControl.number}
          pointerSize={pointerSizeControl.number}
          pointerOffsetPct={pointerOffsetControl.number}
        />
      </div>

      <div style={controlsStyle}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Painel de Configuração</h2>
        <div style={labelStyle}>
          <label>Valor de pH: {safeValue.toFixed(decimalsControl.number)}</label>
          <input
            type="range"
            min={minControl.number}
            max={maxControl.number}
            step={1 / 10 ** decimalsControl.number}
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
              value={minControl.text}
              onChange={(e) => minControl.handleChange(e.target.value)}
              onBlur={minControl.handleBlur}
            />
          </div>
          <div style={labelStyle}>
            <label>Max</label>
            <input
              style={inputStyle}
              type="number"
              value={maxControl.text}
              onChange={(e) => maxControl.handleChange(e.target.value)}
              onBlur={maxControl.handleBlur}
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
              value={decimalsControl.text}
              onChange={(e) => decimalsControl.handleChange(e.target.value)}
              onBlur={decimalsControl.handleBlur}
            />
          </div>
          <div style={labelStyle}>
            <label>Tamanho da fonte</label>
            <input
              style={inputStyle}
              type="number"
              min={12}
              max={80}
              value={fontSizeControl.text}
              onChange={(e) => fontSizeControl.handleChange(e.target.value)}
              onBlur={fontSizeControl.handleBlur}
            />
          </div>
        </div>

        <div style={fieldGroup}>
          <div style={labelStyle}>
            <label>Tamanho da fonte do rótulo</label>
            <input
              style={inputStyle}
              type="number"
              min={8}
              max={48}
              value={labelFontSizeControl.text}
              onChange={(e) => labelFontSizeControl.handleChange(e.target.value)}
              onBlur={labelFontSizeControl.handleBlur}
            />
          </div>
          <div style={labelStyle}>
            <label>Altura da barra (%)</label>
            <input
              style={inputStyle}
              type="number"
              min={10}
              max={80}
              value={heightControl.text}
              onChange={(e) => heightControl.handleChange(e.target.value)}
              onBlur={heightControl.handleBlur}
            />
          </div>
        </div>

        <div style={fieldGroup}>
          <div style={labelStyle}>
            <label>Cor de fundo</label>
            <input
              style={inputStyle}
              type="text"
              value={backgroundInput}
              onChange={(e) => handleColorChange(e.target.value, setBackgroundInput, setBackground, background)}
              onBlur={() => handleColorBlur(backgroundInput, setBackgroundInput, setBackground, background)}
              placeholder="#0B1220"
            />
          </div>
          <div style={labelStyle}>
            <label>Largura do widget (px)</label>
            <input
              style={inputStyle}
              type="number"
              min={240}
              max={1200}
              value={panelWidthControl.text}
              onChange={(e) => panelWidthControl.handleChange(e.target.value)}
              onBlur={panelWidthControl.handleBlur}
            />
          </div>
        </div>

        <div style={fieldGroup}>
          <div style={labelStyle}>
            <label>Altura do widget (px)</label>
            <input
              style={inputStyle}
              type="number"
              min={220}
              max={800}
              value={panelHeightControl.text}
              onChange={(e) => panelHeightControl.handleChange(e.target.value)}
              onBlur={panelHeightControl.handleBlur}
            />
          </div>
          <div style={labelStyle}>
            <label>Altura do ponteiro (px)</label>
            <input
              style={inputStyle}
              type="number"
              min={10}
              max={72}
              value={pointerSizeControl.text}
              onChange={(e) => pointerSizeControl.handleChange(e.target.value)}
              onBlur={pointerSizeControl.handleBlur}
            />
          </div>
        </div>

        <div style={fieldGroup}>
          <div style={labelStyle}>
            <label>Offset vertical do ponteiro (% da barra)</label>
            <input
              style={inputStyle}
              type="number"
              min={-50}
              max={50}
              value={pointerOffsetControl.text}
              onChange={(e) => pointerOffsetControl.handleChange(e.target.value)}
              onBlur={pointerOffsetControl.handleBlur}
            />
          </div>
          <div style={labelStyle}>
            <label>Notas de responsividade</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: 12, opacity: 0.65 }}>
                Use os campos de largura/altura para validar o comportamento fluido do widget dentro do painel.
              </span>
            </div>
          </div>
        </div>

        <div style={fieldGroup}>
          <div style={labelStyle}>
            <label>Cor inicial</label>
            <input
              style={inputStyle}
              type="text"
              value={startColorInput}
              onChange={(e) => handleColorChange(e.target.value, setStartColorInput, setStartColor, startColor)}
              onBlur={() => handleColorBlur(startColorInput, setStartColorInput, setStartColor, startColor)}
              placeholder="#F87171"
            />
          </div>
          <div style={labelStyle}>
            <label>Cor final</label>
            <input
              style={inputStyle}
              type="text"
              value={endColorInput}
              onChange={(e) => handleColorChange(e.target.value, setEndColorInput, setEndColor, endColor)}
              onBlur={() => handleColorBlur(endColorInput, setEndColorInput, setEndColor, endColor)}
              placeholder="#34D399"
            />
          </div>
        </div>

        {gradientMode === 'three' && (
          <div style={labelStyle}>
            <label>Cor intermediária</label>
            <input
              style={inputStyle}
              type="text"
              value={midColorInput}
              onChange={(e) => handleColorChange(e.target.value, setMidColorInput, setMidColor, midColor)}
              onBlur={() => handleColorBlur(midColorInput, setMidColorInput, setMidColor, midColor)}
              placeholder="#60A5FA"
            />
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
            <input
              style={inputStyle}
              type="text"
              value={pointerColorInput}
              onChange={(e) => handleColorChange(e.target.value, setPointerColorInput, setPointerColor, pointerColor)}
              onBlur={() => handleColorBlur(pointerColorInput, setPointerColorInput, setPointerColor, pointerColor)}
              placeholder="#ffffff"
            />
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
