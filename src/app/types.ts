export type FileName = string;

export type FileList = FileName[];

export type ThemeType = 'light' | 'dark';

export interface ExportPdfOptions {
  previewHtmlElement: HTMLDivElement;
  theme: ThemeType;
  fileName?: string;
}

export type SplitMode = 'vertical' | 'horizontal' | 'edit' | 'preview';

export interface MarkDownFile {
  name: FileName;
  content: string;
}

export interface MarkDownState {
  content: string;
  fileList: FileList;
  currentFile: FileName;
  splitMode: SplitMode;
  historyDrawerVisible: boolean;
}

export interface EditFileTitleProps {
  name: string;
}