import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { withRouter } from 'next/router';
import {
    Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, Collapse
} from 'shards-react';
import _ from 'lodash';

import TermsModal from '../Terms/TermsModal';
import urls from '../../../utils/urls';
import hashUtils from '../../../utils/hash';
import { signOut } from '../../firebase/actions';


const styles = () => ({
    navItem: {
        cursor: 'pointer'
    }
});

class NavBar extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            drawerOpen: false,
            termsOpen: false
        };
    }

    toggleDrawer = () => {
        this.setState((prevState) => ({
            drawerOpen: !prevState.drawerOpen
        }));
    };

    toggleTerms = () => {
        this.setState((prevState) => ({
            termsOpen: !prevState.termsOpen
        }));
    };

    handleSignout = () => {
        const { router } = this.props;

        signOut()
            .then(() => {
                router.push(urls.home());
            });
    };

    render() {
        const { classes, router, userId } = this.props;
        const { drawerOpen, termsOpen } = this.state;

        return (
            <React.Fragment>
                <Navbar
                    type='dark'
                    theme='primary'
                    expand='md'
                >
                    <NavbarBrand href={urls.home()}>CoinQR</NavbarBrand>
                    <NavbarToggler onClick={this.toggleDrawer} />

                    <Collapse open={drawerOpen} navbar>
                        <Nav navbar>
                            <NavItem className={classes.navItem}>
                                <NavLink
                                    active={router.asPath === urls.qr.create()}
                                    href={urls.qr.create()}
                                >
                                    Create
                                </NavLink>
                            </NavItem>
                            <NavItem className={classes.navItem}>
                                <NavLink
                                    active={router.asPath === urls.recent()}
                                    href={urls.recent()}
                                >
                                    Recent Pages
                                </NavLink>
                            </NavItem>
                            {_.isString(userId) && (
                                <NavItem className={classes.navItem}>
                                    <NavLink
                                        active={router.asPath === urls.profile.view(hashUtils.hashUID(userId))}
                                        href={urls.profile.view(hashUtils.hashUID(userId))}
                                    >
                                        Profile
                                    </NavLink>
                                </NavItem>
                            )}
                        </Nav>
                        <Nav navbar className='ml-auto'>
                            {_.isString(userId) ? (
                                <NavItem className={classes.navItem}>
                                    <NavLink
                                        onClick={this.handleSignout}
                                    >
                                        Sign Out
                                    </NavLink>
                                </NavItem>
                            ) : (
                                <React.Fragment>
                                    <NavItem className={classes.navItem}>
                                        <NavLink
                                            onClick={this.toggleTerms}
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
                    toggleModal={this.toggleTerms}
                />
            </React.Fragment>
        );
    }
}

NavBar.propTypes = {
    classes: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    userId: PropTypes.string
};

NavBar.defaultProps = {
    userId: null
};

export default withRouter(withStyles(styles)(NavBar));
