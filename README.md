[![Bunestro](https://svgr.ardastroid.com/ogImage.webp)](https://svgr.ardastroid.com/)

# Svgr

An open source svg directory with fuzzy search build with Astro and react. [Live deployment](https://svgr.ardastroid.com/)
Repo: [Github Repo](https://github.com/ardzero/svgr)

> [!NOTE]
> A large portion of this is based on [Svgl](https://github.com/pheralb/svgl). I wanned a version built on react and astro with some difference features and slightly different UI.

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

## Usage (run locally)

> Requires `bun` or `nodejs` installed and up to date

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

<!-- ## Features

- Astro 5.2
- Tailwind CSS v4
- React Integration
- [Shadcn](https://ui.shadcn.com/) components
- Custom utility components
- Theme support (dark and light mode)
- Tailwind CSS animations using [tailwindcss-motion](https://docs.rombo.co/tailwind)
- SEO optimized (SEO component provided)
- Responsive optimized img loader component
- Share modal
- Utilities like `qrCode gen, string shortner, uniqueCode gen, img placeholder, email validation, hashing etc`

## Config

- Configure colors in `src/styles/globals.css`
- Site default metadata in `astro.config.mjs`
- Component configurations in `src/lib/data/siteData.ts`
- Astro configurations in `astro.config.mjs` -->

## Roadmap

- [x] Make copyable svg list
- [x] Fuzzy Search
- [x] logo themes
- [x] Wordmark structuer
- [x] Categories
- [ ] Adding logo docs
- [ ] Logo submission docs
- [ ] Copy with keyboard shortcut
- [ ] Figma Plugin
- [ ] Download svg options
- [ ] Svg to png converter
- [ ] Svg to React converter
- [ ] other framework export
- [ ] Svg api

## Socials

- Website: [ardastroid.com](https://ardastroid.com)
- Email: [hello@ardastroid.com](mailto:hello@ardastroid.com)
- GitHub: [@ardzero](https://github.com/ardzero)

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
