import type { HtmlRendererOptions } from 'shiki'

export const handleClasses = (classname: string | string[] | undefined) => {
  if (!classname)
    return ''
  if (typeof classname === 'string')
    return classname
  else return classname.join(' ')
}

// inspired by vitepress source code
export const attrsToLines = (attrs: string, classname?: string | string[]): HtmlRendererOptions['lineOptions'] => {
  if (!attrs.trim())
    return []
  const result: number[] = []

  attrs
    .split(',')
    .map(v => v.split('-').map(v => parseInt(v, 10)))
    .forEach(([start, end]) => {
      if (start && end) {
        result.push(
          ...Array.from({ length: end - start + 1 }, (_, i) => start + i),
        )
      }
      else {
        result.push(start)
      }
    })

  const classes: string[] = []
  if (!classname)
    classes.push('highlighted')
  else if (typeof classname === 'string')
    classes.push(classname)
  else
    classes.push(...classname)

  // Sort in ascending order, so that the following `mergeLineOptions` function uses the binary search algo
  result.sort((a, b) => a - b)
  return result.map(v => ({
    line: v,
    classes,
  }))
}

export const mergeLineOptions = (
  source: HtmlRendererOptions['lineOptions'],
  target: HtmlRendererOptions['lineOptions'],
): HtmlRendererOptions['lineOptions'] => {
  target!.forEach(({ line, classes = [] }) => {
    let lo = 0; let hi = source!.length - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      const {
        line: _line,
        classes: _classes = [],
      } = source![mid]
      if (line === _line) {
        source![mid].classes = [..._classes, ...classes]
        return
      }
      else if (line < _line) {
        hi = mid
      }
      else {
        lo = mid + 1
      }
    }
    source!.splice(lo, 0, { line, classes })
  })
  return source
}

export const arrayize = (value: string | string[]) => {
  if (typeof value === 'string')
    return [value]
  return value
}
