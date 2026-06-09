import type { Product } from '../types/product';

const BASE_URL = 'https://fakestoreapi.com';

// Función para obtener todos los productos de la API
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
      throw new Error('Error al conectar con el servidor');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en getProducts:", error);
    throw error;
  }
};