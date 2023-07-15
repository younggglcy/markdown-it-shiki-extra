import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type MarkdownIt from 'markdown-it'
import { createSyncFn } from 'synckit'
import type { HtmlRendererOptions, IThemeRegistration } from 'shiki'
import type { DarkModeTheme, ShikiExtraOptions } from './types'
import type { SyncRunFn } from './worker'
import { arrayize, attrsToLines, handleClasses, mergeLineOptions } from './utils'

interface HightlightCodeOptions {
  theme?: IThemeRegistration
  lineOptions?: HtmlRendererOptions['lineOptions']
}

type HighlightCodeFn = (code: string, lang: string, options?: HightlightCodeOptions) => string

const MarkdownItShikiExtra: MarkdownIt.PluginWithOptions<ShikiExtraOptions> = (md, options) => {
  const {
    langs,
    theme = 'nord',
    classname = 'shiki',
    darkModeClassName = {
      dark: 'shiki-dark',
      light: 'shiki-light',
    },
    highlightedClassname = 'highlighted',
    darkModeHighlightedClassName = {
      dark: 'highlighted-dark',
      light: 'highlighted-light',
    },
    diffLinesClassName = {
      minus: 'diff remove',
      plus: 'diff add',
    },
    darkModeDiffLinesClassName = {
      minus: {
        dark: 'diff-dark remove',
        light: 'diff-light remove',
      },
      plus: {
        dark: 'diff-dark add',
        light: 'diff-light add',
      },
    },
    highlighter,
  } = options ?? {}

  let darkMode: DarkModeTheme
  let syncRun: SyncRunFn

  if (!highlighter) {
    const themes: IThemeRegistration[] = []
    if (typeof theme === 'string') {
      themes.push(theme)
    }
    else if ('dark' in theme || 'light' in theme) {
      // @ts-ignore build error
      darkMode = theme
      for (const key in theme)
        // @ts-ignore build error
        themes.push(theme[key] as unknown as IThemeRegistration)
    }
    const __dirname = dirname(fileURLToPath(import.meta.url))
    syncRun = createSyncFn(join(__dirname, './worker'), { tsRunner: 'ts-node' })
    syncRun('getHighlighter', { langs, themes })
  }

  const highlightCode: HighlightCodeFn = (code, lang, options) => {
    const { lineOptions, theme } = options ?? {}
    if (highlighter)
      // @ts-expect-error no overload
      return highlighter.codeToHtml(code, { lang, theme, lineOptions })

    return syncRun('codeToHtml', {
      code,
      theme,
      lang,
      lineOptions,
    })
  }

  // highlight logic
  md.options.highlight = (code, lang = 'text', attrs) => {
    let lineOptions: HtmlRendererOptions['lineOptions'] = []
    let darkLineOptions: HtmlRendererOptions['lineOptions'] = []
    let lightLineOptions: HtmlRendererOptions['lineOptions'] = []

    const highlightLinesRE = /{(.+)}/
    if (attrs.match(highlightLinesRE)) {
      const matchedAttrs = highlightLinesRE.exec(attrs)![1]
      if (darkMode) {
        darkLineOptions = attrsToLines(matchedAttrs, darkModeHighlightedClassName?.dark)
        lightLineOptions = attrsToLines(matchedAttrs, darkModeHighlightedClassName?.light)
      }
      else { lineOptions = attrsToLines(matchedAttrs, highlightedClassname) }
    }

    const diffLineOptions: HtmlRendererOptions['lineOptions'] = []
    const darkDiffLineOptions: HtmlRendererOptions['lineOptions'] = []
    const lightDiffLineOptions: HtmlRendererOptions['lineOptions'] = []
    const minusLinesRE = /\/{2} \[\!code {2}-{2}\]/gm
    const plusLinesRE = /\/{2} \[\!code {2}\+{2}]/gm
    if (code.match(minusLinesRE)) {
      const codeArr = code.split('\n')
      codeArr.forEach((line, index) => {
        if (line.match(minusLinesRE)) {
          const name = diffLinesClassName.minus!
          if (darkMode) {
            const darkname = darkModeDiffLinesClassName?.minus.dark
            const lightname = darkModeDiffLinesClassName?.minus.light
            darkDiffLineOptions.push({
              line: index + 1,
              classes: arrayize(darkname),
            })
            lightDiffLineOptions.push({
              line: index + 1,
              classes: arrayize(lightname),
            })
          }
          else {
            diffLineOptions.push({
              line: index + 1,
              classes: arrayize(name),
            })
          }
        }
      })
      code = code.replace(minusLinesRE, '')
    }
    else if (code.match(plusLinesRE)) {
      const codeArr = code.split('\n')
      codeArr.forEach((line, index) => {
        if (line.match(plusLinesRE)) {
          const name = diffLinesClassName.plus!
          if (darkMode) {
            const darkname = darkModeDiffLinesClassName?.plus.dark
            const lightname = darkModeDiffLinesClassName?.plus.light
            darkDiffLineOptions.push({
              line: index + 1,
              classes: !darkname ? arrayize(name) : arrayize(darkname),
            })
            lightDiffLineOptions.push({
              line: index + 1,
              classes: !lightname ? arrayize(name) : arrayize(lightname),
            })
          }
          else {
            diffLineOptions.push({
              line: index + 1,
              classes: arrayize(name),
            })
          }
        }
      })
      code = code.replace(plusLinesRE, '')
    }

    lineOptions = mergeLineOptions(lineOptions, diffLineOptions)
    darkLineOptions = mergeLineOptions(darkLineOptions, darkDiffLineOptions)
    lightLineOptions = mergeLineOptions(lightLineOptions, lightDiffLineOptions)

    if (darkMode) {
      const dark = highlightCode(code, lang, { theme: darkMode.dark, lineOptions: darkLineOptions })
        .replace('<pre class="shiki', `<pre class="${handleClasses(classname)} ${handleClasses(darkModeClassName.dark)}`)

      const light = highlightCode(code, lang, { theme: darkMode.light, lineOptions: lightLineOptions })
        .replace('<pre class="shiki', `<pre class="${handleClasses(classname)} ${handleClasses(darkModeClassName.light)}`)
      return `<div class="shiki-container language-${lang}">${dark}${light}</div>`
    }
    else {
      let highlighted = highlightCode(code, lang, { lineOptions })
        .replace('<code>', `<code class="language-${lang}">`)
      if (classname !== 'shiki')
        highlighted = highlighted.replace('<pre class="shiki', `<pre class="${handleClasses(classname)}`)
      return highlighted
    }
  }
}

export default MarkdownItShikiExtra

export { ShikiExtraOptions } from './types'
