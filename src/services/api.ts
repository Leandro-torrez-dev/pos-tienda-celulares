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


export const loginUser = async (username: string, password: string): Promise<string> => {
  const response = await fetch('https://fakestoreapi.com/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      username: username.trim(), 
      password: password.trim() 
    }),
  });

  if (!response.ok) {
    throw new Error('Error de autenticación en el servidor');
  }

  const data = await response.json();
  return data.token;
};