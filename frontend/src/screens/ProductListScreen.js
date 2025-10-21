import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts, deleteProduct, createProduct } from '../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';

const ProductListScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const productList = useSelector(state => state.productList);
    const { loading, error, products } = productList;

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
        }

        if (successCreate) {
            navigate(`/admin/product/${createdProduct._id}/edit`);
        } else {
            dispatch(listProducts());
        }
    }, [dispatch, navigate, userInfo, successDelete, successCreate, createdProduct]);

    const deleteHandler = (id) => {
        if (window.confirm('Tem certeza que deseja deletar este produto?')) {
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
                    <h1>Produtos</h1>
                </Col>
                <Col className='text-end'>
                    <Button className='my-3' onClick={createProductHandler}>
                        <i className='fas fa-plus'></i> Criar Produto
                    </Button>
                </Col>
            </Row>

            {loadingDelete && <p>Deletando...</p>}
            {errorDelete && <p style={{color: 'red'}}>{errorDelete}</p>}
            {loadingCreate && <p>Criando...</p>}
            {errorCreate && <p style={{color: 'red'}}>{errorCreate}</p>}

            {loading ? <p>Carregando produtos...</p> : error ? <p style={{color: 'red'}}>{error}</p> : (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NOME</th>
                            <th>PREÇO</th>
                            <th>CATEGORIA</th>
                            <th>MARCA</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                        <Button variant='light' className='btn-sm'><i className='fas fa-edit'></i></Button>
                                    </LinkContainer>
                                    <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
};

export default ProductListScreen;