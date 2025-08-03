# Sistema de Sorteo CODES++ - Estructura Reorganizada

## 📁 Nueva Estructura de Archivos

```
migrar/
├── config/
│   └── database.php              # Configuración centralizada de BD
├── includes/
│   ├── Validator.php             # Clase para validación de datos
│   └── PaymentHandler.php        # Clase para manejo de pagos
├── api/
│   └── process_sorteo.php        # API reorganizada
├── assets/
│   ├── js/
│   │   ├── config.js             # Configuración del frontend
│   │   ├── sorteo-v2.js          # JavaScript reorganizado
│   │   └── main.js               # JavaScript principal
│   ├── css/
│   └── images/
├── sorteo.html                   # Página principal del sorteo
└── database_setup.sql            # Script de base de datos
```

## 🔧 Mejoras Implementadas

### 1. **Configuración Centralizada**
- **`config/database.php`**: Todas las configuraciones en un solo lugar
- Constantes para precios, validaciones y configuraciones de pago
- Función centralizada para conexión a BD

### 2. **Validación Mejorada**
- **`includes/Validator.php`**: Clase dedicada a validaciones
- Validaciones más robustas y reutilizables
- Verificación de duplicados integrada

### 3. **Manejo de Pagos**
- **`includes/PaymentHandler.php`**: Clase para integración con pasarelas
- Soporte para múltiples pasarelas (MercadoPago, Stripe, etc.)
- Generación de enlaces de pago centralizada

### 4. **API Reorganizada**
- **`api/process_sorteo.php`**: Endpoint más limpio y estructurado
- Respuestas JSON estandarizadas
- Mejor manejo de errores

### 5. **JavaScript Moderno**
- **`assets/js/sorteo-v2.js`**: Clase SorteoApp para mejor organización
- **`assets/js/config.js`**: Configuración centralizada del frontend
- Mejor manejo de eventos y validaciones

## 🚀 Beneficios de la Reorganización

### **Mantenibilidad**
- Código más modular y reutilizable
- Separación clara de responsabilidades
- Configuración centralizada

### **Escalabilidad**
- Fácil agregar nuevas pasarelas de pago
- Estructura preparada para nuevas funcionalidades
- Configuración flexible

### **Seguridad**
- Validaciones más robustas
- Mejor manejo de errores
- Sanitización de datos centralizada

### **Rendimiento**
- Código más eficiente
- Mejor organización de recursos
- Carga optimizada de archivos

## 📋 Configuración Requerida

### 1. **Base de Datos**
```sql
-- Ejecutar database_setup.sql para crear las tablas necesarias
```

### 2. **Configuración de BD**
Editar `config/database.php`:
```php
define('DB_HOST', 'tu_host');
define('DB_NAME', 'tu_base_de_datos');
define('DB_USER', 'tu_usuario');
define('DB_PASS', 'tu_password');
```

### 3. **Configuración de Pagos**
Editar `config/database.php`:
```php
define('PAYMENT_GATEWAY', 'mercadopago');
define('PAYMENT_PUBLIC_KEY', 'tu_public_key');
define('PAYMENT_ACCESS_TOKEN', 'tu_access_token');
```

### 4. **Enlaces de Pago**
Editar `assets/js/config.js`:
```javascript
paymentLinks: {
    1: 'https://tu-enlace-1-chance',
    3: 'https://tu-enlace-3-chances',
    4: 'https://tu-enlace-4-chances'
}
```

## 🔄 Migración desde la Versión Anterior

### 1. **Backup**
```bash
# Hacer backup de archivos actuales
cp process_sorteo.php process_sorteo_backup.php
cp assets/js/sorteo.js assets/js/sorteo_backup.js
```

### 2. **Actualizar Referencias**
- El HTML ya está actualizado para usar `sorteo-v2.js`
- Las funciones globales mantienen compatibilidad

### 3. **Probar Funcionalidad**
- Verificar que el formulario funcione correctamente
- Probar validaciones y pagos
- Verificar que no haya errores en consola

## 🛠️ Funcionalidades Nuevas

### **Validación en Tiempo Real**
- Formateo automático de DNI y teléfono
- Validación instantánea de campos
- Mensajes de error más claros

### **Mejor UX**
- Animaciones suaves
- Estados de carga más claros
- Mensajes de éxito/error mejorados

### **Gestión de Estados**
- Mejor control del flujo de pago
- Estados más claros del formulario
- Manejo mejorado de errores

## 📞 Soporte

Para dudas o problemas con la nueva estructura:

1. Revisar los logs de error del servidor
2. Verificar la configuración de BD
3. Comprobar que todos los archivos estén en su lugar
4. Verificar permisos de archivos

## 🔄 Próximas Mejoras

- [ ] Panel de administración
- [ ] Estadísticas de participación
- [ ] Notificaciones por email
- [ ] Integración con redes sociales
- [ ] Sistema de sorteos múltiples 