import React from 'react';
import { Row, Col } from 'antd';
//import CatalogGrid from './CatalogGrid';

const GridForHeader = () => {
  return (
    <>
    <Row gutter={[24, 0]} /* 24px horizontal gutter, no extra vertical gutter */>
      {[...Array(4)].map((_, colIndex) => (
        <Col span={6} key={colIndex}>
          <div className="flex flex-col space-y-4">
            {/* ... creates an array of length 3 --> [undefined, undefined, undefined] */}
            {[...Array(3)].map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="bg-blue-500 text-white p-4 text-center rounded shadow">
                Column
              </div>
            ))}
          </div>
        </Col>
      ))}
    </Row>
    </>
  );
};

export default GridForHeader;
