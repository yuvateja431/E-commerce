import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingCart } from "react-icons/fi";
import { updateItem, removeItem, clearCart, fetchCart } from "../../store/cartSlice";
import { formatCurrency } from '../../utils/formatCurrency';
import type { RootState } from "../../store";

export const CartPage = () => {
  const dispatch = useDispatch();
  const cartState = useSelector((state: RootState) => state.cart);
  const isAuthenticated = useSelector((state: RootState) => state.auth?.isAuthenticated ?? false);

  // Safely extract items — handle both { cart: { items } } and direct { items }
  const rawCart = cartState?.cart as any;
  const items: any[] = Array.isArray(rawCart?.items) ? rawCart.items : [];

  // Only fetch cart when the user is logged in
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart() as any);
    }
  }, [dispatch, isAuthenticated]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const subtotal = items.reduce(
    (acc: number, item: any) => acc + ((item?.product?.price ?? 0) * (item?.quantity ?? 0)),
    0
  );
  const shipping = subtotal > 100 ? 0 : 0;
  const total = subtotal + shipping;

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    dispatch(updateItem({ productId, quantity }) as any);
  };

  const handleRemove = (productId: string) => {
    dispatch(removeItem(productId) as any);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <FiShoppingCart size={40} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Go ahead and explore our top categories.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-12">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item: any) => (
            <div
              key={item.id}
              className="flex gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 items-center"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={item?.product?.images?.[0] || "https://placehold.co/400x400"}
                  alt={item?.product?.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <Link
                    to={`/product/${item?.product?.id}`}
                    className="font-bold text-lg text-gray-900 hover:text-indigo-600 transition"
                  >
                    {item?.product?.name}
                  </Link>
                  <button
                    onClick={() => handleRemove(item?.product?.id)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-4">{item?.product?.category?.name}</p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleUpdateQuantity(item?.product?.id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-50 text-gray-600"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="px-3 py-1 font-bold w-10 text-center border-x border-gray-200 text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item?.product?.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-50 text-gray-600"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <span className="font-bold text-lg text-gray-900">
                    {formatCurrency(((item?.product?.price ?? 0) * item.quantity))}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between pt-6">
            <Link to="/products" className="text-indigo-600 font-bold hover:underline">
              ← Continue Shopping
            </Link>
            <button
              onClick={() => dispatch(clearCart() as any)}
              className="text-gray-500 font-medium hover:text-red-500 transition"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Order Summary</h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-bold text-gray-900">
                  {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-extrabold text-indigo-600">{formatCurrency(total)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
            >
              Checkout Now <FiArrowRight />
            </Link>

            <p className="text-center text-xs text-gray-400 mt-6">
              Tax included where applicable. Shipping costs calculated at checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
