import type { Highlighter, ILanguageRegistration, IThemeRegistration } from 'shiki'

export interface DarkModeTheme {
  /**
   * The theme to use on dark mode
   */
  dark: IThemeRegistration

  /**
   * The theme to use on light mode
   */
  light: IThemeRegistration
}

export interface DarkModeClassName {
  /**
   * CSS class(es) that will be used on dark mode
   */
  dark: string | string[]

  /**
   * CSS class(es) that will be used on light mode
   */
  light: string | string[]
}

export interface ShikiExtraOptions {
  /**
   * Shiki languages presets for highlighter.
   * More details on [shiki-docs](https://github.com/shikijs/shiki/blob/main/docs/languages.md)
   */
  langs?: ILanguageRegistration[]

  /**
   * Shiki themes presets for highlighter, supports dark mode
   * More details on [shiki-docs](https://github.com/shikijs/shiki/blob/main/docs/themes.md)
   * @default 'nord'
   */
  theme?: IThemeRegistration | DarkModeTheme

  /**
   * Custom highlighter.
   * By default, the return value of shiki's `getHighlighter()` will be used.
   */
  highlighter?: Highlighter

  /**
   * Will be used as the CSS class names for shiki-generated \<pre\> blocks that representing code blocks
   * @default 'shiki'
   */
  classname?: string | string[]

  /**
   * Similar to `classname` option, supports dark mode.
   * Only works if theme's type is `DarkModeTheme`
   * @default
   * { dark: 'shiki-dark', light: 'shiki-light' }
   */
  darkModeClassName?: DarkModeClassName

  /**
   * Will be used as the CSS class name for highlighted shiki-generated \<span\> blocks
   * that representing each line of code blocks
   * @default 'highlighted'
   */
  highlightedClassname?: string | string[]

  /**
   * Similar to `highlightedClassName` option, supports dark mode
   * Only works if theme's type is `DarkModeTheme`
   * @default
   * { dark: 'highlighted-dark', light: 'highlighted-light' }
   */
  darkModeHighlightedClassName?: DarkModeClassName

  /**
   * CSS class(es) that will be added to diff lines, support dark mode
   * @default
   * { minus: 'diff remove', plus: 'diff add' }
   */
  diffLinesClassName?: {
    minus?: string | string[]
    plus?: string | string[]
  }

  /**
   * Similar to `diffLinesClassName` option, supports dark mode
   * Only works if theme's type is `DarkModeTheme`
   * @default
   * {
   *   minus: { dark: 'diff-dark remove', light: 'diff-light remove' }
   *   plus: { dark: 'diff-dark add', light: 'diff-light, add' }
   * }
   */
  darkModeDiffLinesClassName?: {
    minus: DarkModeClassName
    plus: DarkModeClassName
  }
}
