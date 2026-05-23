import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { motion } from "framer-motion";
import { FiShoppingCart, FiHeart, FiStar, FiTruck, FiShield } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../../store/cartSlice";
import { toggleWishlist } from "../../store/wishlistSlice";
import { setInstantOrder, reset } from "../../store/slices/checkoutSlice";
import toast from "react-hot-toast";
import type { RootState } from "../../store";
import { formatCurrency } from "../../utils/formatCurrency";

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  const wishlistItems = useSelector((state: RootState) => state.wishlist?.wishlist?.items ?? []);
  const isInWishlist = wishlistItems.some((item: any) => item.productId === id);
  const isAuthenticated = useSelector((state: RootState) => state.auth?.isAuthenticated);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Detect MongoDB ObjectId (24 hex chars) OR Postgres UUID — both go to /:id
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(id as string);
        const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i.test(id as string);
        const url = (isObjectId || isUUID) ? `/products/${id}` : `/products/slug/${id}`;
        const res = await api.get(url);
        setProduct(res.data.data);
        if (res.data.data.variants?.length > 0) {
          setSelectedVariantId(res.data.data.variants[0].id);
        }
      } catch (error) {
        toast.error("Failed to load product");
        console.error("Error fetching product details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const selectedVariant = product?.variants?.find((v: any) => v.id === selectedVariantId);
  const displayPrice = selectedVariant
    ? (product?.discountPrice || product?.price) + selectedVariant.additionalPrice
    : product?.discountPrice || product?.price;
  const originalPrice = selectedVariant
    ? product?.price + selectedVariant.additionalPrice
    : product?.price;
  const currentStock = selectedVariant ? selectedVariant.stockQuantity : product?.inventory?.stock;

  const handleAddToCart = () => {
    if (currentStock < quantity) {
      toast.error("Not enough stock available");
      return;
    }
    dispatch(addItem({ productId: product.id, variantId: selectedVariantId, quantity }) as any);
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please sign in to purchase items");
      navigate("/login");
      return;
    }
    if (currentStock < quantity) {
      toast.error("Not enough stock available");
      return;
    }
    dispatch(reset());
    dispatch(setInstantOrder({ productId: product.id, variantId: selectedVariantId, quantity }));
    navigate("/checkout");
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse">Loading...</div>;
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 border border-gray-100 relative">
            <img src={product.images?.[activeImage] || "https://placehold.co/800x800"} alt={product.name} className="w-full h-full object-cover" />
            {product.discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                -{product.discountPercentage}%
              </div>
            )}
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images?.map((img: string, index: number) => (
              <button key={index} onClick={() => setActiveImage(index)}
                className={`w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition ${activeImage === index ? 'border-indigo-600' : 'border-transparent opacity-60'}`}>\n                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-500 text-sm font-semibold">{product.brand}</span>
              <span className="text-gray-300">•</span>
              <span className="text-indigo-600 font-bold uppercase tracking-widest text-sm">{product.category?.name}</span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map(star => (
                  <FiStar key={star} fill={star <= Math.round(product.averageRating) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-gray-500 text-sm">({product.averageRating.toFixed(1)} • {product.reviewCount} Reviews)</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                product.status === 'IN_STOCK' ? 'bg-green-100 text-green-700' :
                product.status === 'PREORDER' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>{product.status.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <p className="text-4xl font-bold text-gray-900">{formatCurrency(displayPrice)}</p>
            {product.discountPrice && (
              <p className="text-xl text-gray-400 line-through mb-1">{formatCurrency(originalPrice)}</p>
            )}
          </div>

          <div className="text-gray-600 leading-relaxed prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />

          {/* Variants Selector */}
          {product.variants?.length > 0 && (
            <div className="pt-6 border-t border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3">Options:</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant: any) => (
                  <button key={variant.id} onClick={() => setSelectedVariantId(variant.id)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition ${selectedVariantId === variant.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    {variant.value}
                    {variant.additionalPrice > 0 && (
                      <span className="text-xs text-gray-500 block">+${variant.additionalPrice}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="space-y-4 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-12">
                <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))} className="px-4 h-full hover:bg-gray-50 text-gray-600">-</button>
                <span className="px-4 font-bold w-12 text-center border-x border-gray-200 h-full flex items-center justify-center">{quantity}</span>
                <button onClick={() => setQuantity(prev => prev + 1)} className="px-4 h-full hover:bg-gray-50 text-gray-600">+</button>
              </div>
              <button onClick={handleAddToCart}
                disabled={currentStock === 0 || product.status === 'OUT_OF_STOCK'}
                className="flex-1 h-12 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed">
                <FiShoppingCart /> {currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button onClick={handleBuyNow}
                disabled={currentStock === 0 || product.status === 'OUT_OF_STOCK'}
                className="flex-1 h-12 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed">
                Buy Now
              </button>
              <button onClick={() => {
                dispatch(toggleWishlist(product.id) as any);
                toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist ❤️');
              }}
                className={`w-12 h-12 flex items-center justify-center border rounded-lg transition ${isInWishlist ? 'border-red-300 bg-red-50 text-red-500' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}>
                <FiHeart size={20} fill={isInWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>
            {currentStock < 10 && currentStock > 0 && (
              <p className="text-red-500 text-sm font-medium">Hurry! Only {currentStock} left in stock.</p>
            )}
            <p className="text-xs text-gray-400 font-mono">SKU: {selectedVariant?.sku || product.sku}</p>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <FiTruck className="text-indigo-600" size={24} />
              <div>
                <p className="font-bold text-sm text-gray-900">Free Delivery</p>
                <p className="text-xs text-gray-500">For orders over ₹1000</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <FiShield className="text-indigo-600" size={24} />
              <div>
                <p className="font-bold text-sm text-gray-900">1 Year Warranty</p>
                <p className="text-xs text-gray-500">Official brand warranty</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-20 border-t border-gray-100 pt-12">
        <h2 className="text-2xl font-bold mb-8 text-gray-900">Customer Reviews</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Review Summary */}
          <div className="space-y-4">
            <div className="bg-indigo-50 p-8 rounded-3xl text-center border border-indigo-100">
              <p className="text-5xl font-extrabold text-indigo-600 mb-2">{product.averageRating.toFixed(1)}</p>
              <div className="flex justify-center text-yellow-400 mb-2">
                {[1,2,3,4,5].map(i => (
                  <FiStar key={i} fill={i <= Math.round(product.averageRating) ? "currentColor" : "none"} />
                ))}
              </div>
              <p className="text-sm text-gray-600 font-medium">Based on {product.reviewCount} reviews</p>
            </div>
          </div>
          {/* Review List */}
          <div className="lg:col-span-2 space-y-8">
            {product.reviews?.length > 0 ? (
              product.reviews.map((review: any) => (
                <div key={review.id} className="pb-8 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="h-10 w-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
                      {review.user?.firstName?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{review.user?.firstName} {review.user?.lastName}</p>
                      <div className="flex text-yellow-400 text-xs">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FiStar key={i} fill={i < review.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic bg-gray-50 p-6 rounded-2xl border border-gray-100">No reviews yet. Be the first to review this product!</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
