import type { Tcategory } from './categories';

export type ThemeOptions = {
    dark: string;
    light: string;
};

export interface iSVG {
    id?: number;
    title: string;
    subTitle?: string;
    category: Tcategory | Tcategory[];
    route: string | ThemeOptions;
    wordmark?: string | ThemeOptions;
    brandUrl?: string;
    url: string;

}
