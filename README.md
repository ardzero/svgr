[![Bunestro](https://svgr.ardastroid.com/ogImage.webp)](https://svgr.ardastroid.com/)

# Svgr

An open source SVG directory with fuzzy search build with Astro and react. [Live deployment](https://svgr.ardastroid.com/)
Repo: [Github Repo](https://github.com/ardzero/svgr)

> [!NOTE]
> A large portion of this is based on [Svgl](https://github.com/pheralb/svgl). I wanted a version built on React and Astro cause Astro's built times are blazingly fast. Also I wanted some different features and a slightly different UI.

> [!IMPORTANT]
> None of the SVGs on svgr are owned/licensed by svgr. svgr is just a free and open-source registry of SVGs. If you're the owner of any SVG/hold the rights to an SVG and want it to be removed from the list please open a GitHub issue or email me at [svgr@ardastroid.com](mailto:svgr@ardastroid.com)

## 🛠️ Stack
- [**Astro 5.2**](https://astro.build/) - A web framework with fast build time.
- [**Typescript**](https://www.typescriptlang.org/) - Super set of JavaScript with types.
- [**Tailwindcss**](https://tailwindcss.com/) - Utility-first CSS framework.
- [**radix-ui**](https://www.radix-ui.com/) - A collection of headless components for react.
- [**shadcn**](https://ui.shadcn.com/) - A collection of styled components built on top of radix-ui and tailwind.
- [**tailwind-motion**](https://rombo.co/tailwind/) - A tailwind plugin for easy to use css only animations
- [**Prettier**](https://prettier.io/) - An opinionated code formatted.
- [**prettier-plugin-tailwindcss**](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) - A plugin to auto-sort tailwind classes
- [**Lucide Icons**](https://lucide.dev/) - A clean icon library.
- [**astrojs/react**](https://docs.astro.build/en/guides/integrations-guide/react/) - An astro integration enabling rendering and client-side hydration with React 

## Roadmap

- [x] Make a copyable SVG list
- [x] Fuzzy Search
- [x] logo themes
- [x] Wordmark structuer
- [x] Categories
- [ ] Adding logo docs
- [ ] Logo submission docs
- [ ] Svg to png converter
- [ ] Figma Plugin
- [ ] Download svg options
- [ ] Svg to React converter
- [ ] Copy with keyboard shortcut
- [ ] other framework export
- [ ] Svg API
- [ ] add markdown badges for svgs

## Usage (run locally)

> Requires `bun` or `nodejs 18+` installed and up to date

Go to the `root` folder where `package.json` exists.

```bash
# Using bun
bun install

# Using npm
npm install
```

### Then

```bash
# Using bun
bun run dev

# Using npm
npm run dev
```

## Contributors
<a href="https://github.com/ardzero/svgr/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ardzero/svgr" />
</a>


## License

MIT License

Copyright (c) 2024 Ard Astroid / Farhan Ashhab Nur

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
