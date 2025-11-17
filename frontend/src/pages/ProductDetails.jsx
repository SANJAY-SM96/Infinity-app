import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService } from '../api/productService';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useSEO } from '../hooks/useSEO';
import { generateImageAlt } from '../utils/imageOptimizer';
import { BASE_URL, generateProductSchema, generateOrganizationSchema, combineSchemas } from '../utils/seoConfig';
import Loader from '../components/Loader';
import { FiShoppingCart, FiMinus, FiPlus, FiStar, FiArrowLeft, FiCheck, FiDownload, FiExternalLink, FiTag, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { commonClasses, getPageLayoutClasses, animationVariants, cn } from '../utils/designSystem';
import PageLayout from '../components/PageLayout';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const { addToCart } = useCart();
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getById(id);
        const fetchedProduct = response.data.product;
        setProduct(fetchedProduct);
        
        // Fetch related products based on category, tags, or tech stack
        if (fetchedProduct) {
          fetchRelatedProducts(fetchedProduct);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const fetchRelatedProducts = async (currentProduct) => {
    try {
      setLoadingRelated(true);
      // Try to find related products by category, tags, or tech stack
      const filters = [];
      
      // Filter by category if available
      if (currentProduct.category) {
        filters.push({ filterType: currentProduct.category.toLowerCase().replace(/\s+/g, '-') });
      }
      
      // Fetch products with similar tags if available
      let response;
      if (currentProduct.tags && currentProduct.tags.length > 0) {
        // Search for products with matching tags (using search)
        const tagSearch = currentProduct.tags.slice(0, 2).join(' ');
        response = await productService.getAll({ 
          page: 1, 
          limit: 6, 
          search: tagSearch 
        });
      } else if (currentProduct.techStack && currentProduct.techStack.length > 0) {
        // Search by tech stack
        const techSearch = currentProduct.techStack.slice(0, 2).join(' ');
        response = await productService.getAll({ 
          page: 1, 
          limit: 6, 
          search: techSearch 
        });
      } else if (currentProduct.category) {
        // Search by category
        response = await productService.getAll({ 
          page: 1, 
          limit: 6, 
          filterType: currentProduct.category.toLowerCase().replace(/\s+/g, '-') 
        });
      } else {
        // Fallback to featured products
        response = await productService.getFeatured();
      }
      
      // Filter out current product and limit to 6
      const related = (response.data.products || [])
        .filter(p => p._id !== currentProduct._id)
        .slice(0, 6);
      
      setRelatedProducts(related);
    } catch (error) {
      console.error('Failed to fetch related products:', error);
      // Don't show error to user, just don't show related products
    } finally {
      setLoadingRelated(false);
    }
  };

  // Prepare SEO data with breadcrumbs
  const seoData = product ? (() => {
    const productSlug = product.slug || product._id;
    const productUrl = `${BASE_URL}/products/${productSlug}`;
    const productImage = product.images?.[0] || `${BASE_URL}/og-image.jpg`;
    const price = product.priceINR || product.price || 0;

    const breadcrumbs = [
      { name: 'Home', url: BASE_URL },
      { name: 'Products', url: `${BASE_URL}/products` },
      { name: product.title, url: productUrl }
    ];

    // Generate structured data using SEO config
    const productSchema = generateProductSchema(product, BASE_URL);
    const organizationSchema = generateOrganizationSchema(BASE_URL);
    const structuredData = combineSchemas(productSchema, organizationSchema);

    const description = product.description?.substring(0, 155) || product.description || '';
    const techStackStr = product.techStack?.join(', ') || '';
    const categoryStr = product.category || 'IT Project';
    const tags = product.tags || [];

    // Generate optimized title (max 60 chars for SEO)
    const baseTitle = `${product.title} | Buy IT Project`;
    const optimizedTitle = baseTitle.length > 60 
      ? `${baseTitle.substring(0, 57)}...` 
      : baseTitle;

    // Generate optimized description (max 155 chars)
    let optimizedDescription = `Buy ${product.title} with complete source code, documentation, and database. ${techStackStr ? `${techStackStr} ` : ''}Available at ₹${price}.`;
    if (optimizedDescription.length > 155) {
      optimizedDescription = optimizedDescription.substring(0, 152) + '...';
    }

    // Combine keywords with tags
    const keywordsBase = `${product.title}, ${categoryStr}, ${techStackStr}, IT project with source code, buy ${categoryStr.toLowerCase()}, college project, final year project`;
    const keywordsWithTags = tags.length > 0 
      ? `${keywordsBase}, ${tags.slice(0, 10).join(', ')}` 
      : keywordsBase;

    return {
      title: optimizedTitle,
      description: optimizedDescription,
      keywords: keywordsWithTags,
      tags: tags,
      image: productImage,
      url: productUrl,
      type: 'product',
      structuredData,
      breadcrumbs
    };
  })() : {
    title: 'Product Details | Infinity IT Project Marketplace',
    description: 'View product details and buy IT projects with complete source code',
    keywords: 'IT projects, buy projects, source code',
    url: window.location.href,
    breadcrumbs: [
      { name: 'Home', url: BASE_URL },
      { name: 'Products', url: `${BASE_URL}/products` }
    ]
  };

  // Apply SEO
  useSEO(seoData);

  const handleAddToCart = async () => {
    const result = await addToCart(product._id, quantity);
    if (result.success) {
      toast.success('Added to cart!');
    } else {
      toast.error(result.error);
    }
  };

  if (loading) return <Loader />;
  if (!product) return (
    <PageLayout
      title="Product Not Found"
      subtitle="The product you're looking for doesn't exist"
      showBackButton={true}
      backPath="/products"
    >
      <div className="text-center py-12">
        <motion.div
          variants={animationVariants.fadeIn}
          initial="initial"
          animate="animate"
          className={cn(commonClasses.card(isDark), 'max-w-md mx-auto')}
        >
          <p className={cn(commonClasses.textBody(isDark), 'text-lg mb-4')}>
            Product not found
          </p>
          <button 
            onClick={() => navigate('/products')} 
            className={commonClasses.buttonPrimary(isDark)}
          >
            Browse Products
          </button>
        </motion.div>
      </div>
    </PageLayout>
  );

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const layoutClasses = getPageLayoutClasses(isDark);
  const textClass = isDark ? 'text-white' : 'text-gray-900';

  return (
    <main className={cn(layoutClasses.wrapper, 'pt-20 sm:pt-24')}>
      <div className={commonClasses.container}>
        {/* Breadcrumbs */}
        {product && (
          <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
            <ol className="flex items-center gap-2 text-sm flex-wrap">
              <li>
                <a 
                  href="https://infinitywebtechnology.com" 
                  className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}
                  aria-label="Home"
                >
                  Home
                </a>
              </li>
              <li aria-hidden="true" className={isDark ? 'text-gray-600' : 'text-gray-400'}>/</li>
              <li>
                <a 
                  href="/products" 
                  className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition`}
                  aria-label="Products"
                >
                  Products
                </a>
              </li>
              <li aria-hidden="true" className={isDark ? 'text-gray-600' : 'text-gray-400'}>/</li>
              <li className={textClass} aria-current="page">
                {product.title}
              </li>
            </ol>
          </nav>
        )}
        <motion.button
          onClick={() => navigate('/products')}
          className={cn(commonClasses.buttonGhost(isDark), 'mb-4 sm:mb-6 text-sm sm:text-base')}
          whileHover={{ x: -5 }}
          aria-label="Back to products list"
        >
          <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" /> Back to Products
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-12">
          {/* Images */}
          <motion.div 
            variants={animationVariants.slideLeft}
            initial="initial"
            animate="animate"
            className="space-y-3 sm:space-y-4"
          >
            <div className={cn(commonClasses.card(isDark), 'overflow-hidden p-0')}>
              <img
                src={product.images?.[selectedImage] || product.images?.[0]}
                alt={generateImageAlt(product.title, selectedImage, product.category, product.techStack)}
                className="w-full h-56 sm:h-64 md:h-80 lg:h-96 object-cover"
                loading={selectedImage === 0 ? 'eager' : 'lazy'}
                fetchPriority={selectedImage === 0 ? 'high' : 'auto'}
                width={800}
                height={600}
                decoding="async"
                itemProp="image"
                aria-label={`${product.title} - Main product image`}
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <motion.img
                    key={idx}
                    src={img}
                    alt={generateImageAlt(product.title, idx, product.category, product.techStack)}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover rounded-lg sm:rounded-xl cursor-pointer border-2 transition-all flex-shrink-0 ${
                      selectedImage === idx ? 'border-primary scale-105' : isDark ? 'border-gray-700' : 'border-gray-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    loading="lazy"
                    width={80}
                    height={80}
                    decoding="async"
                    aria-label={`View ${product.title} image ${idx + 1}`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedImage(idx);
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.article 
            variants={animationVariants.slideRight}
            initial="initial"
            animate="animate"
            className="space-y-4 sm:space-y-6"
            itemScope 
            itemType="https://schema.org/Product"
          >
              <h1 className={cn(commonClasses.heading1(isDark), 'text-xl sm:text-2xl md:text-3xl lg:text-4xl')} itemProp="name">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i} 
                      className={cn(
                        i < (product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : isDark ? 'text-gray-600' : 'text-gray-300',
                        'sm:w-5 sm:h-5'
                      )} 
                      size={16}
                    />
                  ))}
                </div>
                <span className={cn(commonClasses.textMuted(isDark), 'text-sm sm:text-base')}>
                  ({product.reviews?.length || 0} reviews)
                </span>
              </div>

              {/* Price - Only INR */}
              <div className="flex flex-wrap items-baseline gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
                    ₹{product.priceINR?.toFixed(2) || product.price?.toFixed(2) || '0.00'}
                  </span>
                </div>
                {(product.originalPriceINR || product.originalPrice) && (
                  <>
                    <span className={cn('text-lg sm:text-xl md:text-2xl line-through', commonClasses.textMuted(isDark))}>
                      ₹{(product.originalPriceINR || product.originalPrice)?.toFixed(2)}
                    </span>
                    <span className={commonClasses.badge(isDark, 'error')}>
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Stock */}
              <div className={`text-lg font-semibold mb-6 ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {product.stock > 0 ? `✓ ${product.stock} in stock` : '✗ Out of Stock'}
              </div>

            {/* Description */}
            <section>
              <h2 className={cn(commonClasses.heading2(isDark), 'mb-2 sm:mb-3')}>Description</h2>
              <p className={cn(commonClasses.textBody(isDark), 'text-sm sm:text-base leading-relaxed')} itemProp="description">
                {product.description}
              </p>
            </section>

            {/* Demo Site URL */}
            {product.demoUrl && (
              <div className={commonClasses.card(isDark)}>
                <h3 className={cn(commonClasses.heading3(isDark), 'mb-3 sm:mb-4')}>Live Demo</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                    <FiExternalLink className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`} size={24} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                      Try out the live demo of this project
                    </p>
                    <a
                      href={product.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all text-sm sm:text-base`}
                    >
                      <FiExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                      View Live Demo
                    </a>
                  </div>
                </div>
                <div className={`p-3 ${isDark ? 'bg-gray-700/30' : 'bg-gray-50'} rounded-lg`}>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'} break-all flex items-center gap-2`}>
                    <FiExternalLink size={14} />
                    {product.demoUrl}
                  </p>
                </div>
              </div>
            )}

            {/* Demo Video */}
            {product.demoVideo && (
              <div className={commonClasses.card(isDark)}>
                <h3 className={cn(commonClasses.heading3(isDark), 'mb-3 sm:mb-4')}>Demo Video</h3>
                <div className="aspect-video rounded-lg sm:rounded-xl overflow-hidden">
                  <iframe
                    src={product.demoVideo.replace('watch?v=', 'embed/')}
                    title="Demo Video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Source Code */}
            {product.sourceCode && (
              <div className={commonClasses.card(isDark)}>
                <h3 className={cn(commonClasses.heading3(isDark), 'mb-3 sm:mb-4')}>Source Code</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                    <FiDownload className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`} size={24} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                      Download or view the project source code
                    </p>
                    <a
                      href={product.sourceCode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary via-blue-600 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all text-sm sm:text-base`}
                    >
                      <FiExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                      View Source Code
                    </a>
                  </div>
                </div>
                <div className={`p-3 ${isDark ? 'bg-gray-700/30' : 'bg-gray-50'} rounded-lg`}>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'} break-all flex items-center gap-2`}>
                    <FiExternalLink size={14} />
                    {product.sourceCode}
                  </p>
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {product.techStack && product.techStack.length > 0 && (
              <section className={commonClasses.card(isDark)}>
                <h2 className={cn(commonClasses.heading2(isDark), 'mb-3 sm:mb-4')}>Technology Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {product.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className={commonClasses.badge(isDark, 'primary')}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <section className={commonClasses.card(isDark)}>
                <h2 className={cn(commonClasses.heading2(isDark), 'mb-3 sm:mb-4')}>Key Features</h2>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className={cn('flex items-start gap-2 text-sm sm:text-base', commonClasses.textBody(isDark))}>
                      <FiCheck className="text-green-500 mt-0.5 sm:mt-1 flex-shrink-0 sm:w-5 sm:h-5" size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <section className={commonClasses.card(isDark)}>
                <h2 className={cn(commonClasses.heading2(isDark), 'mb-3 sm:mb-4')}>Project Specifications</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="text-xs sm:text-sm">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{key}:</span>
                      <span className={`${textClass} ml-2 font-semibold`}>{value}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Add to Cart */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <div className={`flex items-center border rounded-xl ${isDark ? 'border-gray-700' : 'border-gray-300'} w-full sm:w-auto`}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className={`px-3 sm:px-4 py-2.5 sm:py-3 ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition rounded-l-xl`}
                      aria-label="Decrease quantity"
                      aria-disabled={quantity <= 1}
                      disabled={quantity <= 1}
                      type="button"
                    >
                      <FiMinus className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                    </button>
                    <span className={`px-4 sm:px-6 ${textClass} font-bold text-base sm:text-lg flex-1 text-center`} aria-label={`Quantity: ${quantity}`}>{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className={`px-3 sm:px-4 py-2.5 sm:py-3 ${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition rounded-r-xl`}
                      aria-label="Increase quantity"
                      aria-disabled={quantity >= product.stock}
                      disabled={quantity >= product.stock}
                      type="button"
                    >
                      <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                    </button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className={cn(commonClasses.buttonPrimary(isDark), 'flex-1 py-3 sm:py-4 flex items-center justify-center gap-2 text-sm sm:text-base')}
                    aria-label={`Add ${quantity} ${product.title}${quantity > 1 ? 's' : ''} to cart`}
                    type="button"
                  >
                    <FiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            )}

            {/* Info */}
            <div className={cn(commonClasses.card(isDark), 'space-y-3 text-xs sm:text-sm')}>
              {product.warranty && (
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Warranty:</span>
                  <span className="text-primary font-semibold">{product.warranty}</span>
                </div>
              )}
              {product.returnsPolicy && (
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Returns:</span>
                  <span className="text-primary font-semibold">{product.returnsPolicy}</span>
                </div>
              )}
            </div>
          </motion.article>
        </div>

        {/* Related Products and Tags Section */}
        {(product?.tags?.length > 0 || relatedProducts.length > 0) && (
          <div className="mt-8 sm:mt-12 space-y-6 sm:space-y-8">
            {/* Tags Section */}
            {product.tags && product.tags.length > 0 && (
              <section className={commonClasses.card(isDark)}>
                <h2 className={cn(commonClasses.heading2(isDark), 'mb-4 sm:mb-6 flex items-center gap-2')}>
                  <FiTag className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                  Related Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => navigate(`/products?search=${encodeURIComponent(tag)}`)}
                      className={cn(
                        'px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all',
                        isDark 
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900',
                        'hover:scale-105'
                      )}
                      aria-label={`Browse projects tagged with ${tag}`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Related Projects Section */}
            {relatedProducts.length > 0 && (
              <section className={commonClasses.card(isDark)}>
                <h2 className={cn(commonClasses.heading2(isDark), 'mb-4 sm:mb-6 flex items-center gap-2')}>
                  <FiPackage className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                  Related Projects
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {relatedProducts.map((relatedProduct) => (
                    <motion.div
                      key={relatedProduct._id}
                      whileHover={{ scale: 1.02, y: -4 }}
                      className={cn(
                        'rounded-lg sm:rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer',
                        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                      )}
                      onClick={() => navigate(`/products/${relatedProduct.slug || relatedProduct._id}`)}
                      role="link"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate(`/products/${relatedProduct.slug || relatedProduct._id}`);
                        }
                      }}
                      aria-label={`View ${relatedProduct.title} details`}
                    >
                      <div className="relative h-40 sm:h-48 overflow-hidden">
                        <img
                          src={relatedProduct.images?.[0] || '/placeholder.jpg'}
                          alt={generateImageAlt(relatedProduct.title, 0, relatedProduct.category, relatedProduct.techStack)}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          width={400}
                          height={300}
                          decoding="async"
                        />
                        {relatedProduct.originalPrice && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                            Save {Math.round(((relatedProduct.originalPrice - (relatedProduct.priceINR || relatedProduct.price)) / relatedProduct.originalPrice) * 100)}%
                          </div>
                        )}
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className={cn(
                          'font-semibold text-sm sm:text-base mb-2 line-clamp-2',
                          isDark ? 'text-white' : 'text-gray-900'
                        )}>
                          {relatedProduct.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <FiStar className={cn('w-4 h-4', isDark ? 'text-yellow-400' : 'text-yellow-500')} />
                            <span className={cn('text-xs sm:text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700')}>
                              {relatedProduct.rating?.toFixed(1) || '4.5'}
                            </span>
                          </div>
                          <span className={cn('font-bold text-sm sm:text-base', isDark ? 'text-primary' : 'text-blue-600')}>
                            ₹{(relatedProduct.priceINR || relatedProduct.price || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
