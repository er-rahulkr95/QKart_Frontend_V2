import { Search, SentimentDissatisfied} from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import ProductCard from "./ProductCard";
import Cart from "./Cart"
import Footer from "./Footer";
import Header from "./Header";
import {generateCartItemsFrom} from "./Cart"
import "./Products.css";
import CartModal from "./CartModal";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 ** @property {string} productId - Unique ID for the product

 */


const Products = () => {
  const [productData,setProductData] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [allProductData,setAllProductData] = useState([]);
 const token = localStorage.getItem("token");
 
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {

    try{
      let response = await axios.get(`${config.endpoint}/products`);
      return response.data;
    }catch(error){
      if(error.response && error.response.status === 500){
        enqueueSnackbar(error.response.data.message,{variant:"error"})
      }else{
       enqueueSnackbar("Something went wrong. Check the backend console for more details",{variant:"error"})
      }
       return [];
    }

  };



  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    let url = `${config.endpoint}/products`
    if(text!==""){
      url = `${url}/search?value=${text}`
    }
      try{
        let searchResponse = await axios.get(url)
            if(searchResponse.status === 200){
              setProductData(searchResponse.data)
            }

      }catch(error){
        if(error.response){
          if(error.response.status === 404){
            setProductData("notFound");
          }
         else{
            enqueueSnackbar(
              "Could not fetch Products. Check that the backend is running, reachable and returns valid JSON.",
              {
                variant: "error",
              }
            );
          }
        }
     
      }
   
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
    
  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      performSearch(value);
    }, 500);
    
    setDebounceTimeout(timeout);
  }

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      let cartResponse = await axios.get(`${config.endpoint}/cart`, {
                                                        headers: {
                                                          'Authorization': `Bearer ${token}`
                                                        }
                                                     });
          
          return cartResponse.data;
          
    
    }catch (e) {
      if (e.response && e.response.status === 401) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      }else if(e.response && e.response.status ===400){
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return [];
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
     let itemChecker  = items.find(cartItemObject=>cartItemObject.productId === productId)
     if(itemChecker){
      return false;
     }
     return true;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */

  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {    
          if(!token){
            enqueueSnackbar("Login to add an item to the Cart",{variant:"warning"})
            return;
          }

          if(options.preventDuplicate===false){
      
            if(!isItemInCart(items,productId)){
              enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",{variant:"warning"});
              return;
            }
          }
          try{
            let cartPostResponse = await axios.post(`${config.endpoint}/cart`,{productId:productId, qty:qty},{headers: {
                                                          'Authorization': `Bearer ${token}`}
                                                    } );
                  setCartItems(cartPostResponse.data);

          }catch(error){
            if (error.response && error.response.status===404 ) {
              enqueueSnackbar(error.response.data.message, { variant: "error" });
              
            }else if(error.response && error.response.status ===401) {
              enqueueSnackbar(error.response.data.message, { variant: "error" });
            }else {
              enqueueSnackbar(
                "Could not update cart. Check that the backend is running, reachable and returns valid JSON.",
                {
                  variant: "error",
                }
              );
            }
          }
          

  };

 

  useEffect(()=>{
    const onPageLoad = async()=>{
      const productsPageData = await performAPICall();
      const itemsInCart = await fetchCart(token);
      setProductData(productsPageData)
      setAllProductData(productsPageData)
      setCartItems(itemsInCart);
    }
    onPageLoad();
  },[])
 

  return (
    <div>
    <div className="mainContainer">

      <Header >
          {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
          <TextField
          className="search-desktop"
          size="small"
          fullWidth
          onChange={(event)=>debounceSearch(event,debounceTimeout)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
        />
     </Header>
  
      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        onChange={(event)=>debounceSearch(event,debounceTimeout)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid container>
        <Grid item md={token!==null ? 9:12} xs={12}>
          <Grid container>
            <Grid item className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                  to your door step
                </p>
              </Box>
            </Grid>
          </Grid>
        <Grid container rowSpacing={2} spacing={2} px={2} my={4}>
          {productData.length!==0 && productData!=="notFound" && productData.map(data=>(<Grid item xs={6} md={3} key={data._id}>
                <ProductCard product={data} handleAddToCart={async ()=>{await addToCart(token,cartItems,allProductData,data._id,1,{ preventDuplicate: false })}}/>   
                </Grid>)
            )
          }
       
          {
            productData.length===0 && (<div className="loading">
            <CircularProgress />
            <h3>Loading Products...</h3>
            </div>)
          }
          {
            productData==="notFound" && (<div className="loading">
            <SentimentDissatisfied/>
            <h3>No products found</h3>
            </div>)
          }
        </Grid>
       </Grid>
        {token!==null && <Grid className="cart-desktop" item xs={12} backgroundColor="#E9F5E1" md={3}>
            <Cart items={generateCartItemsFrom(cartItems,allProductData)} products={allProductData} handleQuantity={addToCart}/>
          </Grid>
        }
       </Grid>
      <Footer />
    </div>
    <div className="cart-mobile">
    <CartModal items={cartItems ? generateCartItemsFrom(cartItems,allProductData):[]} products={allProductData} handleQuantity={addToCart}/>
    </div>
    </div>
  );
};

export default Products;
