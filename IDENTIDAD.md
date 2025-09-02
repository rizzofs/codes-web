# 🎨 **IDENTIDAD CSS COMPLETA DE CODES++**

## **1. PALETA DE COLORES PRINCIPAL**

```css
:root {
  --primary: #39c0c3;        /* Azul turquesa principal */
  --primary-dark: #2a8a8d;   /* Azul turquesa oscuro */
  --secondary: #1a1a1a;      /* Negro/gris muy oscuro */
  --background: #ffffff;      /* Blanco */
  --background-alt: #f8f9fa; /* Gris muy claro */
  --text: #2c3e50;           /* Azul grisáceo para texto */
  --text-light: #6c757d;     /* Gris para texto secundario */
  --border: #e9ecef;         /* Gris claro para bordes */
}
```

## **2. GRADIENTES**

```css
--gradient: linear-gradient(135deg, #39c0c3 0%, #2a8a8d 100%);
```

## **3. TIPOGRAFÍA**

- **Fuente principal**: `"Inter", sans-serif`
- **Pesos disponibles**: 300, 400, 500, 600, 700
- **Tamaños de títulos**:
  - H1: 4rem (hero), 2.5rem (móvil)
  - H2: 2.5rem (section-title)
  - H3: 1.25rem (event-card)

## **4. SOMBRAS Y EFECTOS**

```css
--shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
--shadow-hover: 0 20px 40px rgba(0, 0, 0, 0.15);
```

## **5. COMPONENTES PRINCIPALES**

### **Botones**

```css
.btn-primary {
  background: var(--gradient);
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(57, 192, 195, 0.3);
}
```

### **Tarjetas**

```css
.card {
  border: none;
  border-radius: 16px;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  overflow: hidden;
  background: white;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-hover);
}
```

### **Navbar**

```css
header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}
```

## **6. ANIMACIONES**

```css
/* Fade in up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hover effects */
.nav-link:hover {
  transform: translateY(-2px);
}

.card:hover {
  transform: translateY(-10px);
}
```

## **7. RESPONSIVE DESIGN**

```css
@media (max-width: 768px) {
  .hero h1 { font-size: 2.5rem; }
  .section-title { font-size: 2rem; }
}

@media (max-width: 576px) {
  .hero h1 { font-size: 2rem; }
  .section-title { font-size: 1.75rem; }
}
```

## **8. MODO OSCURO**

```css
[data-theme="dark"] {
  --background: #1a1a1a;
  --background-alt: #2d2d2d;
  --text: #ffffff;
  --text-light: #b0b0b0;
  --border: #404040;
}
```

## **9. ELEMENTOS ESPECIALES**

### **Scroll Indicator**

```css
.scroll-indicator {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--border);
  z-index: 1001;
}

.scroll-progress {
  height: 100%;
  background: var(--gradient);
  width: 0%;
  transition: width 0.3s ease;
}
```

### **Back to Top Button**

```css
#backToTop {
  background: var(--gradient);
  border: none;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
```

## **10. ARCHIVOS CSS INCLUIDOS**

- **Bootstrap 5.3.3**: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css`
- **Bootstrap Icons**: `https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css`
- **Google Fonts**: `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap`
- **CSS Personalizado**: `assets/css/styles.css`

## **11. ESTRUCTURA DE ARCHIVOS**

```
assets/
├── css/
│   └── styles.css          # Estilos principales
├── images/
│   ├── Logo.svg            # Logo principal
│   └── ISOLOGO SIN FONDO.png  # Favicon
└── js/
    ├── main.js             # JavaScript principal
    └── analytics-debug.js  # Debug de analytics
```

---

**Nota**: Esta es la identidad visual completa de CODES++. Puedes usar estos estilos, colores y componentes en cualquier otra página que quieras integrar, manteniendo la consistencia visual de la marca.


