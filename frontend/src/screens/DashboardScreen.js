// frontend/src/screens/DashboardScreen.js

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Table, Button, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    LineElement,
    PointElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getOrderSummary } from '../actions/orderActions';
import { useTranslation } from 'react-i18next';
import { BASE_URL, PRODUCTS_URL, ORDERS_URL } from '../constants/apiConstants.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const DashboardScreen = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [exportLoading, setExportLoading] = useState(false);
    const [exportError, setExportError] = useState(null);

    const [lowStock, setLowStock] = useState({ loading: true, error: null, products: [] });
    const [pendingOrders, setPendingOrders] = useState({ loading: true, error: null, orders: [] });

    const orderSummary = useSelector((state) => state.orderSummary);
    const { loading, error, summary } = orderSummary;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        dispatch(getOrderSummary());
    }, [dispatch]);

    useEffect(() => {
        const fetchOperationalData = async () => {
            if (!userInfo) return;

            const config = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };

            try {
                const { data } = await axios.get(`${BASE_URL}${PRODUCTS_URL}/stock/low`, config);
                setLowStock({ loading: false, products: data, error: null });
            } catch (err) {
                const message = err.response && err.response.data.message ? err.response.data.message : err.message;
                setLowStock({ loading: false, products: [], error: message });
            }

            try {
                const { data } = await axios.get(`${BASE_URL}${ORDERS_URL}/pending`, config);
                setPendingOrders({ loading: false, orders: data, error: null });
            } catch (err) {
                const message = err.response && err.response.data.message ? err.response.data.message : err.message;
                setPendingOrders({ loading: false, orders: [], error: message });
            }
        };

        fetchOperationalData();

    }, [userInfo]);

    const exportHandler = async () => {
        setExportLoading(true);
        setExportError(null);

        const params = {};
        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            params.startDate = start.toISOString();
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            params.endDate = end.toISOString();
        }

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        try {
            const { data } = await axios.get(`${BASE_URL}${ORDERS_URL}/export`, { ...config, params });
            const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const dateStr = new Date().toISOString().split('T')[0];
            link.setAttribute('download', `relatorio_pedidos_${dateStr}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            setExportLoading(false);
        } catch (err) {
            const message = err.response && err.response.data.message
                ? err.response.data.message
                : err.message;
            setExportError(message);
            setExportLoading(false);
        }
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: t('dashboard.title', 'Dashboard'),
            },
        },
    };

    const kpis = {
        totalSales: summary?.ordersSummary?.totalSales || 0,
        numOrders: summary?.ordersSummary?.numOrders || 0,
        numUsers: summary?.numUsers || 0,
        numProducts: summary?.numProducts || 0,
        aov: (summary?.ordersSummary?.totalSales || 0) / (summary?.ordersSummary?.numOrders || 1)
    };

    const salesOverTimeData = {
        labels: summary?.salesOverTime?.map((s) => s._id) || [],
        datasets: [
            {
                label: t('dashboard.dailySalesChartLabel', 'Vendas Diárias (R$)'),
                data: summary?.salesOverTime?.map((s) => s.dailySales) || [],
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    const topProductsData = {
        labels: summary?.topSellingProducts?.map((p) => p.name) || [],
        datasets: [
            {
                label: t('dashboard.quantitySoldChartLabel', 'Quantidade Vendida'),
                data: summary?.topSellingProducts?.map((p) => p.totalQuantitySold) || [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
            },
        ],
    };

    const categorySalesData = {
        labels: summary?.salesByCategory?.map((cat) => cat._id) || [],
        datasets: [
            {
                label: t('dashboard.salesByCategoryChartLabel', 'Vendas por Categoria'),
                data: summary?.salesByCategory?.map((cat) => cat.totalSales) || [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                ],
                hoverOffset: 4,
            },
        ],
    };

    return (
        <>
            <h1>{t('dashboard.title', 'Dashboard')}</h1>

            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                summary ? (
                    <>
                        {/* LINHA 0: EXPORTAÇÃO */}
                        <Row>
                            <Col>
                                <Card
                                    className="my-3 p-3"
                                    style={{ zIndex: 10, position: 'relative' }}
                                >
                                    <Card.Title>{t('dashboard.reports', 'Gerar Relatórios')}</Card.Title>
                                    <Card.Text>
                                        {t('dashboard.reportsDesc', 'Selecione um intervalo de datas para exportar...')}
                                    </Card.Text>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group controlId="startDate">
                                                <Form.Label>{t('dashboard.startDate', 'Data Inicial')}</Form.Label>
                                                <DatePicker
                                                    selected={startDate}
                                                    onChange={(date) => setStartDate(date)}
                                                    selectsStart
                                                    startDate={startDate}
                                                    endDate={endDate}
                                                    dateFormat="dd/MM/yyyy"
                                                    className="form-control"
                                                    isClearable
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                             <Form.Group controlId="endDate">
                                                <Form.Label>{t('dashboard.endDate', 'Data Final')}</Form.Label>
                                                <DatePicker
                                                    selected={endDate}
                                                    onChange={(date) => setEndDate(date)}
                                                    selectsEnd
                                                    startDate={startDate}
                                                    endDate={endDate}
                                                    minDate={startDate}
                                                    dateFormat="dd/MM/yyyy"
                                                    className="form-control"
                                                    isClearable
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4} className="d-flex align-items-end">
                                            <Button
                                                onClick={exportHandler}
                                                disabled={exportLoading}
                                                className="w-100"
                                            >
                                                {exportLoading ? t('loading', 'A carregar...') : t('dashboard.export', 'Exportar CSV')}
                                            </Button>
                                        </Col>
                                    </Row>
                                    {exportError && <Message variant="danger" className="mt-3">{exportError}</Message>}
                                </Card>
                            </Col>
                        </Row>

                        {/* LINHA 1: KPIs */}
                        <Row>
                            <Col lg={2} md={4} sm={6}>
                                <Card bg="success" text="white" className="my-3">
                                    <Card.Body>
                                        <Card.Title>{t('dashboard.totalSales', 'Total de Vendas')}</Card.Title>
                                        <Card.Text as="h4">
                                            R$ {kpis.totalSales.toFixed(2)}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={2} md={4} sm={6}>
                                <Card bg="primary" text="white" className="my-3">
                                    <Card.Body>
                                        <Card.Title>{t('dashboard.aov', 'Ticket Médio')}</Card.Title>
                                        <Card.Text as="h4">
                                            R$ {kpis.aov.toFixed(2)}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={2} md={4} sm={6}>
                                <Card bg="info" text="white" className="my-3">
                                    <Card.Body>
                                        <Card.Title>{t('dashboard.totalOrders', 'Total de Pedidos')}</Card.Title>
                                        <Card.Text as="h4">{kpis.numOrders}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={3} md={6} sm={6}>
                                <Card bg="warning" text="dark" className="my-3">
                                    <Card.Body>
                                        <Card.Title>{t('dashboard.totalCustomers', 'Total de Clientes')}</Card.Title>
                                        <Card.Text as="h4">{kpis.numUsers}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={3} md={6} sm={6}>
                                <Card bg="danger" text="white" className="my-3">
                                    <Card.Body>
                                        <Card.Title>{t('dashboard.totalProducts', 'Total de Produtos')}</Card.Title>
                                        <Card.Text as="h4">{kpis.numProducts}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* LINHA: RELATÓRIOS OPERACIONAIS */}
                        <Row>
                            {/* RELATÓRIO DE PEDIDOS PENDENTES */}
                            <Col md={6}>
                                <Card className="my-3 p-3">
                                    <Card.Title>{t('pendingOrders.title', 'Pedidos Pendentes de Envio')}</Card.Title>
                                    <Card.Text>{t('pendingOrders.desc', 'Pedidos pagos aguardando envio.')}</Card.Text>

                                    {pendingOrders.loading ? <Loader /> : pendingOrders.error ? <Message variant='danger'>{pendingOrders.error}</Message> : (
                                        <Table striped bordered hover responsive size="sm">
                                            <thead>
                                                <tr>
                                                    <th>{t('pendingOrders.orderId', 'Pedido ID')}</th>
                                                    <th>{t('pendingOrders.customer', 'Cliente')}</th>
                                                    <th>{t('pendingOrders.date', 'Data Pagto.')}</th>
                                                    <th>{t('pendingOrders.total', 'Total')}</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Array.isArray(pendingOrders.orders) && pendingOrders.orders.length > 0 ? (
                                                    pendingOrders.orders.map((order) => (
                                                        <tr key={order._id}>
                                                            <td>{order._id}</td>
                                                            <td>{order.user ? order.user.name : 'Utilizador Removido'}</td>
                                                            {/* --- CORREÇÃO AQUI --- */}
                                                            <td>{order.paidAt ? order.paidAt.substring(0, 10) : 'N/A'}</td>
                                                            {/* -------------------- */}
                                                            <td>R$ {order.totalPrice.toFixed(2)}</td>
                                                            <td>
                                                                <LinkContainer to={`/admin/order/${order._id}`}>
                                                                    <Button variant="light" size="sm">
                                                                        {t('pendingOrders.details', 'Detalhes')}
                                                                    </Button>
                                                                </LinkContainer>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="text-center">
                                                            {t('pendingOrders.noPending', 'Nenhum pedido pendente.')}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    )}
                                </Card>
                            </Col>

                            {/* RELATÓRIO DE STOCK BAIXO */}
                            <Col md={6}>
                                <Card className="my-3 p-3">
                                    <Card.Title>{t('stockReport.title', 'Relatório de Stock Baixo')}</Card.Title>
                                    <Card.Text>{t('stockReport.desc', 'Produtos que precisam de reposição...')}</Card.Text>

                                    {lowStock.loading ? <Loader /> : lowStock.error ? <Message variant='danger'>{lowStock.error}</Message> : (
                                        <Table striped bordered hover responsive size="sm">
                                            <thead>
                                                <tr>
                                                    <th>{t('stockReport.product', 'Produto')}</th>
                                                    <th>{t('stockReport.category', 'Categoria')}</th>
                                                    <th>{t('stockReport.stock', 'Stock Atual')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Array.isArray(lowStock.products) && lowStock.products.length > 0 ? (
                                                    lowStock.products.map((product) => (
                                                        <tr key={product._id}>
                                                            <td>
                                                                <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                                                    <Button variant="light" size="sm" className="w-100 text-start">
                                                                        {/* Adiciona verificação para name e category (caso sejam multilíngues) */}
                                                                        {product.name?.pt || product.name || 'Nome Indisponível'}
                                                                    </Button>
                                                                </LinkContainer>
                                                            </td>
                                                            <td>{product.category?.pt || product.category || 'Categoria Indisponível'}</td>
                                                            <td>
                                                                <strong style={{ color: 'red' }}>{product.countInStock}</strong>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="3" className="text-center">
                                                            {t('stockReport.noStock', 'Nenhum produto com stock baixo.')}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    )}
                                </Card>
                            </Col>
                        </Row>

                        {/* LINHA: Gráfico Vendas */}
                        <Row>
                            <Col>
                                <Card className="my-3 p-3">
                                    <Card.Title>{t('dashboard.salesOverTime', 'Vendas ao Longo do Tempo')}</Card.Title>
                                    <Line options={{...options, plugins: {...options.plugins, title: { display: true, text: t('dashboard.dailySales', 'Vendas Diárias')}}}} data={salesOverTimeData} />
                                </Card>
                            </Col>
                        </Row>

                        {/* LINHA: Gráficos Produto e Categoria */}
                        <Row>
                             <Col md={8}>
                                <Card className="my-3 p-3">
                                    <Card.Title>{t('dashboard.topProducts', 'Top 5 Produtos Mais Vendidos')}</Card.Title>
                                    <Bar options={{...options, plugins: {...options.plugins, title: { display: true, text: t('dashboard.quantitySold', 'Quantidade Vendida')}}}} data={topProductsData} />
                                 </Card>
                            </Col>
                            <Col md={4}>
                                <Card className="my-3 p-3">
                                    <Card.Title>{t('dashboard.salesByCategory', 'Vendas por Categoria')}</Card.Title>
                                    <Doughnut options={{...options, plugins: {...options.plugins, title: { display: true, text: t('dashboard.revenueShare', 'Receita por Categoria')}}}} data={categorySalesData} />
                                </Card>
                            </Col>
                        </Row>

                        {/* LINHA: Top Clientes */}
                        <Row>
                            <Col>
                                <Card className="my-3 p-3">
                                    <Card.Title>{t('dashboard.topCustomers', 'Top 5 Clientes')}</Card.Title>
                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>{t('table.name', 'Nome')}</th>
                                                <th>{t('table.email', 'Email')}</th>
                                                <th>{t('dashboard.totalOrders', 'Nº Pedidos')}</th>
                                                <th>{t('dashboard.totalSpent', 'Total Gasto (R$)')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(summary?.topCustomers) && summary.topCustomers.length > 0 ? (
                                                summary.topCustomers.map((customer, index) => (
                                                    <tr key={index}>
                                                        <td>{customer.name}</td>
                                                        <td>{customer.email}</td>
                                                        <td>{customer.totalOrders}</td>
                                                        <td>R$ {customer.totalSpent.toFixed(2)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center">
                                                        {t('dashboard.noCustomers', 'Nenhum cliente encontrado')}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </Card>
                            </Col>
                        </Row>
                    </>
                ) : <Message variant='info'>{t('dashboard.noData', 'Não há dados de resumo disponíveis.')}</Message>
            )}
        </>
    );
};

export default DashboardScreen;