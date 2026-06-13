// The canopy: golden fireflies and slow-falling leaves over the trees.
// No dependencies, no network calls. Respects prefers-reduced-motion.
(function () {
  const canvas = document.getElementById("fireflies");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W, H, flies = [], leaves = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const FLY_COUNT = Math.min(24, Math.floor(W / 50));
  for (let i = 0; i < FLY_COUNT; i++) {
    flies.push({
      x: Math.random() * W,
      y: H * 0.2 + Math.random() * H * 0.7,
      r: 1 + Math.random() * 1.7,
      a: Math.random() * Math.PI * 2,
      sp: 0.1 + Math.random() * 0.22,
      ph: Math.random() * Math.PI * 2,
      pf: 0.008 + Math.random() * 0.02,
    });
  }

  const LEAF_COUNT = reduced ? 0 : 6;
  for (let i = 0; i < LEAF_COUNT; i++) {
    leaves.push({
      x: Math.random() * W,
      y: Math.random() * H,
      size: 4 + Math.random() * 5,
      vy: 0.15 + Math.random() * 0.25,
      sway: Math.random() * Math.PI * 2,
      swaySp: 0.004 + Math.random() * 0.008,
      rot: Math.random() * Math.PI * 2,
      rotSp: (Math.random() - 0.5) * 0.01,
    });
  }

  function drawLeaf(l) {
    ctx.save();
    ctx.translate(l.x + Math.sin(l.sway) * 14, l.y);
    ctx.rotate(l.rot);
    ctx.fillStyle = "rgba(31,66,48,.55)";
    ctx.beginPath();
    ctx.ellipse(0, 0, l.size, l.size * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    for (const l of leaves) {
      drawLeaf(l);
      l.y += l.vy;
      l.sway += l.swaySp * 16;
      l.rot += l.rotSp;
      if (l.y > H + 12) { l.y = -12; l.x = Math.random() * W; }
    }

    for (const f of flies) {
      const pulse = reduced ? 0.55 : 0.35 + 0.65 * Math.abs(Math.sin(f.ph + t * f.pf * 0.06));
      const glow = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 7);
      glow.addColorStop(0, "rgba(255,217,140," + 0.9 * pulse + ")");
      glow.addColorStop(0.35, "rgba(255,217,140," + 0.28 * pulse + ")");
      glow.addColorStop(1, "rgba(255,217,140,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r * 7, 0, Math.PI * 2);
      ctx.fill();

      if (!reduced) {
        f.a += (Math.random() - 0.5) * 0.12;
        f.x += Math.cos(f.a) * f.sp;
        f.y += Math.sin(f.a) * f.sp * 0.6;
        if (f.x < -20) f.x = W + 20;
        if (f.x > W + 20) f.x = -20;
        if (f.y < H * 0.08) { f.y = H * 0.08; f.a = -f.a; }
        if (f.y > H + 20) f.y = H * 0.4;
      }
    }
    if (!reduced) requestAnimationFrame(draw);
  }

  if (reduced) draw(0);
  else requestAnimationFrame(draw);
})();
