import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiTrash2, FiLoader } from "react-icons/fi";
import { fetchWishlist, removeFromWishlist } from "../../store/wishlistSlice";
import { addItem } from "../../store/cartSlice";
import type { RootState } from "../../store";
import toast from "react-hot-toast";

export const WishlistPage = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth?.isAuthenticated ?? false);
  const { wishlist, loading, error } = useSelector(
    (state: RootState) => state.wishlist ?? { wishlist: { items: [] }, loading: false, error: null }
  );

  // Safely extract items
  const items: any[] = Array.isArray(wishlist?.items) ? wishlist.items : [];

  // Fetch on mount (only when authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist() as any);
    }
  }, [dispatch, isAuthenticated]);

  // Redirect guests to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleMoveToCart = (item: any) => {
    dispatch(addItem({ productId: item.productId, quantity: 1 }) as any);
    dispatch(removeFromWishlist(item.productId) as any);
    toast.success(`${item.product?.name} moved to cart! 🛒`);
  };

  const handleRemove = (productId: string, name: string) => {
    dispatch(removeFromWishlist(productId) as any);
    toast.success(`${name} removed from wishlist`);
  };

  // Loading state
  if (loading && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <FiLoader className="animate-spin mx-auto text-indigo-600 mb-4" size={40} />
        <p className="text-gray-500">Loading your wishlist...</p>
      </div>
    );
  }

  // Error state
  if (error && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-red-500 font-bold text-lg mb-2">Failed to load wishlist</p>
        <p className="text-gray-500 mb-6">{error}</p>
        <button
          onClick={() => dispatch(fetchWishlist() as any)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <FiHeart size={40} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Save items you love here to find them easily later and stay updated on price changes.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900">
          My Wishlist
          <span className="ml-3 text-lg font-medium text-gray-400">({items.length} items)</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item: any) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
            <div className="relative h-64 bg-gray-50 overflow-hidden">
              <img
                src={item.product?.images?.[0] || "https://placehold.co/400x400"}
                alt={item.product?.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <button
                onClick={() => handleRemove(item.productId, item.product?.name ?? "Item")}
                className="absolute top-4 right-4 p-2 bg-white text-gray-400 hover:text-red-500 rounded-full shadow-sm transition"
              >
                <FiTrash2 size={18} />
              </button>
            </div>

            <div className="p-4">
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mb-1">
                {item.product?.category?.name}
              </p>
              <Link
                to={`/product/${item.productId}`}
                className="font-bold text-gray-900 hover:text-indigo-600 transition block mb-4 line-clamp-2"
              >
                {item.product?.name}
              </Link>

              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xl font-bold text-gray-900">
                    ${item.product?.discountPrice ?? item.product?.price ?? 0}
                  </span>
                  {item.product?.discountPrice && (
                    <span className="ml-2 text-sm text-gray-400 line-through">
                      ${item.product?.price}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-600 transition"
                >
                  <FiShoppingCart size={16} /> Move to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
