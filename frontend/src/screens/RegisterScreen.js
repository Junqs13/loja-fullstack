import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../actions/userActions';
import { useTranslation } from 'react-i18next';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage(t('profile.passwordsNoMatch'));
    } else {
      dispatch(register(name, email, password));
    }
  };

  return (
    <Container style={{ maxWidth: '600px' }}>
      <h1>{t('register.title')}</h1>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>{t('loading')}</p>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name' className='my-3'>
          <Form.Label>{t('register.nameLabel')}</Form.Label>
          <Form.Control type='name' placeholder={t('register.namePlaceholder')} value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group controlId='email' className='my-3'>
          <Form.Label>{t('login.emailLabel')}</Form.Label>
          <Form.Control type='email' placeholder={t('login.emailPlaceholder')} value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group controlId='password' className='my-3'>
          <Form.Label>{t('login.passwordLabel')}</Form.Label>
          <Form.Control type='password' placeholder={t('login.passwordPlaceholder')} value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group controlId='confirmPassword'  className='my-3'>
          <Form.Label>{t('register.passwordConfirmLabel')}</Form.Label>
          <Form.Control type='password' placeholder={t('register.passwordConfirmPlaceholder')} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary'>{t('register.registerButton')}</Button>
      </Form>
      <Row className='py-3'>
        <Col>{t('register.hasAccountPrompt')} <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>{t('register.loginLink')}</Link></Col>
      </Row>
    </Container>
  );
};

export default RegisterScreen;