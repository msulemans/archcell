// Illustrative drawing-sheet generator.
// Ported unchanged from the legacy dist/app.js so sheets stay pixel-identical.
// Runs at build time: pages render the SVG strings into the HTML.

export function escapeXML(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function drawingSVG(sheet, project) {
  const { kind } = sheet;
  const text = (x, y, t, size = 10, fill = '#7a806e') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-family="Arial,sans-serif" text-anchor="middle">${escapeXML(t)}</text>`;
  const rect = (x, y, w, h, more = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${more}/>`;
  const line = (x1, y1, x2, y2, more = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${more}/>`;
  let content = '';
  const dim = (x1, y1, x2, y2, label) => `<g stroke="#a7ac9c" stroke-width=".65">${line(x1, y1, x2, y2)}${line(x1 - 4, y1 - 4, x1 + 4, y1 + 4)}${line(x2 - 4, y2 - 4, x2 + 4, y2 + 4)}</g>${text((x1 + x2) / 2, (y1 + y2) / 2 - 8, label, 9)}`;
  const elevation = ['elevation', 'rear', 'section', 'joinery'].includes(kind);
  if (elevation) {
    if (kind === 'joinery') {
      content = `<g fill="none" stroke="#7f866f" stroke-width="2">${rect(165, 150, 470, 235)}${line(165, 245, 635, 245)}${line(165, 275, 635, 275)}${[0, 1, 2, 3, 4].map(i => rect(169 + i * 94, 278, 86, 103)).join('')}${[0, 1, 2, 3].map(i => rect(169 + i * 117, 154, 109, 87)).join('')}${rect(353, 296, 87, 66)}${rect(460, 247, 90, 25)}${line(507, 247, 507, 227)}</g><g stroke="#b6a277">${[0, 1, 2, 3, 4].map(i => line(235 + i * 94, 306, 244 + i * 94, 306)).join('')}</g>${dim(165, 412, 635, 412, 'KITCHEN JOINERY / SCHEMATIC')}${text(400, 120, 'ELEVATION 01 — KITCHEN', 12)}`;
    } else {
      const cut = kind === 'section';
      content = `<g fill="none" stroke="#737d68" stroke-width="2">${rect(170, 160, 470, 245)}${rect(150, 270, 510, 14)}${rect(160, 146, 490, 14)}${rect(200, 300, 120, 105)}${rect(352, 300, 150, 105)}${rect(530, 290, 75, 115)}${rect(206, 178, 175, 70)}${rect(429, 178, 185, 70)}${line(292, 178, 292, 248)}${line(518, 178, 518, 248)}${line(397, 300, 397, 405)}${line(447, 300, 447, 405)}${line(120, 408, 690, 408)}</g><g stroke="#a0a78f" stroke-width=".7">${Array.from({ length: 12 }, (_, i) => line(178 + i * 8, 162, 178 + i * 8, 267)).join('')}${line(179, 251, 390, 251)}${line(179, 260, 390, 260)}</g>${cut ? `<g stroke="#757e68" fill="none">${Array.from({ length: 10 }, (_, i) => line(345 + i * 14, 390 - i * 11, 360 + i * 14, 390 - i * 11)).join('')}${line(344, 399, 491, 279)}</g>${text(275, 337, 'LIVING', 10)}${text(513, 215, 'BEDROOM', 10)}` : ''}${dim(160, 121, 650, 121, 'ILLUSTRATIVE ELEVATION — NOT TO SCALE')}${dim(700, 147, 700, 406, '')}${text(736, 282, 'LEVELS', 9)}${text(115, 152, 'ROOF', 9)}${text(108, 276, 'LEVEL 01', 9)}${text(108, 408, 'GROUND', 9)}${kind === 'rear' ? `<g stroke="#858e78" fill="none">${rect(534, 160, 60, 105)}${line(120, 431, 680, 431)}</g>` : ''}`;
    }
  } else {
    const roomNames = kind === 'upper' ? ['BEDROOM 01', 'BEDROOM 02', 'FAMILY LOUNGE', 'TERRACE', 'BATH', 'BEDROOM 03'] : kind === 'roof' ? ['ROOF', 'SOLAR ZONE', 'OPEN TERRACE', 'LIGHT WELL', 'SERVICES', 'ROOF GARDEN'] : ['DRAWING ROOM', 'DINING', 'FAMILY LOUNGE', 'COURTYARD', 'KITCHEN', 'BEDROOM'];
    content = `<g fill="none" stroke="#64725c" stroke-width="3">${rect(208, 108, 388, 328)}${line(208, 228, 360, 228)}${line(360, 108, 360, 228)}${line(360, 228, 596, 228)}${line(437, 108, 437, 228)}${line(208, 338, 360, 338)}${line(360, 228, 360, 436)}${line(360, 338, 596, 338)}${line(484, 338, 484, 436)}</g><g stroke="#a2a991" stroke-width=".9" fill="none">${rect(215, 115, 374, 314)}${rect(223, 101, 109, 12)}${rect(444, 101, 105, 12)}${rect(223, 430, 103, 12)}${rect(500, 430, 69, 12)}${rect(590, 246, 12, 65)}${rect(370, 244, 209, 77, 'stroke-dasharray="4 4"')}${Array.from({ length: 9 }, (_, i) => line(209, 240 + i * 9, 249, 240 + i * 9)).join('')}${line(229, 316, 229, 245)}${line(229, 245, 225, 251)}${line(229, 245, 233, 251)}</g><g stroke="#e8eadd" stroke-width="7">${line(302, 228, 334, 228)}${line(360, 180, 360, 212)}${line(470, 228, 501, 228)}${line(360, 287, 360, 320)}${line(391, 338, 422, 338)}${line(520, 338, 551, 338)}</g><g stroke="#7e896e" stroke-width=".8" fill="none"><path d="M302 228V196Q334 196 334 228"/><path d="M360 180H392Q392 212 360 212"/><path d="M470 228V196Q502 196 502 228"/><path d="M391 338V369Q422 369 422 338"/></g>${text(285, 171, roomNames[0])}${text(518, 172, roomNames[1])}${text(291, 290, roomNames[2], 9)}${text(472, 284, roomNames[3])}${text(420, 390, roomNames[4])}${text(539, 390, roomNames[5])}${text(398, 172, 'FOYER', 9)}${text(285, 390, 'ENTRY / PORCH', 9)}${dim(208, 83, 596, 83, 'ILLUSTRATIVE PLAN — NOT TO SCALE')}${dim(178, 108, 178, 436, '')}${text(155, 270, 'NTS', 9)}<g stroke="#7f886e" fill="none">${line(666, 159, 666, 113)}<path d="M658 124L666 108L674 124Z"/></g>${text(666, 99, 'N', 11)}`;
    if (['lighting', 'power', 'switches', 'ceiling'].includes(kind)) {
      const pts = [[250, 145], [315, 145], [477, 145], [551, 145], [275, 265], [310, 314], [395, 264], [551, 306], [392, 365], [460, 411], [519, 366], [566, 411]];
      content += `<g stroke="#bd934a" stroke-width="1.3" fill="none">${pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6"/>${line(x - 4, y - 4, x + 4, y + 4)}${line(x - 4, y + 4, x + 4, y - 4)}`).join('')}${['switches', 'power'].includes(kind) ? pts.map(([x, y], i) => line(x, y, 360, i < 4 ? 190 : i < 8 ? 302 : 397, 'stroke-dasharray="5 4"')).join('') : ''}${kind === 'ceiling' ? rect(234, 126, 100, 83, 'stroke-dasharray="4 3"') : ''}</g>${text(405, 477, kind === 'power' ? 'POWER POINTS / INDICATIVE LOCATIONS' : kind === 'switches' ? 'DASHED LINES: SAMPLE SWITCHING CIRCUITS' : 'LIGHTING POINTS / INDICATIVE LOCATIONS', 10, '#aa8547')}`;
    } else if (['water', 'drainage', 'sanitary'].includes(kind)) {
      content += `<g stroke="${kind === 'drainage' ? '#a57858' : '#568990'}" fill="none" stroke-width="2"><path d="M625 442V360H421V391M625 360V130H555V165M625 300H562" ${kind === 'drainage' ? 'stroke-dasharray="6 4"' : ''}/>${rect(411, 369, 25, 21)}${rect(549, 148, 27, 24)}<circle cx="625" cy="360" r="6"/>${kind === 'sanitary' ? rect(552, 278, 21, 27) : ''}</g>${text(405, 477, kind === 'drainage' ? 'DRAINAGE ROUTES / DIAGRAM ONLY' : 'WATER & FIXTURE LOCATIONS / DIAGRAM ONLY', 10, '#568990')}`;
    } else if (['foundation', 'columns', 'slab'].includes(kind)) {
      content += `<g fill="${kind === 'foundation' ? 'none' : '#9a8260'}" stroke="#9a8260" stroke-width="1.4">${[208, 360, 596].flatMap(x => [108, 228, 338, 436].map(y => rect(x - 9, y - 9, 18, 18))).join('')}</g><g stroke="#9a8260" stroke-width=".9" stroke-dasharray="5 5">${[208, 360, 596].map(x => line(x, 64, x, 461)).join('')}${[108, 228, 338, 436].map(y => line(184, y, 630, y)).join('')}${kind === 'slab' ? Array.from({ length: 9 }, (_, i) => line(220 + i * 40, 115, 220 + i * 40, 428)).join('') : ''}</g>${text(405, 477, 'STRUCTURAL CONCEPT / ENGINEERING DESIGN REQUIRED', 10, '#9a8260')}`;
    } else if (kind === 'furniture') {
      content += `<g stroke="#889372" stroke-width="1.2" fill="none">${rect(224, 129, 17, 66)}${rect(251, 127, 73, 18)}${rect(264, 172, 48, 23)}${rect(478, 145, 73, 46, 'rx="15"')}${rect(501, 356, 69, 58)}${rect(505, 359, 27, 17, 'rx="3"')}${rect(537, 359, 27, 17, 'rx="3"')}${rect(373, 348, 73, 13)}${rect(373, 348, 13, 60)}</g>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 570" role="img" aria-label="${escapeXML(sheet.name)}, illustrative sample drawing"><rect width="800" height="570" fill="#e8eadd"/><rect x="20" y="20" width="760" height="530" fill="none" stroke="#aeb49e" stroke-width=".7"/>${text(400, 46, 'A R C H C E L L   /   T H E   D R A W I N G   R O O M', 10)}${content}<g stroke="#9fa78e" stroke-width=".7">${line(20, 500, 780, 500)}${line(570, 500, 570, 550)}</g><text x="38" y="521" font-size="11" fill="#3f5036" font-family="Arial">${escapeXML(project.name.toUpperCase())} — ${escapeXML(sheet.name.toUpperCase())}</text><text x="38" y="539" font-size="9" fill="#727d62" font-family="Arial">DESIGN PREVIEW · ILLUSTRATIVE ONLY · NOT FOR CONSTRUCTION</text>${text(675, 522, sheet.code, 14, '#3f5036')}${text(675, 539, 'SAMPLE / NTS', 9)}</svg>`;
}
