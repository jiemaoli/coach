import ExcelJS from 'exceljs';

const wb = new ExcelJS.Workbook();
wb.creator = 'Nine Transition';
wb.created = new Date();

const ws = wb.addWorksheet('Trade Journal', {
  views: [{ state: 'frozen', xSplit: 3, ySplit: 1 }]
});

// Colors
const white = 'FFFFFFFF';
const lightGray = 'FFF8F9FA';
const border = 'FFDEE2E6';
const darkText = 'FF212529';
const mutedText = 'FF6C757D';
const greenText = 'FF198754';
const blueText = 'FF0D6EFD';
const headerBg = 'FFE8F5E9';

const thinBorder = { style: 'thin', color: { argb: border } };
const borders = { top: thinBorder, left: thinBorder, bottom: thinBorder, right: thinBorder };

// Hidden sheets for dropdowns
const dateSheet = wb.addWorksheet('_dates', { state: 'hidden' });
let dr = 1;
for (let d = new Date(2026, 7, 1); d <= new Date(2036, 11, 31); d.setDate(d.getDate() + 1)) {
  dateSheet.getCell(dr, 1).value = new Date(d);
  dateSheet.getCell(dr, 1).numFmt = 'yyyy-mm-dd';
  dr++;
}

const hourSheet = wb.addWorksheet('_hours', { state: 'hidden' });
for (let h = 0; h < 24; h++) {
  hourSheet.getCell(h + 1, 1).value = String(h).padStart(2, '0');
}

const minSheet = wb.addWorksheet('_mins', { state: 'hidden' });
for (let m = 0; m < 60; m++) {
  minSheet.getCell(m + 1, 1).value = String(m).padStart(2, '0');
}

// Columns
const cols = [
  { key: 'date', width: 12 },
  { key: 'hour', width: 5 },
  { key: 'min', width: 5 },
  { key: 'setup', width: 8 },
  { key: 'dir', width: 5 },
  { key: 'entry', width: 10 },
  { key: 'stop', width: 10 },
  { key: 'exit', width: 10 },
  { key: 'result', width: 8 },
  { key: 'points', width: 8 },
  { key: 'notes', width: 28 },
];
cols.forEach((c, i) => ws.getColumn(i + 1).width = c.width);

// Title
ws.mergeCells('A1:K1');
ws.getCell('A1').value = 'Nine Transition - Trade Journal';
ws.getCell('A1').font = { bold: true, color: { argb: greenText }, size: 14 };
ws.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
ws.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: headerBg } };
ws.getCell('A1').border = borders;
ws.getRow(1).height = 30;

// Headers
const headers = ['Date', 'HH', 'MM', 'Setup', 'Dir', 'Entry', 'Stop', 'Exit', 'Result', 'Pts', 'Notes'];
headers.forEach((h, i) => {
  const cell = ws.getCell(2, i + 1);
  cell.value = h;
  cell.font = { bold: true, color: { argb: darkText }, size: 10 };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: headerBg } };
  cell.border = borders;
  cell.alignment = { vertical: 'middle', horizontal: 'center' };
});
ws.getRow(2).height = 24;

// Data rows
const setups = ['A2', 'W1P', 'DP', 'fBO', '1PB', '1Rev', 'G2', 'BP', '1CBO'];
const directions = ['L', 'S'];
const results = ['W', 'L', 'BE'];

for (let i = 3; i <= 102; i++) {
  const isEven = (i - 3) % 2 === 0;
  const rowFill = isEven ? white : lightGray;

  for (let j = 1; j <= 11; j++) {
    const cell = ws.getCell(i, j);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowFill } };
    cell.border = borders;
    cell.font = { color: { argb: darkText }, size: 10 };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  }

  ws.getCell(i, 1).numFmt = 'yyyy-mm-dd';
  ws.getCell(i, 11).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
  ws.getRow(i).height = 20;

  // Dropdowns
  ws.getCell(i, 1).dataValidation = { type: 'list', allowBlank: true, formulae: [`=_dates!$A$1:$A$${dr - 1}`], showDropDown: false };
  ws.getCell(i, 2).dataValidation = { type: 'list', allowBlank: true, formulae: ['=_hours!$A$1:$A$24'], showDropDown: false };
  ws.getCell(i, 3).dataValidation = { type: 'list', allowBlank: true, formulae: ['=_mins!$A$1:$A$60'], showDropDown: false };
  ws.getCell(i, 4).dataValidation = { type: 'list', allowBlank: true, formulae: [`"${setups.join(',')}"`] };
  ws.getCell(i, 5).dataValidation = { type: 'list', allowBlank: true, formulae: [`"${directions.join(',')}"`] };
  ws.getCell(i, 9).dataValidation = { type: 'list', allowBlank: true, formulae: [`"${results.join(',')}"`] };
}

// ===== Summary (Right Side) =====
const sc = 13; // Column M

ws.mergeCells('M1:Q1');
ws.getCell('M1').value = 'Rule of Ten Tracker';
ws.getCell('M1').font = { bold: true, color: { argb: greenText }, size: 12 };
ws.getCell('M1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: headerBg } };
ws.getCell('M1').border = borders;
ws.getCell('M1').alignment = { horizontal: 'center', vertical: 'middle' };

ws.mergeCells('M2:Q2');
ws.getCell('M2').value = 'Performance';
ws.getCell('M2').font = { bold: true, color: { argb: darkText }, size: 10 };
ws.getCell('M2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F8E9' } };
ws.getCell('M2').border = borders;
ws.getCell('M2').alignment = { horizontal: 'center' };

const stats = [
  { label: 'Trades', formula: 'COUNTA(D3:D102)', fmt: '0' },
  { label: 'Win Rate', formula: 'IF(M4>0,COUNTIF(I3:I102,"W")/M4,0)', fmt: '0.0%' },
  { label: 'Total Pts', formula: 'SUM(J3:J102)', fmt: '0' },
  { label: 'Avg Win', formula: 'IF(COUNTIF(I3:I102,"W")>0,SUMIF(I3:I102,"W",J3:J102)/COUNTIF(I3:I102,"W"),0)', fmt: '0.0' },
  { label: 'Avg Loss', formula: 'IF(COUNTIF(I3:I102,"L")>0,ABS(SUMIF(I3:I102,"L",J3:J102))/COUNTIF(I3:I102,"L"),0)', fmt: '0.0' },
  { label: 'Profit Factor', formula: 'IF(M8>0,SUMIF(I3:I102,"W",J3:J102)/ABS(SUMIF(I3:I102,"L",J3:J102)),0)', fmt: '0.00' },
];

stats.forEach((s, i) => {
  const row = i + 3;
  ws.mergeCells(`M${row}:N${row}`);
  ws.getCell(`M${row}`).value = s.label;
  ws.getCell(`M${row}`).font = { bold: true, color: { argb: mutedText }, size: 9 };
  ws.getCell(`M${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: i % 2 === 0 ? white : lightGray } };
  ws.getCell(`M${row}`).border = borders;
  ws.getCell(`M${row}`).alignment = { horizontal: 'right', vertical: 'middle' };

  ws.mergeCells(`O${row}:Q${row}`);
  ws.getCell(`O${row}`).value = { formula: s.formula };
  ws.getCell(`O${row}`).numFmt = s.fmt;
  ws.getCell(`O${row}`).font = { bold: true, color: { argb: darkText }, size: 11 };
  ws.getCell(`O${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: i % 2 === 0 ? white : lightGray } };
  ws.getCell(`O${row}`).border = borders;
  ws.getCell(`O${row}`).alignment = { horizontal: 'center', vertical: 'middle' };
});

// Rule of Ten Goals
const gr = 10;
ws.mergeCells(`M${gr}:Q${gr}`);
ws.getCell(`M${gr}`).value = 'Rule of Ten';
ws.getCell(`M${gr}`).font = { bold: true, color: { argb: darkText }, size: 10 };
ws.getCell(`M${gr}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F8E9' } };
ws.getCell(`M${gr}`).border = borders;
ws.getCell(`M${gr}`).alignment = { horizontal: 'center' };

const goals = [
  { label: '10 pts/week', formula: 'IF(O5>=10,"Pass","Fail")' },
  { label: 'Win Rate > 60%', formula: 'IF(O4>=0.6,"Pass","Fail")' },
  { label: 'Profit Factor > 1.5', formula: 'IF(O8>=1.5,"Pass","Fail")' },
];

goals.forEach((g, i) => {
  const row = gr + 1 + i;
  ws.mergeCells(`M${row}:O${row}`);
  ws.getCell(`M${row}`).value = g.label;
  ws.getCell(`M${row}`).font = { color: { argb: mutedText }, size: 9 };
  ws.getCell(`M${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: i % 2 === 0 ? white : lightGray } };
  ws.getCell(`M${row}`).border = borders;
  ws.getCell(`M${row}`).alignment = { horizontal: 'right', vertical: 'middle' };

  ws.mergeCells(`P${row}:Q${row}`);
  ws.getCell(`P${row}`).value = { formula: g.formula };
  ws.getCell(`P${row}`).font = { bold: true, size: 10 };
  ws.getCell(`P${row}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: i % 2 === 0 ? white : lightGray } };
  ws.getCell(`P${row}`).border = borders;
  ws.getCell(`P${row}`).alignment = { horizontal: 'center', vertical: 'middle' };
});

// By Setup
const sr = 15;
ws.mergeCells(`M${sr}:Q${sr}`);
ws.getCell(`M${sr}`).value = 'By Setup';
ws.getCell(`M${sr}`).font = { bold: true, color: { argb: darkText }, size: 10 };
ws.getCell(`M${sr}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F8E9' } };
ws.getCell(`M${sr}`).border = borders;
ws.getCell(`M${sr}`).alignment = { horizontal: 'center' };

['Setup', 'N', 'W', 'WR', 'Pts'].forEach((h, i) => {
  const cell = ws.getCell(sr + 1, sc + i);
  cell.value = h;
  cell.font = { bold: true, color: { argb: darkText }, size: 9 };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: headerBg } };
  cell.border = borders;
  cell.alignment = { horizontal: 'center' };
});

['A2', 'W1P', 'DP', 'fBO'].forEach((setup, i) => {
  const row = sr + 2 + i;
  const rowFill = i % 2 === 0 ? white : lightGray;

  ws.getCell(row, sc).value = setup;
  ws.getCell(row, sc).font = { bold: true, color: { argb: blueText }, size: 10 };
  ws.getCell(row, sc + 1).value = { formula: `COUNTIF(D3:D102,"${setup}")` };
  ws.getCell(row, sc + 2).value = { formula: `COUNTIFS(D3:D102,"${setup}",I3:I102,"W")` };
  ws.getCell(row, sc + 3).value = { formula: `IF(${String.fromCharCode(78)}${row}>0,${String.fromCharCode(79)}${row}/${String.fromCharCode(78)}${row},0)` };
  ws.getCell(row, sc + 3).numFmt = '0%';
  ws.getCell(row, sc + 4).value = { formula: `SUMIF(D3:D102,"${setup}",J3:J102)` };

  for (let j = 0; j < 5; j++) {
    ws.getCell(row, sc + j).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowFill } };
    ws.getCell(row, sc + j).border = borders;
    ws.getCell(row, sc + j).alignment = { horizontal: 'center' };
  }
});

// Column widths for summary
ws.getColumn(12).width = 2;  // Spacer
ws.getColumn(13).width = 8;
ws.getColumn(14).width = 6;
ws.getColumn(15).width = 6;
ws.getColumn(16).width = 6;
ws.getColumn(17).width = 6;

await wb.xlsx.writeFile('trade-journal-v2.xlsx');
console.log('Generated: trade-journal-v2.xlsx');
