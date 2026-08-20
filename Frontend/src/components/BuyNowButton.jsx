import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setInstantOrder, reset } from "../store/slices/checkoutSlice";
import toast from "react-hot-toast";
const BuyNowButton = ({ productId, variantId = null, quantity = 1, className = "", }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
    const handleBuyNow = async () => {
        if (!isAuthenticated) {
            toast.error("Please sign in to purchase items");
            navigate("/login");
            return;
        }
        // Reset any previous checkout state
        dispatch(reset());
        // Set the instant order details
        dispatch(setInstantOrder({
            productId,
            variantId,
            quantity,
        }));
        // Navigate to checkout page
        navigate("/checkout");
    };
    return (<button type="button" onClick={handleBuyNow} className={`bg-primary-600 hover:bg-primary-7   
        00 text-white font-medium py-2 px-4 rounded transition ${className}`}>
      Buy Now
    </button>);
};
export default BuyNowButton;
