import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  let cartItemsAllDetail = [];
  if(cartData.length===0){
    return cartItemsAllDetail;
  }
  for(let cartItem of cartData){
    for(let productItem of productsData){
      if(cartItem.productId === productItem._id){
        let mergeData = {...productItem, ...cartItem}
        cartItemsAllDetail.push(mergeData);
      }
    }
  }
  return cartItemsAllDetail
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let totalSum = 0;
  for(let cartItem of items){
    totalSum = totalSum + cartItem.cost*cartItem.qty;
  }
  return totalSum;
  // return items.reduce((accumulator,current)=>{return (accumulator.qty*accumulator.cost)+(current.qty*current.cost)},0)
  
};


/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
  isReadOnly
}) => {
  return (
    <Stack direction="row" alignItems="center">
      {!isReadOnly && (<IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>)}
      <Box padding="0.5rem" data-testid="item-qty">
        {isReadOnly ? `Qty: ${value}`:value}
      </Box>
      {!isReadOnly && (<IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>)}
    </Stack>
  );
};

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const Cart = ({
  products,
  items = [],
  handleQuantity,
  isReadOnly, 
  modalDisplay
}) => {
        const history = useHistory();
        const handleForAdding = async (quantity,productId)=>{
          let qty = quantity + 1;
          await handleQuantity(localStorage.getItem("token"),items,products,productId,qty, { preventDuplicate: true })
        }
        const handleForDelete = async(quantity,productId)=>{
          let qty = quantity - 1;
          await handleQuantity(localStorage.getItem("token"),items,products,productId,qty, { preventDuplicate: true })
        }
  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        {items.map((cartProductItem)=>
              <Box display="flex" alignItems="flex-start" padding="1rem" key={cartProductItem.productId}>
                  <Box className="image-container">
                      <img
                          // Add product image
                          src={cartProductItem.image}
                          // Add product name as alt eext
                          alt={cartProductItem.name}
                          width="100%"
                          height="100%"
                      />
                  </Box>
                  <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      height="6rem"
                      paddingX="1rem"
                  >
                      <div>{cartProductItem.name}</div>
                      <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                      >
                      <ItemQuantity
                              value={cartProductItem.qty} handleAdd={async ()=> await handleForAdding(cartProductItem.qty,cartProductItem.productId)}
                              handleDelete={async()=> await handleForDelete(cartProductItem.qty,cartProductItem.productId)}
                              isReadOnly={isReadOnly ? true:false} 
                      />
                      <Box padding="0.5rem" fontWeight="700">
                          ${cartProductItem.cost}
                      </Box>
                      </Box>
                  </Box>
              </Box>
        )}
        {!modalDisplay && (<Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>)}

        {!isReadOnly && !modalDisplay && (<Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            onClick={()=>history.push("/checkout",{from:"Cart"})}
            startIcon={<ShoppingCart />}
            className="checkout-btn"
          >
            Checkout
          </Button>
        </Box>)}
      </Box>
    </>
  );
};

export default Cart;
