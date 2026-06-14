import React, { useEffect, useRef } from 'react';

/**
 * LibraryBackground — Real library aesthetic background.
 *
 * Layers:
 *  1. Actual library photo (library-bg.png in /public)
 *  2. Cinematic dark overlay for text contrast
 *  3. Canvas: warm floating dust motes + subtle light shaft pulse
 *  4. Bottom gradient fade (cards sit above this)
 *  5. Vignette for depth
 */

function DustCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let t = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Warm amber dust motes
    const MOTES = 120;
    const motes = Array.from({ length: MOTES }, () => ({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      r:  Math.random() * 1.8 + 0.3,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -Math.random() * 0.22 - 0.04,
      o:  Math.random() * 0.60 + 0.10,
      phase:  Math.random() * Math.PI * 2,
      speed:  Math.random() * 0.005 + 0.002,
      warm:   Math.random() > 0.4, // amber vs white
    }));

    // Subtle light shaft — originates from upper-centre-left (lantern position)
    const shaft = {
      sx: 0.38, sy: 0,      // start x/y (fraction of canvas)
      ex: 0.50, ey: 0.70,   // end direction
      spread: 0.12,
    };

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Light shaft pulse
      const pulse = Math.sin(t * 0.008) * 0.012 + 0.022;
      const sx = shaft.sx * W;
      const shaftGrad = ctx.createLinearGradient(sx, 0, shaft.ex * W, shaft.ey * H);
      shaftGrad.addColorStop(0,   `rgba(255,200,100,${pulse * 1.4})`);
      shaftGrad.addColorStop(0.4, `rgba(255,180,80,${pulse})`);
      shaftGrad.addColorStop(1,   `rgba(255,160,60,0)`);
      ctx.fillStyle = shaftGrad;
      const hw = shaft.spread * W / 2;
      ctx.beginPath();
      ctx.moveTo(sx - hw * 0.15, 0);
      ctx.lineTo(sx - hw, H * shaft.ey);
      ctx.lineTo(sx + hw, H * shaft.ey);
      ctx.lineTo(sx + hw * 0.15, 0);
      ctx.closePath();
      ctx.fill();

      // Dust motes
      motes.forEach(m => {
        m.phase += m.speed;
        m.x += m.vx + Math.sin(m.phase) * 0.12;
        m.y += m.vy;

        if (m.y < -8)  { m.y = H + 8; m.x = Math.random() * W; }
        if (m.x < -8)  m.x = W + 8;
        if (m.x > W+8) m.x = -8;

        const pulse2 = Math.sin(m.phase * 1.3) * 0.25 + 0.75;
        const alpha  = m.o * pulse2;

        if (m.warm) {
          ctx.fillStyle = `rgba(255,200,110,${alpha})`;
        } else {
          ctx.fillStyle = `rgba(255,238,200,${alpha * 0.7})`;
        }

        // Soft glow
        ctx.shadowColor = m.warm ? `rgba(255,180,80,${alpha * 0.6})` : `rgba(255,220,160,${alpha*0.4})`;
        ctx.shadowBlur  = m.r * 4;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      t++;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas ref={ref} style={{
      position: 'fixed', inset: 0, zIndex: 2,
      pointerEvents: 'none', opacity: 0.75,
    }}/>
  );
}

export default function NightSkyBackground() {
  return (
    <>
      {/* 1. Real library photograph */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: 'url(/library-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        backgroundRepeat: 'no-repeat',
        transform: 'scale(1.04)',   // tiny scale so edges never show
        filter: 'saturate(0.85)',   // slight desaturation — more moody
      }}/>

      {/* 2. Cinematic dark gradient overlay — ensures text & cards are readable */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: `
          linear-gradient(
            160deg,
            rgba(5,3,2,0.72) 0%,
            rgba(10,6,3,0.55) 40%,
            rgba(8,5,2,0.65) 100%
          )
        `,
      }}/>

      {/* 3. Warm dust motes + light shaft canvas */}
      <DustCanvas />

      {/* 4. Bottom fade — anchors the card */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: '35%', zIndex: 3, pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(5,3,2,0.70) 0%, transparent 100%)',
      }}/>

      {/* 5. Edge vignette */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 3, pointerEvents: 'none',
        background: `radial-gradient(
          ellipse at 50% 40%,
          transparent 35%,
          rgba(3,2,1,0.62) 100%
        )`,
      }}/>

      {/* 6. Subtle warm amber colour grade */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 3, pointerEvents: 'none',
        background: 'rgba(80,35,5,0.08)',
        mixBlendMode: 'color',
      }}/>
    </>
  );
}
