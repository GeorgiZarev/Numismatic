import React from "react";
import { Card, CardContent, CardMedia, Typography, Button, Box } from "@mui/material";

const SmallCoinCard = () => {
  return (
    <Card sx={{ display: "flex", alignItems: "center", padding: 2, boxShadow: 2, maxWidth: 700 }}>
      {/* Coin Image */}
    
      <CardMedia
        component="img"
        sx={{
          width: 135, 
          height: 140, 
          margin: "0 1em 0 0",  
          flexShrink: 0,  // Ensures the image does not shrink
          backgroundColor: "hsl(0, 0%, 94%)", 
          borderRadius: 1
        }}
        image="https://placehold.co/135x140" //TODO: replace the placeholder image; bg-color MUST be white or similar to the bg-color of the page;
        alt="Coin Image"
      />

      <CardMedia
        component="img"
        sx={{
          width: 135, 
          height: 140, 
          margin: "0 1em 0 0",
          flexShrink: 0,  // Ensures the image does not shrink
          backgroundColor: "hsl(0, 0%, 94%)", 
          borderRadius: 1
        }}
        image="https://placehold.co/135x140" 
        //image="https://placehold.co/135x140" //TODO: replace the placeholder image
        alt="Coin Image"
      />

      {/* Coin Details */}
      <CardContent sx={{ flex: 1 }}>
        <Box display="flex" alignItems="center">
          {/* BG Flag Image: source -> rene-crevel.com*/}
          <img src="https://rene-crevel.com/images/country-flag-16X16/Bulgaria.png" alt="Bulgarian Flag" width="20" style={{ marginRight: 8 }} />

          {/* Coin Title */}
          <Typography variant="h7" fontWeight="bold">
            5 Stotinki - Ferdinand I (1917)
          </Typography>
        </Box>

        {/* Coin Description */}
        <Typography variant="body2" color="text.secondary" 
          sx={{ 
            marginTop: 1,

          }}>
          in circulation or not <br />
          composition (metal . Weight (in g) . diameter <br />
          product number (e.g. N#1021)
        </Typography>

        {/*TODO: think what the Action Button should do*/}
        <Button
          variant="contained"
          color="warning"
          sx={{ marginTop: 2 }}
        >
          Action Button 
        </Button>
      </CardContent>
    </Card>
  );
};

export default SmallCoinCard;
