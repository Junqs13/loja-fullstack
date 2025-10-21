// frontend/src/components/ProductCardSkeleton.js
import React from 'react';
import { Card } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';

const ProductCardSkeleton = () => {
  return (
    <Card className="my-3 p-3 rounded">
      {/* Esqueleto para a imagem do produto */}
      <Skeleton height={180} />

      <Card.Body>
        {/* Esqueleto para o título do produto */}
        <Skeleton count={2} style={{ marginBottom: '0.5rem' }}/>
        
        {/* Esqueleto para o preço */}
        <Skeleton height={24} width="50%" />
      </Card.Body>
    </Card>
  );
};

export default ProductCardSkeleton;