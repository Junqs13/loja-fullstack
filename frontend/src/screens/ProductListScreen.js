// frontend/src/screens/ProductListScreen.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import Message from '../components/Message';
import Loader from '../components/Loader';
import { listProducts, deleteProduct, createProduct } from '../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';

const ProductListScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const productList = useSelector(state => state.productList);
    const { loading, error, products: productListProducts } = productList;

    const productDelete = useSelector(state => state.productDelete);
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete;

    const productCreate = useSelector(state => state.productCreate);
    const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        dispatch({ type: PRODUCT_CREATE_RESET });

        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login');
            return;
        }

        if (successCreate && createdProduct) {
            navigate(`/admin/product/${createdProduct._id}/edit`);
        } else {
            dispatch(listProducts(''));
        }

        if (successDelete) {
            toast.success(t('productlist.deleteSuccess', 'Produto deletado com sucesso!'));
        }
        if (errorDelete) {
            toast.error(t('productlist.deleteError', 'Erro ao deletar produto:') + ` ${errorDelete}`);
        }
        if (errorCreate) {
             toast.error(t('productlist.createError', 'Erro ao criar produto:') + ` ${errorCreate}`);
        }

    }, [dispatch, navigate, userInfo, successDelete, successCreate, errorDelete, errorCreate, t, createdProduct]); // Adicionado createdProduct aqui, pois é usado no if

    const deleteHandler = (id) => {
        if (window.confirm(t('productlist.deleteConfirm', 'Tem certeza que deseja deletar este produto?'))) {
            dispatch(deleteProduct(id));
        }
    };

    const createProductHandler = () => {
        dispatch(createProduct());
    };

    return (
        <>
            <Row className='align-items-center'>
                <Col>
                    <h1>{t('productlist.title', 'Produtos')}</h1>
                </Col>
                <Col className='text-end'>
                    <Button className='my-3' onClick={createProductHandler} disabled={loadingCreate}>
                        <i className='fas fa-plus'></i>{' '}
                        {loadingCreate ? t('loading', 'Criando...') : t('productlist.createButton', 'Criar Produto')}
                    </Button>
                </Col>
            </Row>

            {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
            {loadingCreate && <Loader />}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}

            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>{t('table.id', 'ID')}</th>
                            <th>{t('table.name', 'NOME')}</th>
                            <th>{t('productlist.price', 'PREÇO')}</th>
                            <th>{t('productlist.category', 'CATEGORIA')}</th>
                            <th>{t('productlist.brand', 'MARCA')}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* --- CORREÇÃO AQUI (removido espaço em => ) --- */}
                        {Array.isArray(productListProducts?.products) && productListProducts.products.map(product => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>R$ {product.price?.toFixed(2)}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                        <Button variant='light' className='btn-sm mx-1' title={t('productlist.editButton', 'Editar')}>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button
                                        variant='danger'
                                        className='btn-sm mx-1'
                                        onClick={() => deleteHandler(product._id)}
                                        disabled={loadingDelete}
                                        title={t('productlist.deleteButton', 'Deletar')}
                                    >
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {/* --- FIM DA CORREÇÃO --- */}

                        {(!Array.isArray(productListProducts?.products) || productListProducts.products.length === 0) && (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    {t('productlist.noProducts', 'Nenhum produto encontrado.')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}
            {/* Adicionar Paginação aqui se necessário */}
        </>
    );
};

export default ProductListScreen;