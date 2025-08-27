export const AUTO_SAVE_INTERVAL = 60000

export const FILE_LIST_KEY = 'markdown-file-list'
// export const HLJS_LIGHT = 'highlight.js/styles/github.css'
export const HLJS_LIGHT = new URL('highlight.js/styles/github.css', import.meta.url).href
export const HLJS_DARK = new URL('highlight.js/styles/github-dark.css', import.meta.url).href

export const markdownItConfig = {
  // Enable HTML tags in source
  html:         true,

  // Use '/' to close single tags (<br />).
  // This is only for full CommonMark compatibility.
  xhtmlOut:     false,

  // Convert '\n' in paragraphs into <br>
  breaks:       false,

  // CSS language prefix for fenced blocks. Can be
  // useful for external highlighters.
  langPrefix:   'language-',

  // Autoconvert URL-like text to links
  linkify:      true,

  // Enable some language-neutral replacement + quotes beautification
  // For the full list of replacements, see https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.mjs
  typographer:  true,

  // Double + single quotes replacement pairs, when typographer enabled,
  // and smartquotes on. Could be either a String or an Array.
  //
  // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
  // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
  quotes: '“”‘’',
}

export const UNTITLED_PREFIX = '未命名'

// 获取内容第一行前10个字作为文件名
export const getAutoFileName = (text: string, fileList: string[]) => {
  const firstLine = text.split('\n')[0].trim()
  // 过滤特殊字符: / \ : * ? " < > | 及不可见字符
  const safe = firstLine.replace(/[\/\\:\*\?"<>\|\r\n\t]/g, '')
  let baseName = safe.slice(0, 10) || UNTITLED_PREFIX
  let name = baseName
  let idx = 1
  while (fileList.includes(name)) {
    name = `${baseName}-${idx}`
    idx += 1
  }
  return name
}

// 生成唯一未命名文件名
export const getUniqueUntitledName = (fileList) => {
  let idx = 1
  let name = `${UNTITLED_PREFIX}-${idx}`
  while (fileList.includes(name)) {
    idx += 1
    name = `${UNTITLED_PREFIX}-${idx}`
  }
  return name
}