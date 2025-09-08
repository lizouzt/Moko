import React from 'react'
import html2canvas from "html2canvas"
import i18next from 'i18n/config'
import jsPDF from "jspdf"
import { ThemeType, FileList, FileName, ExportPdfOptions } from './types'
import { HLJS_LIGHT, HLJS_DARK } from './config'

export async function getFileList(): Promise<FileList> {
  return await window.electron.ipcRenderer.invoke('getFileList');
}

export async function saveFileList(list: FileList): Promise<void> {
  await window.electron.ipcRenderer.invoke('saveFileList', list);
}

export async function saveFileContent(filename: FileName, content: string): Promise<void> {
  await window.electron.ipcRenderer.invoke('saveFileContent', filename, content);
}

export async function getFileContent(filename: FileName): Promise<string> {
  return await window.electron.ipcRenderer.invoke('getFileContent', filename);
}

export async function renameFile(oldName: FileName, newName: FileName): Promise<void> {
  await window.electron.ipcRenderer.invoke('renameFile', oldName, newName);
}

export async function deleteFile(filename: FileName): Promise<void> {
  await window.electron.ipcRenderer.invoke('deleteFile', filename);
}

export const loadHighlightStyle = (theme: string) => {
  // 先移除旧的
  const old = document.getElementById('hljs-theme')
  if (old) old.remove()
  // 新建link
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.id = 'hljs-theme'
  link.type = 'text/css'
  link.href = theme === 'dark' ? HLJS_DARK : HLJS_LIGHT
  document.head.appendChild(link)
}

export const exportPdf = async (
  previewHtmlElement: HTMLDivElement,
  theme: ThemeType,
  fileName?: string
): Promise<string> => {
  const scale = 2;
  const LandScape = 5;
  const bgColor = theme === 'light' ? '#fff' : '#181818';

  const cloneCanvas = document.createElement('canvas');
  cloneCanvas.width = previewHtmlElement.scrollWidth * scale;
  cloneCanvas.height = previewHtmlElement.scrollHeight * scale;

  const canvas = await html2canvas(previewHtmlElement, {
    backgroundColor: bgColor,
    x: 0,
    y: 0,
    scale,
    scrollY: 0,
    canvas: cloneCanvas,
    removeContainer: true,
    useCORS: true,
    logging: true,
    windowHeight: previewHtmlElement.scrollHeight * scale,
  });

  const pdf = new jsPDF('p', 'mm');
  const A4PageWidth = pdf.internal.pageSize.getWidth();
  const A4PageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = A4PageWidth;

  // 每页内容高度（去除上下空白）
  const contentHeightPerPage = A4PageHeight - LandScape * 2;
  // 图片在canvas中的像素高度对应每页内容
  const pxPerPage = (contentHeightPerPage * canvas.width) / A4PageWidth;

  let renderedHeight = 0;
  let pageNum = 0;

  while (renderedHeight < canvas.height) {
    // 新页顶部和底部空白
    pdf.setFillColor(bgColor);
    pdf.rect(0, 0, imgWidth, A4PageHeight, 'F');

    // 计算本页实际内容高度
    const remainPx = canvas.height - renderedHeight;
    const pagePx = Math.min(pxPerPage, remainPx);
    const pageImgHeight = (pagePx * A4PageWidth) / canvas.width;

    // 截取本页内容
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = pagePx;
    const ctx = pageCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(
        canvas,
        0, renderedHeight, canvas.width, pagePx, // 源
        0, 0, canvas.width, pagePx // 目标
      );
    }
    const pageImgData = pageCanvas.toDataURL('image/jpeg', 1.0);

    // 内容图片插入到空白下方
    pdf.addImage(pageImgData, 'JPEG', 0, LandScape, imgWidth, pageImgHeight);

    renderedHeight += pagePx;
    pageNum++;
    if (renderedHeight < canvas.height) {
      pdf.addPage();
    }
  }

  try {
    await pdf.save(`${fileName || 'markdown'}.pdf`, { returnPromise: true });
    return i18next.t('成功导出');
  } catch (err: any) {
    return err.message;
  }
};