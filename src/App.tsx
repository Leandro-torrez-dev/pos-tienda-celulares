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

  useEffect(() => {
    if (!token) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
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

  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 relative">
      {/* BOTÓN FLOTANTE DEL CARRITO */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110"
      >
        <span className="text-2xl">🛒</span>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {/* ENCABEZADO */}
      <header className="mb-6 max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">📱 Sistema POS & Tienda</h1>
          <p className="text-xs text-gray-400 mt-0.5">Sesión Activa - Perfil Autorizado</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-4 py-2 rounded-lg text-xs transition-colors border border-red-200"
        >
          🚪 Cerrar Sesión
        </button>
      </header>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="max-w-6xl mx-auto mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="🔍 Escribe una categoría o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
            {rawCategories.map((rawCategory) => (
              <button
                key={rawCategory}
                onClick={() => setSelectedCategory(rawCategory)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === rawCategory ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {categoryTranslations[rawCategory] || rawCategory}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VISTA DEL CATÁLOGO */}
      <div className="max-w-6xl mx-auto">
        {loading && (
          <div className="text-center py-10 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xl font-medium text-blue-600 animate-pulse">Cargando catálogo de productos...</p>
          </div>
        )}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center"><p>{error}</p></div>}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <div className="w-20 h-20 shrink-0 flex items-center justify-center p-1 bg-gray-50 rounded-lg">
                    <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">{categoryTranslations[product.category] || product.category}</span>
                      <h2 className="text-xs font-bold text-gray-800 line-clamp-2 mt-0.5">{product.title}</h2>
                    </div>
                    <p className="text-sm font-black text-gray-900">${product.price.toFixed(2)}</p>
                  </div>
                </div>
                <button onClick={() => addToCart(product)} className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 rounded-lg text-xs transition-colors">+ Agregar al Carrito</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PANEL LATERAL DEL CARRITO */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/40" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-4 flex flex-col z-10 animate-slide-in">
            <div className="border-b border-gray-100 pb-3 mb-3 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">🛒 Carrito de Ventas</h2>
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">{totalItems} items</span>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl p-1">✕</button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 space-y-3 pr-1">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm"><p>El carrito está vacío.</p></div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100 justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold text-gray-800 truncate">{item.title}</h3>
                      <p className="text-[11px] text-gray-500 font-medium">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-gray-200 bg-white rounded-md">
                        <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 font-bold text-xs">-</button>
                        <span className="px-2 text-xs font-bold text-gray-800">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 font-bold text-xs">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 text-sm">🗑️</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-gray-100 pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-gray-600">Total a Pagar:</span>
                <span className="text-2xl font-black text-gray-950">${totalPrice.toFixed(2)}</span>
              </div>
              <button
                disabled={cart.length === 0}
                className={`w-full font-bold py-2.5 rounded-xl text-sm transition-colors ${
                  cart.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                onClick={() => alert(`Simulación POS: Venta exitosa por $${totalPrice.toFixed(2)}`)}
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

export default App;