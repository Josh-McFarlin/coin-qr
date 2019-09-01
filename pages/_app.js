import React from 'react';
import PropTypes from 'prop-types';
import App from 'next/app';
import Head from 'next/head';
import JssProvider from 'react-jss/lib/JssProvider';
import withStyles, { ThemeProvider } from 'react-jss';
import { Container } from 'shards-react';
import MobileDetect from 'mobile-detect';
import Cookies from 'universal-cookie';

import PageContext from '../frontend/utils/pageContext';
import NavBar from '../frontend/components/NavBar';
import { getCurrentUser } from '../frontend/firebase/actions';
import 'bootstrap-css-only';
import 'shards-ui/dist/css/shards.min.css';
import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css';
import 'react-virtualized-select/styles.css';


const styles = (theme) => ({
    content: {
        flex: 1,
        overflow: 'hidden auto',
        padding: `${2 * theme.spacing.unit}px ${2 * theme.spacing.unit}px 0 ${2 * theme.spacing.unit}px`
    }
});

class AppContent extends React.PureComponent {
    render() {
        const { classes, Component, pageContext, pageProps, isMobile, currentUser } = this.props;

        return (
            <React.Fragment>
                <NavBar currentUser={currentUser} />
                <Container
                    className={classes.content}
                    fluid
                >
                    <Component
                        pageContext={pageContext}
                        isMobile={isMobile}
                        currentUser={currentUser}
                        {...pageProps}
                    />
                </Container>
            </React.Fragment>
        );
    }
}

AppContent.propTypes = {
    classes: PropTypes.object.isRequired,
    Component: PropTypes.any.isRequired,
    pageContext: PropTypes.object.isRequired,
    pageProps: PropTypes.object.isRequired,
    isMobile: PropTypes.bool.isRequired,
    currentUser: PropTypes.object.isRequired
};

const StyledContent = withStyles(styles)(AppContent);

export default class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        const cookies = new Cookies(ctx.req.headers.cookie);
        const currentUser = await getCurrentUser(cookies.get('session'));

        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        const md = ctx.req ? new MobileDetect(ctx.req.headers['user-agent']) :
            new MobileDetect(navigator.userAgent);

        return {
            pageProps,
            isMobile: md.mobile() != null,
            currentUser
        };
    }

    constructor(props) {
        super(props);

        this.pageContext = PageContext();
    }

    componentDidMount() {
        const style = document.getElementById('server-side-styles');

        if (style) {
            style.parentNode.removeChild(style);
        }
    }

    render() {
        const { Component, pageProps, isMobile, currentUser } = this.props;

        return (
            <React.Fragment>
                <Head>
                    <title>Kitchen Jobs</title>
                </Head>
                <JssProvider
                    registry={this.pageContext.sheetsRegistry}
                    generateClassName={this.pageContext.generateClassName}
                >
                    <ThemeProvider theme={this.pageContext.theme}>
                        <StyledContent
                            Component={Component}
                            pageContext={this.pageContext}
                            pageProps={pageProps}
                            isMobile={isMobile}
                            currentUser={currentUser}
                        />
                    </ThemeProvider>
                </JssProvider>
            </React.Fragment>
        );
    }
}
