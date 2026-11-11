// 간단한 SVG 그리기 도구: 구역(zone), 장비(node), 연결(link), 설명(note)
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const COLOR = {
  ink: '#1f2937', muted: '#5b6472', line: '#6b7280',
  ext: { fill: '#eef2ff', stroke: '#8b9bd8' },      // 외부·지점
  edge: { fill: '#fff4e5', stroke: '#e0a458' },     // 경계
  sec: { fill: '#ffeceb', stroke: '#e08a85' },      // 보안
  staff: { fill: '#eaf7ee', stroke: '#79b98b' },    // 직원
  srv: { fill: '#fff9e0', stroke: '#d9b84a' },      // 서버
  mgmt: { fill: '#f1ecfa', stroke: '#a28ad6' },     // 관리·로그
  app: { fill: '#e8f4fb', stroke: '#6cb0d6' },      // 응용
};

export class Svg {
  constructor(w, h) { this.w = w; this.h = h; this.parts = []; this.nodes = {}; }

  zone(x, y, w, h, label, c, opt = {}) {
    this.parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${c.fill}" stroke="${c.stroke}" stroke-width="1.5" ${opt.dash ? 'stroke-dasharray="7 5"' : ''}/>`);
    if (label) this.parts.push(`<text x="${x + 14}" y="${y + 24}" font-size="15" font-weight="700" fill="${c.stroke === '#e08a85' ? '#a8423c' : COLOR.ink}" opacity="0.9">${esc(label)}</text>`);
  }

  /* lines[0] 은 굵게, 나머지는 작게 */
  node(id, x, y, w, h, lines, opt = {}) {
    const fill = opt.fill ?? '#ffffff', stroke = opt.stroke ?? '#4b5563';
    this.nodes[id] = { x, y, w, h };
    const r = opt.round ?? 9;
    let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${opt.sw ?? 1.6}" ${opt.dash ? 'stroke-dasharray="6 4"' : ''}/>`;
    const n = lines.length, lh = 17, total = n * lh, top = y + (h - total) / 2 + 13;
    lines.forEach((t, i) => {
      s += `<text x="${x + w / 2}" y="${top + i * lh}" text-anchor="middle" font-size="${i === 0 ? 14.5 : 12}" font-weight="${i === 0 ? 700 : 400}" fill="${i === 0 ? COLOR.ink : COLOR.muted}">${esc(t)}</text>`;
    });
    this.parts.push(s);
  }

  p(id, side, off = 0) {
    const n = this.nodes[id]; if (!n) throw new Error('노드 없음: ' + id);
    if (side === 't') return [n.x + n.w / 2 + off, n.y];
    if (side === 'b') return [n.x + n.w / 2 + off, n.y + n.h];
    if (side === 'l') return [n.x, n.y + n.h / 2 + off];
    return [n.x + n.w, n.y + n.h / 2 + off];
  }

  /* pts: [[x,y],...]; opt: {label, dash, color, w, arrow('end'|'both'|none), at(0~1 구간 위치), lx, ly} */
  link(pts, opt = {}) {
    const color = opt.color ?? COLOR.line;
    const d = pts.map((q, i) => `${i ? 'L' : 'M'}${q[0]} ${q[1]}`).join(' ');
    const mk = opt.arrow === 'both' ? 'marker-start="url(#ar)" marker-end="url(#ar)"' : opt.arrow === 'none' ? '' : 'marker-end="url(#ar)"';
    this.parts.push(`<path d="${d}" fill="none" stroke="${color}" stroke-width="${opt.w ?? 1.8}" ${opt.dash ? 'stroke-dasharray="6 4"' : ''} ${mk}/>`);
    if (opt.label) {
      let seg = Math.floor((pts.length - 1) * (opt.at ?? 0.5)); seg = Math.min(seg, pts.length - 2);
      const a = pts[seg], b = pts[seg + 1];
      const lx = opt.lx ?? (a[0] + b[0]) / 2, ly = opt.ly ?? (a[1] + b[1]) / 2;
      const w = Math.max(24, String(opt.label).length * 7.4 + 12);
      this.parts.push(`<rect x="${lx - w / 2}" y="${ly - 10}" width="${w}" height="19" rx="4" fill="#ffffff" stroke="${color}" stroke-width="0.8" opacity="0.95"/>`);
      this.parts.push(`<text x="${lx}" y="${ly + 4}" text-anchor="middle" font-size="11.5" fill="${COLOR.ink}">${esc(opt.label)}</text>`);
    }
  }

  legend(x, y) {
    const items = [['실선', COLOR.line, false, '연결(L2·L3 링크)'], ['점선', '#8c6fcf', true, '복사·관리·VPN 터널'], ['굵은 붉은 상자', '#c0463f', false, '보안 장비']];
    this.parts.push(`<rect x="${x}" y="${y}" width="330" height="86" rx="8" fill="#ffffff" stroke="#c9ced6"/>`);
    this.parts.push(`<text x="${x + 12}" y="${y + 20}" font-size="12.5" font-weight="700" fill="${COLOR.ink}">범례</text>`);
    items.forEach(([n, c, d, t], i) => {
      const yy = y + 38 + i * 17;
      this.parts.push(`<line x1="${x + 12}" y1="${yy - 4}" x2="${x + 52}" y2="${yy - 4}" stroke="${c}" stroke-width="2.2" ${d ? 'stroke-dasharray="6 4"' : ''}/>`);
      this.parts.push(`<text x="${x + 62}" y="${yy}" font-size="12" fill="${COLOR.ink}">${t}</text>`);
    });
  }

  text(x, y, t, opt = {}) {
    const lines = Array.isArray(t) ? t : [t];
    this.parts.push(lines.map((l, i) => `<text x="${x}" y="${y + i * (opt.lh ?? 18)}" font-size="${opt.size ?? 13}" font-weight="${opt.bold ? 700 : 400}" fill="${opt.fill ?? COLOR.ink}" text-anchor="${opt.anchor ?? 'start'}">${esc(l)}</text>`).join(''));
  }

  toString(title) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.w} ${this.h}" width="${this.w}" height="${this.h}" role="img" aria-label="${esc(title)}" font-family="'Malgun Gothic','Apple SD Gothic Neo','Noto Sans KR','Segoe UI',sans-serif">
<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${COLOR.line}"/></marker></defs>
<rect width="${this.w}" height="${this.h}" fill="#ffffff"/>
<text x="24" y="34" font-size="20" font-weight="800" fill="${COLOR.ink}">${esc(title)}</text>
${this.parts.join('\n')}
</svg>
`;
  }
}
