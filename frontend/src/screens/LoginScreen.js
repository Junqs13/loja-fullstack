import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../actions/userActions.js';
import { useTranslation } from 'react-i18next'; // 1. Importar

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { t } = useTranslation(); // 2. Inicializar o hook
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <Container style={{ maxWidth: '600px' }}>
      <h1>{t('login.title')}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Carregando...</p>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email'>
          <Form.Label>{t('login.emailLabel')}</Form.Label>
          <Form.Control
            type='email'
            placeholder={t('login.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password' className='my-3'>
          <Form.Label>{t('login.passwordLabel')}</Form.Label>
          <Form.Control
            type='password'
            placeholder={t('login.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-3'data-cy="login-submit-button" >
          {t('login.signInButton')}
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          {t('login.newUserPrompt')}{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            {t('login.registerLink')}
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginScreen;
