import React from "react";
import { Card, CardContent, CardMedia, Typography, Button, Box } from "@mui/material"; //Material UI components

const SmallCoinCard = ({ image, title, year, description, flag, onAddToCart }) => {
  return (
    <Card sx={{ display: "flex", alignItems: "center", padding: 2, boxShadow: 2 }}>
      {/* Coin Image */}
      <CardMedia
        component="img"
        sx={{ width: 100, height: 100, marginRight: 2, backgroundColor: "#f0f0f0" }}
        image={image || "https://via.placeholder.com/100"} //Placeholder img
        alt={title}
      />

      {/* Coin Details */}
      <CardContent sx={{ flex: 1 }}>
        <Box display="flex" alignItems="center">
          {flag && <img src={flag} alt="flag" width="20" style={{ marginRight: 8 }} />}
          <Typography variant="h6" fontWeight="bold">
            {title} - {year}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography> /*Coin Description (Typography === Text)*/

        {/* Add to Cart Button */}
        <Button
          variant="contained"
          color="warning"
          sx={{ marginTop: 1 }}
          onClick={onAddToCart} //TODO: Add to Cart function (implement logic in the app.js)
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

/* code for the app.js file:

const CoinListing = () => {
  const handleAddToCart = () => {
    alert("Coin added to cart!");
  }; //TODO: Implement add to cart logic

return (
    <div>
      <h2>Coin Listings</h2>
      <CoinCard
        title="5 Stotinki - Ferdinand I"
        year="1917"
        description="In circulation or not. Composition: Metal. Weight (in g). Diameter. Product Number (e.g. N#1021)."
        flag="https://flagcdn.com/w40/bg.png" // Example Bulgarian flag
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default CoinListing; //Export the CoinListing component
*/ 

export default SmallCoinCard;