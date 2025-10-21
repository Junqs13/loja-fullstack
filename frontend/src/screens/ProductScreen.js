import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listProductDetails, createProductReview } from '../actions/productActions';
import { addToCart } from '../actions/cartActions';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    loading: loadingProductReview,
    success: successProductReview,
    error: errorProductReview,
  } = productReviewCreate;

  useEffect(() => {
    if (successProductReview) {
      toast.success('Avaliação submetida com sucesso!');
      setRating(0);
      setComment('');
    }
    if (!product._id || product._id !== id || successProductReview) {
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
      dispatch(listProductDetails(id));
    }
  }, [dispatch, id, successProductReview, i18n.language]);

  const addToCartHandler = () => {
    dispatch(addToCart(id, qty));
    navigate('/cart');
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReview(id, { rating, comment }));
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        {t('goBack')}
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        product && (
          <>
            <Row>
              <Col md={6}>
                <Image src={product.image} alt={product.name} fluid />
              </Col>
              <Col md={3}>
                <ListGroup variant="flush">
                  <ListGroup.Item><h3>{product.name}</h3></ListGroup.Item>
                  <ListGroup.Item><Rating value={product.rating} text={` ${product.numReviews} avaliações`} /></ListGroup.Item>
                  <ListGroup.Item>{t('price')}: ${product.price}</ListGroup.Item>
                  <ListGroup.Item>{t('description')}: {product.description}</ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={3}>
                <Card>
                  <ListGroup variant="flush">
                    <ListGroup.Item><Row><Col>{t('price')}:</Col><Col><strong>${product.price}</strong></Col></Row></ListGroup.Item>
                    <ListGroup.Item><Row><Col>{t('status')}:</Col><Col>{product.countInStock > 0 ? t('inStock') : t('outOfStock')}</Col></Row></ListGroup.Item>
                    {product.countInStock > 0 && (
                      <ListGroup.Item>
                        <Row>
                          <Col>{t('quantity')}:</Col>
                          <Col>
                            <Form.Control as="select" value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                              {[...Array(product.countInStock).keys()].map((x) => (
                                <option key={x + 1} value={x + 1}>{x + 1}</option>
                              ))}
                            </Form.Control>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    )}
                    <ListGroup.Item className="d-grid">
                      <Button onClick={addToCartHandler} type="button" disabled={product.countInStock === 0}>{t('addToCart')}</Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Row>
            <Row className="my-4">
              <Col md={6}>
                <h2>Avaliações</h2>
                {/* ▼▼▼ CORREÇÃO AQUI ▼▼▼ */}
                {product.reviews && product.reviews.length === 0 && <Message>Sem avaliações</Message>}
                <ListGroup variant='flush'>
                  {product.reviews && product.reviews.map(review => (
                    <ListGroup.Item key={review._id}>
                      <strong>{review.name}</strong>
                      <Rating value={review.rating} />
                      <p>{new Date(review.createdAt).toLocaleDateString()}</p>
                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))}
                  {/* ▲▲▲ FIM DA CORREÇÃO ▲▲▲ */}
                  <ListGroup.Item>
                    <h2>Escreva uma Avaliação</h2>
                    {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}
                    {userInfo ? (
                      <Form onSubmit={submitHandler}>
                        <Form.Group controlId='rating' className="my-2">
                          <Form.Label>Nota</Form.Label>
                          <Form.Control as='select' value={rating} onChange={(e) => setRating(e.target.value)}>
                            <option value=''>Selecione...</option>
                            <option value='1'>1 - Péssimo</option>
                            <option value='2'>2 - Ruim</option>
                            <option value='3'>3 - Bom</option>
                            <option value='4'>4 - Muito Bom</option>
                            <option value='5'>5 - Excelente</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='comment' className="my-2">
                          <Form.Label>Comentário</Form.Label>
                          <Form.Control as='textarea' rows='3' value={comment} onChange={(e) => setComment(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Button type='submit' variant='primary' className='my-3' disabled={loadingProductReview}>Submeter</Button>
                      </Form>
                    ) : (
                      <Message>Por favor, <Link to='/login'>faça login</Link> para escrever uma avaliação.</Message>
                    )}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </>
        )
      )}
    </>
  );
};

export default ProductScreen;