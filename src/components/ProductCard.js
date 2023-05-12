import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  const {name,cost,rating,image} = product;
  return (
    <Card className="card">
      <CardMedia
        component="img"
        alt="green iguana"
        // height="140"
        image={image}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {name}
        </Typography>
        <Typography gutterBottom variant="h6" fontWeight='bold' component="div">
          ${cost}
        </Typography>
        <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} value={rating} readOnly />
      </CardContent>
      <CardActions>
        <Button className="button" variant="contained" startIcon={<AddShoppingCartOutlined />} onClick={handleAddToCart} fullWidth>
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
