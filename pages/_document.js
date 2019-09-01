import React from 'react';
import PropTypes from 'prop-types';
import Document, { Head, Main, NextScript } from 'next/document';
import { resetServerContext } from 'react-beautiful-dnd';


class MyDocument extends Document {
    static async getInitialProps(ctx) {
        let pageContext;
        const page = ctx.renderPage((Component) => {
            const WrappedComponent = (props) => {
            // eslint-disable-next-line react/destructuring-assignment,prefer-destructuring
                pageContext = props.pageContext;
                return <Component {...props} />;
            };

            WrappedComponent.propTypes = {
                pageContext: PropTypes.object.isRequired
            };

            return WrappedComponent;
        });

        let css;
        if (pageContext) {
            css = pageContext.sheetsRegistry.toString();
        }

        resetServerContext();

        return {
            ...page,
            pageContext,
            styles: (
                <React.Fragment>
                    <style id='server-side-styles'>{css}</style>
                </React.Fragment>
            )
        };
    }

    render() {
        const { pageContext } = this.props;

        return (
            <html lang='en' dir='ltr'>
                <Head>
                    <meta charSet='utf-8' />
                    <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no' />
                    <meta name='theme-color' content={pageContext ? pageContext.theme.palette.primary.main : null} />
                    <meta name='description' content='A tool to manage communal kitchen cleaning.' />
                    <link rel='apple-touch-icon' sizes='180x180' href='/static/favicons/apple-touch-icon.png' />
                    <link rel='icon' type='image/png' sizes='32x32' href='/static/favicons/favicon-32x32.png' />
                    <link rel='icon' type='image/png' sizes='16x16' href='/static/favicons/favicon-16x16.png' />
                    <link rel='manifest' href='/static/favicons/site.webmanifest' />
                    <link rel='stylesheet' type='text/css' href='/static/css/index.css' />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}

export default MyDocument;
