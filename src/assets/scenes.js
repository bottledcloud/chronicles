// Procedural polaroid scenes — a unique little garden painted per post,
// seeded from its title so it's the same on every rebuild. No network, no files.
(function () {
  // --- seeded RNG (mulberry32) ---
  function hash(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return h >>> 0;
  }
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // --- garden palettes: [sky top, sky bottom, orb, hillA, hillB, hillC, tree] ---
  const palettes = [
    ["#2d5a3d","#5a8a5e","#ffd98c","#1f4230","#2d5a3d","#3a6a49","#14301f"], // forest dusk
    ["#3b2d5e","#8a5570","#ffd98c","#2c2148","#4a3a6b","#5a3a6b","#160f28"], // twilight violet
    ["#37505c","#9fd0c7","#f4efe2","#2c524e","#3f6b66","#5d8a96","#13282a"], // monsoon
    ["#f4e6c0","#e9c46a","#fff3e0","#d4a843","#b3852a","#9bb069","#5a4030"], // golden field
    ["#a8cce4","#eef5fa","#fdfdfb","#7fb5ad","#9bb069","#6d9460","#33424a"], // bright day
    ["#0d2230","#13374d","#f4efe2","#0a1b26","#1c4a66","#13374d","#0a1810"], // night sea
    ["#5c1f24","#d4691e","#ffd98c","#4a1a20","#8c3b2e","#b3541a","#2e1014"], // marigold evening
    ["#f0ead8","#c9e0c5","#f7e3b5","#a3c89c","#6d9460","#9bb069","#4a3328"], // meadow
  ];

  function scene(seed) {
    const r = rng(seed);
    const p = palettes[Math.floor(r() * palettes.length)];
    const W = 200, H = 150;
    let svg = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">`;
    // sky
    svg += `<defs><linearGradient id="s${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p[0]}"/><stop offset="1" stop-color="${p[1]}"/></linearGradient></defs>`;
    svg += `<rect width="${W}" height="${H}" fill="url(#s${seed})"/>`;
    // orb (sun/moon) — random position upper area
    const ox = 30 + r() * 140, oy = 20 + r() * 35, orad = 10 + r() * 12;
    svg += `<circle cx="${ox.toFixed(1)}" cy="${oy.toFixed(1)}" r="${(orad*2).toFixed(1)}" fill="${p[2]}" opacity="0.18"/>`;
    svg += `<circle cx="${ox.toFixed(1)}" cy="${oy.toFixed(1)}" r="${orad.toFixed(1)}" fill="${p[2]}"/>`;
    // three hill layers
    function hill(yBase, color) {
      const a = yBase + r() * 12, b = yBase - r() * 16, c = yBase + r() * 10, d = yBase - r() * 12;
      return `<path d="M0,${a.toFixed(1)} C${(W*0.25).toFixed(0)},${b.toFixed(1)} ${(W*0.5).toFixed(0)},${c.toFixed(1)} ${(W*0.75).toFixed(0)},${d.toFixed(1)} S${W},${(yBase).toFixed(1)} ${W},${(yBase).toFixed(1)} L${W},${H} L0,${H} Z" fill="${color}"/>`;
    }
    svg += hill(H * 0.55, p[5]);
    svg += hill(H * 0.68, p[4]);
    svg += hill(H * 0.82, p[3]);
    // a tree or two on the front hill
    const treeCount = 1 + Math.floor(r() * 2);
    for (let i = 0; i < treeCount; i++) {
      const tx = 25 + r() * 150, ty = H * 0.82 + r() * 8, th = 14 + r() * 12;
      svg += `<rect x="${(tx-1).toFixed(1)}" y="${(ty-th*0.4).toFixed(1)}" width="2" height="${(th*0.5).toFixed(1)}" fill="${p[6]}"/>`;
      svg += `<ellipse cx="${tx.toFixed(1)}" cy="${(ty-th*0.5).toFixed(1)}" rx="${(th*0.5).toFixed(1)}" ry="${(th*0.62).toFixed(1)}" fill="${p[6]}"/>`;
    }
    // fireflies / stars
    const flies = 3 + Math.floor(r() * 4);
    for (let i = 0; i < flies; i++) {
      const fx = r() * W, fy = r() * H * 0.6, fr = 0.8 + r() * 1.4;
      svg += `<circle cx="${fx.toFixed(1)}" cy="${fy.toFixed(1)}" r="${(fr*3).toFixed(1)}" fill="#ffd98c" opacity="0.18"/>`;
      svg += `<circle cx="${fx.toFixed(1)}" cy="${fy.toFixed(1)}" r="${fr.toFixed(1)}" fill="#ffd98c"/>`;
    }
    svg += `</svg>`;
    return svg;
  }

  document.querySelectorAll(".polaroid-photo").forEach((el) => {
    const seed = hash(el.getAttribute("data-seed") || el.textContent || "garden");
    el.innerHTML = scene(seed);
  });
})();
