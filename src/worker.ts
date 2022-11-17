import type { Highlighter, HtmlRendererOptions, ILanguageRegistration, IThemeRegistration, Lang } from 'shiki'
import { getHighlighter as _get } from 'shiki'
import { runAsWorker } from 'synckit'

let highlighter: Highlighter

function handler(command: 'getHighlighter', options: {
  themes?: IThemeRegistration[]
  theme?: IThemeRegistration
  langs?: (ILanguageRegistration | Lang)[]
}): void

function handler(command: 'codeToHtml', options: {
  code: string
  lang: string
  lineOptions?: HtmlRendererOptions['lineOptions']
  theme?: IThemeRegistration
}): Promise<string>

async function handler(command: 'getHighlighter' | 'codeToHtml', options: any) {
  if (command === 'getHighlighter') { highlighter = await _get(options) }
  else {
    const { code, lang, lineOptions, theme } = options

    const loadedLangs = highlighter.getLoadedLanguages()
    if (!loadedLangs.includes(lang))
      await highlighter.loadLanguage(lang)

    const loadedThemes = highlighter.getLoadedThemes()
    if (!loadedThemes.includes(theme))
      await highlighter.loadTheme(theme)

    return highlighter.codeToHtml(code, {
      lang,
      lineOptions: lineOptions ?? [],
      theme,
    })
  }
}

// TODO: Can we get this interface by manipulating `typeof handler`?
// To use it in `index.ts`, we do not want return type to be a Promise
export interface SyncRunFn {
  (command: 'getHighlighter', options: {
    themes?: IThemeRegistration[]
    theme?: IThemeRegistration
    langs?: (ILanguageRegistration | Lang)[]
  }): void
  (command: 'codeToHtml', options: {
    code: string
    lang: string
    lineOptions?: HtmlRendererOptions['lineOptions']
    theme?: IThemeRegistration
  }): string
}

runAsWorker(handler)
