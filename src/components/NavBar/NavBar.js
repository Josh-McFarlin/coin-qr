import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { withRouter } from 'next/router';
import {
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Collapse
} from 'shards-react';
import { connect } from 'react-redux';
import _ from 'lodash';

import TermsModal from '../Terms/TermsModal';
import urls from '../../utils/urls';
import { signOut } from '../../redux/actions/auth';


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
        const { dispatch, router } = this.props;

        dispatch(signOut()).then(() => {
            router.push(urls.home());
        });
    };

    render() {
        const { classes, router, user } = this.props;
        const { drawerOpen, termsOpen } = this.state;

        return (
            <React.Fragment>
                <Navbar
                    type='dark'
                    theme='primary'
                    expand='md'
                >
                    <NavbarBrand href={urls.home()}>CryptoQR</NavbarBrand>
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
                            {_.isObject(user) && (
                                <NavItem className={classes.navItem}>
                                    <NavLink
                                        active={router.asPath === urls.profile.view()}
                                        href={urls.profile.view()}
                                    >
                                        Profile
                                    </NavLink>
                                </NavItem>
                            )}
                        </Nav>
                        <Nav navbar className='ml-auto'>
                            <NavItem className={classes.navItem}>
                                <NavLink
                                    onClick={this.toggleTerms}
                                >
                                    Terms
                                </NavLink>
                            </NavItem>
                            {_.isNil(user) && (
                                <NavItem className={classes.navItem}>
                                    <NavLink
                                        active={router.asPath === urls.auth()}
                                        href={urls.auth()}
                                    >
                                        Login
                                    </NavLink>
                                </NavItem>
                            )}
                            {_.isObject(user) && (
                                <NavItem className={classes.navItem}>
                                    <NavLink
                                        onClick={this.handleSignout}
                                    >
                                        Sign Out
                                    </NavLink>
                                </NavItem>
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
    user: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};

NavBar.defaultProps = {
    user: null
};

const styledComponent = withRouter(withStyles(styles)(NavBar));

export default connect(
    (state) => {
        const { auth } = state;

        return {
            user: _.get(auth, 'user')
        };
    }
)(withRouter(styledComponent));
