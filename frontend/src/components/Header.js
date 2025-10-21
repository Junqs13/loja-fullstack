import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Nav, Container, NavDropdown, Badge, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { logout } from '../actions/userActions';
import { changeTheme } from '../actions/themeActions';
import SearchBox from './SearchBox';

const Header = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const { theme } = useSelector((state) => state.theme);

  const logoutHandler = () => {
    dispatch(logout());
  };

  const changeLanguageHandler = (lang) => {
    i18n.changeLanguage(lang);
  };
  
  const themeSwitchHandler = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(changeTheme(newTheme));
  };

  return (
    <header>
      <Navbar bg={theme} variant={theme} expand="lg" collapseOnSelect className="shadow-sm">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Loja Full Stack</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <SearchBox />
            <Nav className="ms-auto d-flex align-items-center">
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className="fas fa-shopping-cart"></i> {t('header.cart')}
                  {cartItems.length > 0 && (
                    <Badge pill bg='success' style={{ marginLeft: '5px' }}>
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>{t('header.profileLink')}</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler} data-cy="logout-button">
                    {t('header.logout')}
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link data-cy="login-link">
                    <i className="fas fa-user"></i> {t('header.signIn')}
                  </Nav.Link>
                </LinkContainer>
              )}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown title={t('header.admin')} id='adminmenu'>
                    <LinkContainer to='/admin/dashboard'>
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/userlist'>
                        <NavDropdown.Item>{t('header.users')}</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/productlist'>
                        <NavDropdown.Item>{t('header.products')}</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/orderlist'>
                        <NavDropdown.Item>{t('header.orders')}</NavDropdown.Item>
                    </LinkContainer>
                </NavDropdown>
              )}
              
              <NavDropdown title={i18n.language.toUpperCase()} id='language-selector'>
                  <NavDropdown.Item onClick={() => changeLanguageHandler('pt')}>Português (PT)</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => changeLanguageHandler('en')}>English (EN)</NavDropdown.Item>
              </NavDropdown>

              <Button variant="secondary" onClick={themeSwitchHandler} className="ms-2">
                <i className={theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'}></i>
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;