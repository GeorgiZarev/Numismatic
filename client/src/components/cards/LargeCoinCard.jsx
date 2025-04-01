import React, { useState } from 'react';
import { Layout, Button, InputNumber } from 'antd';
import { 
  ShoppingCartOutlined,
  TruckOutlined,
  UndoOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  RocketOutlined 
} from '@ant-design/icons';
import { assets } from '../../Assets/ObjFile.js';

const { Sider, Content } = Layout;

const LargeCoinCard = () => {
  const [isHovering, setIsHovering] = useState(false);

  // Style objects
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
    backgroundColor: '#f8f8f8',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    '@media (max-width: 768px)': {
      padding: '16px'
    }
  };

  const boxStyle = {
    padding: '24px',
    marginBottom: '24px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #f0f0f0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    transition: 'all 0.3s ease'
  };

  const imageBoxStyle = {
    ...boxStyle,
    padding: '0',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-4px)'
    }
  };

  const layoutStyle = {
    borderRadius: '12px',
    overflow: 'hidden',
    width: '100%',
    minHeight: '359px',
    transition: 'all 0.3s ease'
  };

  const siderStyle = {
    textAlign: 'center',
    lineHeight: '30px',
    color: '#000',
    backgroundColor: '#fff',
    padding: '24px',
    border: '1px solid #f0f0f0',
    borderRadius: '12px'
  };

  const contentStyle = {
    ...siderStyle,
    minHeight: '125px'
  };

  const addToCartStyle = {
    backgroundColor: isHovering ? '#1890ff' : '#fa8c16',
    color: '#fff',
    fontWeight: 'bold',
    height: '48px',
    fontSize: '16px',
    width: '100%',
    border: 'none',
    transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
    },
    '&:active': {
      transform: 'translateY(0)'
    }
  };

  const handleAddToCart = () => {
    console.log('Product added to cart');
  };

  return (
    <div style={containerStyle} className="product-container">
      {/* Main Title */}
      <h1 style={{ 
        marginBottom: '32px', 
        fontSize: '32px', 
        fontWeight: '700',
        color: '#1d1d1d',
        textAlign: 'center',
        position: 'relative',
        '&:after': {
          content: '""',
          display: 'block',
          width: '80px',
          height: '4px',
          background: '#fa8c16',
          margin: '16px auto 0',
          borderRadius: '2px'
        }
      }}>
        Product Details
      </h1>

      {/* Two-column layout */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '32px',
        '@media (max-width: 768px)': {
          gridTemplateColumns: '1fr'
        }
      }}>
        
        {/* Left Column - Images and Description */}
        <div>
          {/* Image Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '20px', 
            marginBottom: '32px' 
          }}>
            <div style={imageBoxStyle}>
              <img 
                src={assets}
                alt='Bomba 1' 
                style={{ 
                  width: '100%', 
                  height: '240px', 
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.03)'
                  }
                }} 
              />
            </div>
            <div style={imageBoxStyle}>
              <img 
                src={assets}
                alt='Bomba 2' 
                style={{ 
                  width: '100%', 
                  height: '240px', 
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.03)'
                  }
                }} 
              />
            </div>
          </div>

          {/* Description Box */}
          <div style={{ 
            ...boxStyle,
            padding: '28px'
          }}>
            <h2 style={{ 
              fontSize: '22px', 
              fontWeight: '600', 
              marginBottom: '16px',
              color: '#1d1d1d',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ color: '#fa8c16' }}>•</span> Front Features
            </h2>
            <p style={{ 
              marginBottom: '24px',
              lineHeight: '1.6',
              color: '#555'
            }}>
              Detailed description of front features with premium craftsmanship and attention to detail.
            </p>
            
            <h2 style={{ 
              fontSize: '22px', 
              fontWeight: '600', 
              marginBottom: '16px',
              color: '#1d1d1d',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ color: '#fa8c16' }}>•</span> Back Features
            </h2>
            <p style={{ 
              marginBottom: '24px',
              lineHeight: '1.6',
              color: '#555'
            }}>
              Detailed description of back features showcasing the intricate design elements.
            </p>
            
            <h2 style={{ 
              fontSize: '22px', 
              fontWeight: '600', 
              marginBottom: '16px',
              color: '#1d1d1d',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ color: '#fa8c16' }}>•</span> Mint Condition
            </h2>
            <p style={{ 
              lineHeight: '1.6',
              color: '#555'
            }}>
              Pristine condition with certification of authenticity and protective casing included.
            </p>
          </div>

          {/* Social Sharing */}
          <div style={{ 
            ...boxStyle,
            textAlign: 'center',
            padding: '16px'
          }}>
            <h3 style={{ 
              marginBottom: '16px',
              color: '#666',
              fontWeight: '500'
            }}>
              Share this product
            </h3>
            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <Button 
                shape="circle" 
                icon={<FacebookOutlined />} 
                style={{ 
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#4267B2',
                  color: '#fff',
                  border: 'none'
                }} 
              />
              <Button 
                shape="circle" 
                icon={<TwitterOutlined />} 
                style={{ 
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#1DA1F2',
                  color: '#fff',
                  border: 'none'
                }} 
              />
              <Button 
                shape="circle" 
                icon={<InstagramOutlined />} 
                style={{ 
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D)',
                  color: '#fff',
                  border: 'none'
                }} 
              />
            </div>
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div>
          {/* Product Title Box */}
          <div style={{ 
            ...boxStyle,
            textAlign: 'left',
            borderBottom: '2px solid #fa8c16',
            paddingBottom: '24px'
          }}>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              margin: 0,
              color: '#1d1d1d',
              lineHeight: '1.3'
            }}>
              Coin Info
            </h1>
            {/* Price Display */}
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#d46b08', 
              margin: '16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span>$129.99</span> 
              <span style={{ 
                fontSize: '16px', 
                color: '#666', 
                textDecoration: 'line-through'
              }}>
                $159.99
              </span>
              <span style={{ 
                fontSize: '14px', 
                color: '#fff',
                backgroundColor: '#389e0d',
                padding: '2px 8px',
                borderRadius: '12px'
              }}>
                20% OFF
              </span>
            </div>
          </div>

          {/* Product Details Box */}
          <div style={boxStyle}>
            <Layout style={layoutStyle}>
              <Layout>
                <Sider width="40%" style={siderStyle}>
                  <div style={{ 
                    marginBottom: '24px',
                    fontWeight: '600',
                    color: '#fa8c16'
                  }}>Country</div>
                  <div style={{ 
                    marginBottom: '24px',
                    fontWeight: '600',
                    color: '#fa8c16'
                  }}>Year</div>
                  <div style={{ 
                    fontWeight: '600',
                    color: '#fa8c16'
                  }}>Material</div>
                </Sider>
                <Content style={contentStyle}>
                  <div style={{ 
                    marginBottom: '24px',
                    fontWeight: '500'
                  }}>Bulgaria</div>
                  <div style={{ 
                    marginBottom: '24px',
                    fontWeight: '500'
                  }}>1985</div>
                  <div style={{ 
                    fontWeight: '500'
                  }}>.925 Silver</div>
                </Content>
              </Layout>
            </Layout>
          </div>

          {/* Shipping and Returns - Updated to match other boxes */}
          <div style={boxStyle}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '12px',
              gap: '12px'
            }}>
              <TruckOutlined style={{ 
                color: '#1890ff', 
                fontSize: '20px'
              }} />
              <span style={{ fontSize: '16px', color: '#333' }}>
                Free shipping on all orders over $100
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '12px'
            }}>
              <UndoOutlined style={{ 
                color: '#1890ff', 
                fontSize: '20px'
              }} />
              <span style={{ fontSize: '16px', color: '#333' }}>
                30-day hassle-free return policy
              </span>
            </div>
          </div>
            
          {/* Quantity Selector + Add to Cart */}
          <div style={boxStyle}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '24px',
              justifyContent: 'space-between'
            }}>
              <span style={{ 
                fontSize: '16px', 
                fontWeight: '500',
                color: '#1d1d1d'
              }}>Quantity:</span>
              <InputNumber 
                min={1} 
                max={10} 
                defaultValue={1} 
                style={{ width: '120px' }}
                size="large"
              />
            </div>
            <Button 
              type="primary" 
              style={addToCartStyle}
              onClick={handleAddToCart}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              icon={isHovering ? <RocketOutlined /> : <ShoppingCartOutlined />}
              size="large"
            >
              {isHovering ? 'Coming Soon!' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LargeCoinCard;