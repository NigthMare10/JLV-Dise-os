# Manual de Usuario - JLV E-commerce

> **Bienvenido a la guía oficial de usuario.**
> Este documento detalla paso a paso cómo utilizar cada función de la plataforma JLV E-commerce, tanto para clientes como para administradores.

---

## Índice
1. [Navegación General](#1-navegación-general)
2. [Guía de Compras (Cliente)](#2-guía-de-compras-cliente)
3. [Panel de Administración](#3-panel-de-administración)
4. [Gestión de Inventario](#4-gestión-de-inventario)
5. [Seguridad y Accesos](#5-seguridad-y-accesos)
6. [Solución de Problemas](#6-solución-de-problemas)

---

## 1. Navegación General

La plataforma cuenta con un diseño intuitivo dividido en tres secciones principales:

- **Barra de Navegación (Navbar)**:
  - **Logo JLV**: Al hacer clic, siempre te llevará a la página de inicio.
  - **Carrito de Compras**: Un ícono de bolsa que muestra un contador rojo con la cantidad de artículos seleccionados.
  - **Botón de Tema (Sol/Luna)**: Permite alternar entre modo claro (ideal para el día) y modo oscuro (ideal para la noche).
  - **Botón Admin**: Un acceso discreto (ícono de candado o texto "Admin") para ingresar al panel de control.

- **Pie de Página (Footer)**:
  - Información de copyright y enlaces rápidos.

---

## 2. Guía de Compras (Cliente)

### Explorar Productos
En la página de inicio, encontrarás:
1. **Hero Section**: Un banner principal con la oferta destacada.
2. **Productos Más Vendidos**: Una sección automática que destaca los artículos populares.
3. **Catálogo Completo**: Una cuadrícula con todos los productos disponibles.

### Realizar un Pedido
1. **Seleccionar Producto**: Haz clic en la imagen o título de un producto para ver sus detalles completos (descripción ampliada, precio, categoría).
2. **Añadir al Carrito**: Presiona el botón negro **"Añadir al Carrito"**. Una notificación confirmará la acción.
3. **Revisar Carrito**: Haz clic en el ícono de la bolsa arriba a la derecha.
   - Aquí podrás ver el resumen de tu pedido.
   - Usa los botones `+` y `-` para ajustar cantidades.
   - Usa el botón de **Papelera** para eliminar un artículo.
4. **Finalizar Compra**:
   - Presiona el botón verde **"Finalizar Pedido vía WhatsApp"**.
   - El sistema abrirá automáticamente WhatsApp Web o la App con un mensaje pre-redactado que incluye:
     - Lista de productos.
     - Cantidades.
     - Total a pagar.
   - Solo tendrás que enviar el mensaje para contactar al vendedor.

---

## 3. Panel de Administración

Esta sección es exclusiva para el dueño de la tienda o gerentes. Permite controlar todo el inventario.

### Acceso
1. Dirígete a la ruta `/admin/login` o haz clic en el botón de candado en el menú.
2. Se te solicitará un **PIN de Seguridad**.
   - **PIN Predeterminado**: `Sauceda1234`
3. Al ingresar correctamente, serás redirigido al **Dashboard**.

> **Nota de Seguridad**: Si ingresas el PIN incorrectamente más de 10 veces en 1 minuto, el sistema bloqueará tu acceso temporalmente por seguridad.

### Dashboard (Tablero Principal)
El tablero te ofrece una vista rápida del estado de tu negocio:
- **Ventas Totales Estimadas**: Suma del valor de todos los productos marcados como vendidos.
- **Gráfico de Rendimiento**: Un gráfico de barras que muestra visualmente cuáles son tus 5 productos más exitosos.

---

## 4. Gestión de Inventario

Dentro del panel de administración, encontrarás la lista de productos. Aquí puedes realizar las siguientes acciones (CRUD):

### Agregar Nuevo Producto
1. Haz clic en el botón **"+ Nuevo Producto"**.
2. Rellena el formulario:
   - **Nombre**: Título del producto.
   - **Precio**: Valor en moneda local (Lempiras).
   - **Categoría**: Clasificación (ej: Gorras, Camisas).
   - **Imagen**: Sube una imagen desde tu dispositivo.
   - **Descripción**: Detalles del producto.
3. Guarda los cambios. El producto aparecerá inmediatamente en la tienda.

### Editar Producto
1. Ubica el producto en la lista.
2. Haz clic en el ícono del **Lápiz (Editar)**.
3. Modifica los campos necesarios (puedes cambiar solo el precio, o solo la imagen, etc.).
4. Guarda los cambios.

### Eliminar Producto
1. Ubica el producto que deseas retirar.
2. Haz clic en el ícono de la **Papelera (Eliminar)**.
3. Confirma la acción en el mensaje emergente.
   - **Advertencia**: Esta acción no se puede deshacer.

### Actualización Masiva de Precios
Una herramienta poderosa para épocas de rebajas o inflación.
1. Busca la sección **"Ajuste de Precios"** en la parte superior del inventario.
2. Ingresa un porcentaje:
   - Para **aumentar** precios un 10%, escribe: `10`.
   - Para **bajar** precios un 10%, escribe: `-10`.
3. Haz clic en **"Aplicar"**. Todos los precios del inventario se actualizarán automáticamente.

---

## 5. Seguridad y Accesos

### Protección de Datos
- **Almacenamiento Local**: Todos los datos de productos y carritos se guardan en el navegador del dispositivo donde se creó la tienda.
  - *Importante*: Si borras la caché del navegador del administrador, podrías perder los productos creados si no tienes respaldo.
- **PIN Encriptado**: El PIN no se guarda como texto; se usa un sistema de "Hash SHA-256" para que sea imposible de leer por hackers.

---

## 6. Solución de Problemas

**P: Olvidé el PIN de administrador.**
R: Por defecto es `Sauceda1234`. Si fue cambiado en el código, contacta al desarrollador.

**P: Los productos que agregué desaparecieron.**
R: Verificaste si cambiaste de navegador o borraste el historial? El sistema actual usa el almacenamiento del navegador. Asegúrate de usar siempre el mismo dispositivo para administrar.

**P: Las imágenes no cargan.**
R: Asegúrate de subir imágenes en formatos estándar (JPG, PNG) y que no sean extremadamente pesadas (más de 5MB), ya que podrían ralentizar la tienda.

---
**© 2026 JLV E-commerce**
