import { ShoppingCart } from "@mui/icons-material";
import KeyIcon from "@mui/icons-material/Key";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState, useRef } from "react";
import Cart from "./Cart";
import { getTotalCartValue } from "./Cart";
import "./Products.css";
import { useHistory } from "react-router-dom";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import "./CartModal.css";

export default function CartModal({ products, items = [], handleQuantity }) {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  let modalRef = useRef();
  const token = localStorage.getItem("token");
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const modalToggler = () => {
    if (open) {
      document.body.style.overflow = "unset";
      setOpen(false);
    } else {
      document.body.style.overflow = "hidden";
      setOpen(true);
    }
  };

  useEffect(() => {
    let clickOutsideHandler = (event) => {

      if (!modalRef.current.contains(event.target)) {
        document.body.style.overflow = "unset";
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", clickOutsideHandler, true);
    }
    return () => {
      document.removeEventListener("mousedown", clickOutsideHandler, true);
    };
  }, [open]);

  const routeToCheckOut = (e) => {
    document.body.style.overflow = "unset";
    history.push("/checkout");
  };
  return (
    <>
      {open && <div className="modal-backdrop"></div>}
      <div ref={modalRef} className="modalContainer">
        {open && (
          <Box paddingBottom="1rem">
            <Box display="flex" flexDirection="column" padding="1rem">
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                my="0.25rem"
              >
                <Box color="#3C3C3C" alignSelf="center">
                  <span className="span-text">{items.length}</span> items in
                  cart
                </Box>
                <Box
                  color="#3C3C3C"
                  alignSelf="center"
                  onClick={() => {
                    modalToggler();
                  }}
                >
                  <CloseIcon />
                </Box>
              </Box>
            </Box>
            <Divider />
            <Box className="cart-content">
              <Cart
                products={products}
                items={items}
                handleQuantity={handleQuantity}
                modalDisplay={open}
              />
            </Box>
            <Divider />
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              my="1rem"
            >
              <Box color="#3C3C3C" alignSelf="center">
                Total amount to checkout
              </Box>
              <Box
                color="#3C3C3C"
                alignSelf="center"
                fontWeight="bold"
                fontSize="large"
              >
                {formatter.format(getTotalCartValue(items))}
              </Box>
            </Box>
            <Divider />
          </Box>
        )}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          {items.length !== 0 && !open && (
            <Box
              onClick={() => {
                modalToggler();
              }}
            >
              <Box fontSize="large">
                {items.length} items in cart <InfoOutlinedIcon />
              </Box>

              <Box fontWeight="700" fontSize="1.25em" marginTop="0.5rem">
                {formatter.format(getTotalCartValue(items))}
              </Box>
            </Box>
          )}

          {items.length === 0 && !open && (
            <Box
              onClick={() => {
                modalToggler();
              }}
            >
              <Box fontSize="large">
                0 items in cart <InfoOutlinedIcon />
              </Box>
              <Box fontWeight="700" fontSize="1.25em" marginTop="0.5rem">
                {formatter.format(0)}
              </Box>
            </Box>
          )}
          <Box></Box>
          <Box>
            {!token && (
              <Button
                sx={{ padding: "0.75rem" }}
                size="large"
                variant="contained"
                startIcon={<KeyIcon />}
                onClick={() => {
                  history.push("/login");
                }}
              >
               Logon To Add Item
              </Button>
            )}
            {token && (
              <Button
                size="large"
                variant="contained"
                startIcon={<ShoppingCart />}
                onClick={(e) => {
                  routeToCheckOut(e);
                }}
              >
                Check Out
              </Button>
            )}
          </Box>
        </Box>
      </div>
    </>
  );
}
