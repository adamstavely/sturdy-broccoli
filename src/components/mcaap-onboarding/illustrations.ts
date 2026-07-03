/* illustrations.ts — inline animated-SVG illustrations for the onboarding tours.
   Each value is a self-contained SVG string (viewBox 0 0 260 148). Animation is
   driven by CSS classes defined in mcaap-onboarding.css (.il-*).
   Every tour step has its own illustration key — no two step cards share a motion. */

const NAVY = '#1D3557', BLUE = '#0073E6', GOLD = '#B5851C', GOLDL = '#E8C46A',
      GREEN = '#16A34A', RED = '#D24B43', VIOLET = '#7C5CD6', PAPER = '#FFFFFF',
      TINT = '#EAF0F7', LINE = '#E2E8F0', INK3 = '#94A3B8';

function frame(inner: string, bg?: string): string {
  return '<svg viewBox="0 0 260 148" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">' +
    '<defs><linearGradient id="ilbg" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="' + (bg || '#F4F7FC') + '"/><stop offset="1" stop-color="#ECF2FB"/></linearGradient>' +
    '<linearGradient id="ilgold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + GOLDL + '"/><stop offset="1" stop-color="' + GOLD + '"/></linearGradient></defs>' +
    '<rect x="1" y="1" width="258" height="146" rx="16" fill="url(#ilbg)" stroke="' + LINE + '"/>' + inner + '</svg>';
}
function diamond(cx: number, cy: number, r: number, fill: string, extra?: string): string {
  return '<path ' + (extra || '') + ' d="M' + cx + ' ' + (cy - r) + ' C' + (cx + r * .5) + ' ' + (cy - r * .35) + ' ' + (cx + r * .5) + ' ' + (cy - r * .35) + ' ' + (cx + r) + ' ' + cy +
    ' C' + (cx + r * .5) + ' ' + (cy + r * .35) + ' ' + (cx + r * .5) + ' ' + (cy + r * .35) + ' ' + cx + ' ' + (cy + r) +
    ' C' + (cx - r * .5) + ' ' + (cy + r * .35) + ' ' + (cx - r * .5) + ' ' + (cy + r * .35) + ' ' + (cx - r) + ' ' + cy +
    ' C' + (cx - r * .5) + ' ' + (cy - r * .35) + ' ' + (cx - r * .5) + ' ' + (cy - r * .35) + ' ' + cx + ' ' + (cy - r) + ' Z" fill="' + fill + '"/>';
}
function rc(x: number, y: number, w: number, h: number, fill: string, stroke?: string): string { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="7" fill="' + fill + '" stroke="' + (stroke || LINE) + '"/>'; }
function bar(x: number, y: number, w: number, fill: string, stroke?: string): string { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="6" rx="3" fill="' + fill + '"' + (stroke ? ' stroke="' + stroke + '"' : '') + '/>'; }
function dot(cx: number, cy: number, r: number, fill: string): string { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '"/>'; }
function pill(x: number, y: number, w: number, h: number, fill: string, stroke?: string): string { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (h / 2) + '" fill="' + fill + '"' + (stroke ? ' stroke="' + stroke + '"' : '') + '/>'; }
function ic(x: number, y: number, s: number, c: string): string { return '<rect x="' + x + '" y="' + y + '" width="' + s + '" height="' + s + '" rx="5" fill="' + c + '"/>'; }
function lines(x: number, y: number, n: number, w: number): string { let s = ''; for (let i = 0; i < (n || 5); i++) s += bar(x, y + i * 13, (i % 2 ? w * .7 : w), LINE); return s; }
function tag(x: number, y: number, t: string, c: string): string { return '<rect x="' + x + '" y="' + y + '" width="' + (t ? 44 : 24) + '" height="15" rx="7" fill="#fff" stroke="' + c + '"/>' + (t ? '<text x="' + (x + 22) + '" y="' + (y + 11) + '" font-size="8" font-family="Inter,sans-serif" font-weight="700" fill="' + c + '" text-anchor="middle">' + t + '</text>' : ''); }
function col(x: number, label: string, dots: string[]): string {
  let s = '<text x="' + (x + 22) + '" y="34" font-size="7.5" font-family="Inter,sans-serif" font-weight="700" fill="' + INK3 + '" text-anchor="middle">' + label.toUpperCase() + '</text>';
  for (let i = 0; i < dots.length; i++) { s += '<rect x="' + x + '" y="' + (46 + i * 26) + '" width="44" height="20" rx="5" fill="#fff" stroke="' + LINE + '"/><circle cx="' + (x + 8) + '" cy="' + (56 + i * 26) + '" r="3" fill="' + dots[i] + '"/>'; }
  return s;
}
function node(cx: number, cy: number, c: string): string { return '<circle cx="' + cx + '" cy="' + cy + '" r="10" fill="' + PAPER + '" stroke="' + c + '" stroke-width="3"/>'; }
function star(cx: number, cy: number, c: string): string { return '<path d="M' + cx + ' ' + (cy - 6) + ' l1.9 4 4.3 .5 -3.1 3 .8 4.3 -3.8 -2.1 -3.8 2.1 .8 -4.3 -3.1 -3 4.3 -.5 z" fill="' + c + '"/>'; }

export const ILLUS: Record<string, string> = {};

// ============ GETTING STARTED ============
  ILLUS.gs_welcome = frame(
    '<g class="il-spin-slow" style="transform-origin:130px 74px">' +
    dot(130, 30, 3.4, BLUE) + dot(188, 60, 3.4, GOLD) + dot(170, 112, 3.4, GREEN) + dot(82, 108, 3.4, BLUE) + dot(66, 46, 3.4, GOLDL) + '</g>' +
    '<circle cx="130" cy="74" r="40" fill="none" stroke="' + LINE + '" stroke-dasharray="3 6"/>' +
    '<g class="il-float">' + diamond(130, 74, 26, NAVY) + diamond(130, 74, 13, 'url(#ilgold)') + '</g>');

  ILLUS.gs_explore = frame(
    rc(30, 30, 58, 40, PAPER) + rc(101, 30, 58, 40, PAPER) + rc(172, 30, 58, 40, TINT) +
    rc(30, 82, 58, 36, TINT) + rc(101, 82, 58, 36, PAPER) + rc(172, 82, 58, 36, PAPER) +
    bar(40, 44, 30, BLUE) + bar(40, 52, 20, LINE) + bar(111, 44, 34, NAVY) + bar(111, 52, 22, LINE) +
    '<g class="il-float"><circle cx="150" cy="92" r="17" fill="none" stroke="' + BLUE + '" stroke-width="4"/>' +
    '<line x1="162" y1="104" x2="176" y2="118" stroke="' + BLUE + '" stroke-width="4.5" stroke-linecap="round"/>' +
    '<circle class="il-pulse" cx="150" cy="92" r="17" fill="' + BLUE + '" opacity=".14"/></g>');

  ILLUS.gs_tasks = frame(
    col(24, 'Backlog', [INK3, INK3]) + col(84, 'Doing', [BLUE, INK3]) + col(144, 'Review', [GOLD]) + col(204, 'Done', [GREEN]) +
    '<g class="il-slide-card"><rect x="84" y="46" width="52" height="22" rx="5" fill="' + PAPER + '" stroke="' + BLUE + '"/>' +
    bar(90, 53, 26, BLUE) + bar(90, 60, 16, LINE) + '</g>');

  ILLUS.gs_workspaces = frame(
    '<g class="il-popseq">' +
    '<g>' + rc(50, 30, 68, 44, PAPER) + ic(61, 43, 18, GREEN) + bar(86, 46, 22, LINE) + bar(86, 54, 14, LINE) + '</g>' +
    '<g>' + rc(142, 30, 68, 44, PAPER) + ic(153, 43, 18, BLUE) + bar(178, 46, 22, LINE) + bar(178, 54, 14, LINE) + '</g>' +
    '<g>' + rc(50, 84, 68, 44, PAPER) + ic(61, 97, 18, GOLD) + bar(86, 100, 22, LINE) + bar(86, 108, 14, LINE) + '</g>' +
    '<g>' + rc(142, 84, 68, 44, PAPER) + ic(153, 97, 18, NAVY) + bar(178, 100, 22, LINE) + bar(178, 108, 14, LINE) + '</g>' +
    '</g>');

  ILLUS.gs_termbase = (function (): string {
    function trow(y: number) { return pill(38, y, 68, 16, PAPER, LINE) + bar(46, y + 7, 46, NAVY) + '<line class="il-blink" x1="112" y1="' + (y + 8) + '" x2="148" y2="' + (y + 8) + '" stroke="' + BLUE + '" stroke-width="2.4" stroke-dasharray="3 4"/>' + pill(154, y, 68, 16, PAPER, LINE) + bar(162, y + 7, 46, BLUE); }
    return frame(trow(44) + trow(72) + trow(100));
  })();

  ILLUS.gs_agents = frame(
    '<circle class="il-ring" cx="130" cy="70" r="30" fill="none" stroke="' + BLUE + '" stroke-width="3" stroke-dasharray="146 30" stroke-linecap="round" style="transform-origin:130px 70px"/>' +
    '<circle cx="130" cy="70" r="30" fill="none" stroke="' + LINE + '" stroke-width="3"/>' +
    '<g class="il-float"><path d="M130 48 L150 60 V84 L130 96 L110 84 V60 Z" fill="' + NAVY + '"/>' + diamond(130, 72, 9, 'url(#ilgold)') + '</g>' +
    '<g class="il-spark">' + dot(182, 46, 3, GOLD) + dot(78, 52, 3, BLUE) + dot(176, 100, 3, GREEN) + '</g>');

  ILLUS.gs_profile = frame(
    '<circle cx="130" cy="76" r="32" fill="' + TINT + '" stroke="' + LINE + '"/>' +
    '<circle cx="130" cy="68" r="12" fill="' + NAVY + '"/>' +
    '<path d="M110 98 a20 20 0 0 1 40 0 z" fill="' + NAVY + '"/>' +
    '<g class="il-spin-slow" style="transform-origin:130px 76px">' + dot(130, 36, 5.5, 'url(#ilgold)') + '</g>');

  ILLUS.gs_help = frame(
    '<g class="il-float"><circle cx="130" cy="70" r="34" fill="' + PAPER + '" stroke="' + BLUE + '" stroke-width="3"/>' +
    '<path d="M118 60 a12 12 0 1 1 16 12 c-3 2 -4 4 -4 8" fill="none" stroke="' + NAVY + '" stroke-width="5" stroke-linecap="round"/>' +
    dot(130, 90, 3.4, NAVY) + '</g>' +
    '<g class="il-spark">' + dot(180, 44, 3, GOLD) + dot(82, 52, 3, BLUE) + '</g>');

  ILLUS.gs_celebrate = frame(
    '<g class="il-spark"><path d="M60 40 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" fill="' + GOLD + '"/>' +
    '<path d="M206 48 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2 z" fill="' + BLUE + '"/>' +
    dot(72, 108, 4, GREEN) + dot(196, 106, 4, GOLDL) + dot(130, 26, 4, BLUE) + '</g>' +
    '<g class="il-rise"><circle cx="130" cy="78" r="34" fill="' + NAVY + '"/>' + diamond(130, 78, 17, 'url(#ilgold)') + '</g>');

  // ============ TASKS & AGENTS ============
  ILLUS.ta_board = frame(
    col(24, 'Backlog', [INK3, INK3]) + col(84, 'Doing', []) + col(144, 'Review', [GOLD, INK3]) + col(204, 'Done', [GREEN]) +
    '<rect x="84" y="46" width="52" height="24" rx="5" fill="' + PAPER + '" stroke="' + BLUE + '"/>' + bar(90, 53, 26, BLUE) + bar(90, 61, 16, LINE) +
    '<rect class="il-pulse" x="84" y="46" width="52" height="24" rx="5" fill="' + BLUE + '" opacity=".16"/>');

  ILLUS.ta_views = (function (): string {
    function cells(x: number, y: number) { var s = ''; for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) s += '<rect x="' + (x + c * 17) + '" y="' + (y + r * 15) + '" width="13" height="11" rx="2" fill="' + (r === 1 && c === 1 ? BLUE : TINT) + '"/>'; return s; }
    return frame('<g class="il-popseq">' +
      '<g>' + rc(24, 44, 66, 60, PAPER) + ic(31, 52, 15, BLUE) + ic(49, 52, 15, LINE) + ic(67, 52, 15, LINE) + bar(31, 74, 52, LINE) + bar(31, 84, 38, LINE) + '</g>' +
      '<g>' + rc(97, 44, 66, 60, PAPER) + bar(105, 54, 50, NAVY) + bar(105, 66, 50, LINE) + bar(105, 78, 50, LINE) + bar(105, 90, 32, LINE) + '</g>' +
      '<g>' + rc(170, 44, 66, 60, PAPER) + cells(178, 52) + '</g>' +
      '</g>');
  })();

  ILLUS.ta_new = frame(
    col(24, 'Backlog', [INK3]) + col(84, 'Doing', [BLUE]) + col(144, 'Review', [GOLD]) + col(204, 'Done', [GREEN]) +
    '<g class="il-drop"><rect x="24" y="74" width="52" height="26" rx="5" fill="' + PAPER + '" stroke="' + GREEN + '"/>' +
    '<path d="M50 80 v14 M43 87 h14" stroke="' + GREEN + '" stroke-width="2.6" stroke-linecap="round"/></g>');

  ILLUS.ta_workflows = (function (): string {
    function wp(x: number, c: string) { return '<g>' + pill(x, 62, 40, 22, PAPER, c) + dot(x + 11, 73, 4, c) + bar(x + 20, 70, 12, LINE) + '</g>'; }
    return frame('<g class="il-wave">' + wp(20, BLUE) + wp(66, GREEN) + wp(112, GOLD) + wp(158, NAVY) + wp(204, INK3) + '</g>');
  })();

  ILLUS.ta_move = frame(
    col(24, 'Backlog', [INK3]) + col(84, 'Doing', [INK3]) + col(144, 'Review', []) + col(204, 'Done', []) +
    '<rect x="144" y="46" width="52" height="22" rx="5" fill="' + PAPER + '" stroke="' + GOLD + '"/>' + bar(150, 53, 26, GOLD) + bar(150, 60, 16, LINE) +
    '<path class="il-draw" d="M78 100 C112 100 118 58 140 57" fill="none" stroke="' + BLUE + '" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="96" stroke-dashoffset="96"/>' +
    '<path d="M134 52 l8 5 -8 5" fill="none" stroke="' + BLUE + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>');

  ILLUS.ta_card = frame(
    '<g class="il-tilt"><rect x="74" y="34" width="112" height="80" rx="10" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    bar(86, 48, 66, NAVY) + bar(86, 60, 84, LINE) +
    dot(94, 84, 7, BLUE) + bar(106, 81, 30, LINE) +
    pill(150, 77, 30, 14, '#FFF7E6', '#E6C975') +
    '<path d="M172 96 h8 l-4 9 z" fill="' + RED + '"/></g>');

  ILLUS.ta_assignee = frame(
    '<g class="il-swap"><circle cx="96" cy="74" r="16" fill="' + BLUE + '"/><circle cx="96" cy="69" r="6" fill="#fff"/><path d="M86 87 a10 10 0 0 1 20 0 z" fill="#fff"/></g>' +
    '<g class="il-float"><rect x="150" y="58" width="34" height="32" rx="7" fill="' + NAVY + '"/><rect x="158" y="66" width="18" height="12" rx="3" fill="url(#ilgold)"/>' + dot(163, 84, 1.6, NAVY) + dot(171, 84, 1.6, NAVY) + '</g>' +
    '<path d="M120 74 h20 M134 68 l6 6 -6 6" fill="none" stroke="' + INK3 + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>');

  ILLUS.ta_autonomy = frame(
    '<rect x="52" y="44" width="126" height="14" rx="7" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    '<rect x="52" y="67" width="126" height="14" rx="7" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    '<rect x="52" y="90" width="126" height="14" rx="7" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    '<g class="il-grow">' + pill(52, 44, 52, 14, GREEN) + pill(52, 67, 86, 14, GOLD) + pill(52, 90, 120, 14, BLUE) + '</g>' +
    dot(192, 51, 4, GREEN) + dot(192, 74, 4, GOLD) + dot(192, 97, 4, BLUE));

  ILLUS.ta_fleet = frame(
    '<g class="il-orbit" style="transform-origin:130px 74px"><circle cx="130" cy="74" r="34" fill="none" stroke="' + BLUE + '" stroke-width="3" stroke-dasharray="120 40" stroke-linecap="round"/></g>' +
    '<g class="il-spin-slow" style="transform-origin:130px 74px"><circle cx="130" cy="74" r="22" fill="none" stroke="' + GOLD + '" stroke-width="3" stroke-dasharray="70 28" stroke-linecap="round"/></g>' +
    diamond(130, 74, 11, NAVY) + diamond(130, 74, 5.5, 'url(#ilgold)') +
    '<g class="il-spark">' + dot(178, 44, 3, BLUE) + dot(80, 50, 3, GOLD) + dot(180, 104, 3, GREEN) + '</g>');

  // ============ CLEARANCE ============
  ILLUS.cl_intro = frame(
    '<rect x="52" y="30" width="92" height="92" rx="8" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    bar(64, 44, 48, NAVY) + bar(64, 58, 66, LINE) + bar(64, 68, 54, LINE) + bar(64, 78, 66, LINE) + bar(64, 88, 44, LINE) + bar(64, 98, 60, LINE) +
    '<g class="il-bob"><path d="M158 70 v14 a2 2 0 0 0 2 2 h6 l22 12 V56 l-22 12 h-6 a2 2 0 0 0 -2 2 z" fill="' + GREEN + '"/>' +
    '<path d="M192 68 a8 8 0 0 1 0 20" fill="none" stroke="' + GREEN + '" stroke-width="2.4"/></g>');

  ILLUS.cl_protect = frame(
    '<rect x="56" y="26" width="118" height="96" rx="8" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    bar(70, 42, 60, NAVY) + bar(70, 54, 90, LINE) +
    '<rect x="70" y="64" width="90" height="9" rx="3" fill="' + RED + '" opacity=".18"/><line x1="70" y1="74" x2="160" y2="74" stroke="' + RED + '" stroke-width="2"/>' +
    bar(70, 84, 78, LINE) + bar(70, 94, 58, LINE) +
    '<g class="il-rise"><path d="M182 84 l16 6 v11 c0 9 -8 13 -16 16 c-8 -3 -16 -7 -16 -16 v-11 z" fill="' + GREEN + '"/>' +
    '<path d="M175 100 l5 5 9 -10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>');

  ILLUS.cl_screen = frame(
    '<rect x="70" y="28" width="120" height="92" rx="8" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    bar(84, 44, 60, NAVY) + bar(84, 56, 92, LINE) + bar(84, 66, 80, LINE) + bar(84, 76, 92, LINE) + bar(84, 86, 66, LINE) + bar(84, 96, 84, LINE) +
    '<rect class="il-scan" x="70" y="70" width="120" height="8" rx="2" fill="' + BLUE + '" opacity=".5"/>' +
    '<g class="il-spark">' + dot(98, 66, 3, GOLD) + dot(150, 86, 3, RED) + '</g>');

  ILLUS.cl_queue = frame(
    pill(46, 62, 168, 26, '#EEF1F6') +
    '<rect x="50" y="66" width="54" height="18" rx="6" fill="' + PAPER + '" stroke="' + LINE + '"/>' + bar(58, 74, 30, NAVY) +
    '<g class="il-blink">' + bar(116, 74, 30, INK3) + bar(170, 74, 30, INK3) + '</g>' +
    dot(154, 55, 5, BLUE) + dot(208, 55, 5, GOLD));

  ILLUS.cl_table = frame(
    '<rect x="40" y="34" width="180" height="82" rx="8" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    '<rect x="40" y="34" width="180" height="20" rx="8" fill="' + TINT + '"/>' + bar(52, 42, 40, INK3) + bar(120, 42, 30, INK3) + bar(178, 42, 26, INK3) +
    (function (): string { var s = ''; [62, 80, 98].forEach(function (y: number) { s += dot(56, y + 7, 6, BLUE) + bar(70, y + 4, 46, NAVY) + bar(128, y + 4, 26, LINE) + bar(182, y + 4, 24, GREEN); }); return s; })() +
    '<rect class="il-pulse" x="44" y="76" width="172" height="18" rx="4" fill="' + BLUE + '" opacity=".12"/>');

  ILLUS.cl_route = frame(
    '<path class="il-draw" d="M52 48 C52 74 92 74 130 74 C168 74 168 100 208 100" fill="none" stroke="' + BLUE + '" stroke-width="3" stroke-linecap="round" stroke-dasharray="220" stroke-dashoffset="220"/>' +
    node(52, 48, NAVY) + node(130, 74, BLUE) + node(208, 100, GREEN) +
    tag(30, 66, 'Draft', NAVY) + tag(108, 92, 'Screen', BLUE) + tag(186, 118, '', GREEN));

  // ============ MEMOS ============
  ILLUS.me_intro = frame(
    node(52, 40, NAVY) + node(130, 74, BLUE) + node(208, 108, GREEN) +
    '<path id="mroute" d="M52 50 C52 74 90 74 130 74 C170 74 170 98 208 98" fill="none" stroke="' + LINE + '" stroke-width="3" stroke-dasharray="4 6"/>' +
    '<circle r="5" fill="' + GOLD + '"><animateMotion dur="2.6s" repeatCount="indefinite" rotate="auto"><mpath href="#mroute"/></animateMotion></circle>' +
    tag(30, 62, 'Draft', NAVY) + tag(108, 96, 'Concur', BLUE) + tag(186, 130, '', GREEN));

  ILLUS.me_why = frame(
    '<circle cx="130" cy="76" r="30" fill="none" stroke="' + GOLD + '" stroke-width="2.5" stroke-dasharray="4 5"/>' +
    '<circle class="il-pulse" cx="130" cy="74" r="24" fill="' + GOLD + '" opacity=".2"/>' +
    '<g class="il-drop"><circle cx="130" cy="74" r="24" fill="url(#ilgold)"/>' +
    '<path d="M120 74 l7 7 14 -15" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></g>');

  ILLUS.me_start = frame(
    '<rect x="60" y="28" width="104" height="92" rx="8" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    bar(74, 44, 58, NAVY) + bar(74, 58, 76, LINE) + bar(74, 70, 60, LINE) + bar(74, 82, 70, LINE) +
    '<g class="il-pen"><path d="M150 66 l30 -22 10 10 -30 22 -13 3 3 -13 z" fill="' + GOLDL + '" stroke="' + GOLD + '" stroke-width="1.5" stroke-linejoin="round"/><path d="M180 44 l10 10" stroke="' + GOLD + '" stroke-width="1.5"/></g>');

  ILLUS.me_awaiting = frame(
    '<g class="il-float"><path d="M78 66 h104 v34 a6 6 0 0 1 -6 6 H84 a6 6 0 0 1 -6 -6 z" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    '<path d="M78 66 l14 -30 h76 l14 30 h-38 a8 8 0 0 1 -16 0 z" fill="' + TINT + '" stroke="' + LINE + '"/></g>' +
    '<circle class="il-pulse" cx="176" cy="52" r="14" fill="' + RED + '" opacity=".3"/><circle cx="176" cy="52" r="11" fill="' + RED + '"/>' +
    '<text x="176" y="56" font-size="11" font-family="Inter,sans-serif" font-weight="700" fill="#fff" text-anchor="middle">3</text>');

  ILLUS.me_track = (function (): string {
    function tn(y: number, c: string) { return '<g><circle cx="80" cy="' + y + '" r="8" fill="' + PAPER + '" stroke="' + c + '" stroke-width="3"/>' + pill(98, y - 8, 96, 16, PAPER, LINE) + bar(106, y - 1, 54, c) + '</g>'; }
    return frame('<line x1="80" y1="34" x2="80" y2="112" stroke="' + LINE + '" stroke-width="3"/>' +
      '<g class="il-popseq">' + tn(42, GREEN) + tn(74, BLUE) + tn(106, INK3) + '</g>');
  })();

  // ============ PREP ============
  ILLUS.pr_intro = frame(
    '<g class="il-float"><rect x="66" y="26" width="128" height="96" rx="8" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    '<rect x="66" y="26" width="128" height="22" rx="8" fill="' + GOLD + '" opacity=".18"/>' +
    bar(80, 60, 60, NAVY) + bar(80, 74, 100, LINE) + bar(80, 86, 84, LINE) + bar(80, 98, 96, LINE) + '</g>' +
    '<rect x="150" y="30" width="40" height="14" rx="4" fill="' + GOLD + '"/><text x="170" y="40" font-size="7.5" font-family="Inter,sans-serif" font-weight="700" fill="#fff" text-anchor="middle">TMPL</text>');

  ILLUS.pr_why = (function (): string {
    function sect(y: number, c: string) { return '<g><rect x="84" y="' + y + '" width="92" height="18" rx="4" fill="' + TINT + '"/><rect x="84" y="' + y + '" width="6" height="18" rx="3" fill="' + c + '"/>' + bar(98, y + 7, 60, LINE) + '</g>'; }
    return frame('<rect x="70" y="28" width="120" height="94" rx="8" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
      '<g class="il-popseq">' + sect(40, BLUE) + sect(64, GREEN) + sect(88, GOLD) + '</g>');
  })();

  ILLUS.pr_start = frame(
    '<rect x="60" y="30" width="120" height="88" rx="8" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    bar(74, 46, 50, NAVY) +
    '<path class="il-draw" d="M74 62 H166" stroke="' + BLUE + '" stroke-width="3" stroke-linecap="round" stroke-dasharray="92" stroke-dashoffset="92"/>' +
    bar(74, 74, 96, LINE) + bar(74, 86, 70, LINE) + bar(74, 98, 88, LINE) +
    '<g class="il-spark"><path d="M176 40 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" fill="url(#ilgold)"/>' + dot(58, 54, 3, BLUE) + dot(184, 92, 3, GREEN) + '</g>');

  ILLUS.pr_scope = frame(
    '<g class="il-driftx"><path d="M46 56 h24 l6 8 h34 v40 a4 4 0 0 1 -4 4 H50 a4 4 0 0 1 -4 -4 z" fill="' + BLUE + '"/></g>' +
    '<g class="il-float"><path d="M150 56 h24 l6 8 h34 v40 a4 4 0 0 1 -4 4 h-60 a4 4 0 0 1 -4 -4 z" fill="' + NAVY + '"/></g>' +
    '<text x="76" y="120" font-size="8" font-family="Inter,sans-serif" font-weight="700" fill="' + BLUE + '" text-anchor="middle">Mine</text>' +
    '<text x="180" y="120" font-size="8" font-family="Inter,sans-serif" font-weight="700" fill="' + NAVY + '" text-anchor="middle">Team</text>');

  ILLUS.pr_handoff = frame(
    '<g class="il-shift"><rect x="40" y="54" width="60" height="44" rx="6" fill="' + PAPER + '" stroke="' + LINE + '"/>' + bar(50, 66, 40, NAVY) + bar(50, 76, 32, LINE) + bar(50, 84, 36, LINE) + '</g>' +
    '<path d="M110 76 h22 M126 70 l6 6 -6 6" fill="none" stroke="' + INK3 + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<g class="il-float"><rect x="150" y="44" width="66" height="26" rx="6" fill="' + GREEN + '" opacity=".14" stroke="' + GREEN + '"/><text x="183" y="61" font-size="9" font-family="Inter,sans-serif" font-weight="700" fill="' + GREEN + '" text-anchor="middle">Memos</text>' +
    '<rect x="150" y="82" width="66" height="26" rx="6" fill="' + BLUE + '" opacity=".14" stroke="' + BLUE + '"/><text x="183" y="99" font-size="9" font-family="Inter,sans-serif" font-weight="700" fill="' + BLUE + '" text-anchor="middle">Clear</text></g>');

  // ============ BRIEFING BOOKS ============
  ILLUS.br_intro = frame(
    '<g class="il-float"><rect x="86" y="42" width="88" height="72" rx="6" fill="' + BLUE + '"/>' +
    '<rect x="78" y="36" width="88" height="72" rx="6" fill="' + NAVY + '"/>' +
    '<rect x="70" y="30" width="88" height="72" rx="6" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    bar(82, 44, 48, NAVY) + bar(82, 56, 64, LINE) + bar(82, 66, 52, LINE) + bar(82, 76, 60, LINE) + bar(82, 86, 40, LINE) + '</g>' +
    '<g class="il-rise"><circle cx="176" cy="98" r="13" fill="url(#ilgold)"/>' + diamond(176, 98, 6, '#fff') + '</g>');

  ILLUS.br_stats = (function (): string {
    function st(x: number, c: string, n: string) { return '<g><rect x="' + x + '" y="50" width="52" height="46" rx="8" fill="' + PAPER + '" stroke="' + LINE + '"/><rect x="' + x + '" y="50" width="52" height="6" rx="3" fill="' + c + '"/>' + '<text x="' + (x + 26) + '" y="80" font-size="15" font-family="Inter,sans-serif" font-weight="800" fill="' + c + '" text-anchor="middle">' + n + '</text><rect x="' + (x + 12) + '" y="86" width="28" height="4" rx="2" fill="' + LINE + '"/></g>'; }
    return frame('<g class="il-popseq">' + st(22, BLUE, '12') + st(82, GREEN, '34') + st(142, GOLD, '8') + st(202, NAVY, '4.6') + '</g>');
  })();

  ILLUS.br_views = frame(
    pill(66, 62, 128, 28, '#EEF1F6') + bar(80, 74, 40, INK3) + bar(148, 74, 34, INK3) +
    '<g class="il-shift"><rect x="70" y="66" width="60" height="20" rx="7" fill="' + PAPER + '" stroke="' + LINE + '"/>' + bar(80, 74, 40, NAVY) + '</g>');

  ILLUS.br_start = frame(
    '<g class="il-bob"><rect x="92" y="34" width="74" height="82" rx="8" fill="' + GOLD + '" opacity=".16" stroke="' + GOLD + '"/><rect x="92" y="34" width="10" height="82" rx="4" fill="' + GOLD + '"/></g>' +
    '<g class="il-drop"><circle cx="172" cy="50" r="15" fill="' + NAVY + '"/><path d="M172 44 v12 M166 50 h12" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></g>');

  ILLUS.br_collate = frame(
    '<rect x="86" y="60" width="92" height="58" rx="8" fill="' + PAPER + '" stroke="' + LINE + '"/><rect x="86" y="60" width="10" height="58" rx="4" fill="' + NAVY + '"/>' +
    '<g class="il-fall1"><rect x="102" y="66" width="62" height="14" rx="4" fill="' + BLUE + '"/></g>' +
    '<g class="il-fall2"><rect x="102" y="84" width="62" height="14" rx="4" fill="' + GREEN + '"/></g>' +
    '<g class="il-fall3"><rect x="102" y="102" width="62" height="14" rx="4" fill="' + GOLD + '"/></g>');

  ILLUS.br_publish = frame(
    '<g class="il-up"><rect x="96" y="46" width="68" height="60" rx="8" fill="' + PAPER + '" stroke="' + LINE + '"/><rect x="96" y="46" width="10" height="60" rx="4" fill="' + NAVY + '"/>' +
    '<path d="M132 92 V64 M122 74 l10 -10 10 10" fill="none" stroke="' + GREEN + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>' +
    '<g class="il-spark">' + star(58, 54, GOLD) + star(202, 60, BLUE) + star(70, 106, GREEN) + '</g>');

  // ============ LANGUAGE EXPLOITATION ============
  ILLUS.la_intro = frame(
    '<g class="il-spin-slow" style="transform-origin:96px 74px"><circle cx="96" cy="74" r="34" fill="' + TINT + '" stroke="' + BLUE + '" stroke-width="2"/>' +
    '<path d="M62 74 H130 M96 40 C112 56 112 92 96 108 C80 92 80 56 96 40" fill="none" stroke="' + BLUE + '" stroke-width="2"/></g>' +
    '<path class="il-draw" d="M138 60 H150" stroke="' + INK3 + '" stroke-width="3" stroke-linecap="round"/>' +
    '<g class="il-float">' + bar(150, 46, 74, PAPER, LINE) + bar(158, 50, 50, NAVY) + bar(150, 66, 74, PAPER, LINE) + bar(158, 70, 60, BLUE) + bar(150, 86, 74, PAPER, LINE) + bar(158, 90, 40, GOLD) + '</g>');

  ILLUS.la_why = frame(
    '<circle cx="104" cy="78" r="30" fill="' + TINT + '" stroke="' + LINE + '"/>' +
    '<circle cx="100" cy="72" r="10" fill="' + NAVY + '"/><path d="M84 96 a18 18 0 0 1 34 0 z" fill="' + NAVY + '"/>' +
    '<circle class="il-pulse" cx="160" cy="74" r="24" fill="' + GOLD + '" opacity=".18"/>' +
    '<g class="il-float"><path d="M160 52 a16 16 0 0 0 -12 26 c0 4 2 6 2 9 h20 c0 -3 2 -5 2 -9 a16 16 0 0 0 -12 -26 z" fill="url(#ilgold)"/><rect x="152" y="90" width="16" height="5" rx="2" fill="' + GOLD + '"/></g>');

  ILLUS.la_capture = frame(
    '<g class="il-shift"><rect x="40" y="54" width="54" height="42" rx="6" fill="#FFF7E6" stroke="' + GOLD + '"/>' + bar(50, 66, 32, GOLD) + bar(50, 76, 26, LINE) + bar(50, 84, 30, LINE) + '</g>' +
    '<path d="M104 76 h22 M120 70 l6 6 -6 6" fill="none" stroke="' + INK3 + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<g class="il-float"><rect x="146" y="46" width="70" height="60" rx="8" fill="' + PAPER + '" stroke="' + LINE + '"/>' + bar(158, 60, 46, NAVY) + bar(158, 72, 44, LINE) + bar(158, 82, 40, LINE) +
    '<circle cx="204" cy="96" r="8" fill="' + GREEN + '"/><path d="M200 96 l3 3 5 -6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>');

  ILLUS.la_articles = (function (): string {
    function ar(y: number) { return '<g>' + rc(48, y - 14, 164, 26, PAPER) + ic(56, y - 8, 14, BLUE) + bar(78, y - 5, 90, NAVY) + '<circle cx="196" cy="' + y + '" r="7" fill="' + GREEN + '"/><path d="M192 ' + y + ' l3 3 5 -6" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></g>'; }
    return frame('<g class="il-wave">' + ar(38) + ar(72) + ar(106) + '</g>');
  })();

  ILLUS.la_endorse = frame(
    '<g class="il-spin-slow" style="transform-origin:130px 74px">' + dot(130, 40, 6, BLUE) + dot(164, 74, 6, GREEN) + dot(130, 108, 6, GOLD) + dot(96, 74, 6, NAVY) + '</g>' +
    '<circle cx="130" cy="74" r="20" fill="url(#ilgold)"/>' +
    '<path d="M120 74 l7 7 14 -15" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>');

  ILLUS.la_sources = (function (): string {
    function sn(x: number, y: number, c: string) { return '<g><circle cx="' + x + '" cy="' + y + '" r="11" fill="' + PAPER + '" stroke="' + c + '" stroke-width="2.5"/>' + ic(x - 5, y - 5, 10, c) + '</g>'; }
    return frame('<line x1="130" y1="74" x2="60" y2="42" stroke="' + LINE + '" stroke-width="2"/><line x1="130" y1="74" x2="60" y2="106" stroke="' + LINE + '" stroke-width="2"/><line x1="130" y1="74" x2="204" y2="48" stroke="' + LINE + '" stroke-width="2"/><line x1="130" y1="74" x2="204" y2="100" stroke="' + LINE + '" stroke-width="2"/>' +
      '<circle cx="130" cy="74" r="16" fill="' + NAVY + '"/>' + diamond(130, 74, 7, 'url(#ilgold)') +
      '<g class="il-popseq">' + sn(60, 42, BLUE) + sn(60, 106, GREEN) + sn(204, 48, GOLD) + sn(204, 100, BLUE) + '</g>');
  })();

  ILLUS.la_stuck = frame(
    '<g class="il-tilt"><rect x="106" y="66" width="48" height="42" rx="7" fill="url(#ilgold)"/>' +
    '<path d="M114 66 v-8 a16 16 0 0 1 32 0 v8" fill="none" stroke="' + NAVY + '" stroke-width="5"/>' +
    '<circle cx="130" cy="84" r="5" fill="#fff"/><rect x="128" y="86" width="4" height="10" rx="2" fill="#fff"/></g>' +
    '<g class="il-spark">' + dot(80, 54, 3, BLUE) + dot(184, 60, 3, GREEN) + dot(176, 104, 3, GOLD) + '</g>');

  // ============ DATA UPLOAD ============
  ILLUS.up_intro = frame(
    '<g class="il-float"><ellipse cx="130" cy="112" rx="46" ry="12" fill="' + NAVY + '"/><path d="M84 74 v38 c0 6.6 20.6 12 46 12 s46 -5.4 46 -12 v-38" fill="' + NAVY + '"/>' +
    '<ellipse cx="130" cy="74" rx="46" ry="12" fill="' + BLUE + '"/></g>' +
    '<g class="il-up"><circle cx="130" cy="44" r="20" fill="url(#ilgold)"/><path d="M130 54 V34 M121 43 l9 -9 9 9" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></g>');

  ILLUS.up_describe = (function (): string {
    function field(y: number, c: string) { return '<g><rect x="80" y="' + y + '" width="100" height="14" rx="4" fill="' + TINT + '"/>' + bar(86, y + 5, 40, c) + '</g>'; }
    return frame('<rect x="66" y="28" width="128" height="94" rx="8" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
      '<g class="il-wave">' + field(44, BLUE) + field(66, GREEN) + field(88, GOLD) + '</g>');
  })();

  ILLUS.up_classify = frame(
    '<circle class="il-pulse" cx="132" cy="76" r="30" fill="' + RED + '" opacity=".14"/>' +
    '<g class="il-drop"><path d="M92 58 h48 a6 6 0 0 1 5 3 l18 15 -18 15 a6 6 0 0 1 -5 3 H92 a6 6 0 0 1 -6 -6 V64 a6 6 0 0 1 6 -6 z" fill="' + NAVY + '"/>' +
    '<circle cx="102" cy="76" r="4" fill="#fff"/><rect x="114" y="72" width="36" height="8" rx="3" fill="url(#ilgold)"/></g>');

  ILLUS.up_files = frame(
    '<rect x="60" y="72" width="140" height="44" rx="10" fill="' + TINT + '" stroke="' + BLUE + '" stroke-dasharray="5 5"/>' +
    '<g class="il-fall1"><rect x="76" y="72" width="30" height="38" rx="4" fill="' + PAPER + '" stroke="' + LINE + '"/><rect x="76" y="72" width="30" height="7" rx="4" fill="' + BLUE + '"/></g>' +
    '<g class="il-fall2"><rect x="115" y="72" width="30" height="38" rx="4" fill="' + PAPER + '" stroke="' + LINE + '"/><rect x="115" y="72" width="30" height="7" rx="4" fill="' + GREEN + '"/></g>' +
    '<g class="il-fall3"><rect x="154" y="72" width="30" height="38" rx="4" fill="' + PAPER + '" stroke="' + LINE + '"/><rect x="154" y="72" width="30" height="7" rx="4" fill="' + GOLD + '"/></g>');

  ILLUS.up_submit = (function (): string {
    function chk(y: number, c: string) { return '<g><circle cx="86" cy="' + (y + 6) + '" r="8" fill="' + c + '"/><path d="M82 ' + (y + 6) + ' l3 3 6 -7" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' + bar(102, y + 3, 70, LINE) + '</g>'; }
    return frame('<rect x="66" y="30" width="128" height="90" rx="8" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
      '<g class="il-popseq">' + chk(44, GREEN) + chk(66, GREEN) + chk(88, BLUE) + '</g>');
  })();

  ILLUS.up_next = frame(
    '<g class="il-orbit" style="transform-origin:100px 72px"><circle cx="100" cy="72" r="22" fill="none" stroke="' + NAVY + '" stroke-width="4" stroke-dasharray="10 8"/></g>' +
    '<g class="il-spin-slow" style="transform-origin:150px 96px"><circle cx="150" cy="96" r="14" fill="none" stroke="' + BLUE + '" stroke-width="4" stroke-dasharray="8 7"/></g>' +
    '<g class="il-drop"><rect x="176" y="46" width="52" height="38" rx="7" fill="' + PAPER + '" stroke="' + GREEN + '"/><circle cx="188" cy="60" r="5" fill="' + GREEN + '"/>' + bar(198, 57, 22, NAVY) + bar(186, 72, 34, LINE) + '</g>');

  // ============ TRIAGE ============
  ILLUS.tr_intro = frame(
    '<g class="il-float"><path d="M64 44 h132 l-10 30 h-112 z" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    '<path d="M74 74 h30 a6 6 0 0 0 6 6 h40 a6 6 0 0 0 6 -6 h30" fill="none" stroke="' + NAVY + '" stroke-width="2.5"/></g>' +
    '<g class="il-fall1"><rect x="76" y="92" width="30" height="20" rx="4" fill="' + BLUE + '"/></g>' +
    '<g class="il-fall2"><rect x="115" y="96" width="30" height="20" rx="4" fill="' + GOLD + '"/></g>' +
    '<g class="il-fall3"><rect x="154" y="92" width="30" height="20" rx="4" fill="' + GREEN + '"/></g>');

  ILLUS.tr_gate = frame(
    '<line x1="120" y1="34" x2="120" y2="114" stroke="' + LINE + '" stroke-width="3"/><line x1="140" y1="34" x2="140" y2="114" stroke="' + LINE + '" stroke-width="3"/>' +
    dot(120, 34, 4, NAVY) + dot(140, 34, 4, NAVY) +
    '<g class="il-shift"><rect x="50" y="60" width="42" height="28" rx="6" fill="' + BLUE + '"/></g>' +
    '<path d="M156 74 h34 M180 68 l8 6 -8 6" fill="none" stroke="' + GREEN + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>');

  ILLUS.tr_jump = frame(
    '<circle class="il-pulse" cx="130" cy="74" r="34" fill="' + GREEN + '" opacity=".16"/>' +
    '<circle cx="130" cy="74" r="28" fill="' + GREEN + '"/><path d="M122 62 l20 12 -20 12 z" fill="#fff"/>');

  ILLUS.tr_scope = frame(
    '<rect x="52" y="54" width="130" height="16" rx="8" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    '<rect x="52" y="82" width="130" height="16" rx="8" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    '<g class="il-grow">' + pill(52, 54, 82, 16, BLUE) + pill(52, 82, 120, 16, NAVY) + '</g>' +
    dot(196, 62, 4, BLUE) + dot(196, 90, 4, NAVY));

  ILLUS.tr_queue = (function (): string {
    function qr(y: number) { return '<g>' + ic(60, y, 12, BLUE) + bar(80, y + 3, 80, NAVY) + bar(178, y + 3, 22, GREEN) + '</g>'; }
    return frame('<rect x="48" y="34" width="164" height="82" rx="8" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
      '<g class="il-wave">' + qr(48) + qr(70) + qr(92) + '</g>' +
      '<path class="il-float" d="M150 84 l0 16 4 -4 3 7 3 -1 -3 -7 5 0 z" fill="' + NAVY + '"/>');
  })();

  ILLUS.tr_signoff = frame(
    '<rect x="70" y="34" width="120" height="80" rx="8" fill="' + PAPER + '" stroke="' + LINE + '"/>' +
    bar(84, 50, 60, NAVY) + bar(84, 62, 90, LINE) + bar(84, 72, 74, LINE) + bar(84, 82, 86, LINE) +
    '<g class="il-drop"><circle cx="160" cy="94" r="20" fill="' + GREEN + '"/><path d="M150 94 l7 7 14 -16" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></g>');

  // ============ EXPLORE & SEARCH ============
  ILLUS.ex_search = frame(
    lines(38, 40, 3, 120) +
    '<g class="il-float"><circle cx="150" cy="78" r="26" fill="' + PAPER + '" stroke="' + BLUE + '" stroke-width="4.5"/>' +
    '<circle class="il-pulse" cx="150" cy="78" r="26" fill="' + BLUE + '" opacity=".12"/>' +
    '<line x1="169" y1="97" x2="192" y2="120" stroke="' + NAVY + '" stroke-width="6" stroke-linecap="round"/>' +
    bar(139, 72, 22, BLUE) + bar(139, 82, 14, LINE) + '</g>');

  ILLUS.ex_ai = frame(
    pill(40, 62, 180, 28, PAPER, LINE) +
    '<g class="il-spark"><path d="M62 71 l2.4 6 6 2.4 -6 2.4 -2.4 6 -2.4 -6 -6 -2.4 6 -2.4 z" fill="url(#ilgold)"/></g>' +
    bar(80, 73, 92, LINE) +
    '<circle class="il-pulse" cx="196" cy="76" r="12" fill="' + VIOLET + '" opacity=".25"/><circle cx="196" cy="76" r="9" fill="' + VIOLET + '"/>' +
    '<path d="M192 76 l3 3 5 -6" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>');

  ILLUS.ex_browse = (function (): string {
    function bt(x: number, c: string) { return '<g><rect x="' + x + '" y="44" width="52" height="60" rx="8" fill="' + PAPER + '" stroke="' + LINE + '"/>' + ic(x + 18, 56, 16, c) + bar(x + 12, 82, 28, LINE) + bar(x + 12, 90, 20, LINE) + '</g>'; }
    return frame('<g class="il-popseq">' + bt(22, BLUE) + bt(82, GREEN) + bt(142, GOLD) + bt(202, NAVY) + '</g>');
  })();

  ILLUS.ex_tabs = frame(
    '<line x1="40" y1="62" x2="220" y2="62" stroke="' + LINE + '"/>' +
    '<rect x="48" y="48" width="46" height="14" rx="4" fill="' + BLUE + '"/><rect x="48" y="60" width="46" height="3" fill="' + BLUE + '"/>' +
    '<g class="il-blink">' + bar(108, 52, 40, INK3) + bar(168, 52, 40, INK3) + '</g>' +
    dot(150, 40, 4, GREEN) + dot(210, 40, 4, GOLD));

  ILLUS.ex_map = frame(
    '<rect x="40" y="30" width="180" height="88" rx="8" fill="' + TINT + '" stroke="' + LINE + '"/>' +
    '<line x1="90" y1="30" x2="90" y2="118" stroke="' + LINE + '" stroke-width="1"/><line x1="150" y1="30" x2="150" y2="118" stroke="' + LINE + '" stroke-width="1"/><line x1="40" y1="74" x2="220" y2="74" stroke="' + LINE + '" stroke-width="1"/>' +
    '<polygon points="82,46 166,58 150,102 76,94" fill="' + BLUE + '" fill-opacity=".14" stroke="' + BLUE + '" stroke-width="2.5"/>' +
    '<g class="il-popseq">' + '<g>' + dot(100, 66, 4, GREEN) + '</g><g>' + dot(132, 82, 4, GOLD) + '</g><g>' + dot(118, 92, 4, BLUE) + '</g></g>' +
    '<circle class="il-pulse" cx="132" cy="82" r="9" fill="' + GOLD + '" opacity=".3"/>' +
    '<circle class="il-float" cx="166" cy="58" r="5" fill="#fff" stroke="' + BLUE + '" stroke-width="2.5"/>');

  ILLUS.ex_subscribe = frame(
    '<circle class="il-pulse" cx="118" cy="72" r="30" fill="' + GOLD + '" opacity=".16"/>' +
    '<g class="il-tilt"><path d="M118 40 a20 20 0 0 1 20 20 v10 l6 8 h-52 l6 -8 v-10 a20 20 0 0 1 20 -20 z" fill="url(#ilgold)"/>' +
    '<path d="M110 86 a8 8 0 0 0 16 0" fill="' + NAVY + '"/></g>' +
    '<g class="il-float"><rect x="150" y="60" width="66" height="40" rx="7" fill="' + PAPER + '" stroke="' + LINE + '"/>' + bar(160, 72, 44, NAVY) + bar(160, 82, 32, LINE) + '</g>');

// Aliases for the fixed engine screens (welcome modal, completion screen)
// which reference these keys directly rather than through a tour step.
ILLUS.welcome = ILLUS.gs_welcome;
ILLUS.celebrate = ILLUS.gs_celebrate;
