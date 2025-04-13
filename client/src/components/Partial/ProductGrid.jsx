import React, { useEffect } from "react";
import { Row, Col } from "antd";
import ProductItem from "./ProductItem";
import { useCoins } from "../../hooks/useCoins";

const ProductGrid = () => {
  const { coins, loading, error, fetchCoins } = useCoins();

  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  if (loading) return <p>Loading coins...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!coins || coins.length === 0) return <p>No coins found.</p>;

  return (
    <Row gutter={[24, 24]}>
      {coins.slice(0, 8).map((coin) => (
        <Col key={coin.id} xs={24} sm={12} md={8} lg={6}>
          <ProductItem
            id={coin.id}
            image={coin.photo_url}
            name={coin.name}
            price={coin.price}
          />
        </Col>
      ))}
    </Row>
  );
};

export default ProductGrid;
