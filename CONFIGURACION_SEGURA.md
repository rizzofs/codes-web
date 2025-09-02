# 🔐 CONFIGURACIÓN SEGURA - CODES++

## ⚠️ IMPORTANTE: DATOS SENSIBLES

**NUNCA subas archivos con tokens reales al repositorio público.**

## 📋 Pasos para Configurar de Forma Segura

### 1. **Regenerar Token de MercadoPago**
1. Ve a tu cuenta de MercadoPago
2. Ve a "Desarrolladores" → "Tus credenciales"
3. **REVOCA** el token expuesto: `APP_USR-5908100961878781-080320-3d4cf3e45d4723bffa7e302677cce571-2142366374`
4. **GENERA** un nuevo token de acceso
5. **COPIA** el nuevo token (lo necesitarás para Google Apps Script)

### 2. **Configurar Google Apps Script**
1. Abre tu proyecto de Google Apps Script
2. En el archivo `GOOGLE_SORTEO_EXISTENTE.gs`:
   ```javascript
   const MERCADOPAGO_ACCESS_TOKEN = 'TU_NUEVO_TOKEN_AQUI';
   ```
3. **NO** subas este archivo al repositorio

### 3. **Variables de Entorno (Recomendado)**
Para mayor seguridad, usa variables de entorno en Google Apps Script:

```javascript
// En lugar de hardcodear el token:
const MERCADOPAGO_ACCESS_TOKEN = 'TU_TOKEN_AQUI';

// Usa:
const MERCADOPAGO_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('MERCADOPAGO_TOKEN');
```

**Para configurar la variable:**
1. En Google Apps Script: "Proyecto" → "Configuración del proyecto"
2. Agrega propiedad: `MERCADOPAGO_TOKEN` = `tu_token_real`

## 🚨 ACCIONES INMEDIATAS REQUERIDAS

### ✅ **Completado:**
- [x] Enmascarado token en archivos del repositorio
- [x] Actualizado .gitignore para archivos sensibles
- [x] Creado documentación de configuración segura

### 🔄 **Pendiente (HACER AHORA):**
- [ ] **REVOCAR** el token expuesto en MercadoPago
- [ ] **GENERAR** nuevo token de acceso
- [ ] **ACTUALIZAR** Google Apps Script con nuevo token
- [ ] **HACER COMMIT** de los cambios de seguridad
- [ ] **VERIFICAR** que no hay más tokens expuestos

## 📞 Datos de Configuración

### MercadoPago
- **Access Token**: `[NUEVO_TOKEN_A_GENERAR]`
- **Collector ID**: `2142366374`
- **Email**: `rizzofs.eu@gmail.com`

### Google Sheets
- **Sheet ID**: `1rCNIwjzB--xtIyK4gMvqIxJGLETra4VqnF5aL8lRTMk`
- **Sheet Name**: `Registros_Sorteo`

## 🔒 Mejores Prácticas de Seguridad

1. **Nunca** hardcodees tokens en código público
2. **Usa** variables de entorno o servicios de configuración
3. **Revisa** .gitignore antes de hacer commit
4. **Rota** tokens regularmente
5. **Monitorea** accesos a tu cuenta de MercadoPago

## 📧 Contacto de Emergencia

Si detectas actividad sospechosa en tu cuenta de MercadoPago:
- **Email**: codes.unlu@gmail.com
- **Acción**: Revocar todos los tokens y generar nuevos
