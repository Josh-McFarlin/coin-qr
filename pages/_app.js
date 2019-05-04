/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import App, { Container as AppContainer } from 'next/app';
import Head from 'next/head';
import JssProvider from 'react-jss/lib/JssProvider';
import withStyles, { ThemeProvider } from 'react-jss';
import { Container } from 'shards-react';
import { Provider as ReduxProvider, connect } from 'react-redux';
import withRedux from 'next-redux-wrapper';

import reduxStore from '../src/redux/store/index';
import PageContext from '../src/utils/pageContext';
import NavBar from '../src/components/NavBar/NavBar';
import 'bootstrap-css-only';
import 'shards-ui/dist/css/shards.min.css';
import { listenForUser } from '../src/redux/actions/auth';


const styles = (theme) => ({
    content: {
        flex: 1,
        overflow: 'hidden auto',
        padding: `${2 * theme.spacing.unit}px ${2 * theme.spacing.unit}px 0 ${2 * theme.spacing.unit}px`
    }
});

class AppContent extends React.PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;

        dispatch(listenForUser());
    }

    render() {
        const { classes, Component, pageContext, pageProps } = this.props;

        return (
            <React.Fragment>
                <NavBar />
                <Container
                    className={classes.content}
                    fluid
                >
                    <Component
                        pageContext={pageContext}
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
    dispatch: PropTypes.func.isRequired
};

const StyledContent = connect(null)(withStyles(styles)(AppContent));

class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        return {
            pageProps: {
                ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})
            }
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
        const { Component, pageProps, store } = this.props;

        return (
            <AppContainer>
                <Head>
                    <title>CryptoQR</title>
                </Head>
                <ReduxProvider store={store}>
                    <JssProvider
                        registry={this.pageContext.sheetsRegistry}
                        generateClassName={this.pageContext.generateClassName}
                    >
                        <ThemeProvider theme={this.pageContext.theme}>
                            <StyledContent
                                Component={Component}
                                pageContext={this.pageContext}
                                pageProps={pageProps}
                            />
                        </ThemeProvider>
                    </JssProvider>
                </ReduxProvider>
            </AppContainer>
        );
    }
}

export default withRedux(reduxStore, { debug: false })(MyApp);
