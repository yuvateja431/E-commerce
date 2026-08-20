import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../store/cartSlice";
import { setInstantOrder } from "../store/slices/checkoutSlice";
import { toggleWishlist } from "../store/wishlistSlice";
import toast from "react-hot-toast";
export const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { wishlist } = useSelector((state) => state.wishlist || { wishlist: { items: [] } });
    const isInWishlist = wishlist?.items?.some((item) => item.productId === product.id);
    const handleAddToCart = (e) => {
        e.preventDefault();
        dispatch(addItem({ productId: product.id, quantity: 1 }));
        toast.success(`${product.name} added to cart`);
    };
    const navigate = useNavigate();
    const handleBuyNow = (e) => {
        e.preventDefault();
        const stock = product.inventory?.stock ?? product.stock ?? 0;
        if (stock === 0) {
            toast.error('Product out of stock');
            return;
        }
        dispatch(setInstantOrder({
            productId: product.id,
            variantId: null,
            quantity: 1,
        }));
        // Navigate to checkout page after setting instant order
        navigate('/checkout');
    };
    const handleToggleWishlist = (e) => {
        e.preventDefault();
        dispatch(toggleWishlist(product.id));
    };
    return (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
      <button onClick={handleToggleWishlist} className={`absolute top-4 right-4 z-10 p-2 rounded-full shadow-md transition ${isInWishlist ? "bg-red-500 text-white" : "bg-white text-gray-400 hover:text-red-500"}`}>
        <FiHeart size={18} fill={isInWishlist ? "currentColor" : "none"}/>
      </button>

      <Link to={`/product/${product.id}`} className="block relative h-64 bg-gray-50 overflow-hidden">
        <img src={product.images?.[0] || "https://placehold.co/400x400"} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500"/>
      </Link>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mb-1">
              {product.category?.name}
            </p>
            <Link to={`/product/${product.id}`} className="font-bold text-gray-900 hover:text-indigo-600 transition block">
              {product.name}
            </Link>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span style={{
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            fontStyle: 'normal',
            fontWeight: 600,
            color: 'rgb(31, 41, 55)',
            fontSize: '14px',
            lineHeight: '20px'
        }}>
            ₹{product.price}
          </span>
            <div className="flex gap-2">
              <button onClick={handleAddToCart} className="bg-gray-900 text-white p-2 rounded-lg hover:bg-indigo-600 transition" title="Add to Cart">
                <FiShoppingCart size={20}/>
              </button>
            </div>
        </div>
      </div>
    </motion.div>);
};
