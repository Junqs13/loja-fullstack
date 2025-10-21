import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Tab, Nav } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listProductDetails, updateProduct } from '../actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProductEditScreen = () => {
    const { id: productId } = useParams();
    
    // Estados para os campos não traduzíveis
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [countInStock, setCountInStock] = useState(0);

    // Estados para os campos traduzíveis (objetos)
    const [name, setName] = useState({ pt: '', en: '' });
    const [brand, setBrand] = useState({ pt: '', en: '' });
    const [category, setCategory] = useState({ pt: '', en: '' });
    const [description, setDescription] = useState({ pt: '', en: '' });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails;
    
    const productUpdate = useSelector((state) => state.productUpdate);
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate;

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET });
            navigate('/admin/productlist');
        } else {
            if (!product || !product.name || product._id !== productId) {
                dispatch(listProductDetails(productId, true));
            } else {
                // Usar fallbacks para garantir que não estamos a definir estados como undefined
                setName(product.name || { pt: '', en: '' });
                setPrice(product.price || 0);
                setImage(product.image || '');
                setBrand(product.brand || { pt: '', en: '' });
                setCategory(product.category || { pt: '', en: '' });
                setCountInStock(product.countInStock || 0);
                setDescription(product.description || { pt: '', en: '' });
            }
        }
    }, [dispatch, navigate, productId, product, successUpdate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateProduct({
            _id: productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description,
        }));
    };

    const handleTranslateChange = (e, lang, setState) => {
        setState(prevState => ({
            ...prevState,
            [lang]: e.target.value
        }));
    };

    return (
        <Container style={{ maxWidth: '800px' }}>
            <Link to='/admin/productlist' className='btn btn-light my-3'>
                Voltar
            </Link>
            <h1>Editar Produto</h1>
            {loadingUpdate && <Loader />}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='price' className='my-3'>
                        <Form.Label>Preço</Form.Label>
                        <Form.Control type='number' placeholder='Digite o preço' value={price} onChange={(e) => setPrice(e.target.value)}></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='image' className='my-3'>
                        <Form.Label>Imagem</Form.Label>
                        <Form.Control type='text' placeholder='Digite o caminho da imagem' value={image} onChange={(e) => setImage(e.target.value)}></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='countInStock' className='my-3'>
                        <Form.Label>Quantidade em Estoque</Form.Label>
                        <Form.Control type='number' placeholder='Digite a quantidade' value={countInStock} onChange={(e) => setCountInStock(e.target.value)}></Form.Control>
                    </Form.Group>
                    
                    <hr />

                    <Tab.Container defaultActiveKey="pt">
                        <Nav variant="pills" className="mb-3">
                            <Nav.Item><Nav.Link eventKey="pt">Português</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="en">Inglês</Nav.Link></Nav.Item>
                        </Nav>
                        <Tab.Content>
                            <Tab.Pane eventKey="pt">
                                <Form.Group controlId='name_pt' className="mb-3"><Form.Label>Nome (PT)</Form.Label><Form.Control type='text' value={name.pt || ''} onChange={(e) => handleTranslateChange(e, 'pt', setName)}></Form.Control></Form.Group>
                                <Form.Group controlId='brand_pt' className="mb-3"><Form.Label>Marca (PT)</Form.Label><Form.Control type='text' value={brand.pt || ''} onChange={(e) => handleTranslateChange(e, 'pt', setBrand)}></Form.Control></Form.Group>
                                <Form.Group controlId='category_pt' className="mb-3"><Form.Label>Categoria (PT)</Form.Label><Form.Control type='text' value={category.pt || ''} onChange={(e) => handleTranslateChange(e, 'pt', setCategory)}></Form.Control></Form.Group>
                                <Form.Group controlId='description_pt' className="mb-3"><Form.Label>Descrição (PT)</Form.Label><Form.Control as='textarea' rows={3} value={description.pt || ''} onChange={(e) => handleTranslateChange(e, 'pt', setDescription)}></Form.Control></Form.Group>
                            </Tab.Pane>
                            <Tab.Pane eventKey="en">
                                <Form.Group controlId='name_en' className="mb-3"><Form.Label>Nome (EN)</Form.Label><Form.Control type='text' value={name.en || ''} onChange={(e) => handleTranslateChange(e, 'en', setName)}></Form.Control></Form.Group>
                                <Form.Group controlId='brand_en' className="mb-3"><Form.Label>Marca (EN)</Form.Label><Form.Control type='text' value={brand.en || ''} onChange={(e) => handleTranslateChange(e, 'en', setBrand)}></Form.Control></Form.Group>
                                <Form.Group controlId='category_en' className="mb-3"><Form.Label>Categoria (EN)</Form.Label><Form.Control type='text' value={category.en || ''} onChange={(e) => handleTranslateChange(e, 'en', setCategory)}></Form.Control></Form.Group>
                                <Form.Group controlId='description_en' className="mb-3"><Form.Label>Descrição (EN)</Form.Label><Form.Control as='textarea' rows={3} value={description.en || ''} onChange={(e) => handleTranslateChange(e, 'en', setDescription)}></Form.Control></Form.Group>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>

                    <Button type='submit' variant='primary' className='my-3'>
                        Atualizar
                    </Button>
                </Form>
            )}
        </Container>
    );
};

export default ProductEditScreen;