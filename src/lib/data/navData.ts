import type { TnavData } from "@/types";
import { Icons } from "@/components/utils/icons";
import { siteData } from "@/lib/data/siteData";

export const navData: TnavData = {
    title: siteData.shortName,
    showTitle: true,
    logo: {
        src: "/logo.svg",
        alt: "logo",
    },
    links: [
        {
            label: "Home",
            href: "/",
        },
        {
            label: "Docs",
            href: "https://github.com/DarkidOP/Bunext?tab=readme-ov-file#bunext",
            external: true,
        },
        {
            label: "Contact",
            href: "/contact",
        },
    ],
    iconButtons: [
        {
            label: "GitHub",
            href: "https://github.com/DarkidOP/Bunext",
            Icon: Icons.gitHub,
        },
    ],
};
