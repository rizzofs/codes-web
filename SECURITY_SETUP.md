# 🔒 Configuración de Seguridad - Sistema de Pagos

## ⚠️ IMPORTANTE: Protección de Datos Sensibles

Este documento explica cómo configurar el sistema de manera segura para evitar que datos sensibles se suban al repositorio.

## 📋 Archivos que Contienen Datos Sensibles

Los siguientes archivos contienen tokens de acceso reales y **NO deben subirse al repositorio**:

- `sistema-completo-pagos.gs` - Contiene el token de MercadoPago real
- `sistema-pagos-simple.gs` - Contiene el token de MercadoPago real
- `verificacion-pagos-simple.gs` - Contiene el token de MercadoPago real
- `test-configuracion.gs` - Contiene el token de MercadoPago real

## 🛡️ Configuración del .gitignore

Ya se ha creado un archivo `.gitignore` que excluye automáticamente estos archivos sensibles del control de versiones.

## 📝 Archivos Template Seguros

Se han creado los siguientes archivos template que contienen la misma funcionalidad pero con placeholders en lugar de datos sensibles:

- `sistema-completo-pagos-template.gs` - Sistema completo de pagos con MercadoPago
- `verificacion-manual-template.gs` - Sistema de verificación manual de pagos

## 🔧 Pasos para Configurar de Forma Segura

### 1. Configurar los Templates

#### Sistema Completo de Pagos:
1. Abre `sistema-completo-pagos-template.gs`
2. Reemplaza los siguientes valores:
   - `TU_ACCESS_TOKEN_AQUI` → Tu token real de MercadoPago
   - `TU_SHEET_ID_AQUI` → ID de tu Google Sheet
   - `TU_NOMBRE_DE_HOJA_AQUI` → Nombre de la hoja donde guardar datos

#### Sistema de Verificación Manual:
1. Abre `verificacion-manual-template.gs`
2. Reemplaza los siguientes valores:
   - `TU_SPREADSHEET_ID_AQUI` → ID de tu Google Sheet
   - `TU_NOMBRE_DE_HOJA_AQUI` → Nombre de la hoja donde guardar datos

### 2. Copiar a Google Apps Script

1. Copia el contenido del archivo template (con tus tokens reales)
2. Pégalo en Google Apps Script
3. Guarda el proyecto

### 3. Verificar Configuración

Ejecuta estas funciones en Google Apps Script para verificar que todo funcione:

```javascript
// Probar conexión con MercadoPago
probarMercadoPago();

// Buscar pagos recibidos
buscarPagosUsuario();

// Configurar verificación automática
configurarTrigger();
```

## 🚨 Reglas de Seguridad

### ✅ Lo que SÍ se puede subir al repositorio:
- Archivos HTML, CSS, JavaScript del frontend
- Archivos de documentación (README, MD)
- Archivos template sin tokens reales
- Archivos de configuración con placeholders

### ❌ Lo que NO se debe subir al repositorio:
- Tokens de acceso reales
- IDs de Google Sheets reales
- Credenciales de cualquier tipo
- Archivos con datos personales

## 🔄 Flujo de Trabajo Seguro

1. **Desarrollo**: Usa el archivo template para desarrollo
2. **Configuración**: Reemplaza los placeholders con datos reales
3. **Implementación**: Copia el código configurado a Google Apps Script
4. **Control de Versiones**: Solo sube archivos sin datos sensibles

## 📞 Datos de Configuración

### MercadoPago
- **Access Token**: `APP_USR-5908100961878781-080320-3d4cf3e45d4723bffa7e302677cce571-2142366374`
- **Collector ID**: `2142366374`
- **Email**: `rizzofs.eu@gmail.com`

### Google Sheets
- **Sheet ID**: (Reemplazar con tu ID real)
- **Sheet Name**: (Reemplazar con tu nombre de hoja)

## 🛠️ Comandos Útiles

Para verificar que no hay datos sensibles en el repositorio:

```bash
# Buscar tokens en archivos
grep -r "APP_USR-" .

# Buscar IDs de Google Sheets
grep -r "1B" . | grep -v ".gitignore"
```

## 📚 Recursos Adicionales

- [Documentación de MercadoPago API](https://developers.mercadopago.com/)
- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Google Sheets API](https://developers.google.com/sheets/api)

---

**Recuerda**: Nunca subas tokens reales al repositorio. Siempre usa el archivo template y reemplaza los valores localmente. 