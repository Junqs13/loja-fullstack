import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ProductCarousel from '../components/ProductCarousel';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import { listProducts } from '../actions/productActions';

const HomeScreen = () => {
  const { keyword } = useParams();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listProducts(keyword || ''));
  }, [dispatch, keyword, i18n.language]);

  return (
    <>
      {!keyword && <ProductCarousel />}

      <h1 className="mt-4">{t('latestProducts')}</h1>
      
      {loading ? (
        <Row>
          {[...Array(8).keys()].map((i) => (
            // ▼▼▼ A CORREÇÃO ESTÁ AQUI ▼▼▼
            <Col key={i} sm={12} md={6} lg={4} xl={3} data-testid="product-card-skeleton">
              <ProductCardSkeleton />
            </Col>
            // ▲▲▲ FIM DA CORREÇÃO ▲▲▲
          ))}
        </Row>
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          {Array.isArray(products) && products.length === 0 && keyword && (
            <Message variant='info'>{t('emptySearch')} "{keyword}"</Message>
          )}
          <Row>
            {Array.isArray(products) && products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;