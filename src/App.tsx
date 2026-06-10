import { useEffect, useState } from 'react';
import type { Product, CartItem } from './types/product';
import { getProducts } from './services/api';
import { Login } from './components/Login';

const categoryTranslations: { [key: string]: string } = {
  'all': 'Todas',
  'electronics': 'Electrónicos',
  'jewelery': 'Joyería',
  'men\'s clothing': 'Ropa de Hombre',
  'women\'s clothing': 'Ropa de Mujer'
};

const cleanText = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('user_token'));
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const [currentView, setCurrentView] = useState<'catalogo' | 'detalle'>('catalogo');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // --- ESTADO DEL MODO OSCURO (Persistente en LocalStorage) ---
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Efecto para inyectar o remover la clase 'dark' en el HTML principal
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    if (!token) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError('No se pudieron cargar los productos. Por favor, intenta más tarde.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token]);

  const handleLoginSuccess = (newToken: string) => {
    localStorage.setItem('user_token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    setToken(null);
    setCart([]);
    setCurrentView('catalogo');
    setSelectedProduct(null);
  };

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, amount: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + amount };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const rawCategories = ['all', ...new Set(products.map((p) => p.category))];
  const filteredProducts = products.filter((product) => {
    const cleanedSearch = cleanText(searchTerm);
    const cleanedTitle = cleanText(product.title);
    const translatedCategory = categoryTranslations[product.category] || product.category;
    const cleanedCategory = cleanText(translatedCategory);

    return (cleanedTitle.includes(cleanedSearch) || cleanedCategory.includes(cleanedSearch)) &&
           (selectedCategory === 'all' || product.category === selectedCategory);
  });

  const viewProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('detalle');
  };

  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-4 md:p-6 relative text-gray-800 dark:text-gray-100 transition-colors duration-300">
      
      {/* BOTÓN FLOTANTE DEL CARRITO */}
      <button
        onClick={() => setIsCartOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          totalItems > 0 ? 'scale-110 ring-4 ring-blue-300 dark:ring-blue-900 animate-pulse' : 'hover:scale-110'
        }`}
      >
        <span className="text-2xl">🛒</span>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-bounce">
            {totalItems}
          </span>
        )}
      </button>

      {/* ENCABEZADO GLOBAL */}
      <header className="mb-6 max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 gap-4 transition-colors duration-300">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white tracking-tight">🛍 Sistema de Tienda</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Sesión Activa - Perfil Autorizado</p>
        </div>
        <div className="flex items-center gap-3">
          {/* INTERRUPTOR DE MODO OSCURO */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-amber-400 p-2 rounded-lg text-sm font-bold border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Alternar Modo Oscuro"
          >
            {darkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
          </button>

          {currentView === 'detalle' && (
            <button
              onClick={() => setCurrentView('catalogo')}
              className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold px-4 py-2 rounded-lg text-xs transition-colors border border-gray-200 dark:border-gray-700"
            >
              ⬅ Volver
            </button>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400 font-semibold px-4 py-2 rounded-lg text-xs transition-colors border border-red-200 dark:border-red-900/50"
          >
            🚪 Salir
          </button>
        </div>
      </header>

      {/* VISTA 1: CATÁLOGO GENERAL */}
      {currentView === 'catalogo' && (
        <>
          {/* BARRA DE BÚSQUEDA Y FILTROS */}
          <div className="max-w-6xl mx-auto mb-6 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-4 transition-colors duration-300">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="w-full md:w-1/3">
                <input
                  type="text"
                  placeholder="🔍 Escribe una categoría o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 dark:text-white transition-colors"
                />
              </div>
              <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
                {loading ? (
                  [1, 2, 3, 4, 5].map((n) => (
                    <div key={n} className="w-16 h-7 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
                  ))
                ) : (
                  rawCategories.map((rawCategory) => (
                    <button
                      key={rawCategory}
                      onClick={() => setSelectedCategory(rawCategory)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        selectedCategory === rawCategory 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      {categoryTranslations[rawCategory] || rawCategory}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* SKELETON LOADERS DE MODO OSCURO */}
          <div className="max-w-6xl mx-auto">
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((skeletonId) => (
                  <div key={skeletonId} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between h-40 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-2.5 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                      </div>
                    </div>
                    <div className="w-full h-8 bg-gray-200 dark:bg-gray-800 rounded-lg mt-3" />
                  </div>
                ))}
              </div>
            )}

            {error && <div className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-center">{error}</div>}

            {/* CUADRÍCULA DE PRODUCTOS */}
            {!loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg dark:hover:border-blue-500/50 group"
                  >
                    <div className="flex gap-4 cursor-pointer" onClick={() => viewProductDetails(product)}>
                      <div className="w-20 h-20 shrink-0 flex items-center justify-center p-1 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden transition-colors">
                        <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105" />
                      </div>
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider">{categoryTranslations[product.category] || product.category}</span>
                          <h2 className="text-xs font-bold text-gray-800 dark:text-gray-200 line-clamp-2 mt-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{product.title}</h2>
                        </div>
                        <p className="text-sm font-black text-gray-900 dark:text-white">${product.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => addToCart(product)} 
                      className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 rounded-lg text-xs transition-colors shadow-sm"
                    >
                      + Agregar al Carrito
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* VISTA 2: DETALLE INDIVIDUAL DE PRODUCTO */}
      {currentView === 'detalle' && selectedProduct && (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="w-full h-72 md:h-96 bg-gray-50 dark:bg-gray-800 rounded-xl p-6 flex items-center justify-center border border-gray-100 dark:border-gray-700 transition-colors">
              <img src={selectedProduct.image} alt={selectedProduct.title} className="max-h-full max-w-full object-contain drop-shadow-md" />
            </div>
            <div className="flex flex-col justify-between h-full space-y-4">
              <div>
                <span className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {categoryTranslations[selectedProduct.category] || selectedProduct.category}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-gray-800 dark:text-white mt-3 tracking-tight">{selectedProduct.title}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-amber-500 font-bold text-sm">⭐ {selectedProduct.rating?.rate || '4.5'}</span>
                  <span className="text-gray-400 dark:text-gray-500 text-xs">({selectedProduct.rating?.count || '120'} reseñas)</span>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Descripción del Producto</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed text-justify">{selectedProduct.description}</p>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 block">Precio Unitario:</span>
                  <span className="text-3xl font-black text-gray-950 dark:text-white">${selectedProduct.price.toFixed(2)}</span>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => addToCart(selectedProduct)}
                    className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md"
                  >
                    🛒 Añadir al Carrito POS
                  </button>
                  <button
                    onClick={() => setCurrentView('catalogo')}
                    className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium px-4 py-3 rounded-xl text-xs transition-colors border border-gray-200 dark:border-gray-700"
                  >
                    Volver
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PANEL LATERAL DEL CARRITO */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/40" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 h-full shadow-2xl p-4 flex flex-col z-10 text-gray-800 dark:text-gray-100 transition-colors duration-300">
            <div className="border-b border-gray-100 dark:border-gray-800 pb-3 mb-3 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">🛒 Carrito de Ventas</h2>
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs font-bold px-2 py-0.5 rounded-full">{totalItems} items</span>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-bold text-xl p-1">✕</button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 space-y-3 pr-1">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm"><p>El carrito está vacío.</p></div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-100 dark:border-gray-800 justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{item.title}</h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md">
                        <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-0.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold text-xs">-</button>
                        <span className="px-2 text-xs font-bold text-gray-800 dark:text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-0.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold text-xs">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 text-sm">🗑️</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total a Pagar:</span>
                <span className="text-2xl font-black text-gray-950 dark:text-white">${totalPrice.toFixed(2)}</span>
              </div>
              <button
                disabled={cart.length === 0}
                className={`w-full font-bold py-2.5 rounded-xl text-sm transition-colors ${
                  cart.length === 0 
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                onClick={() => {
                  alert(`✓ ¡Venta Registrada Exitosamente!\nTotal procesado: $${totalPrice.toFixed(2)}`);
                  setCart([]);
                  setIsCartOpen(false);
                }}
              >
                ✓ Registrar Venta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}