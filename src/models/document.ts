export interface Document {
  id: string;
  content: string;
  filename: string;
  sourceType: 'pdf' | 'txt';
}
