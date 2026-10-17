// The page vine: one trunk drawn down the page as you scroll, with a branch into every [data-vine-node].
const { useEffect: useEffectV, useRef: useRefV } = React;

function VineLayer() {
  const svgRef = useRefV(null);

  useEffectV(() => {
    const svg = svgRef.current;
    const host = svg.parentElement;
    const NS = 'http://www.w3.org/2000/svg';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let samples = [], lens = [], total = 0;
    let branches = [], leaves = [];
    let live = null, tip = null;
    let maxTip = 0, raf = 0, buildRaf = 0, lastW = 0, lastH = 0;

    const mk = (tag, attrs) => {
      const e = document.createElementNS(NS, tag);
      for (const k in attrs) e.setAttribute(k, attrs[k]);
      svg.appendChild(e);
      return e;
    };

    const indexAt = (y) => {
      let lo = 0, hi = samples.length - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (samples[mid][1] <= y) lo = mid; else hi = mid;
      }
      return lo;
    };
    const frac = (i, y) => {
      const a = samples[i], b = samples[Math.min(i + 1, samples.length - 1)];
      return b[1] === a[1] ? 0 : Math.max(0, Math.min(1, (y - a[1]) / (b[1] - a[1])));
    };
    const trunkX = (y) => {
      const i = indexAt(y), t = frac(i, y);
      const a = samples[i], b = samples[Math.min(i + 1, samples.length - 1)];
      return a[0] + (b[0] - a[0]) * t;
    };
    const lenAt = (y) => {
      const i = indexAt(y), t = frac(i, y);
      const next = lens[Math.min(i + 1, lens.length - 1)];
      return lens[i] + (next - lens[i]) * t;
    };

    function build() {
      const hr = host.getBoundingClientRect();
      const W = hr.width, H = host.offsetHeight;
      lastW = W; lastH = H;
      const box = (el) => {
        const r = el.getBoundingClientRect();
        return { l: r.left - hr.left, r: r.right - hr.left, t: r.top - hr.top, b: r.bottom - hr.top };
      };

      svg.setAttribute('width', W);
      svg.setAttribute('height', H);
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.textContent = '';
      samples = []; lens = []; branches = []; leaves = []; live = null; tip = null;

      const rails = [...host.querySelectorAll('[data-vine-rail]')]
        .map(box).filter((b) => b.b - b.t > 20).sort((a, b) => a.t - b.t);
      if (!rails.length) return;

      const amp = W < 900 ? 3 : 12;
      let px = null, py = null;
      rails.forEach((rl) => {
        const cx = (rl.l + rl.r) / 2;
        let startY = rl.t;
        if (px !== null) {
          const span = rl.t - py;
          for (let y = py + 12; y < rl.t; y += 12) {
            const t = (y - py) / span;
            samples.push([px + (cx - px) * t * t * (3 - 2 * t), y]);
          }
          startY = Math.max(rl.t, py + 12);
        }
        for (let y = startY; y <= rl.b; y += 12) {
          const env = Math.max(0, Math.min(1, (y - rl.t) / 140, (rl.b - y) / 140));
          samples.push([cx + amp * env * Math.sin(((y - rl.t) / 380) * Math.PI * 2), y]);
        }
        const last = samples[samples.length - 1];
        px = last[0]; py = last[1];
      });

      lens = [0];
      for (let i = 1; i < samples.length; i++) {
        lens.push(lens[i - 1] + Math.hypot(samples[i][0] - samples[i - 1][0], samples[i][1] - samples[i - 1][1]));
      }
      total = lens[lens.length - 1];
      const d = 'M' + samples.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L');
      const firstY = samples[0][1], lastY = samples[samples.length - 1][1];

      mk('path', { class: 'vine-ghost', d });

      const nodeSpecs = [];
      host.querySelectorAll('[data-vine-node]').forEach((el) => {
        const b = box(el);
        const ny = b.t + (parseFloat(el.getAttribute('data-vine-node')) || 30);
        if (ny < firstY + 8 || ny > lastY) return;
        const gap = parseFloat(el.getAttribute('data-vine-gap') || '16');
        const mid = trunkX(ny);
        const dir = (b.l + b.r) / 2 > mid ? 1 : -1;
        let nx = dir > 0 ? b.l - gap : b.r + gap;
        if (dir * (nx - mid) < 8) nx = mid + dir * 8;
        const k = Math.max(4, Math.min(28, dir * (nx - mid) * 0.5));
        const y0 = ny - k, tx = trunkX(y0);
        nodeSpecs.push({ el, nx, ny, y0, d: `M${tx.toFixed(1)},${y0.toFixed(1)}L${(tx + dir * k).toFixed(1)},${ny.toFixed(1)}L${nx.toFixed(1)},${ny.toFixed(1)}` });
      });

      let side = 1;
      rails.forEach((rl) => {
        for (let y = rl.t + 130; y < rl.b - 70; y += 250) {
          if (nodeSpecs.some((n) => Math.abs(n.ny - y) < 46)) continue;
          const g = mk('g', { transform: `translate(${trunkX(y).toFixed(1)},${y}) rotate(${side > 0 ? 32 : 148}) scale(${W < 900 ? 0.6 : 1})` });
          const leaf = document.createElementNS(NS, 'path');
          leaf.setAttribute('class', 'vine-leaf');
          leaf.setAttribute('d', 'M0 0C7 -10 20 -10 27 0C20 10 7 10 0 0ZM4 0H21');
          g.appendChild(leaf);
          leaves.push({ leaf, y });
          side = -side;
        }
      });

      nodeSpecs.forEach((n) => {
        const path = mk('path', { class: 'vine-branch', d: n.d });
        const L = path.getTotalLength();
        path.style.strokeDasharray = L;
        path.style.strokeDashoffset = L;
        n.path = path; n.L = L;
      });

      live = mk('path', { class: 'vine-trunk', d });
      live.style.strokeDasharray = total;
      live.style.strokeDashoffset = total;

      nodeSpecs.forEach((n) => {
        n.node = mk('circle', { class: 'vine-node', cx: n.nx.toFixed(1), cy: n.ny.toFixed(1), r: 5 });
        branches.push(n);
      });

      tip = mk('circle', { class: 'vine-tip', r: 5 });
    }

    function update() {
      raf = 0;
      if (!samples.length || !live) return;
      const hr = host.getBoundingClientRect();
      const vh = window.innerHeight;
      let y = -hr.top + vh * 0.72;
      if (reduced || window.scrollY + vh >= document.documentElement.scrollHeight - 8) y = Infinity;
      maxTip = Math.max(maxTip, y);

      const firstY = samples[0][1], lastY = samples[samples.length - 1][1];
      const ty = Math.max(firstY, Math.min(maxTip, lastY));
      live.style.strokeDashoffset = total - lenAt(ty);
      tip.setAttribute('cx', trunkX(ty).toFixed(1));
      tip.setAttribute('cy', ty.toFixed(1));
      tip.style.opacity = maxTip >= lastY ? 0 : 1;

      branches.forEach((b) => {
        if (!b.lit && maxTip >= b.y0) {
          b.lit = true;
          b.path.style.strokeDashoffset = 0;
          b.node.classList.add('lit');
          b.el.setAttribute('data-lit', '');
        }
      });
      leaves.forEach((l) => {
        if (!l.lit && maxTip >= l.y) { l.lit = true; l.leaf.classList.add('lit'); }
      });
    }

    function rebuild() {
      buildRaf = 0;
      svg.classList.add('vine-instant');
      build();
      update();
      requestAnimationFrame(() => requestAnimationFrame(() => svg.classList.remove('vine-instant')));
    }
    const scheduleBuild = () => { if (!buildRaf) buildRaf = requestAnimationFrame(rebuild); };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onFocus = (e) => {
      const n = e.type === 'focusin' && e.target.closest ? e.target.closest('[data-vine-node]') : null;
      branches.forEach((b) => {
        b.path.classList.toggle('active', b.el === n);
        b.node.classList.toggle('active', b.el === n);
      });
    };

    document.documentElement.classList.add('vine-ready');
    rebuild();

    const ro = new ResizeObserver(() => {
      const r = host.getBoundingClientRect();
      if (Math.abs(r.width - lastW) > 0.5 || Math.abs(host.offsetHeight - lastH) > 0.5) scheduleBuild();
    });
    ro.observe(host);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', scheduleBuild);
    window.addEventListener('load', scheduleBuild);
    document.addEventListener('focusin', onFocus);
    document.addEventListener('focusout', onFocus);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleBuild);

    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', scheduleBuild);
      window.removeEventListener('load', scheduleBuild);
      document.removeEventListener('focusin', onFocus);
      document.removeEventListener('focusout', onFocus);
      document.documentElement.classList.remove('vine-ready');
    };
  }, []);

  return <svg ref={svgRef} className="vine-layer" aria-hidden="true" />;
}

Object.assign(window, { VineLayer });
