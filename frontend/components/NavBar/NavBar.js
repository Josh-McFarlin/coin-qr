import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'react-jss';
import { withRouter } from 'next/router';
import { Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, Collapse } from 'shards-react';
import _ from 'lodash';

import urls from '../../../utils/urls';
import { loginUser, signOut } from '../../firebase/actions';


const styles = () => ({
    navItem: {
        cursor: 'pointer'
    }
});

class NavBar extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            drawerOpen: false
        };
    }

    toggleDrawer = () => {
        this.setState((prevState) => ({
            drawerOpen: !prevState.drawerOpen
        }));
    };

    render() {
        const { classes, router, currentUser } = this.props;
        const { drawerOpen } = this.state;

        return (
            <Navbar
                type='dark'
                theme='primary'
                expand='md'
            >
                <NavbarBrand href={urls.home}>Kitchen Jobs</NavbarBrand>
                <NavbarToggler onClick={this.toggleDrawer} />

                <Collapse open={drawerOpen} navbar>
                    <Nav navbar>
                        {_.get(currentUser, 'isAdmin', false) && (
                            <NavItem className={classes.navItem}>
                                <NavLink
                                    active={router.asPath === urls.manage}
                                    href={urls.manage}
                                >
                                    Manage
                                </NavLink>
                            </NavItem>
                        )}
                    </Nav>
                    <Nav navbar className='ml-auto'>
                        {currentUser.isUser ? (
                            <NavItem className={classes.navItem}>
                                <NavLink
                                    onClick={signOut}
                                >
                                    Sign Out
                                </NavLink>
                            </NavItem>
                        ) : (
                            <NavItem className={classes.navItem}>
                                <NavLink
                                    onClick={loginUser}
                                >
                                    Login
                                </NavLink>
                            </NavItem>
                        )}
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}

NavBar.propTypes = {
    classes: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(NavBar));
