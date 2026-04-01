import * as XLSX from 'xlsx';

// export function readExcel(filePath: string) {

//   const workbook = XLSX.readFile(filePath);

//   const sheetName = workbook.SheetNames[0];

//   const sheet = workbook.Sheets[sheetName];

//   const data = XLSX.utils.sheet_to_json(sheet);

//   return data;


export function readExcel(filePath: string, sheetName?: string) {
  const workbook = XLSX.readFile(filePath);

  const targetSheetName = sheetName || workbook.SheetNames[0];
  const sheet = workbook.Sheets[targetSheetName];

  if (!sheet) {
    throw new Error(`❌ Không tìm thấy sheet: ${targetSheetName}`);
  }

  const data = XLSX.utils.sheet_to_json(sheet);

  return data;




}