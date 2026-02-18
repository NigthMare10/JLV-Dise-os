# Documentación Técnica - JLV E-commerce

> **Versión:** 1.0.0
> **Fecha:** 18 de Febrero, 2026
> **Autor:** Cesar Andre Martinez Vivas 

Esta documentación está dirigida a desarrolladores y mantenedores del proyecto. Contiene una descripción exhaustiva de la arquitectura, variables, funciones y lógica del sistema.

---

## 1. Visión General del Proyecto

**JLV E-commerce** es una aplicación web de comercio electrónico moderna y minimalista construida con tecnologías de vanguardia. Su objetivo es proporcionar una experiencia de usuario fluida y una gestión administrativa sencilla sin necesidad de un backend complejo en su fase inicial.

### Stack Tecnológico
- **Framework Principal:** [Next.js 15](https://nextjs.org/) (App Router)
- **Biblioteca UI:** [React 18+](https://react.dev/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) (Tipado estático estricto)
- **Estilos:** [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Iconografía:** [Lucide React](https://lucide.dev/)
- **Animaciones:** [Framer Motion](https://www.framer.com/motion/)
- **Manejo de Estado:** React Context API + LocalStorage
- **Seguridad:** SHA-256 Hashing (Web Crypto API) + Rate Limiting (Middleware)

---

## 2. Arquitectura del Proyecto

El proyecto sigue la convención de **App Router** de Next.js.

### Estructura de Directorios (`src/`)

```text
src/
├── app/                        # Rutas y Páginas
│   ├── admin/                  # Sección administrativa
│   │   ├── login/              # Página de login (/admin/login)
│   │   └── page.tsx            # Dashboard principal (/admin)
│   ├── cart/                   # Carrito de compras (/cart)
│   ├── product/[id]/           # Página dinámica de producto (/product/123)
│   ├── globals.css             # Estilos globales y variables CSS
│   ├── layout.tsx              # Layout raíz (HTML, Body, Providers)
│   └── page.tsx                # Página de inicio (Landing Page)
├── components/                 # Componentes de UI
│   ├── admin/                  # Componentes específicos del admin
│   ├── layout/                 # Navbar, Footer
│   ├── product/                # Tarjetas de producto, Grid
│   └── ui/                     # Componentes base (Button, Inputs)
├── context/                    # Lógica de Estado Global
│   └── store.tsx               # StoreContext y Provider
├── hooks/                      # Custom Hooks (actualmente vacío)
├── lib/                        # Utilidades y Funciones Puras
│   ├── security.ts             # Lógica de Hashing y validación
│   └── utils.ts                # Utilidad 'cn' para clases condicionales
├── types/                      # Definiciones de Tipos TypeScript
│   └── index.ts                # Interfaces Core (Product, CartItem)
└── middleware.ts               # Lógica de Edge (Rate Limiting)
```

---

## 3. Diccionario de Datos (Variables y Tipos)

A continuación, se detallan las interfaces y variables clave utilizadas en todo el proyecto.

### 3.1 Interfaces Principales (`src/types/index.ts`)

#### `Product`
Representa un artículo en venta.
```typescript
interface Product {
    id: string;          // Identificador único (UUID o string simple)
    title: string;       // Nombre del producto
    description: string; // Descripción detallada
    price: number;       // Precio unitario
    imageUrl: string;    // URL de la imagen (puede ser Base64 o enlace externo)
    category: string;    // Categoría (ej: "Ropa", "Accesorios")
    soldCount: number;   // Cantidad de veces vendido (para "Más Vendidos")
    createdAt: string;   // Fecha de creación (ISO string)
}
```

#### `CartItem`
Extiende de `Product` añadiendo cantidad.
```typescript
interface CartItem extends Product {
    quantity: number;    // Cantidad del producto en el carrito
}
```

#### `StoreContextType`
Define la API pública del Contexto.
```typescript
interface StoreContextType {
    products: Product[];
    cart: CartItem[];
    isAdmin: boolean;
    addProduct: (product: Product) => void;
    updateProduct: (id: string, updates: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    addToCart: (product: Product) => void;
    removeFromCart: (id: string) => void;
    updateCartQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    loginAdmin: () => void;
    logoutAdmin: () => void;
    applyBulkPriceUpdate: (percentage: number) => void;
}
```

### 3.2 Variables de Persistencia (LocalStorage)

El estado persiste en el navegador del usuario utilizando las siguientes claves:

| Clave (Key) | Tipo de Dato | Descripción |
| :--- | :--- | :--- |
| `jlv_products` | `JSON String (Product[])` | Array de productos. Si no existe, se carga `defaultProducts`. |
| `jlv_cart` | `JSON String (CartItem[])` | Estado actual del carrito de compras. |

### 3.3 Constantes de Seguridad (`src/lib/security.ts`)

| Variable | Valor | Descripción |
| :--- | :--- | :--- |
| `ADMIN_PIN_HASH` | `744bcc5f...` | Hash SHA-256 del PIN administrativo. |
| **PIN Original** | `Sauceda1234` | Clave por defecto (no almacenada en código plano). |

---

## 4. Lógica de Negocio y Funciones

### 4.1 Gestión de Estado (`src/context/store.tsx`)

El `StoreProvider` encapsula toda la lógica de negocio.

- **`useEffect` (Inicialización)**: Al montar el componente, intenta leer `localStorage`.
    - Si `jlv_products` existe y es válido, lo carga.
    - Si no, carga `defaultProducts` (4 productos de ejemplo).
- **`addProduct`**: Añade un producto al array y actualiza `localStorage`.
- **`applyBulkPriceUpdate(percentage)`**:
    - Calcula un factor: `1 + (percentage / 100)`.
    - Itera sobre todos los productos multiplicando su precio por el factor.
    - Redondea el resultado con `Math.round()`.

### 4.2 Seguridad y Autenticación

#### Validación de PIN (`src/lib/security.ts`)
```typescript
async function verifyPin(inputPin: string): Promise<boolean>
```
1. Convierte `inputPin` a `Uint8Array`.
2. Genera un hash SHA-256 usando `crypto.subtle.digest`.
3. Convierte el hash a string Hexadecimal.
4. Compara estrictamente con `ADMIN_PIN_HASH`.

#### Rate Limiting (`src/middleware.ts`)
Protege la ruta `/admin/login`.
- **Límite**: 10 peticiones por minuto por IP.
- **Almacenamiento**: `Map<string, { count: number, lastReset: number }>` en memoria.
- **Respuesta**: Retorna `429 Too Many Requests` si se excede el límite.

---

## 5. Componentes Clave

### `src/components/ui/Button.tsx`
Componente base wrapper de HTMLButtonElement.
- **Props**: Acepta `variant` ('default', 'outline', 'ghost') y `size`.
- **Uso**: Utiliza `cn()` para fusionar clases de Tailwind de forma segura.

### `src/components/ui/ThemeToggle.tsx`
Botón flotante o en navbar para alternar entre modo Claro/Oscuro.
- Interactúa directamente con la clase `dark` en el elemento `html`.

---

## 6. Guía de Mantenimiento y Expansión

### Cómo agregar una Base de Datos Real
Actualmente, el proyecto es "Client-Side Only" para persistencia. Para conectar una DB:
1. **Backend**: Crear endpoints en `src/app/api/products/route.ts` (GET, POST).
2. **Database**: Configurar Prisma ORM o Mongoose.
3. **Context**: Modificar `store.tsx` para que `useEffect` haga `fetch('/api/products')` en lugar de leer `localStorage`.

### Cómo cambiar el PIN de Administrador
1. Generar un nuevo hash SHA-256 de tu nueva contraseña (puedes usar una herramienta online o la consola del navegador).
2. Actualizar la constante `ADMIN_PIN_HASH` en `src/lib/security.ts`.
3. **Nota**: No cambies el código para guardar el PIN en texto plano.

### Solución de Problemas Comunes
- **Problema**: Los cambios en productos no se guardan.
    - **Causa**: El navegador puede estar en modo incógnito o tener almacenamiento desactivado.
    - **Solución**: Verificar permisos de `localStorage`.
- **Problema**: Error de hidratación en Next.js.
    - **Causa**: Diferencia entre HTML renderizado en servidor y cliente (común con `localStorage`).
    - **Solución**: Asegurarse de que el renderizado dependiente de datos guardados solo ocurra despues de que el componente se haya montado (`useEffect`). (Ya implementado correctamente en `StoreContext`).
