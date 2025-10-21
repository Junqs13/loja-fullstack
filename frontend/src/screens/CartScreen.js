import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import { addToCart, removeFromCart } from '../actions/cartActions';
import { useTranslation } from 'react-i18next';
import Message from '../components/Message';

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <Row>
      <Col md={8}>
        <h1>{t('shoppingCart')}</h1>
        {cartItems.length === 0 ? (
          <Message variant='info'>
            {t('emptyCart')}. <Link to='/'>{t('goBack')}</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map(item => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}><Image src={item.image} alt={item.name} fluid rounded /></Col>
                  <Col md={3}><Link to={`/product/${item.product}`}>{item.name}</Link></Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <Form.Control as="select" value={item.qty} onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}>
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button type='button' variant='light' onClick={() => removeFromCartHandler(item.product)}>
                      <i className='fas fa-trash'></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>{t('subtotal')} ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) {t('items')}</h2>
              ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item className="d-grid">
              <Button type='button' disabled={cartItems.length === 0} onClick={checkoutHandler}>
                {t('proceedToCheckout')}
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;