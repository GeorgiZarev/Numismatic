import React from 'react';
import { Row, Col } from 'antd';
import { Link } from 'react-router-dom';

/* to be replaced with actual db content */
const categories = [
  {
    id: "aaaa",
    title: 'Country1',
    imageUrl: 'https://placehold.co/300x200?text=Country1',
  },
  {
    id: "aaab",
    title: 'Country2',
    imageUrl: 'https://placehold.co/300x200?text=Country2',
  },
  {
    id: "aabb",
    title: 'Country3',
    imageUrl: 'https://placehold.co/300x200?text=Country3',
  },
  {
    id: "abbb",
    title: 'Country4',
    imageUrl: 'https://placehold.co/300x200?text=Country4',
  },
  {
    id: "bbbb",
    title: 'Country5',
    imageUrl: 'https://placehold.co/300x200?text=Country5',
  },
  {
    id: "bbbc",
    title: 'Country6',
    imageUrl: 'https://placehold.co/300x200?text=Country6',
  },
  {
    id: "bbcc",
    title: 'Country7',
    imageUrl: 'https://placehold.co/300x200?text=Country7',
  },
  {
    id: "bccc",
    title: 'Country8',
    imageUrl: 'https://placehold.co/300x200?text=Country8',
  },
];

const CategoryGrid = () => {
  return (
    <Row gutter={[16, 16]}>
      {categories.map((cat) => (
        <Col
          key={cat.id}
          xs={24}     
          sm={8}      
          md={6}      
          lg={6}
        >
          <Link
            to={`/product/${cat.id}`}
            className="block mx-auto w-full max-w-[300px] h-[200px] relative rounded-md overflow-hidden shadow hover:shadow-md transition-shadow"
          >
            <img
              src={cat.imageUrl}
              alt={cat.title}
              className="w-full h-full object-cover opacity-70 hover:opacity-80 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-blue-600 text-base sm:text-lg font-bold text-center drop-shadow">
                {cat.title}
              </h3>
            </div>
          </Link>
        </Col>
      ))}
    </Row>
  );
};


export default CategoryGrid;
