import { useEffect, useState } from 'react';
import type { Product } from './types/product';
import { getProducts } from './services/api';

// --- DICCIONARIO DE TRADUCCIÓN ---
// Mapeamos las categorías en inglés de la API a su versión correcta en español
const categoryTranslations: { [key: string]: string } = {
  'all': 'Todas',
  'electronics': 'Electrónicos',
  'jewelery': 'Joyería',
  'men\'s clothing': 'Ropa de Hombre',
  'women\'s clothing': 'Ropa de Mujer'
};

// Función auxiliar para quitar acentos (tildes) y hacer la búsqueda más amigable
// Ejemplo: "Electrónicos" se convierte en "electronicos" para que coincida si buscan sin tilde
const cleanText = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all'); // Inicializamos con 'all' en inglés

  useEffect(() => {
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
  }, []);

  // Extraemos las categorías originales en inglés de la API
  const rawCategories = ['all', ...new Set(products.map((p) => p.category))];

  // --- LÓGICA DE FILTRADO OPTIMIZADA EN ESPAÑOL ---
  const filteredProducts = products.filter((product) => {
    const cleanedSearch = cleanText(searchTerm);
    const cleanedTitle = cleanText(product.title);
    
    // Obtenemos la traducción de la categoría del producto actual
    const translatedCategory = categoryTranslations[product.category] || product.category;
    const cleanedCategory = cleanText(translatedCategory);

    // El usuario puede buscar por el nombre del producto O por el nombre de la categoría en español
    const matchesSearch = cleanedTitle.includes(cleanedSearch) || cleanedCategory.includes(cleanedSearch);
    
    // El filtro de botones compara usando las categorías en inglés que maneja el estado internamente
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          📱 Catálogo Tienda & POS
        </h1>
        <p className="text-gray-500 mt-2">Prueba Técnica - Frontend Junior</p>
      </header>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      {!loading && !error && (
        <div className="max-w-7xl mx-auto mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Buscador inteligente */}
            <div className="w-full md:w-1/3">
              <input
                type="text"
                placeholder="🔍 Buscar por nombre o categoría (ej: electrónicos)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
              />
            </div>

            {/* Filtro de Categorías Traducidas */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
              {rawCategories.map((rawCategory) => (
                <button
                  key={rawCategory}
                  onClick={() => setSelectedCategory(rawCategory)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedCategory === rawCategory
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {/* Mostramos el texto en español, pero el ID del botón sigue siendo el de la API */}
                  {categoryTranslations[rawCategory] || rawCategory}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Manejo del Estado de Carga */}
      {loading && (
        <div className="text-center py-10">
          <p className="text-xl font-medium text-blue-600 animate-pulse">Cargando catálogo de productos...</p>
        </div>
      )}

      {/* Manejo de Errores */}
      {error && (
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
          <p>{error}</p>
        </div>
      )}

      {/* LISTA DE PRODUCTOS FILTRADOS */}
      {!loading && !error && (
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
              <p className="text-gray-400 text-lg">No se encontraron productos que coincidan con tu búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="w-full h-48 flex items-center justify-center p-2 bg-gray-50 rounded-lg mb-4">
                      <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain" />
                    </div>
                    {/* Mostramos la categoría traducida al español en la tarjeta */}
                    <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">
                      {categoryTranslations[product.category] || product.category}
                    </span>
                    <h2 className="text-sm font-bold text-gray-800 mt-1 line-clamp-2 h-10">{product.title}</h2>
                  </div>
                  <div className="mt-4">
                    <p className="text-xl font-black text-gray-950">${product.price.toFixed(2)}</p>
                    <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors">
                      Agregar al Carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;