import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

interface File {
  filename: string;
  content: string;
}

const dbPath = path.join(app.getPath('userData'), 'moko.db');
const db = new Database(dbPath);
console.log('sqlite3 initialized path', dbPath);

// 初始化表
db.exec(`
  CREATE TABLE IF NOT EXISTS files (
    filename TEXT PRIMARY KEY,
    content TEXT NOT NULL
  );
`);

export function getFileList(): string[] {
  const rows = db.prepare<string[], File>(`SELECT filename FROM files`).all();
  return rows.map(r => r.filename);
}

export function saveFileList(list: string[]): void {
  // 文件列表由所有文件名组成，实际存储在 files 表
  // 可忽略此函数，或用于同步删除不存在的文件
  const existFiles = getFileList();
  const toDelete = existFiles.filter(f => !list.includes(f));
  toDelete.forEach(f => {
    db.prepare('DELETE FROM files WHERE filename = ?').run(f);
  });
}

export function saveFileContent(filename: string, content: string): void {
  db.prepare(`
    INSERT INTO files (filename, content) VALUES (?, ?)
    ON CONFLICT(filename) DO UPDATE SET content=excluded.content
  `).run(filename, content);
}

export function getFileContent(filename: string): string {
  const row = db.prepare<string, File>('SELECT content FROM files WHERE filename = ?').get(filename);
  return row?.content || '';
}