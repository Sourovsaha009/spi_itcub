import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [targetPos, setTargetPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [hoverLabel, setHoverLabel] = useState<string>('');
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  
  const rafRef = useRef<number | null>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const targetPosRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only enable custom cursor for precise pointer devices (desktops/laptops)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) {
      setEnabled(false);
      return;
    }
    setEnabled(true);

    const onMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      targetPosRef.current = { x: e.clientX, y: e.clientY };
      setTargetPos({ x: e.clientX, y: e.clientY });
      setCoords({ x: Math.round(e.clientX), y: Math.round(e.clientY) });

      // Detect hovered element type
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer, .neo-btn, .neo-card');
        if (interactive) {
          setIsHovered(true);
          if (interactive.closest('#gallery')) {
            setHoverLabel('ZOOM');
          } else if (interactive.tagName === 'A' || interactive.closest('a')) {
            setHoverLabel('LINK');
          } else if (interactive.classList.contains('neo-btn') || interactive.tagName === 'BUTTON') {
            setHoverLabel('ACTIVATE');
          } else {
            setHoverLabel('TARGET');
          }
        } else {
          setIsHovered(false);
          setHoverLabel('');
        }
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Smooth Lerp loop for trailing reticle follower
    const loop = () => {
      const ease = 0.22;
      posRef.current.x += (targetPosRef.current.x - posRef.current.x) * ease;
      posRef.current.y += (targetPosRef.current.y - posRef.current.y) * ease;
      setPos({ x: posRef.current.x, y: posRef.current.y });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!enabled || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      {/* Central Fast Laser Dot (Snapped directly to cursor target) */}
      <div
        className="absolute w-2 h-2 -ml-1 -mt-1 rounded-full bg-black transition-transform duration-75"
        style={{
          transform: `translate3d(${targetPos.x}px, ${targetPos.y}px, 0) scale(${isClicking ? 0.6 : isHovered ? 1.5 : 1})`,
        }}
      >
        {/* Core neon pulse center */}
        <div className="absolute inset-0 rounded-full bg-[#FFE600] animate-ping opacity-75"></div>
      </div>

      {/* Trailing Neo Reticle / Targeting Brackets */}
      <div
        className="absolute -ml-5 -mt-5 transition-transform duration-100 ease-out flex items-center justify-center"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          width: '40px',
          height: '40px',
        }}
      >
        {/* Outer Tech Ring / Crosshair */}
        <div
          className={`w-full h-full relative transition-all duration-200 border-2 ${
            isHovered
              ? 'border-[#FFE600] scale-125 rotate-45 bg-[#FFE600]/15 shadow-[0_0_12px_rgba(255,230,0,0.8)]'
              : 'border-black/70 scale-100 rotate-0 bg-transparent'
          } rounded-lg`}
        >
          {/* Corner brackets */}
          <span className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t-2 border-l-2 border-black"></span>
          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 border-t-2 border-r-2 border-black"></span>
          <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 border-b-2 border-l-2 border-black"></span>
          <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b-2 border-r-2 border-black"></span>

          {/* Crosshair ticks when hovering */}
          {isHovered && (
            <>
              <div className="absolute top-1/2 left-0 w-1.5 h-0.5 -translate-y-1/2 bg-black"></div>
              <div className="absolute top-1/2 right-0 w-1.5 h-0.5 -translate-y-1/2 bg-black"></div>
              <div className="absolute top-0 left-1/2 w-0.5 h-1.5 -translate-x-1/2 bg-black"></div>
              <div className="absolute bottom-0 left-1/2 w-0.5 h-1.5 -translate-x-1/2 bg-black"></div>
            </>
          )}
        </div>

        {/* Micro Tech HUD Label */}
        {isHovered && hoverLabel && (
          <div className="absolute left-8 top-8 bg-black text-[#FFE600] text-[9px] font-black tracking-widest px-1.5 py-0.5 border border-[#FFE600] shadow-[2px_2px_0px_#000] whitespace-nowrap animate-in fade-in zoom-in-95 duration-100">
            [SYS::{hoverLabel}]
          </div>
        )}

        {/* Subordinate Coordinates readout in subtle tech stamp */}
        {!isHovered && (
          <div className="absolute -bottom-4 left-6 text-[8px] font-mono font-bold text-black/50 tracking-tighter whitespace-nowrap">
            {coords.x},{coords.y}
          </div>
        )}

        {/* Click wave ripple */}
        {isClicking && (
          <div className="absolute w-12 h-12 rounded-full border-2 border-[#10B981] animate-ping opacity-90"></div>
        )}
      </div>
    </div>
  );
};
