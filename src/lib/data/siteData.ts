import type { TSiteData, TtwitterMetaData, TMetadataIcons } from "@/types";

// edit the webmanifest file in /public to change the name, short_name, and icons in android
// in webmanifest, theme_color is the color of the app icon's background and
export const siteData: TSiteData = {
    favicon: "/favicon.svg", // .svg / .ico / .png
    name: "Svgr (svg registry) - An open source svg logo list/registry",
    shortName: "Svgr (svg registry)",
    publisher: "ardastroid.com",
    baseUrl: "svgr.ardastroid.com", //"svgr.vercel.app"
    description:
        "Svgr (svg registry) is an open source svg logo list/registry built on top of Astro and react",

    ogImage: { src: "/ogImage.webp", alt: "svgr", width: 1200, height: 630 },

    metadata_color: {
        light: "#c5beb2",
        dark: "#f9f0e0",
    },
    author: {
        name: "darkidop",
        url: "https://zeneticesports.com/darkid",
    },
    keywords: [
        "Astro.build",
        "React",
        "Tailwind CSS",
        "Bun",
        "TypeScript",
        "Svgr",
        "Svg registry",
        "Svg logo list",
        "Svg logo registry",
        "svg",
        "logo",
        "list",
        "open source",
        "open source project",
        "open source svg logo list",
        "open source svg logo registry",
        "svg logo list",
    ],

    robotsDefault: "index, follow", // { index: false, follow: false }
};



// these are defaults may get overwrited in specific routes
export const twitterMetaData: TtwitterMetaData = {
    card: "summary_large_image",
    title: siteData.name,
    description: siteData.description,
    image: siteData.ogImage.src,
    creator: "@ardastroid", //twitter username of author
};

// By default, it uses the favicon mentioned at the top
export const icons: TMetadataIcons = {
    icon: siteData.favicon, // "/favicon.svg",
    shortcut: siteData.favicon, // "/favicon-16x16.png",
    apple: siteData.favicon, // "/apple-touch-icon.png",
};
