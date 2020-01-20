import React from 'react';
import { useRouter } from 'next/router';
import {
    Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, Collapse
} from 'shards-react';
import _ from 'lodash';
import TermsModal from '../Terms/TermsModal';
import urls from '../../../utils/urls';
import { signOut } from '../../firebase/actions';
import firebase from '../../firebase';


const classes = {};

const NavBar = () => {
    const router = useRouter();
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [termsOpen, setTermsOpen] = React.useState(false);
    const [userId, setUserId] = React.useState(null);

    React.useEffect(() => {
        firebase.auth()
            .onAuthStateChanged((user) => {
                if (user) {
                    setUserId(user.uid);
                } else {
                    setUserId(null);
                }
            }, () => {
                setUserId(null);
            });
    }, []);

    const toggleDrawer = () => setDrawerOpen((prevState) => !prevState);

    const toggleTerms = () => setTermsOpen((prevState) => !prevState);

    return (
        <React.Fragment>
            <Navbar
                type='dark'
                theme='primary'
                expand='md'
            >
                <NavbarBrand href={urls.home()}>CoinQR</NavbarBrand>
                <NavbarToggler onClick={toggleDrawer} />

                <Collapse open={drawerOpen} navbar>
                    <Nav navbar>
                        <NavItem
                            styles={{
                                cursor: 'pointer'
                            }}
                        >
                            <NavLink
                                active={router.asPath === urls.recent()}
                                href={urls.recent()}
                            >
                                Recent Pages
                            </NavLink>
                        </NavItem>
                        {_.isString(userId) && (
                            <>
                                <NavItem
                                    styles={{
                                        cursor: 'pointer'
                                    }}
                                >
                                    <NavLink
                                        active={router.asPath === urls.qr.create()}
                                        href={urls.qr.create()}
                                    >
                                        Create
                                    </NavLink>
                                </NavItem>
                                <NavItem
                                    styles={{
                                        cursor: 'pointer'
                                    }}
                                >
                                    <NavLink
                                        active={router.asPath === urls.profile.view(userId)}
                                        href={urls.profile.view(userId)}
                                    >
                                        Profile
                                    </NavLink>
                                </NavItem>
                            </>
                        )}
                    </Nav>
                    <Nav navbar className='ml-auto'>
                        {_.isString(userId) ? (
                            <NavItem className={classes.navItem}>
                                <NavLink
                                    onClick={signOut}
                                >
                                    Sign Out
                                </NavLink>
                            </NavItem>
                        ) : (
                            <React.Fragment>
                                <NavItem className={classes.navItem}>
                                    <NavLink
                                        onClick={toggleTerms}
                                    >
                                        Terms
                                    </NavLink>
                                </NavItem>
                                <NavItem className={classes.navItem}>
                                    <NavLink
                                        active={router.asPath === urls.auth()}
                                        href={urls.auth()}
                                    >
                                        Login
                                    </NavLink>
                                </NavItem>
                            </React.Fragment>
                        )}
                    </Nav>
                </Collapse>
            </Navbar>

            <TermsModal
                isOpen={termsOpen}
                toggleModal={toggleTerms}
            />
        </React.Fragment>
    );
};

export default NavBar;
