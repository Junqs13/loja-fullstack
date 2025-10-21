import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const dispatch = useDispatch();
  const [paypalClientId, setPaypalClientId] = useState(null);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    const getClientId = async () => {
      try {
        const { data: clientId } = await axios.get('/api/config/paypal');
        setPaypalClientId(clientId);
      } catch (error) {
        console.error("Não foi possível obter o Client ID do PayPal", error);
      }
    };

    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        getClientId();
      }
    }
  }, [dispatch, orderId, successPay, successDeliver, order]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
      <h1>Pedido {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Entrega</h2>
              {/* ▼▼▼ CORREÇÃO AQUI ▼▼▼ */}
              <p><strong>Nome: </strong> {order.user ? order.user.name : 'Usuário Deletado'}</p>
              <p><strong>Email: </strong>{order.user ? <a href={`mailto:${order.user.email}`}>{order.user.email}</a> : 'N/A'}</p>
              {/* ▲▲▲ FIM DA CORREÇÃO ▲▲▲ */}
              <p>
                <strong>Endereço: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              {order.isDelivered ? <p style={{ color: 'green' }}>Entregue em {new Date(order.deliveredAt).toLocaleString()}</p> : <p style={{ color: 'red' }}>Não Entregue</p>}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Pagamento</h2>
              <p><strong>Método: </strong>{order.paymentMethod}</p>
              {order.isPaid ? <p style={{ color: 'green' }}>Pago em {new Date(order.paidAt).toLocaleString()}</p> : <p style={{ color: 'red' }}>Não Pago</p>}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Itens do Pedido</h2>
              {order.orderItems.length === 0 ? <p>Pedido vazio</p> : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}><Image src={item.image} alt={item.name} fluid rounded /></Col>
                        <Col><Link to={`/product/${item.product}`}>{item.name}</Link></Col>
                        <Col md={4}>{item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}</Col>
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
            <ListGroup variant="flush">
              <ListGroup.Item><h2>Resumo do Pedido</h2></ListGroup.Item>
              <ListGroup.Item><Row><Col>Itens</Col><Col>${order.itemsPrice.toFixed(2)}</Col></Row></ListGroup.Item>
              <ListGroup.Item><Row><Col>Frete</Col><Col>${order.shippingPrice.toFixed(2)}</Col></Row></ListGroup.Item>
              <ListGroup.Item><Row><Col>Imposto</Col><Col>${order.taxPrice.toFixed(2)}</Col></Row></ListGroup.Item>
              <ListGroup.Item><Row><Col>Total</Col><Col>${order.totalPrice.toFixed(2)}</Col></Row></ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <p>Processando Pagamento...</p>}
                  {!paypalClientId ? <p>Carregando PayPal...</p> : (
                    <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                      <PayPalButtons
                        createOrder={(data, actions) => actions.order.create({ purchase_units: [{ amount: { value: order.totalPrice, currency_code: 'USD' } }] })}
                        onApprove={(data, actions) => actions.order.capture().then(successPaymentHandler)}
                      />
                    </PayPalScriptProvider>
                  )}
                </ListGroup.Item>
              )}

              {loadingDeliver && <p>Marcando como entregue...</p>}
              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item className="d-grid">
                  <Button type='button' onClick={deliverHandler}>
                    Marcar como Entregue
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;