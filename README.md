<h1 align="center">markdown-it-shiki-extra</h1>

<p align="center">
<a href="https://markdown-it.github.io/">Markdown It</a> plugin for <a href="https://github.com/shikijs/shiki">Shiki</a> with extra options.
</p>

<p align="center">
<a href="https://www.npmjs.com/package/markdown-it-shiki-extra"><img src="https://img.shields.io/npm/v/markdown-it-shiki-extra?color=c95f8b&amp;label=" alt="NPM version"></a></p>

## Features

Via Integrating shiki with the markdown-it plugin system, it can do
+ Syntax Highlighting in Code Blocks
+ Line Highlighting in Code Blocks
+ Colored diffs in Code Blocks

## Install

```sh
npm i -D markdown-it-shiki-extra
```

## Usage

See these simple examples below

### Syntax Highlight

```typescript
import MarkdownIt from 'markdown-it'
import Shiki from 'markdown-it-shiki-extra'

const md = new MarkdownIt()

md.use(Shiki, {
  theme: 'one-dark-pro'
})
```

#### With Dark Mode

```typescript
md.use(Shiki, {
  theme: {
    dark: 'github-dark',
    light: 'github-light'
  }
})
```

And also, remember to write some CSS codes to make it work

```css
/* Query based dark mode */

@media (prefers-color-scheme: dark) {
  .shiki-light {
    display: none;
  }
}

@media (prefers-color-scheme: light), (prefers-color-scheme: no-preference) {
  .shiki-dark {
    display: none;
  }
}

```

or

```css
/* Class based dark mode */

html.dark .shiki-light {
  display: none;
}

html:not(.dark) .shiki-dark {
  display: none;
}
```

In addition, providing custom CSS classnames is also accpetable

```typescript
md.use(Shiki, {
  theme: {
    dark: 'github-dark',
    light: 'github-light'
  },
  darkModeClassName: {
    dark: 'my-dark',
    light: 'my-light'
  }
})
```

Then replace `.shiki-dark`, `.shiki-light` with `.my-dark`, `.my-light` in your CSS code

### Line Highlighting

Same rules as [vitepress](https://vitepress.vuejs.org/guide/markdown#line-highlighting-in-code-blocks)

**Input**

````
```typescript {1, 4-5}
const msg = 'Hello, World!'

const greet = (msg: string) => {
  console.log(msg)
}

greet(msg)
```
````

**Output**

The processed HTML string contains something looks like

```html
<code v-pre="">
<span class="line highlighted"><span style="color: rgb(255, 123, 114);">const</span><span style="color: rgb(201, 209, 217);"> </span><span style="color: rgb(121, 192, 255);">msg</span><span style="color: rgb(201, 209, 217);"> </span><span style="color: rgb(255, 123, 114);">=</span><span style="color: rgb(201, 209, 217);"> </span><span style="color: rgb(165, 214, 255);">'Hello, World!'</span></span>
<span class="line"></span>
<span class="line"><span style="color: rgb(255, 123, 114);">const</span><span style="color: rgb(201, 209, 217);"> </span><span style="color: rgb(210, 168, 255);">greet</span><span style="color: rgb(201, 209, 217);"> </span><span style="color: rgb(255, 123, 114);">=</span><span style="color: rgb(201, 209, 217);"> (</span><span style="color: rgb(255, 166, 87);">msg</span><span style="color: rgb(255, 123, 114);">:</span><span style="color: rgb(201, 209, 217);"> </span><span style="color: rgb(121, 192, 255);">string</span><span style="color: rgb(201, 209, 217);">) </span><span style="color: rgb(255, 123, 114);">=&gt;</span><span style="color: rgb(201, 209, 217);"> {</span></span>
<span class="line highlighted"><span style="color: rgb(201, 209, 217);">  console.</span><span style="color: rgb(210, 168, 255);">log</span><span style="color: rgb(201, 209, 217);">(msg)</span></span>
<span class="line highlighted"><span style="color: rgb(201, 209, 217);">}</span></span>
<span class="line"></span>
<span class="line"><span style="color: rgb(210, 168, 255);">greet</span><span style="color: rgb(201, 209, 217);">(msg)</span></span>
<span class="line"></span>
</code>
```

And then you can write some CSS codes to implement its highlighted visual effects, for example

```css
span .line .highlighted {
  margin: 0 -24px;
  padding: 0 24px;
  width: calc(100% + 48px);
  display: inline-block;
}
```

#### With Dark Mode

if `theme` option supports dark mode
```typescript
md.use(Shiki, {
  theme: {
    dark: 'github-dark',
    light: 'github-light'
  },
})
```

In dark mode, the HTML structure will be like

```html
<span class="line">foo</span>
<span class="line highlighted-dark">foo</span>
<span class="line highlighted-dark">foo</span>
<span class="line">foo</span>
```

In light mode, CSS class will be `highlighted-light` instead

With custom CSS class

```typescript
md.use(Shiki, {
  theme: {
    dark: 'github-dark',
    light: 'github-light'
  },
 darkModeHighlightedClassName: {
    dark: 'my-dark',
    light: 'my-light'
  }
})
```

### Colored diffs

Same rules as [vitepress](https://vitepress.vuejs.org/guide/markdown#colored-diffs-in-code-blocks)

**Input**

````
```typescript
const msg = 'Hello, World!'

const greet = (msg: string) => {
  console.log(`greet: ${msg}`) // [!code ++]
  console.log(msg) // [!code --]
}

greet(msg)
```
````

**Output**

The processed HTML string contains something looks like

```html
<code v-pre="">
<span class="line">xxx</span>
<span class="line diff add">xxx</span>
<span class="line diff remove">xxx</span>
<span class="line">xxx</span>
</code>
```

Do not remember to write some CSS codes to make it looks great

#### With Dark Mode

with custom CSS class

```typescript
md.use(Shiki, {
  theme: {
    dark: 'github-dark',
    light: 'github-light'
  },
  darkModeDiffLinesClassName: {
    minus: {
      dark: 'diff-dark minus',
      light: 'diff-light minus'
    },
    plus: {
      dark: 'diff-dark plus',
      light: 'diff-light plus'
    }
  }
})
```

View [source code](https://github.com/GODLiangCY/markdown-it-shiki-extra/tree/main/src) to explore more details

## Credits

+ Greatly inspired by [markdown-it-shiki](https://github.com/antfu/markdown-it-shiki), also inherited from it
+ Design of features comes from [Vitepress](https://vitepress.vuejs.org/)

## License

[MIT](./LICENSE)
