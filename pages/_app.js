import React from 'react';
import Head from 'next/head';
import { Container } from 'shards-react';
import _ from 'lodash';
import Cookies from 'universal-cookie';
import NavBar from '../src/components/NavBar/NavBar';
import TermsModal from '../src/components/Terms/TermsModal';
import 'bootstrap-css-only';
import 'shards-ui/dist/css/shards.min.css';
import 'react-virtualized/styles.css';
import 'react-virtualized-select/styles.css';
import '../public/static/css/index.css';


const MyApp = ({ Component, pageProps }) => {
    const [termsOpen, setTermsOpen] = React.useState(false);

    const cookies = new Cookies();
    const termsCookie = cookies.get('acceptedTerms');

    return (
        <>
            <Head>
                <title>CoinQR</title>
            </Head>
            <NavBar />
            <Container
                fluid
                style={{
                    flex: 1,
                    overflow: 'hidden auto',
                    padding: '8px 8px 0 8px'
                }}
            >
                {(!_.isNil(termsCookie) && termsCookie === 'false') && (
                    <TermsModal
                        isOpen={termsOpen}
                        toggleModal={() => setTermsOpen(false)}
                    />
                )}
                <Component
                    isMobile={false}
                    {...pageProps}
                />
            </Container>
        </>
    );
};

export default MyApp;
