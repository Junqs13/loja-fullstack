// frontend/src/screens/OrderListScreen.js
import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listOrders } from '../actions/orderActions';
import { useNavigate } from 'react-router-dom';

const OrderListScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const orderList = useSelector(state => state.orderList);
    const { loading, error, orders } = orderList;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listOrders());
        } else {
            navigate('/login');
        }
    }, [dispatch, navigate, userInfo]);

    return (
        <>
            <h1>Pedidos</h1>
            {loading ? <p>Carregando...</p> : error ? <p style={{color: 'red'}}>{error}</p> : (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>USUÁRIO</th>
                            <th>DATA</th>
                            <th>TOTAL</th>
                            <th>PAGO</th>
                            <th>ENTREGUE</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user && order.user.name}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>${order.totalPrice.toFixed(2)}</td>
                                <td>{order.isPaid ? (new Date(order.paidAt).toLocaleDateString()) : <i className='fas fa-times' style={{color: 'red'}}></i>}</td>
                                <td>{order.isDelivered ? (new Date(order.deliveredAt).toLocaleDateString()) : <i className='fas fa-times' style={{color: 'red'}}></i>}</td>
                                <td>
                                    <LinkContainer to={`/order/${order._id}`}>
                                        <Button variant='light' className='btn-sm'>Detalhes</Button>
                                    </LinkContainer>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
}

export default OrderListScreen;