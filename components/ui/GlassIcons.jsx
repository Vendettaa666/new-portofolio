// components/GlassIcons.jsx (atau .tsx)
import React from 'react';

const gradientMapping = {
  blue: 'linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))',
  purple: 'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))',
  red: 'linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))',
  indigo: 'linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))',
  orange: 'linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))',
  green: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))'
};

const GlassIcons = ({ items, className }) => {
  const getBackgroundStyle = color => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color }; 
  };

  return (
    // DIUBAH: Gap (jarak antar ikon) diperkecil lagi
    <div className={`flex flex-wrap justify-center gap-[1em] md:gap-[1.25em] mx-auto py-[1.5em] max-w-5xl overflow-visible ${className || ''}`}>
      {items.map((item, index) => (
        <button
          key={index}
          type="button"
          aria-label={item.label}
          // DIUBAH: Ukuran box utama diperkecil drastis ke 2.5em (mobile) & 3em (desktop)
          className={`relative bg-transparent outline-none border-none cursor-pointer w-[2.5em] h-[2.5em] md:w-[3em] md:h-[3em] mb-3 [perspective:24em] [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent] group ${
            item.customClass || ''
          }`}
        >
          {/* Latar Belakang Warna */}
          <span
            className="absolute top-0 left-0 w-full h-full rounded-[0.75em] block transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[100%_100%] rotate-[15deg] [will-change:transform] group-hover:[transform:rotate(25deg)_translate3d(-0.3em,-0.3em,0.3em)]"
            style={{
              ...getBackgroundStyle(item.color),
              boxShadow: '0.3em -0.3em 0.4em hsla(223, 10%, 10%, 0.15)'
            }}
          ></span>

          {/* Efek Kaca Depan */}
          <span
            className="absolute top-0 left-0 w-full h-full rounded-[0.75em] bg-[hsla(0,0%,100%,0.15)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[80%_50%] flex backdrop-blur-[0.75em] [-webkit-backdrop-filter:blur(0.75em)] [-moz-backdrop-filter:blur(0.75em)] [will-change:transform] transform group-hover:[transform:translate3d(0,0,1em)]"
            style={{
              boxShadow: '0 0 0 0.1em hsla(0, 0%, 100%, 0.3) inset'
            }}
          >
            {/* DIUBAH: Ukuran ikon SVG di dalam diperkecil agar proporsional */}
            <span className="m-auto w-[1.2em] h-[1.2em] md:w-[1.4em] md:h-[1.4em] flex items-center justify-center text-dark dark:text-white" aria-hidden="true">
              {item.icon}
            </span>
          </span>

          {/* Label Teks (Muncul saat Hover) */}
          <span className="absolute top-full left-0 right-0 text-center whitespace-nowrap leading-[2] text-[10px] md:text-xs font-medium opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] translate-y-0 group-hover:opacity-100 group-hover:[transform:translateY(10%)] text-neutral-800 dark:text-neutral-200">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default GlassIcons;