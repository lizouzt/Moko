import ExcelIcon from 'assets/svg/files/excel.svg?component'
import ImageIcon from 'assets/svg/files/img.svg?component'
import PDFIcon from 'assets/svg/files/pdf.svg?component'
import PPTIcon from 'assets/svg/files/ppt.svg?component'
import UnknownIcon from 'assets/svg/files/unknown.svg?component'
import WordIcon from 'assets/svg/files/word.svg?component'
import ZipIcon from 'assets/svg/files/zip.svg?component'

export const FileTypeIcon: Record<string, typeof ImageIcon> = {
  xlsx: ExcelIcon,
  xls: ExcelIcon,
  png: ImageIcon,
  gif: ImageIcon,
  svg: ImageIcon,
  jpeg: ImageIcon,
  jpg: ImageIcon,
  pdf: PDFIcon,
  ppt: PPTIcon,
  doc: WordIcon,
  docx: WordIcon,
  docs: WordIcon,
  zip: ZipIcon,
  '7z': ZipIcon,
  tar: ZipIcon,
  unknown: UnknownIcon,
}

export const getFileIconFromName = (name: string) => {
  const fileTypeStr = name?.match(/\w+$/)?.[0] || 'unknown'
  return FileTypeIcon[fileTypeStr]
}
