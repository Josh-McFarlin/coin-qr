import React from 'react';
import PropTypes from 'prop-types';
import App, { Container as AppContainer } from 'next/app';
import Head from 'next/head';
import JssProvider from 'react-jss/lib/JssProvider';
import withStyles, { ThemeProvider } from 'react-jss';
import { Container } from 'shards-react';
import MobileDetect from 'mobile-detect';
import _ from 'lodash';
import Cookies from 'universal-cookie';
import PageContext from '../frontend/utils/pageContext';
import NavBar from '../frontend/components/NavBar/NavBar';
import TermsModal from '../frontend/components/Terms/TermsModal';
import 'bootstrap-css-only';
import 'shards-ui/dist/css/shards.min.css';
import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css';
import 'react-virtualized-select/styles.css';
import '../public/static/css/index.css';


const styles = (theme) => ({
    content: {
        flex: 1,
        overflow: 'hidden auto',
        padding: `${2 * theme.spacing.unit}px ${2 * theme.spacing.unit}px 0 ${2 * theme.spacing.unit}px`
    }
});

class AppContent extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            termsOpen: true
        };
    }

    closeModal = () => {
        this.setState({
            termsOpen: false
        });
    };

    render() {
        const { classes, Component, pageContext, pageProps, isMobile, userId } = this.props;
        const { termsOpen } = this.state;

        const cookies = new Cookies();
        const termsCookie = cookies.get('acceptedTerms');

        return (
            <React.Fragment>
                <NavBar userId={userId} />
                <Container
                    className={classes.content}
                    fluid
                >
                    {(!_.isNil(termsCookie) && termsCookie === 'false') && (
                        <TermsModal
                            isOpen={termsOpen}
                            toggleModal={this.closeModal}
                        />
                    )}
                    <Component
                        pageContext={pageContext}
                        isMobile={isMobile}
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
    userId: PropTypes.string
};

AppContent.defaultProps = {
    userId: null
};

const StyledContent = withStyles(styles)(AppContent);

export default class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        const locals = _.get(ctx, 'res.locals', {});

        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        const md = ctx.req ? new MobileDetect(ctx.req.headers['user-agent']) :
            new MobileDetect(navigator.userAgent);

        return {
            pageProps,
            isMobile: md.mobile() != null,
            userId: locals.userId
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
        const { Component, pageProps, isMobile, userId } = this.props;

        return (
            <AppContainer>
                <Head>
                    <title>CoinQR</title>
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
                            userId={userId}
                        />
                    </ThemeProvider>
                </JssProvider>
            </AppContainer>
        );
    }
}
