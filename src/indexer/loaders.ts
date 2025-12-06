import { readFile } from 'fs/promises';
import { basename, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Document } from '../models/document.js';

export async function loadTxt(filepath: string): Promise<Document> {
  const content = await readFile(filepath, 'utf-8');
  return {
    id: uuidv4(),
    content,
    filename: basename(filepath),
    sourceType: 'txt',
  };
}

export async function loadPdf(filepath: string): Promise<Document> {
  const pdfParse = (await import('pdf-parse')).default;
  const buffer = await readFile(filepath);
  const data = await pdfParse(buffer);
  return {
    id: uuidv4(),
    content: data.text,
    filename: basename(filepath),
    sourceType: 'pdf',
  };
}

export async function loadDocument(filepath: string): Promise<Document> {
  const ext = extname(filepath).toLowerCase();
  switch (ext) {
    case '.txt':
      return loadTxt(filepath);
    case '.pdf':
      return loadPdf(filepath);
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}
