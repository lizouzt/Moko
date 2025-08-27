import React, { useEffect, useRef } from 'react'
import mermaid from 'mermaid'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import { useAppSelector } from 'modules/store'
import CommonStyle from 'styles/common.module.less'
import classNames from 'classnames'
import MarkdownItDiagrams from 'markdown-it-diagram'
import MarkdownToc from './MarkdownToc'
import { markdownItConfig } from './config'
import { loadHighlightStyle } from './utils'
import style from './index.module.less'

interface Props {
  value: string
}

const MarkdownPreview = React.forwardRef<HTMLDivElement, Props>(({ value }: Props, ref) => {
  const { theme } = useAppSelector((state) => state.global)
  const md = useRef<MarkdownIt>()
  const previewRef = useRef<HTMLDivElement>(null)
  const contentRef = ref as React.MutableRefObject<HTMLDivElement | null>

  useEffect(() => {
    md.current = new MarkdownIt({
      ...markdownItConfig,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
          } catch (__) {}
        }
        return `<pre class="hljs"><code>${md.current?.utils.escapeHtml(str) || str}</code></pre>`
      }
    })
    md.current.renderer.rules.link_open = (tokens, idx, options, env, self) => {
      const aIndex = tokens[idx].attrIndex('target')
      if (aIndex < 0) {
        tokens[idx].attrPush(['target', '_blank'])
      }
      return self.renderToken(tokens, idx, options)
    }

    md.current.use(MarkdownItDiagrams, {
      showController: false,
      ditaa: 'txt',
      dot: 'svg',
      plantuml: 'txt',
    })

    mermaid.initialize({ startOnLoad: false })
  }, [])

  useEffect(() => {
    mermaid.run().catch((error) => {
      console.log('mermaid error', error)
    })
  }, [value])

  useEffect(() => {
    if (!previewRef.current) return

    if (md.current && contentRef && contentRef.current) {
      contentRef.current.innerHTML = md.current.render(value) || ''
    }

    const headings = previewRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6')
    headings.forEach((el, idx) => {
      if (!el.id) {
        el.id = `md-heading-${idx}`
      }
    })
  }, [value])

  useEffect(() => {
    loadHighlightStyle(theme)
  }, [theme])

  return (
    <div className={classNames(CommonStyle.scrollbar, style.markdownPreview)} ref={previewRef}>
      <MarkdownToc previewRef={previewRef} content={value} />
      <div ref={contentRef} />
    </div>
  )
})

export default MarkdownPreview