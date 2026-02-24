import { useRef, ReactNode, CSSProperties } from 'react';

// 1. KITA BUATKAN "KTP" UNTUK SEMUA PROPS (Aturan Tipe Data)
interface GlareHoverProps {
  width?: string | number;
  height?: string | number;
  background?: string;
  borderRadius?: string | number;
  borderColor?: string;
  children?: ReactNode; // Tipe khusus untuk komponen/elemen React di dalam tag
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
  playOnce?: boolean;
  className?: string;
  style?: CSSProperties; // Tipe khusus untuk inline-style React
}

const GlareHover = ({
  width = '500px',
  height = '500px',
  background = '#000',
  borderRadius = '10px',
  borderColor = '#333',
  children,
  glareColor = '#ffffff',
  glareOpacity = 0.5,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
  playOnce = false,
  className = '',
  style = {}
}: GlareHoverProps) => { // <-- Pasang interface-nya di sini
  
  const hex = glareColor.replace('#', '');
  let rgba = glareColor;
  
  if (/^[\dA-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  } else if (/^[\dA-Fa-f]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  }

  // 2. BERI TAHU TYPESCRIPT BAHWA REF INI UNTUK ELEMEN <div>
  const overlayRef = useRef<HTMLDivElement>(null);

  const animateIn = () => {
    const el = overlayRef.current;
    if (!el) return;

    el.style.transition = 'none';
    el.style.backgroundPosition = '-100% -100%, 0 0';
    el.style.transition = `${transitionDuration}ms ease`;
    el.style.backgroundPosition = '100% 100%, 0 0';
  };

  const animateOut = () => {
    const el = overlayRef.current;
    if (!el) return;

    if (playOnce) {
      el.style.transition = 'none';
      el.style.backgroundPosition = '-100% -100%, 0 0';
    } else {
      el.style.transition = `${transitionDuration}ms ease`;
      el.style.backgroundPosition = '-100% -100%, 0 0';
    }
  };

  const overlayStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    zIndex: 50,
    background: `linear-gradient(${glareAngle}deg,
        hsla(0,0%,0%,0) 60%,
        ${rgba} 70%,
        hsla(0,0%,0%,0) 100%)`,
    backgroundSize: `${glareSize}% ${glareSize}%, 100% 100%`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '-100% -100%, 0 0',
    pointerEvents: 'none'
  };

  return (
    <div
      className={`relative grid place-items-center overflow-hidden cursor-pointer ${className}`}
      style={{
        width,
        height,
        background,
        borderRadius,
        ...style
      }}
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
    >
     {/* URUTANNYA DITUKAR JADI SEPERTI INI 👇 */}
      {children} 
      <div ref={overlayRef} style={overlayStyle} />
    </div>
  );
};

export default GlareHover;