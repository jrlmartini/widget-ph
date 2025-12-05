import React, { useMemo } from 'react';

export type GradientMode = 'two' | 'three';

export interface PhWidgetProps {
  /** Valor atual de pH a ser exibido */
  value: number;
  /** Limite inferior da faixa de leitura */
  min?: number;
  /** Limite superior da faixa de leitura */
  max?: number;
  /** Casas decimais para o valor formatado */
  decimals?: number;
  /** Controla animação da movimentação do ponteiro */
  animate?: boolean;
  /** Permite esconder o ponteiro caso não seja necessário */
  showPointer?: boolean;
  /** Define se o degradê terá duas ou três cores */
  gradientMode?: GradientMode;
  /** Cor inicial do degradê */
  startColor?: string;
  /** Cor intermediária (usada apenas no modo three) */
  midColor?: string;
  /** Cor final do degradê */
  endColor?: string;
  /** URL opcional de uma imagem de ponteiro (PNG/SVG) */
  pointerImage?: string;
  /** Cor do ponteiro fallback em CSS */
  pointerColor?: string;
  /** Cor de fundo do container (compatível com tema dark do Grafana) */
  background?: string;
  /** Tamanho da fonte usada no cabeçalho */
  fontSize?: number;
  /** Tamanho da fonte do label (ex.: "pH") */
  labelFontSize?: number;
  /** Altura da barra em % em relação ao container */
  heightPct?: number;
  /** Raio do container para integração com estilização do painel */
  containerRadius?: number;
  /** Raio da barra colorida */
  barRadius?: number;
  /** Texto exibido no cabeçalho ao lado do valor */
  label?: string;
  /** Altura do ponteiro (aplicada à imagem ou fallback) */
  pointerSize?: number;
  /** Deslocamento vertical do ponteiro em relação ao centro da barra (positivo sobe) */
  pointerOffsetPct?: number;
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

// Widget desenhado para ser facilmente migrado para um Panel Plugin do Grafana.
export const PhWidget: React.FC<PhWidgetProps> = ({
  value,
  min = 0,
  max = 14,
  decimals = 2,
  animate = true,
  showPointer = true,
  gradientMode = 'three',
  startColor = '#F87171',
  midColor = '#60A5FA',
  endColor = '#34D399',
  pointerImage = '',
  pointerColor = '#ffffff',
  background = '#0B1220',
  fontSize = 40,
  labelFontSize,
  heightPct = 25,
  containerRadius = 8,
  barRadius = 20,
  label = 'pH',
  pointerSize = 28,
  pointerOffsetPct = 0,
}) => {
  const normalized = useMemo(() => {
    const safeRange = max - min === 0 ? 1 : max - min;
    const ratio = (value - min) / safeRange;
    return clamp(ratio, 0, 1);
  }, [value, min, max]);

  const gradient = useMemo(() => {
    return gradientMode === 'two'
      ? `linear-gradient(90deg, ${startColor}, ${endColor})`
      : `linear-gradient(90deg, ${startColor}, ${midColor}, ${endColor})`;
  }, [gradientMode, startColor, midColor, endColor]);

  const pointerLeft = `${normalized * 100}%`;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    width: '100%',
    height: '100%',
    padding: '16px',
    boxSizing: 'border-box',
    background,
    color: '#E5EDF9',
    borderRadius: containerRadius,
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    textAlign: 'center',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    width: '100%',
  };

  const valueStyle: React.CSSProperties = {
    fontSize,
    fontWeight: 700,
    lineHeight: 1,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: labelFontSize ?? fontSize * 0.35,
    opacity: 0.8,
    letterSpacing: '0.02em',
  };

  const barAreaStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 1,
  };

  const barStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: `${heightPct}%`,
    minHeight: '12px',
    background: gradient,
    borderRadius: barRadius,
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)',
    overflow: 'visible',
  };

  const pointerBaseStyle: React.CSSProperties = {
    position: 'absolute',
    top: `calc(50% - ${pointerOffsetPct}%)`,
    left: pointerLeft,
    transform: 'translate(-50%, -50%)',
    transition: animate ? 'left 400ms ease' : undefined,
    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
  };

  const pointerBase = pointerSize * 0.7;
  const pointerFallback: React.CSSProperties = {
    width: 0,
    height: 0,
    borderLeft: `${pointerBase * 0.5}px solid transparent`,
    borderRight: `${pointerBase * 0.5}px solid transparent`,
    borderTop: `${pointerSize}px solid ${pointerColor}`,
  };

  const pointerImageStyle: React.CSSProperties = {
    height: pointerSize,
    width: 'auto',
    objectFit: 'contain',
    display: 'block',
  };

  const formattedValue = value.toFixed(decimals);

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>{label}</span>
        <span style={valueStyle}>{formattedValue}</span>
      </div>

      <div style={barAreaStyle}>
        <div style={barStyle}>
          {showPointer && (
            pointerImage ? (
              <img src={pointerImage} alt="Pointer" style={{ ...pointerBaseStyle, ...pointerImageStyle }} />
            ) : (
              <div style={{ ...pointerBaseStyle, ...pointerFallback }} />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PhWidget;
