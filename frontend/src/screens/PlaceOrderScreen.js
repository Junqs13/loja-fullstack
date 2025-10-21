import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';
import { useTranslation } from 'react-i18next';

const PlaceOrderScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);

  // Cálculos
  cart.itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  cart.shippingPrice = cart.itemsPrice > 100 ? 0 : 10;
  cart.taxPrice = Number((0.15 * cart.itemsPrice).toFixed(2));
  cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2);

  const orderCreate = useSelector(state => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if(success) {
        navigate(`/order/${order._id}`);
    }
  }, [navigate, success, order]);

  const placeOrderHandler = () => {
    dispatch(createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
    }));
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>{t('placeOrder.shipping')}</h2>
              <p>
                <strong>{t('shipping.address')}: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>{t('placeOrder.paymentMethod')}</h2>
              <strong>{t('payment.selectMethod')}: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>{t('placeOrder.orderItems')}</h2>
              {cart.cartItems.length === 0 ? <p>{t('emptyCart')}</p> : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}><Image src={item.image} alt={item.name} fluid rounded /></Col>
                        <Col><Link to={`/product/${item.product}`}>{item.name}</Link></Col>
                        <Col md={4}>{item.qty} x ${item.price} = ${item.qty * item.price}</Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item><h2>{t('placeOrder.orderSummary')}</h2></ListGroup.Item>
              <ListGroup.Item><Row><Col>{t('placeOrder.items')}</Col><Col>${cart.itemsPrice.toFixed(2)}</Col></Row></ListGroup.Item>
              <ListGroup.Item><Row><Col>{t('placeOrder.shippingPrice')}</Col><Col>${cart.shippingPrice.toFixed(2)}</Col></Row></ListGroup.Item>
              <ListGroup.Item><Row><Col>{t('placeOrder.tax')}</Col><Col>${cart.taxPrice.toFixed(2)}</Col></Row></ListGroup.Item>
              <ListGroup.Item><Row><Col>{t('placeOrder.total')}</Col><Col>${cart.totalPrice}</Col></Row></ListGroup.Item>
              <ListGroup.Item>{error && <p style={{color: 'red'}}>{error}</p>}</ListGroup.Item>
              <ListGroup.Item className='d-grid'>
                <Button type='button' disabled={cart.cartItems === 0} onClick={placeOrderHandler}>
                  {t('placeOrder.placeOrderButton')}
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;