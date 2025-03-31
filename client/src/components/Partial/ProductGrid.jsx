// ProductGrid.jsx
import React from 'react';
import { Row, Col } from 'antd';
import ProductItem from './ProductItem';

const CoinProducts = [
  {
    id: "aaaaa",
    image: ["https://placehold.co/300x200"],
    name: "Coin One",
    price: "10.00",
  },
  {
    id: "aaaba",
    image: ["https://placehold.co/300x200"],
    name: "Coin Two",
    price: "15.00",
  }, 
  {
    id: "aabba",
    image: ["https://placehold.co/300x200"],
    name: "Coin One",
    price: "10.00",
  },
  {
    id: "abbba",
    image: ["https://placehold.co/300x200"],
    name: "Coin Two",
    price: "15.00",
  },
  {
    id: "bbbba",
    image: ["https://placehold.co/300x200"],
    name: "Coin One",
    price: "10.00",
  },
  {
    id: "bbbca",
    image: ["https://placehold.co/300x200"],
    name: "Coin Two",
    price: "15.00",
  }, 
  {
    id: "bbcca",
    image: ["https://placehold.co/300x200"],
    name: "Coin One",
    price: "10.00",
  },
  {
    id: "bccca",
    image: ["https://placehold.co/300x200"],
    name: "Coin Two",
    price: "15.00",
  },
];

const ProductGrid = () => {
  return (
    <Row gutter={[24, 24]}>
      {CoinProducts.map((product) => (
        <Col
          key={product.id}
          xs={24}      // 1 column 
          sm={12}      // 2 columns 
          md={8}       // 3 columns 
          lg={6}       // 4 columns 
        >
          <ProductItem
            id={product.id}
            image={product.image}
            name={product.name}
            price={product.price}
          />
        </Col>
      ))}
    </Row>
  );
};

export default ProductGrid;
