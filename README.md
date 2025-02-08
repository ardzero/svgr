[![svgr](https://svgr.ardastroid.com/ogImage.webp)](https://svgr.ardastroid.com/)

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

## 🗺️ Roadmap

- [x] Make a copyable SVG list
- [x] Fuzzy Search
- [x] logo themes
- [x] Wordmark structuer
- [x] Categories
- [x] Adding logo docs
- [x] Logo submission docs
- [x] Svg to png converter
- [x] theme switcher on each card so the full page theme doesn't have to be changed
- [ ] Figma Plugin
- [ ] Download svg options
- [ ] Svg to React converter
- [ ] Copy with keyboard shortcut
- [ ] other framework export
- [ ] Svg API
- [ ] add markdown badges for svgs
- [ ] Raycast extension

## 📥 SVG Submission

There are two ways to submit your logo to Svgr:

### 1. Submit via GitHub Issue

If you'd prefer a quick submission, open an issue using our [SVG submission template](https://github.com/ardzero/svgr/issues/new?template=submit-svg.yml).

> **Note:** Submissions through GitHub Issues may take longer to process as they depend on the availability of our contributors to put a pull request for your submission.

### 2. Fork & Pull Request

If you'd like to contribute directly, please follow these steps:

1. **Fork the Repository**

   If you want to preview your changes, first install the project dependencies:

```bash
# Using bun
bun i
bun run dev
```

2. **Add Your Logo**

   Navigate to the [**`public/library`**](https://github.com/ardzero/svgr/blob/main/public/library) folder in your fork and add your `.svg` logo file.

> [!WARNING]
>
> - Remember to optimize SVG for web, you can use [SVGOMG](https://jakearchibald.github.io/svgomg/).
> - When you optimize the SVG, make sure that the `viewBox` is not removed.
> - The size limit for each .svg is **20kb**.

3. **Update Logo Metadata**

   Open the [**`src/lib/data/svgs.ts`**](https://github.com/ardzero/svgr/blob/main/src/lib/data/svgs.ts) file and add information about your logo. You can follow one of these example structures:

   - **Simple Logo:**

     ```json:README.md
     {
       "title": "Title",
       "category": "Category",
       "route": "/library/your_logo.svg",
       "url": "Website"
     }
     ```

   - **Logo + Wordmark Version:**

     ```json
     {
     	"title": "Title",
     	"category": "Category",
     	"route": "/library/your_logo.svg",
     	"wordmark": "/library/your_logo_wordmark.svg",
     	"url": "Website"
     }
     ```

   - **Logo + Wordmark with Light/Dark Mode:**

     ```json
     {
     	"title": "Title",
     	"category": "Category",
     	"route": {
     		"light": "/library/your_logo_light.svg",
     		"dark": "/library/your_logo_dark.svg"
     	},
     	"wordmark": {
     		"light": "/library/your_wordmark-logo_light.svg",
     		"dark": "/library/your_wordmark-logo_dark.svg"
     	},
     	"url": "Website"
     }
     ```

   - **Logo with Brand Guidelines:**

     ```json
     {
     	"title": "Title",
     	"category": "Category",
     	"route": "/library/your_logo.svg",
     	"wordmark": "/library/your_logo_wordmark.svg",
     	"brandUrl": "https://assets.website.com/brand-guidelines",
     	"url": "Website"
     }
     ```

> [!NOTE]
>
> - Check the list of available categories in [`src/types/categories.ts`](https://github.com/ardzero/svgr/blob/main/src/types/categories.ts). You can add a new category if needed.
> - To include multiple categories, simply use an array (e.g., `"category": ["Social", "Design"]`).

4. **Create a Pull Request**

   Once you've added your logo and updated the metadata, open a pull request. Your submission will be reviewed and, once approved, merged into the project.

> **Disclaimer:**  
> Please note that all SVG submissions are subject to removal if the rightful owner requests it. Svgr is an open registry and does not own or license any of the submitted SVGs. If you are the owner of an SVG and would like it removed, please open a GitHub issue or email at [svgr@ardastroid.com](mailto:svgr@ardastroid.com).

## 📦 Run locally

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

## ✨ Contributors

<a href="https://github.com/ardzero/svgr/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ardzero/svgr" />
</a>

## 📙 License

- [MIT](https://github.com/ardzero/svgr/blob/main/LICENSE).
