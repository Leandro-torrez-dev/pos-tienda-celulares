# 📱 Sistema POS & Catálogo de Tienda Virtual

Una aplicación web moderna, reactiva y altamente optimizada de Punto de Venta (POS) y catálogo interactivo. Este proyecto ha sido desarrollado con un enfoque riguroso en la experiencia de usuario (UX), micro-interacciones avanzadas y seguridad en el flujo de datos.

## 🔗 Demo en Vivo
La aplicación se encuentra desplegada en la nube y puede ser probada en tiempo real desde cualquier dispositivo a través del siguiente enlace:  
🚀 https://pos-tienda-celulares.vercel.app

---

## 🔑 Credenciales de Acceso Autorizadas

Por motivos de control de seguridad en la gestión de operadores de la tienda, el acceso a la plataforma está restringido de forma estricta. El formulario cuenta con un validador que distingue de forma exacta entre mayúsculas y minúsculas (*case-sensitive*). 

Utilice los siguientes datos exactos para iniciar sesión:

*   **Usuario de la Tienda:** `Cliente`
*   **Contraseña de Seguridad:** `Admin123`

*Nota: Cualquier variación en las mayúsculas (como escribir "cliente" o "admin123") bloqueará el acceso por seguridad. El sistema gestiona la persistencia del inicio de sesión mediante LocalStorage.*

---

## 🛠️ Stack Tecnológico Utilizado

*   **React 18** junto con **TypeScript** para una arquitectura de componentes escalable, limpia y fuertemente tipada.
*   **Tailwind CSS (v4 / Optimizado)** para un estilizado moderno de alto rendimiento, soporte nativo de transiciones y diseño completamente adaptable (*responsive design*).
*   **Vite** como empaquetador y entorno de ejecución ultra veloz para desarrollo frontend.
*   **Fake Store API** para el consumo asíncrono y renderizado dinámico de productos externos mediante servicios REST.

---

## ⚙️ Características Destacadas e Implementaciones de UI/UX

1.  **Módulo de Autenticación Independiente y Estricto:** Pantalla de Login blindada con manejo riguroso de errores en tiempo real, validación tipográfica exacta y protección ante campos vacíos.
2.  **Modo Oscuro Nativo y Persistente (Dark Mode):** Interruptor dinámico incorporado en el encabezado que permite alternar la interfaz para mitigar la fatiga visual. La preferencia del usuario se almacena de forma persistente a través de `localStorage`.
3.  **Skeleton Loader Realista:** Mitigación de tiempos de espera de red mediante tarjetas parpadeantes (`animate-pulse`) que simulan la estructura exacta del catálogo mientras se consumen los datos de internet.
4.  **Micro-interacciones en el Catálogo:** Tarjetas interactivas con efectos fluidos que reaccionan al cursor, elevándose en el eje Y (`hover:-translate-y-1.5`), profundizando sus sombras y aplicando un zoom suave a las imágenes.
5.  **Buscador y Filtros por Categoría Inteligentes:** Sistema de búsqueda avanzado internacionalizado al español que procesa los textos de forma insensible a mayúsculas, tildes o caracteres especiales.
6.  **Panel de Carrito POS Interactiva:** Caja lateral flotante que permite añadir productos, actualizar unidades y eliminar artículos, recalculando el monto acumulado en tiempo real. El botón de acceso posee un pulso dinámico cuando hay transacciones activas.
7.  **Flujo Post-Venta Comercial:** Al simular la venta con éxito, el sistema vacía el carrito a cero, cierra el panel lateral y restablece de forma automática las alertas del Punto de Venta.
8.  **Ficha Técnica Dinámica:** Navegación interna fluida para consultar la descripción extendida y valoración por estrellas de cada artículo sin necesidad de dependencias externas pesadas.

---

## 🚀 Ejecución en Entorno Local

Si desea clonar este repositorio para revisar el código o ejecutarlo en un servidor de desarrollo local:

1. Clone este repositorio en su máquina:
```
   git clone [https://github.com/Leandro-torrez-dev/pos-tienda-celulares.git](https://github.com/Leandro-torrez-dev/pos-tienda-celulares.git)

2. Instale los módulos y dependencias del proyecto:
```
   npm install

3. Inicie el servidor local de Vite:
```
   npm run dev

4. Abra en su navegador la dirección asignada: http://localhost:5173