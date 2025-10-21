// frontend/src/screens/ProfileScreen.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Table, Tabs, Tab } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

const ProfileScreen = () => {
  const { t } = useTranslation();
  
  // States do Perfil
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // States de Endereço
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails; // <-- CORRIGIDO

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin; // <-- CORRIGIDO

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success, loading: loadingUpdate } = userUpdateProfile; // <-- CORRIGIDO

  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy; // <-- CORRIGIDO

  // useEffect para CARREGAR DADOS
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      if (!user || !user.name) {
        dispatch(getUserDetails('profile'));
        dispatch(listMyOrders());
      } else {
        setName(user.name);
        setEmail(user.email);
        if (user.shippingAddress) {
            setAddress(user.shippingAddress.address || '');
            setCity(user.shippingAddress.city || '');
            setPostalCode(user.shippingAddress.postalCode || '');
            setCountry(user.shippingAddress.country || '');
        }
      }
    }
  }, [dispatch, navigate, userInfo, user]);


  // useEffect para LIDAR COM SUCESSO
  useEffect(() => {
    if (success) {
      toast.success(t('profile.updateSuccess'));
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
      dispatch(getUserDetails('profile'));
    }
  }, [dispatch, success, t]);

  const profileSubmitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(t('profile.passwordsNoMatch'));
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
    }
  };

  const addressSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile({ 
        id: user._id, 
        shippingAddress: { address, city, postalCode, country }
    }));
  };

  return (
    <>
      <Tabs defaultActiveKey="profile" id="profile-tabs" className="my-3" fill>
        
        {/* --- ABA 1: PERFIL --- */}
        <Tab eventKey="profile" title={t('profile.title', 'Perfil')}>
          <Row className="justify-content-md-center">
            <Col md={6}>
              <h2>{t('profile.title')}</h2>
              {error && <Message variant='danger'>{error}</Message>}
              {loading && <Loader />}
              {loadingUpdate && <Loader />} 

              <Form onSubmit={profileSubmitHandler}>
                <Form.Group controlId="name" className="my-3">
                  <Form.Label>{t('register.nameLabel')}</Form.Label>
                  <Form.Control type="name" placeholder={t('register.namePlaceholder')} value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId="email" className="my-3">
                  <Form.Label>{t('login.emailLabel')}</Form.Label>
                  <Form.Control type="email" placeholder={t('login.emailPlaceholder')} value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId="password" className="my-3">
                  <Form.Label>{t('profile.passwordNew')}</Form.Label>
                  <Form.Control type="password" placeholder={t('profile.passwordNewPlaceholder')} value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId="confirmPassword"  className="my-3">
                  <Form.Label>{t('profile.passwordConfirm')}</Form.Label>
                  <Form.Control type="password" placeholder={t('profile.passwordConfirmPlaceholder')} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
                </Form.Group>
                <Button type="submit" variant="primary" className="my-3">{t('profile.updateButton')}</Button>
              </Form>
            </Col>
          </Row>
        </Tab>
        
        {/* --- ABA 2: ENDEREÇO (NOVO) --- */}
        <Tab eventKey="address" title={t('profile.addressTab', 'Endereço de Envio')}>
           <Row className="justify-content-md-center">
            <Col md={6}>
              <h2>{t('profile.addressTab', 'Endereço de Envio')}</h2>
              <p>{t('profile.addressDesc', 'Atualize o seu endereço...')}</p>
              {loadingUpdate && <Loader />}
              <Form onSubmit={addressSubmitHandler}>
                 <Form.Group controlId='address' className="my-3">
                    <Form.Label>{t('shipping.address')}</Form.Label>
                    <Form.Control type='text' placeholder={t('shipping.address')} value={address} required onChange={(e) => setAddress(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId='city' className="my-3">
                    <Form.Label>{t('shipping.city')}</Form.Label>
                    <Form.Control type='text' placeholder={t('shipping.city')} value={city} required onChange={(e) => setCity(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId='postalCode' className="my-3">
                    <Form.Label>{t('shipping.postalCode')}</Form.Label>
                    <Form.Control type='text' placeholder={t('shipping.postalCode')} value={postalCode} required onChange={(e) => setPostalCode(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId='country' className="my-3">
                    <Form.Label>{t('shipping.country')}</Form.Label>
                    <Form.Control type='text' placeholder={t('shipping.country')} value={country} required onChange={(e) => setCountry(e.target.value)}></Form.Control>
                </Form.Group>
                <Button type="submit" variant="primary" className="my-3">{t('profile.saveAddressButton', 'Salvar Endereço')}</Button>
              </Form>
            </Col>
          </Row>
        </Tab>

        {/* --- ABA 3: PEDIDOS --- */}
        <Tab eventKey="orders" title={t('profile.myOrders', 'Meus Pedidos')}>
          <h2>{t('profile.myOrders')}</h2>
          {loadingOrders ? <Loader /> : errorOrders ? <Message variant='danger'>{errorOrders}</Message> : (
              orders.length === 0 ? <Message variant='info'>{t('noOrders')}</Message> : (
                  <Table striped bordered hover responsive className='table-sm'>
                      <thead>
                          <tr>
                              <th>ID</th>
                              <th>{t('table.date', 'DATA')}</th>
                              <th>{t('placeOrder.total', 'TOTAL')}</th>
                              <th>{t('table.paid', 'PAGO')}</th>
                              <th>{t('table.delivered', 'ENTREGUE')}</th>
                              <th></th>
                          </tr>
                      </thead>
                      <tbody>
                          {orders.map(order => (
                              <tr key={order._id}>
                                  <td>{order._id}</td>
                                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                  <td>R$ {order.totalPrice.toFixed(2)}</td>
                                  <td>{order.isPaid ? new Date(order.paidAt).toLocaleDateString() : (<i className='fas fa-times' style={{color: 'red'}}></i>)}</td>
                                  <td>{order.isDelivered ? (order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : <i className='fas fa-check' style={{color: 'green'}}></i>) : (<i className='fas fa-times' style={{color: 'red'}}></i>)}</td>
                                  <td>
                                      <LinkContainer to={`/order/${order._id}`}>
                                          <Button className='btn-sm' variant='light'>{t('pendingOrders.details', 'Detalhes')}</Button>
                                      </LinkContainer>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </Table>
              )
          )}
        </Tab>

      </Tabs>
    </>
  );
};

export default ProfileScreen;