import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';
import { useTranslation } from 'react-i18next';

const ShippingScreen = () => {
  const { t } = useTranslation();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <Container style={{ maxWidth: '600px' }}>
      <CheckoutSteps step1 step2 />
      <h1>{t('shipping.title')}</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='address' className='my-3'>
          <Form.Label>{t('shipping.address')}</Form.Label>
          <Form.Control type='text' placeholder={`${t('shipping.address')}...`} value={address} required onChange={(e) => setAddress(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group controlId='city' className='my-3'>
            <Form.Label>{t('shipping.city')}</Form.Label>
            <Form.Control type='text' placeholder={`${t('shipping.city')}...`} value={city} required onChange={(e) => setCity(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group controlId='postalCode' className='my-3'>
            <Form.Label>{t('shipping.postalCode')}</Form.Label>
            <Form.Control type='text' placeholder={`${t('shipping.postalCode')}...`} value={postalCode} required onChange={(e) => setPostalCode(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group controlId='country' className='my-3'>
            <Form.Label>{t('shipping.country')}</Form.Label>
            <Form.Control type='text' placeholder={`${t('shipping.country')}...`} value={country} required onChange={(e) => setCountry(e.target.value)}></Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary'>{t('shipping.continue')}</Button>
      </Form>
    </Container>
  );
};

export default ShippingScreen;