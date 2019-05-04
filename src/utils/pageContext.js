import { SheetsRegistry } from 'react-jss';
import theme from './theme';


function createPageContext() {
    return {
        theme,
        sheetsManager: new Map(),
        sheetsRegistry: new SheetsRegistry()
    };
}

let pageContext;

export default function getPageContext() {
    if (!process.browser) {
        return createPageContext();
    }

    // Reuse context on the client-side.
    if (!pageContext) {
        pageContext = createPageContext();
    }

    return pageContext;
}
