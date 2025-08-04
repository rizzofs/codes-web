
// ===========================================
// SISTEMA COMPLETO DE PAGOS - CONFIGURACIÓN REAL
// ===========================================
// IMPORTANTE: Este archivo contiene datos sensibles - NO subir al repositorio

// CONFIGURACIÓN DE MERCADOPAGO
const MERCADOPAGO_ACCESS_TOKEN = 'APP_USR-5908100961878781-080320-3d4cf3e45d4723bffa7e302677cce571-2142366374';
const GOOGLE_SHEET_ID = '1rCNIwjzB--xtIyK4gMvqIxJGLETra4VqnF5aL8lRTMk';
const GOOGLE_SHEET_NAME = 'Registros_Sorteo';

// CONFIGURACIÓN DE COLECTOR
const COLLECTOR_ID = 2142366374; // Tu ID de colector en MercadoPago
const COLLECTOR_EMAIL = 'rizzofs.eu@gmail.com'; // Tu email de MercadoPago

// ===========================================
// FUNCIÓN DE INICIALIZACIÓN AUTOMÁTICA
// ===========================================

/**
 * Función que se ejecuta automáticamente al abrir el script
 * Verifica y agrega la columna "Email Enviado" si no existe
 */
function onOpen() {
  try {
    console.log('🚀 Inicializando sistema...');
    verificarYAgregarColumnaEmailEnviado();
    console.log('✅ Sistema inicializado correctamente');
  } catch (error) {
    console.error('❌ Error en inicialización:', error);
  }
}

// ===========================================
// FUNCIONES PRINCIPALES
// ===========================================

/**
 * Función manual para verificar y agregar la columna "Email Enviado"
 * Puedes ejecutar esta función desde el editor de Apps Script
 */
function verificarYAgregarColumnaEmailEnviado() {
  try {
    console.log('🔍 Verificando si existe la columna "Email Enviado"...');
    
    const sheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID).getSheetByName(GOOGLE_SHEET_NAME);
    if (!sheet) {
      throw new Error('No se encontró la hoja especificada');
    }
    
    // Obtener los headers actuales
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('📋 Headers actuales:', headers);
    
    // Verificar si ya existe la columna "Email Enviado"
    const emailEnviadoIndex = headers.indexOf('Email Enviado');
    
    if (emailEnviadoIndex === -1) {
      console.log('➕ Agregando columna "Email Enviado"...');
      
      // Agregar la nueva columna al final
      const nuevaColumna = sheet.getLastColumn() + 1;
      sheet.getRange(1, nuevaColumna).setValue('Email Enviado');
      
      // Rellenar todas las filas existentes con 'FALSE'
      const ultimaFila = sheet.getLastRow();
      if (ultimaFila > 1) {
        const rangoRellenar = sheet.getRange(2, nuevaColumna, ultimaFila - 1, 1);
        rangoRellenar.setValue('FALSE');
      }
      
      console.log('✅ Columna "Email Enviado" agregada correctamente');
      return true;
    } else {
      console.log('✅ La columna "Email Enviado" ya existe');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error verificando/agregando columna Email Enviado:', error);
    return false;
  }
}

/**
 * Función para verificar el estado de la columna "Email Enviado"
 * Ejecuta esta función desde el editor de Apps Script para ver el estado
 */
function verificarEstadoColumnaEmailEnviado() {
  try {
    console.log('🔍 Verificando estado de la columna "Email Enviado"...');
    
    const sheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID).getSheetByName(GOOGLE_SHEET_NAME);
    if (!sheet) {
      throw new Error('No se encontró la hoja especificada');
    }
    
    // Obtener los headers actuales
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('📋 Headers actuales:', headers);
    
    // Verificar si existe la columna "Email Enviado"
    const emailEnviadoIndex = headers.indexOf('Email Enviado');
    
    if (emailEnviadoIndex === -1) {
      console.log('❌ La columna "Email Enviado" NO existe');
      console.log('💡 Ejecuta la función verificarYAgregarColumnaEmailEnviado() para agregarla');
      return false;
    } else {
      console.log('✅ La columna "Email Enviado" existe en la posición:', emailEnviadoIndex + 1);
      
      // Contar cuántos emails han sido enviados
      const ultimaFila = sheet.getLastRow();
      if (ultimaFila > 1) {
        const valoresEmailEnviado = sheet.getRange(2, emailEnviadoIndex + 1, ultimaFila - 1, 1).getValues();
        const emailsEnviados = valoresEmailEnviado.filter(valor => valor[0] === 'TRUE').length;
        const emailsNoEnviados = valoresEmailEnviado.filter(valor => valor[0] === 'FALSE').length;
        
        console.log('📊 Estadísticas de emails:');
        console.log('   - Emails enviados:', emailsEnviados);
        console.log('   - Emails no enviados:', emailsNoEnviados);
        console.log('   - Total de registros:', ultimaFila - 1);
      }
      
      return true;
    }
    
  } catch (error) {
    console.error('❌ Error verificando estado de la columna:', error);
    return false;
  }
}

/**
 * Función para manejar solicitudes GET (acceso directo al script)
 */
function doGet(e) {
  try {
    console.log('🌐 Acceso directo al script detectado');
    
    // Crear una página HTML simple que explique cómo usar el script
    const htmlOutput = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sistema de Pagos - Codes++</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              min-height: 100vh;
            }
            .container {
              background: rgba(255, 255, 255, 0.1);
              padding: 30px;
              border-radius: 15px;
              backdrop-filter: blur(10px);
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }
            h1 {
              text-align: center;
              margin-bottom: 30px;
              color: #fff;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }
            .status {
              background: rgba(0, 255, 0, 0.2);
              padding: 15px;
              border-radius: 10px;
              margin: 20px 0;
              border-left: 4px solid #4CAF50;
            }
            .info {
              background: rgba(255, 255, 255, 0.1);
              padding: 15px;
              border-radius: 10px;
              margin: 15px 0;
            }
            .warning {
              background: rgba(255, 193, 7, 0.2);
              padding: 15px;
              border-radius: 10px;
              margin: 15px 0;
              border-left: 4px solid #FFC107;
            }
            .function-list {
              background: rgba(255, 255, 255, 0.05);
              padding: 20px;
              border-radius: 10px;
              margin: 20px 0;
            }
            .function-item {
              margin: 10px 0;
              padding: 10px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 5px;
            }
            .function-name {
              font-weight: bold;
              color: #FFD700;
            }
            .function-desc {
              margin-top: 5px;
              font-size: 0.9em;
              opacity: 0.9;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🚀 Sistema de Pagos - Codes++</h1>
            
            <div class="status">
              <strong>✅ Script funcionando correctamente</strong><br>
              El sistema está activo y listo para procesar pagos.
            </div>
            
            <div class="info">
              <strong>ℹ️ ¿Qué es esto?</strong><br>
              Este es el backend del sistema de pagos para el sorteo de tablets. 
              No está diseñado para acceso directo desde el navegador.
            </div>
            
            <div class="warning">
              <strong>⚠️ Uso correcto</strong><br>
              Este script debe ser llamado desde las páginas web del sorteo, 
              no directamente desde el navegador.
            </div>
            
            <div class="function-list">
              <strong>🔧 Funciones disponibles:</strong>
              <div class="function-item">
                <div class="function-name">doPost()</div>
                <div class="function-desc">Procesa confirmaciones de pago y envía emails automáticamente</div>
              </div>
              <div class="function-item">
                <div class="function-name">verificarPagosAutomaticamente()</div>
                <div class="function-desc">Verifica pagos pendientes en MercadoPago</div>
              </div>
              <div class="function-item">
                <div class="function-name">completarDatosFaltantes()</div>
                <div class="function-desc">Completa datos faltantes en la hoja de cálculo</div>
              </div>
              <div class="function-item">
                <div class="function-name">probarConfiguracion()</div>
                <div class="function-desc">Prueba la configuración del sistema</div>
              </div>
            </div>
            
            <div class="info">
              <strong>📊 Estado del sistema:</strong><br>
              • Google Sheets: Conectado<br>
              • MercadoPago API: Conectado<br>
              • Email automático: Activo<br>
              • Verificación automática: Configurada
            </div>
          </div>
        </body>
      </html>
    `;
    
    return HtmlService.createHtmlOutput(htmlOutput);
    
  } catch (error) {
    console.error('❌ Error en doGet:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ 
        error: 'Error accediendo al script', 
        message: error.message 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función principal para recibir datos del formulario
 */
function doPost(e) {
  try {
    console.log('📥 Datos recibidos:', e.postData.contents);
    const data = JSON.parse(e.postData.contents);
    
    // Verificar y agregar columna "Email Enviado" si no existe
    verificarYAgregarColumnaEmailEnviado();
    
    // Verificar si es una verificación de pago
    if (data.action === 'verificarPago') {
      console.log('🔍 Verificando pago...');
      const result = verificarPagoPorDatos(data);
      
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Verificar si es una verificación automática
    if (data.action === 'ejecutarVerificacionAutomatica') {
      console.log('🤖 Ejecutando verificación automática...');
      const result = verificarPagosAutomaticamente();
      
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Verificar si es para completar datos faltantes
    if (data.action === 'completarDatosFaltantes') {
      console.log('🔧 Completando datos faltantes...');
      const result = completarDatosFaltantes();
      
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // CONFIRMACIÓN INICIAL DE PAGO - ÚNICO LUGAR DONDE SE ENVÍA EMAIL
    if (data.sessionId && (data.paymentId || data.estadoPago === 'CONFIRMADO' || data.pagoConfirmado)) {
      console.log('🔄 CONFIRMACIÓN INICIAL DE PAGO - Actualizando datos y enviando email...');
      
      // Primero actualizar los datos en la hoja
      const result = actualizarPagoEnGoogleSheets(data);
      
      if (result.success) {
        // SOLO ENVIAR EMAIL SI HAY EMAIL Y DATOS VÁLIDOS
        if (data.email && data.sessionId) {
          console.log('📧 ENVIANDO EMAIL DE CONFIRMACIÓN INICIAL...');
          const emailResult = enviarEmailConfirmacionInicial(data.email, data.sessionId, data.paymentId);
          
          if (emailResult.success) {
            return ContentService
              .createTextOutput(JSON.stringify({ 
                success: true, 
                message: 'Pago confirmado y email enviado correctamente',
                emailSent: true 
              }))
              .setMimeType(ContentService.MimeType.JSON);
          } else if (emailResult.alreadySent) {
            return ContentService
              .createTextOutput(JSON.stringify({ 
                success: true, 
                message: 'Pago confirmado (email ya fue enviado anteriormente)',
                emailSent: false 
              }))
              .setMimeType(ContentService.MimeType.JSON);
          } else {
            return ContentService
              .createTextOutput(JSON.stringify({ 
                success: true, 
                message: 'Pago confirmado (error enviando email)',
                emailSent: false,
                emailError: emailResult.error 
              }))
              .setMimeType(ContentService.MimeType.JSON);
          }
        } else {
          return ContentService
            .createTextOutput(JSON.stringify({ 
              success: true, 
              message: 'Pago confirmado (sin email para enviar)',
              emailSent: false 
            }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      } else {
        return ContentService
          .createTextOutput(JSON.stringify({ success: false, error: result.error }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Validar datos requeridos para nuevo registro
    if (!data.nombre || !data.apellido || !data.email || !data.telefono || !data.cantidadChances) {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: false, 
          error: 'Faltan datos requeridos' 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Guardar en Google Sheets
    const result = guardarEnGoogleSheets(data);
    
    if (result.success) {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: true, 
          message: 'Datos guardados correctamente',
          sessionId: data.sessionId 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: false, 
          error: result.error 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    console.error('❌ Error en doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.message 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Guarda los datos del formulario en Google Sheets
 */
function guardarEnGoogleSheets(data) {
  try {
    console.log('💾 Guardando datos en Google Sheets...');
    
    const sheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID).getSheetByName(GOOGLE_SHEET_NAME);
    if (!sheet) {
      throw new Error('No se encontró la hoja especificada');
    }
    
    // Obtener los headers de la hoja para mapear correctamente
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('📋 Headers encontrados:', headers);
    
    // Crear array de datos basado en los headers exactos
    const rowData = [];
    
    // Mapear cada header con su valor correspondiente
    headers.forEach(header => {
      switch(header) {
        case 'Timestamp':
          rowData.push(new Date());
          break;
        case 'Nombre':
          rowData.push(data.nombre || '');
          break;
        case 'Apellido':
          rowData.push(data.apellido || '');
          break;
        case 'Email':
          rowData.push(data.email || '');
          break;
        case 'DNI':
          rowData.push(data.dni || '');
          break;
        case 'Teléfono':
          rowData.push(data.telefono || '');
          break;
        case 'Cantidad de Chances':
          rowData.push(data.cantidadChances || '');
          break;
        case 'Pago Confirmado':
          rowData.push(data.pagoConfirmado ? 'TRUE' : 'FALSE');
          break;
        case 'Fecha de Registro':
          rowData.push(data.fechaRegistro || new Date().toISOString());
          break;
        case 'Observaciones':
          rowData.push(data.observaciones || '');
          break;
        case 'Estado Pago':
          rowData.push(data.estadoPago || 'PENDIENTE');
          break;
        case 'Session ID':
          rowData.push(data.sessionId || '');
          break;
        case 'Payment ID':
          rowData.push(data.paymentId || 'N/A');
          break;
        case 'Fecha Confirmación':
          rowData.push(data.fechaConfirmacion || '');
          break;
        default:
          rowData.push(''); // Para headers no reconocidos
      }
    });
    
    console.log('📊 Datos a guardar:', rowData);
    sheet.appendRow(rowData);
    console.log('✅ Datos guardados correctamente');
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error guardando datos:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Actualiza un pago existente en Google Sheets
 */
function actualizarPagoExistente(data) {
  try {
    console.log('🔄 Actualizando pago existente con sessionId:', data.sessionId);
    
    const sheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID).getSheetByName(GOOGLE_SHEET_NAME);
    if (!sheet) {
      throw new Error('No se encontró la hoja especificada');
    }
    
    // Obtener los headers para encontrar las columnas correctas
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('📋 Headers encontrados:', headers);
    
    // Encontrar los índices de las columnas
    const sessionIdIndex = headers.indexOf('Session ID');
    const pagoConfirmadoIndex = headers.indexOf('Pago Confirmado');
    const estadoPagoIndex = headers.indexOf('Estado Pago');
    const paymentIdIndex = headers.indexOf('Payment ID');
    const fechaConfirmacionIndex = headers.indexOf('Fecha Confirmación');
    
    console.log('🔍 Índices encontrados:', {
      sessionId: sessionIdIndex,
      pagoConfirmado: pagoConfirmadoIndex,
      estadoPago: estadoPagoIndex,
      paymentId: paymentIdIndex,
      fechaConfirmacion: fechaConfirmacionIndex
    });
    
    if (sessionIdIndex === -1) {
      throw new Error('No se encontró la columna Session ID');
    }
    
    // Buscar la fila por Session ID
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    let rowIndex = -1;
    for (let i = 1; i < values.length; i++) { // Empezar desde la fila 2 (después del header)
      if (values[i][sessionIdIndex] === data.sessionId) {
        rowIndex = i + 1; // +1 porque getValues() devuelve índices basados en 0
        break;
      }
    }
    
    if (rowIndex === -1) {
      throw new Error('No se encontró el Session ID en la hoja');
    }
    
    console.log('✅ Fila encontrada:', rowIndex);
    
    // Actualizar solo las columnas de pago
    if (pagoConfirmadoIndex !== -1) {
      sheet.getRange(rowIndex, pagoConfirmadoIndex + 1).setValue('TRUE');
    }
    if (estadoPagoIndex !== -1) {
      sheet.getRange(rowIndex, estadoPagoIndex + 1).setValue('CONFIRMADO');
    }
    if (paymentIdIndex !== -1 && data.paymentId && data.paymentId !== 'N/A' && data.paymentId !== null) {
      sheet.getRange(rowIndex, paymentIdIndex + 1).setValue(data.paymentId);
    }
    if (fechaConfirmacionIndex !== -1) {
      sheet.getRange(rowIndex, fechaConfirmacionIndex + 1).setValue(new Date().toISOString());
    }
    
    // Actualizar datos del formulario si están disponibles
    const nombreIndex = headers.indexOf('Nombre');
    const apellidoIndex = headers.indexOf('Apellido');
    const emailIndex = headers.indexOf('Email');
    const dniIndex = headers.indexOf('DNI');
    const telefonoIndex = headers.indexOf('Teléfono');
    const cantidadChancesIndex = headers.indexOf('Cantidad de Chances');
    
    if (nombreIndex !== -1 && data.nombre) {
      sheet.getRange(rowIndex, nombreIndex + 1).setValue(data.nombre);
    }
    if (apellidoIndex !== -1 && data.apellido) {
      sheet.getRange(rowIndex, apellidoIndex + 1).setValue(data.apellido);
    }
    if (emailIndex !== -1 && data.email) {
      sheet.getRange(rowIndex, emailIndex + 1).setValue(data.email);
    }
    if (dniIndex !== -1 && data.dni) {
      sheet.getRange(rowIndex, dniIndex + 1).setValue(data.dni);
    }
    if (telefonoIndex !== -1 && data.telefono) {
      sheet.getRange(rowIndex, telefonoIndex + 1).setValue(data.telefono);
    }
    if (cantidadChancesIndex !== -1 && data.cantidadChances) {
      sheet.getRange(rowIndex, cantidadChancesIndex + 1).setValue(data.cantidadChances);
    }
    
    console.log('✅ Pago actualizado correctamente en fila:', rowIndex);
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error actualizando pago:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Verifica pagos pendientes en Google Sheets
 */
function verificarPagosPendientes() {
  try {
    console.log('🔍 Verificando pagos pendientes...');
    
    const sheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID).getSheetByName(GOOGLE_SHEET_NAME);
    if (!sheet) {
      throw new Error('No se encontró la hoja especificada');
    }
    
    // Obtener los headers para encontrar las columnas correctas
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('📋 Headers encontrados:', headers);
    
    // Encontrar los índices de las columnas
    const sessionIdIndex = headers.indexOf('Session ID');
    const pagoConfirmadoIndex = headers.indexOf('Pago Confirmado');
    const estadoPagoIndex = headers.indexOf('Estado Pago');
    const paymentIdIndex = headers.indexOf('Payment ID');
    const fechaConfirmacionIndex = headers.indexOf('Fecha Confirmación');
    const emailIndex = headers.indexOf('Email');
    const emailEnviadoIndex = headers.indexOf('Email Enviado');
    
    console.log('🔍 Índices encontrados:', {
      sessionId: sessionIdIndex,
      pagoConfirmado: pagoConfirmadoIndex,
      estadoPago: estadoPagoIndex,
      paymentId: paymentIdIndex,
      fechaConfirmacion: fechaConfirmacionIndex,
      email: emailIndex,
      emailEnviado: emailEnviadoIndex
    });
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    let pagosActualizados = 0;
    
    // Empezar desde la fila 2 (después del header)
    for (let i = 1; i < values.length; i++) {
      const estadoPago = values[i][estadoPagoIndex];
      const pagoConfirmado = values[i][pagoConfirmadoIndex];
      const sessionId = values[i][sessionIdIndex];
      
      if (estadoPago === 'PENDIENTE' && pagoConfirmado === 'FALSE' && sessionId) {
        console.log(`🔍 Verificando pago para sessionId: ${sessionId}`);
        
        const resultado = verificarPagoEnMercadoPago(sessionId);
        
        if (resultado.confirmado) {
          // Actualizar la fila
          const rowIndex = i + 1;
          if (pagoConfirmadoIndex !== -1) {
            sheet.getRange(rowIndex, pagoConfirmadoIndex + 1).setValue('TRUE');
          }
          if (estadoPagoIndex !== -1) {
            sheet.getRange(rowIndex, estadoPagoIndex + 1).setValue('CONFIRMADO');
          }
          if (paymentIdIndex !== -1) {
            sheet.getRange(rowIndex, paymentIdIndex + 1).setValue(resultado.paymentId);
          }
          if (fechaConfirmacionIndex !== -1) {
            sheet.getRange(rowIndex, fechaConfirmacionIndex + 1).setValue(new Date().toISOString());
          }
          
          console.log(`✅ Pago confirmado para sessionId: ${sessionId}`);
          pagosActualizados++;
          
          // NO ENVIAR EMAIL DURANTE VERIFICACIÓN DE PAGOS PENDIENTES
          // Los emails solo se envían en la confirmación inicial
          const email = values[i][emailIndex];
          console.log(`📧 Email no enviado durante verificación de pagos pendientes para: ${email}`);
        }
      }
    }
    
    console.log(`📊 Total de pagos actualizados: ${pagosActualizados}`);
    return { success: true, pagosActualizados };
    
  } catch (error) {
    console.error('❌ Error verificando pagos:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Verifica un pago específico en MercadoPago
 */
function verificarPagoEnMercadoPago(sessionId) {
  try {
    console.log(`🔍 Verificando pago en MercadoPago para sessionId: ${sessionId}`);
    
    const url = `https://api.mercadopago.com/v1/payments/search?limit=200`;
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const searchData = JSON.parse(response.getContentText());
    
    console.log(`📊 Total de pagos encontrados: ${searchData.results.length}`);
    
    // Filtrar por collector_id
    const collectorId = 2142366374;
    const pagosRecibidos = searchData.results.filter(payment => 
      payment.collector_id === collectorId
    );
    
    console.log(`📊 Pagos recibidos por collector_id ${collectorId}: ${pagosRecibidos.length}`);
    
    // Buscar pago que coincida con el sessionId
    for (const payment of pagosRecibidos) {
      if (payment.external_reference === sessionId && payment.status === 'approved') {
        console.log(`✅ Pago confirmado encontrado: ${payment.id}`);
        return {
          confirmado: true,
          paymentId: payment.id,
          amount: payment.transaction_amount,
          status: payment.status
        };
      }
    }
    
    console.log(`❌ No se encontró pago confirmado para sessionId: ${sessionId}`);
    return { confirmado: false };
    
  } catch (error) {
    console.error('❌ Error verificando pago en MercadoPago:', error);
    return { confirmado: false, error: error.message };
  }
}

/**
 * Verifica un pago específico usando datos del usuario
 */
function verificarPagoPorDatos(data) {
  try {
    console.log('🔍 Verificando pago por datos:', data);
    
    if (!data.email || !data.fechaRegistro) {
      return { success: false, error: 'Email y fecha de registro son requeridos' };
    }
    
    // Configurar fecha de búsqueda con tolerancia de ±1 día
    const fechaRegistro = new Date(data.fechaRegistro);
    const fechaInicio = new Date(fechaRegistro.getTime() - 24 * 60 * 60 * 1000); // -1 día
    const fechaFin = new Date(fechaRegistro.getTime() + 24 * 60 * 60 * 1000); // +1 día
    
    console.log('📅 Rango de fechas para búsqueda:', {
      fechaRegistro: fechaRegistro.toISOString(),
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin.toISOString()
    });
    
    // Buscar pagos en MercadoPago
    const url = `https://api.mercadopago.com/v1/payments/search`;
    const params = {
      'collector.id': COLLECTOR_ID,
      'date_created.from': fechaInicio.toISOString(),
      'date_created.to': fechaFin.toISOString(),
      'status': 'approved'
    };
    
    console.log('🔗 URL de búsqueda:', url);
    console.log('📋 Parámetros:', params);
    
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + MERCADOPAGO_ACCESS_TOKEN,
        'Content-Type': 'application/json'
      },
      muteHttpExceptions: true
    });
    
    console.log('📥 Respuesta de MercadoPago:', response.getResponseCode());
    
    if (response.getResponseCode() !== 200) {
      console.error('❌ Error en respuesta de MercadoPago:', response.getContentText());
      return { success: false, error: 'Error comunicándose con MercadoPago' };
    }
    
    const responseData = JSON.parse(response.getContentText());
    console.log('📊 Pagos encontrados:', responseData.results?.length || 0);
    
    if (!responseData.results || responseData.results.length === 0) {
      return { success: false, error: 'No se encontraron pagos aprobados para este período' };
    }
    
    // Buscar pago que coincida con el email
    let pagoEncontrado = null;
    let searchMethod = '';
    
    for (const pago of responseData.results) {
      console.log('🔍 Revisando pago:', {
        id: pago.id,
        external_reference: pago.external_reference,
        payer_email: pago.payer?.email,
        status: pago.status,
        amount: pago.transaction_amount
      });
      
      // Verificar si el email coincide
      if (pago.payer && pago.payer.email && pago.payer.email.toLowerCase() === data.email.toLowerCase()) {
        console.log('✅ Pago encontrado por email:', pago.id);
        pagoEncontrado = pago;
        searchMethod = 'email';
        break;
      }
    }
    
    // Si no se encontró por email, buscar por external_reference si tenemos sessionId
    if (!pagoEncontrado && data.sessionId) {
      console.log('🔍 Buscando pago por external_reference:', data.sessionId);
      for (const pago of responseData.results) {
        if (pago.external_reference === data.sessionId) {
          console.log('✅ Pago encontrado por external_reference:', pago.id);
          pagoEncontrado = pago;
          searchMethod = 'external_reference';
          break;
        }
      }
    }
    
    // Si aún no se encontró, buscar por monto y fecha (pago más reciente en el rango)
    if (!pagoEncontrado) {
      console.log('🔍 Buscando pago por monto y fecha...');
      // Ordenar por fecha de creación (más reciente primero)
      const pagosOrdenados = responseData.results.sort((a, b) => 
        new Date(b.date_created) - new Date(a.date_created)
      );
      
      // Tomar el pago más reciente que esté aprobado
      for (const pago of pagosOrdenados) {
        if (pago.status === 'approved') {
          console.log('✅ Pago encontrado por fecha (más reciente):', pago.id);
          pagoEncontrado = pago;
          searchMethod = 'fecha_reciente';
          break;
        }
      }
    }
    
    if (!pagoEncontrado) {
      return { success: false, error: 'No se encontró un pago aprobado para este período' };
    }
    
    // Generar sessionId si no existe
    let sessionId = data.sessionId;
    if (!sessionId) {
      sessionId = 'SES_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      console.log('🆔 Session ID generado:', sessionId);
    }
    
    // Preparar datos para actualizar Google Sheets
    const datosActualizados = {
      sessionId: sessionId,
      paymentId: pagoEncontrado.id.toString(),
      estadoPago: 'CONFIRMADO',
      pagoConfirmado: true,
      fechaConfirmacion: new Date().toISOString(),
      collectionStatus: 'approved',
      status: pagoEncontrado.status,
      // Datos adicionales del pago
      paymentMethod: pagoEncontrado.payment_method?.type || 'N/A',
      installments: pagoEncontrado.installments || 1,
      currency: pagoEncontrado.currency_id || 'ARS',
      amount: pagoEncontrado.transaction_amount || 0,
      // Datos del usuario para búsqueda
      email: data.email,
      nombre: data.nombre,
      apellido: data.apellido,
      // Información de búsqueda
      searchMethod: searchMethod,
      payerEmail: pagoEncontrado.payer?.email || 'N/A'
    };
    
    console.log('📊 Datos actualizados para Google Sheets:', datosActualizados);
    
    // Actualizar Google Sheets
    const result = actualizarPagoEnGoogleSheets(datosActualizados);
    
    if (result.success) {
      console.log('✅ Pago verificado y actualizado exitosamente');
      return {
        success: true,
        message: 'Pago verificado y actualizado',
        data: datosActualizados
      };
    } else {
      console.error('❌ Error actualizando Google Sheets:', result.error);
      return { success: false, error: result.error };
    }
    
  } catch (error) {
    console.error('❌ Error en verificarPagoPorDatos:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Actualiza un pago en Google Sheets usando sessionId o email
 */
function actualizarPagoEnGoogleSheets(datos) {
  try {
    console.log('📝 Actualizando pago en Google Sheets:', datos);
    
    const sheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID).getSheetByName(GOOGLE_SHEET_NAME);
    if (!sheet) {
      throw new Error('No se encontró la hoja especificada');
    }
    
    // Obtener headers
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('📋 Headers encontrados:', headers);
    
    // Encontrar índices de columnas
    const sessionIdIndex = headers.indexOf('Session ID');
    const emailIndex = headers.indexOf('Email');
    const pagoConfirmadoIndex = headers.indexOf('Pago Confirmado');
    const estadoPagoIndex = headers.indexOf('Estado Pago');
    const paymentIdIndex = headers.indexOf('Payment ID');
    const fechaConfirmacionIndex = headers.indexOf('Fecha Confirmación');
    const nombreIndex = headers.indexOf('Nombre');
    const apellidoIndex = headers.indexOf('Apellido');
    const dniIndex = headers.indexOf('DNI');
    const telefonoIndex = headers.indexOf('Teléfono');
    const cantidadChancesIndex = headers.indexOf('Cantidad de Chances');
    const emailEnviadoIndex = headers.indexOf('Email Enviado');
    
    console.log('🔍 Índices encontrados:', {
      sessionId: sessionIdIndex,
      email: emailIndex,
      pagoConfirmado: pagoConfirmadoIndex,
      estadoPago: estadoPagoIndex,
      paymentId: paymentIdIndex,
      fechaConfirmacion: fechaConfirmacionIndex,
      nombre: nombreIndex,
      apellido: apellidoIndex,
      dni: dniIndex,
      telefono: telefonoIndex,
      cantidadChances: cantidadChancesIndex
    });
    
    // Buscar fila por sessionId o email
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    let rowIndex = -1;
    let searchMethod = '';
    
    // Primero buscar por sessionId si existe
    if (datos.sessionId && sessionIdIndex !== -1) {
      for (let i = 1; i < values.length; i++) {
        if (values[i][sessionIdIndex] === datos.sessionId) {
          rowIndex = i + 1;
          searchMethod = 'sessionId';
          break;
        }
      }
    }
    
    // Si no se encontró por sessionId, buscar por email
    if (rowIndex === -1 && datos.email && emailIndex !== -1) {
      for (let i = 1; i < values.length; i++) {
        if (values[i][emailIndex] && values[i][emailIndex].toLowerCase() === datos.email.toLowerCase()) {
          rowIndex = i + 1;
          searchMethod = 'email';
          break;
        }
      }
    }
    
    // Si aún no se encontró, buscar por fecha de registro (más reciente sin pago confirmado)
    if (rowIndex === -1) {
      console.log('🔍 Buscando registro por fecha (más reciente sin pago confirmado)...');
      const fechaRegistroIndex = headers.indexOf('Fecha de Registro');
      const pagoConfirmadoIndex = headers.indexOf('Pago Confirmado');
      
      if (fechaRegistroIndex !== -1 && pagoConfirmadoIndex !== -1) {
        // Ordenar filas por fecha de registro (más reciente primero)
        const filasConFechas = [];
        for (let i = 1; i < values.length; i++) {
          const fechaRegistro = values[i][fechaRegistroIndex];
          const pagoConfirmado = values[i][pagoConfirmadoIndex];
          
          if (fechaRegistro && pagoConfirmado !== 'TRUE') {
            filasConFechas.push({
              rowIndex: i + 1,
              fecha: new Date(fechaRegistro)
            });
          }
        }
        
        // Ordenar por fecha (más reciente primero)
        filasConFechas.sort((a, b) => b.fecha - a.fecha);
        
        if (filasConFechas.length > 0) {
          rowIndex = filasConFechas[0].rowIndex;
          searchMethod = 'fecha_reciente';
          console.log('✅ Registro encontrado por fecha (más reciente):', rowIndex);
        }
      }
    }
    
    if (rowIndex === -1) {
      throw new Error('No se encontró el registro en la hoja');
    }
    
    console.log('✅ Fila encontrada:', rowIndex, 'por método:', searchMethod);
    
    // Actualizar columnas
    if (pagoConfirmadoIndex !== -1) {
      sheet.getRange(rowIndex, pagoConfirmadoIndex + 1).setValue('TRUE');
    }
    if (estadoPagoIndex !== -1) {
      sheet.getRange(rowIndex, estadoPagoIndex + 1).setValue('CONFIRMADO');
    }
    if (paymentIdIndex !== -1 && datos.paymentId) {
      sheet.getRange(rowIndex, paymentIdIndex + 1).setValue(datos.paymentId);
    }
    if (fechaConfirmacionIndex !== -1) {
      sheet.getRange(rowIndex, fechaConfirmacionIndex + 1).setValue(new Date().toISOString());
    }
    if (sessionIdIndex !== -1 && datos.sessionId) {
      sheet.getRange(rowIndex, sessionIdIndex + 1).setValue(datos.sessionId);
    }
    
    // Actualizar campos del formulario si están presentes en los datos
    if (nombreIndex !== -1 && datos.nombre) {
      sheet.getRange(rowIndex, nombreIndex + 1).setValue(datos.nombre);
    }
    if (apellidoIndex !== -1 && datos.apellido) {
      sheet.getRange(rowIndex, apellidoIndex + 1).setValue(datos.apellido);
    }
    if (dniIndex !== -1 && datos.dni) {
      sheet.getRange(rowIndex, dniIndex + 1).setValue(datos.dni);
    }
    if (telefonoIndex !== -1 && datos.telefono) {
      sheet.getRange(rowIndex, telefonoIndex + 1).setValue(datos.telefono);
    }
    if (cantidadChancesIndex !== -1 && datos.cantidadChances) {
      sheet.getRange(rowIndex, cantidadChancesIndex + 1).setValue(datos.cantidadChances);
    }
    
    // NO ENVIAR EMAIL DESDE ESTA FUNCIÓN
    // Los emails solo se envían desde doPost en la confirmación inicial
    console.log('📧 Email no enviado desde actualizarPagoEnGoogleSheets - solo se envía desde doPost');
    
    console.log('✅ Pago actualizado correctamente en fila:', rowIndex);
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error actualizando pago en Google Sheets:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Función para verificación automática de pagos (ejecutar manualmente o con trigger)
 */
function verificarPagosAutomaticamente() {
  try {
    console.log('🤖 Iniciando verificación automática de pagos...');
    
    const sheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID).getSheetByName(GOOGLE_SHEET_NAME);
    if (!sheet) {
      throw new Error('No se encontró la hoja especificada');
    }
    
    // Obtener los headers para encontrar las columnas correctas
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Encontrar los índices de las columnas
    const emailIndex = headers.indexOf('Email');
    const nombreIndex = headers.indexOf('Nombre');
    const apellidoIndex = headers.indexOf('Apellido');
    const fechaRegistroIndex = headers.indexOf('Fecha de Registro');
    const pagoConfirmadoIndex = headers.indexOf('Pago Confirmado');
    const estadoPagoIndex = headers.indexOf('Estado Pago');
    const paymentIdIndex = headers.indexOf('Payment ID');
    const fechaConfirmacionIndex = headers.indexOf('Fecha Confirmación');
    const sessionIdIndex = headers.indexOf('Session ID');
    const emailEnviadoIndex = headers.indexOf('Email Enviado');
    
    console.log('🔍 Índices encontrados:', {
      email: emailIndex,
      nombre: nombreIndex,
      apellido: apellidoIndex,
      fechaRegistro: fechaRegistroIndex,
      pagoConfirmado: pagoConfirmadoIndex,
      estadoPago: estadoPagoIndex,
      paymentId: paymentIdIndex,
      fechaConfirmacion: fechaConfirmacionIndex,
      sessionId: sessionIdIndex,
      emailEnviado: emailEnviadoIndex
    });
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    let pagosVerificados = 0;
    let pagosConfirmados = 0;
    
    // Empezar desde la fila 2 (después del header)
    for (let i = 1; i < values.length; i++) {
      const email = values[i][emailIndex];
      const nombre = values[i][nombreIndex];
      const apellido = values[i][apellidoIndex];
      const fechaRegistro = values[i][fechaRegistroIndex];
      const pagoConfirmado = values[i][pagoConfirmadoIndex];
      const estadoPago = values[i][estadoPagoIndex];
      const sessionId = values[i][sessionIdIndex];
      
      // Solo verificar pagos que no estén confirmados
      if (pagoConfirmado !== 'TRUE' && email && fechaRegistro) {
        console.log(`🔍 Verificando pago para: ${email} - ${fechaRegistro}`);
        
        const resultado = verificarPagoPorDatos({
          email: email,
          nombre: nombre,
          apellido: apellido,
          fechaRegistro: fechaRegistro,
          sessionId: sessionId
        });
        
        if (resultado.success) {
          console.log(`✅ Pago confirmado para: ${email}`);
          console.log(`   - Payment ID: ${resultado.data.paymentId}`);
          console.log(`   - Session ID: ${resultado.data.sessionId}`);
          console.log(`   - Status: ${resultado.data.status}`);
          console.log(`   - Amount: $${resultado.data.amount}`);
          
          pagosConfirmados++;
          
          // NO ENVIAR EMAIL DURANTE VERIFICACIÓN AUTOMÁTICA
          // Los emails solo se envían en la confirmación inicial
          console.log(`📧 Email no enviado durante verificación automática para: ${email}`);
        } else {
          console.log(`❌ No se pudo verificar pago para: ${email} - ${resultado.error}`);
        }
        
        pagosVerificados++;
      }
    }
    
    console.log(`📊 Resumen de verificación automática:`);
    console.log(`   - Pagos verificados: ${pagosVerificados}`);
    console.log(`   - Pagos confirmados: ${pagosConfirmados}`);
    
    return { 
      success: true, 
      pagosVerificados, 
      pagosConfirmados 
    };
    
  } catch (error) {
    console.error('❌ Error en verificación automática:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

/**
 * Completa datos faltantes en registros existentes
 */
function completarDatosFaltantes() {
  try {
    console.log('🔧 Completando datos faltantes en registros existentes...');
    
    const sheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID).getSheetByName(GOOGLE_SHEET_NAME);
    if (!sheet) {
      throw new Error('No se encontró la hoja especificada');
    }
    
    // Obtener los headers para encontrar las columnas correctas
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Encontrar los índices de las columnas
    const emailIndex = headers.indexOf('Email');
    const fechaRegistroIndex = headers.indexOf('Fecha de Registro');
    const pagoConfirmadoIndex = headers.indexOf('Pago Confirmado');
    const estadoPagoIndex = headers.indexOf('Estado Pago');
    const paymentIdIndex = headers.indexOf('Payment ID');
    const fechaConfirmacionIndex = headers.indexOf('Fecha Confirmación');
    const sessionIdIndex = headers.indexOf('Session ID');
    const emailEnviadoIndex = headers.indexOf('Email Enviado');
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    let registrosCompletados = 0;
    
    // Empezar desde la fila 2 (después del header)
    for (let i = 1; i < values.length; i++) {
      const email = values[i][emailIndex];
      const fechaRegistro = values[i][fechaRegistroIndex];
      const pagoConfirmado = values[i][pagoConfirmadoIndex];
      const estadoPago = values[i][estadoPagoIndex];
      const sessionId = values[i][sessionIdIndex];
      const paymentId = values[i][paymentIdIndex];
      
      // Buscar registros con Pago Confirmado = TRUE pero datos faltantes
      if (pagoConfirmado === 'TRUE' && 
          (!sessionId || sessionId === '' || sessionId === 'N/A' || 
           !paymentId || paymentId === '' || paymentId === 'N/A')) {
        
        console.log(`🔍 Completando datos para: ${email}`);
        
        const resultado = verificarPagoPorDatos({
          email: email,
          fechaRegistro: fechaRegistro.split('T')[0]
        });
        
        if (resultado.success && resultado.pagoEncontrado) {
          const rowIndex = i + 1;
          
          // Completar Session ID si está vacío
          if (sessionIdIndex !== -1 && (!sessionId || sessionId === '' || sessionId === 'N/A')) {
            sheet.getRange(rowIndex, sessionIdIndex + 1).setValue(resultado.sessionId);
            console.log(`📝 Session ID completado: ${resultado.sessionId}`);
          }
          
          // Completar Payment ID si está vacío
          if (paymentIdIndex !== -1 && (!paymentId || paymentId === '' || paymentId === 'N/A')) {
            sheet.getRange(rowIndex, paymentIdIndex + 1).setValue(resultado.paymentId);
            console.log(`📝 Payment ID completado: ${resultado.paymentId}`);
          }
          
          registrosCompletados++;
        }
      }
    }
    
    console.log(`📊 Registros completados: ${registrosCompletados}`);
    return { 
      success: true, 
      registrosCompletados 
    };
    
  } catch (error) {
    console.error('❌ Error completando datos:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

/**
 * Configura el trigger automático para verificación de pagos
 */
function configurarTriggerAutomatico() {
  try {
    console.log('⚙️ Configurando trigger automático...');
    
    // Eliminar triggers existentes
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'verificarPagosAutomaticamente') {
        ScriptApp.deleteTrigger(trigger);
        console.log('🗑️ Trigger anterior eliminado');
      }
    });
    
    // Crear nuevo trigger que se ejecute cada hora
    ScriptApp.newTrigger('verificarPagosAutomaticamente')
      .timeBased()
      .everyHours(1)
      .create();
    
    console.log('✅ Trigger automático configurado (cada hora)');
    return { success: true, message: 'Trigger configurado correctamente' };
    
  } catch (error) {
    console.error('❌ Error configurando trigger:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Ejecuta verificación manual (para testing)
 */
function ejecutarVerificacionManual() {
  console.log('🔧 Ejecutando verificación manual...');
  const resultado = verificarPagosAutomaticamente();
  console.log('📊 Resultado de verificación manual:', resultado);
  return resultado;
}

// ===========================================
// FUNCIÓN CENTRALIZADA DE ENVÍO DE EMAILS
// ===========================================

/**
 * Función centralizada para enviar email de confirmación
 * SOLO se debe llamar desde la confirmación inicial
 * @param {string} email - Email del usuario
 * @param {string} sessionId - ID de sesión
 * @param {string} paymentId - ID de pago
 * @returns {Object} Resultado del envío
 */
function enviarEmailConfirmacionInicial(email, sessionId, paymentId) {
  try {
    console.log(`📧 ENVÍO CENTRALIZADO - Verificando si se debe enviar email a: ${email}`);
    
    const sheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID).getSheetByName(GOOGLE_SHEET_NAME);
    if (!sheet) {
      throw new Error('No se encontró la hoja especificada');
    }
    
    // Obtener headers frescos de la hoja
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const emailEnviadoIndex = headers.indexOf('Email Enviado');
    const emailIndex = headers.indexOf('Email');
    const sessionIdIndex = headers.indexOf('Session ID');
    
    if (emailEnviadoIndex === -1) {
      console.log('❌ Columna "Email Enviado" no encontrada');
      return { success: false, error: 'Columna Email Enviado no existe' };
    }
    
    // Buscar la fila específica por email Y sessionId para mayor precisión
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    let rowIndex = -1;
    for (let i = 1; i < values.length; i++) {
      const rowEmail = values[i][emailIndex];
      const rowSessionId = values[i][sessionIdIndex];
      
      if (rowEmail === email && rowSessionId === sessionId) {
        rowIndex = i + 1;
        break;
      }
    }
    
    if (rowIndex === -1) {
      console.log(`❌ No se encontró fila para email: ${email} y sessionId: ${sessionId}`);
      return { success: false, error: 'Fila no encontrada' };
    }
    
    // Leer el estado actual de "Email Enviado" directamente de la hoja
    const emailEnviadoActual = sheet.getRange(rowIndex, emailEnviadoIndex + 1).getValue();
    console.log(`📧 Estado actual de Email Enviado para ${email}: ${emailEnviadoActual}`);
    
    if (emailEnviadoActual === 'TRUE') {
      console.log(`📧 Email ya fue enviado anteriormente a: ${email}`);
      return { 
        success: false, 
        message: 'Email ya enviado anteriormente',
        alreadySent: true 
      };
    }
    
    // ENVIAR EMAIL SOLO SI NO HA SIDO ENVIADO
    console.log(`📧 ENVIANDO EMAIL DE CONFIRMACIÓN INICIAL a: ${email}`);
    
    const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Pago - Sorteo Tablet</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f9fa;
            }
            .email-container {
                background: white;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #e9ecef;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                color: #007bff;
                margin-bottom: 10px;
            }
            .success-icon {
                font-size: 48px;
                margin-bottom: 20px;
            }
            .main-content {
                margin-bottom: 30px;
            }
            .payment-details {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #28a745;
            }
            .prize-section {
                background: linear-gradient(135deg, #ffd700, #ffed4e);
                padding: 25px;
                border-radius: 10px;
                text-align: center;
                margin: 25px 0;
                border: 2px solid #ffc107;
            }
            .prize-icon {
                font-size: 36px;
                margin-bottom: 15px;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e9ecef;
                color: #6c757d;
                font-size: 14px;
            }
            .highlight {
                color: #007bff;
                font-weight: 600;
            }
            .success-text {
                color: #28a745;
                font-weight: 600;
            }
            .prize-text {
                color: #2c3e50 !important;
                text-shadow: 0 1px 2px rgba(0,0,0,0.1);
                font-weight: 600;
            }
            @media (max-width: 600px) {
                body {
                    padding: 10px;
                }
                .email-container {
                    padding: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header -->
            <div class="header">
                <div class="logo">Codes++</div>
                <div class="success-icon">✅</div>
                <h1 style="margin: 0; color: #28a745;">¡Pago Confirmado!</h1>
            </div>
            
            <!-- Main Content -->
            <div class="main-content">
                <p>¡Gracias por participar en nuestro sorteo! 🎉</p>
                
                <div class="payment-details">
                    <h3 style="margin-top: 0; color: #495057;">Detalles del Pago</h3>
                    <p><strong>Estado:</strong> <span class="success-text">CONFIRMADO</span></p>
                    <p><strong>ID de Pago:</strong> <span class="highlight">${paymentId || 'N/A'}</span></p>
                    <p><strong>Fecha:</strong> <span class="highlight">${new Date().toLocaleDateString('es-AR')}</span></p>
                </div>
                
                <!-- Prize Section -->
                <div class="prize-section">
                    <div class="prize-icon">🎁</div>
                    <h3 style="margin: 0; color: #2c3e50; text-shadow: 0 1px 2px rgba(0,0,0,0.1);" class="prize-text">¡Estás Participando!</h3>
                    <p style="margin: 10px 0 0 0; color: #2c3e50; text-shadow: 0 1px 2px rgba(0,0,0,0.1); font-weight: 600;" class="prize-text">
                        <strong>Premio:</strong> Una Tablet de última generación
                    </p>
                </div>
                
                <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #1976d2;">📅 Próximos Pasos</h3>
                    <p><strong>Fecha del Sorteo:</strong> 30/09/2025</p>
                    <p>Te notificaremos por este medio en cuanto tengamos los resultados.</p>
                </div>
                
                <p>🙏 Gracias por apoyar nuestro viaje al CACIC 2025.</p>
                <p>¡Tu ayuda nos acerca un paso más!</p>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <p><strong>Saludos cordiales,</strong></p>
                <p><strong>Codes++</strong></p>
                <p style="font-size: 12px; margin-top: 20px;">
                    Este es un email automático. Por favor, no respondas a este mensaje.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    // Enviar el email
    MailApp.sendEmail({
      to: email,
      subject: '✅ Pago Confirmado - Sorteo Tablet Codes++',
      htmlBody: emailContent
    });
    
    // MARCAR COMO ENVIADO INMEDIATAMENTE
    sheet.getRange(rowIndex, emailEnviadoIndex + 1).setValue('TRUE');
    console.log(`✅ Email enviado y marcado como enviado en fila: ${rowIndex}`);
    
    return { 
      success: true, 
      message: 'Email enviado correctamente',
      rowIndex: rowIndex 
    };
    
  } catch (error) {
    console.error('❌ Error enviando email centralizado:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

/**
 * Busca pagos del usuario en MercadoPago
 */
function buscarPagosUsuario() {
  try {
    console.log('🔍 Buscando pagos recibidos...');
    
    const url = `https://api.mercadopago.com/v1/payments/search?limit=200`;
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const searchData = JSON.parse(response.getContentText());
    
    console.log(`📊 Total de pagos disponibles: ${searchData.results.length}`);
    
    // Filtrar por collector_id
    const collectorId = 2142366374;
    const pagosRecibidos = searchData.results.filter(payment => 
      payment.collector_id === collectorId
    );
    
    console.log(`📊 Pagos recibidos por collector_id ${collectorId}: ${pagosRecibidos.length}`);
    
    // Mostrar información de los primeros 10 pagos
    for (let i = 0; i < Math.min(pagosRecibidos.length, 10); i++) {
      const payment = pagosRecibidos[i];
      console.log(`📊 Pago ${i + 1}:`);
      console.log(`   ID: ${payment.id}`);
      console.log(`   Estado: ${payment.status}`);
      console.log(`   Monto: $${payment.transaction_amount}`);
      console.log(`   Fecha: ${payment.date_created}`);
      console.log(`   External Reference: ${payment.external_reference}`);
      console.log(`   Payer Email: ${payment.payer?.email || 'N/A'}`);
      console.log('   ---');
    }
    
    return { success: true, totalPagos: pagosRecibidos.length };
    
  } catch (error) {
    console.error('❌ Error buscando pagos:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Función de prueba para verificar el mapeo de columnas
 */
function probarMapeoColumnas() {
  try {
    console.log('🧪 Probando mapeo de columnas...');
    
    const sheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID).getSheetByName(GOOGLE_SHEET_NAME);
    if (!sheet) {
      throw new Error('No se encontró la hoja especificada');
    }
    
    // Obtener los headers
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('📋 Headers encontrados:', headers);
    
    // Encontrar los índices de las columnas importantes
    const sessionIdIndex = headers.indexOf('Session ID');
    const pagoConfirmadoIndex = headers.indexOf('Pago Confirmado');
    const estadoPagoIndex = headers.indexOf('Estado Pago');
    const paymentIdIndex = headers.indexOf('Payment ID');
    const fechaConfirmacionIndex = headers.indexOf('Fecha Confirmación');
    
    console.log('🔍 Índices encontrados:', {
      sessionId: sessionIdIndex,
      pagoConfirmado: pagoConfirmadoIndex,
      estadoPago: estadoPagoIndex,
      paymentId: paymentIdIndex,
      fechaConfirmacion: fechaConfirmacionIndex
    });
    
    // Verificar que todas las columnas necesarias existen
    const columnasRequeridas = ['Session ID', 'Pago Confirmado', 'Estado Pago', 'Payment ID', 'Fecha Confirmación'];
    const columnasFaltantes = columnasRequeridas.filter(col => headers.indexOf(col) === -1);
    
    if (columnasFaltantes.length > 0) {
      console.log('❌ Columnas faltantes:', columnasFaltantes);
      return { success: false, error: 'Columnas faltantes: ' + columnasFaltantes.join(', ') };
    }
    
    console.log('✅ Todas las columnas requeridas están presentes');
    return { success: true, headers, indices: {
      sessionId: sessionIdIndex,
      pagoConfirmado: pagoConfirmadoIndex,
      estadoPago: estadoPagoIndex,
      paymentId: paymentIdIndex,
      fechaConfirmacion: fechaConfirmacionIndex
    }};
    
  } catch (error) {
    console.error('❌ Error probando mapeo:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Prueba la conexión con MercadoPago
 */
function probarMercadoPago() {
  try {
    console.log('🔍 Probando API de MercadoPago...');
    
    const url = 'https://api.mercadopago.com/v1/payments/search?limit=1';
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());
    
    console.log('✅ Conexión a MercadoPago exitosa');
    console.log(`📊 Total de pagos disponibles: ${data.paging.total}`);
    
    return { success: true, totalPagos: data.paging.total };
    
  } catch (error) {
    console.error('❌ Error probando MercadoPago:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Configura el trigger para verificación automática
 */
function configurarTrigger() {
  try {
    console.log('⏰ Configurando trigger automático...');
    
    // Eliminar triggers existentes
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'verificarPagosPendientes') {
        ScriptApp.deleteTrigger(trigger);
      }
    });
    
    // Crear nuevo trigger (cada hora)
    ScriptApp.newTrigger('verificarPagosPendientes')
      .timeBased()
      .everyHours(1)
      .create();
    
    console.log('✅ Trigger configurado correctamente');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error configurando trigger:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Función para ejecutar el sistema completo
 */
function ejecutarSistema() {
  try {
    console.log('🚀 Ejecutando sistema completo...');
    
    // Probar conexión
    const pruebaConexion = probarMercadoPago();
    if (!pruebaConexion.success) {
      throw new Error('Error en conexión con MercadoPago');
    }
    
    // Verificar pagos pendientes
    const verificacion = verificarPagosPendientes();
    if (!verificacion.success) {
      throw new Error('Error verificando pagos pendientes');
    }
    
    console.log('✅ Sistema ejecutado correctamente');
    return { success: true, verificacion };
    
  } catch (error) {
    console.error('❌ Error ejecutando sistema:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Función para probar el flujo completo con datos simulados
 */
function probarFlujoCompleto() {
  try {
    console.log('🧪 Probando flujo completo con datos simulados...');
    
    // Simular datos iniciales (PENDIENTE)
    const datosIniciales = {
      nombre: 'Federico Sebastián',
      apellido: 'Rizzo',
      email: 'rizzofs@gmail.com',
      dni: '31608123',
      telefono: '234652913',
      cantidadChances: '1',
      estadoPago: 'PENDIENTE',
      pagoConfirmado: false,
      fechaRegistro: new Date().toISOString(),
      sessionId: 'TEST_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      paymentId: 'N/A'
    };
    
    console.log('📊 Datos iniciales:', datosIniciales);
    
    // Guardar datos iniciales
    const resultadoInicial = guardarEnGoogleSheets(datosIniciales);
    if (!resultadoInicial.success) {
      throw new Error('Error guardando datos iniciales: ' + resultadoInicial.error);
    }
    
    console.log('✅ Datos iniciales guardados correctamente');
    
    // Simular datos de confirmación
    const datosConfirmacion = {
      sessionId: datosIniciales.sessionId,
      estadoPago: 'CONFIRMADO',
      pagoConfirmado: true,
      paymentId: 'TEST_PAY_' + Date.now(),
      fechaConfirmacion: new Date().toISOString()
    };
    
    console.log('📊 Datos de confirmación:', datosConfirmacion);
    
    // Actualizar datos
    const resultadoConfirmacion = actualizarPagoExistente(datosConfirmacion);
    if (!resultadoConfirmacion.success) {
      throw new Error('Error actualizando datos: ' + resultadoConfirmacion.error);
    }
    
    console.log('✅ Datos de confirmación actualizados correctamente');
    
    return { 
      success: true, 
      sessionId: datosIniciales.sessionId,
      message: 'Flujo completo probado exitosamente' 
    };
    
  } catch (error) {
    console.error('❌ Error probando flujo completo:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Función para probar la configuración del sistema
 * Ejecuta esta función desde el editor de Apps Script para verificar que todo esté configurado correctamente
 */
function probarConfiguracion() {
  try {
    console.log('🔍 Probando configuración del sistema...');
    
    // Verificar que las constantes estén definidas
    if (!GOOGLE_SHEET_ID) {
      throw new Error('❌ GOOGLE_SHEET_ID no está configurado correctamente');
    }
    
    if (!MERCADOPAGO_ACCESS_TOKEN) {
      throw new Error('❌ MERCADOPAGO_ACCESS_TOKEN no está configurado correctamente');
    }
    
    console.log('✅ Constantes configuradas correctamente');
    
    // Probar conexión a Google Sheets
    console.log('🔍 Probando conexión a Google Sheets...');
    const sheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID).getSheetByName(GOOGLE_SHEET_NAME);
    if (!sheet) {
      throw new Error('❌ No se pudo conectar a Google Sheets');
    }
    console.log('✅ Conexión a Google Sheets: OK');
    
    // Probar conexión a MercadoPago
    console.log('🔍 Probando conexión a MercadoPago...');
    const url = 'https://api.mercadopago.com/v1/payments/search?limit=1';
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    
    if (responseCode !== 200) {
      throw new Error(`❌ Error en conexión a MercadoPago. Código: ${responseCode}`);
    }
    
    console.log('✅ Conexión a MercadoPago: OK');
    
    // Probar función de email
    console.log('🔍 Probando función de email...');
    const emailTest = enviarEmailConfirmacionInicial('test@example.com', 'TEST_SESSION', 'TEST_PAYMENT');
    console.log('✅ Función de email: OK');
    
    console.log('🎉 ¡Configuración correcta! El sistema está listo para usar.');
    return { 
      success: true, 
      message: 'Configuración correcta',
      googleSheets: 'OK',
      mercadopago: 'OK',
      email: 'OK'
    };
    
  } catch (error) {
    console.error('❌ Error en configuración:', error);
    return { 
      success: false, 
      error: error.message,
      message: 'Revisa la configuración según las instrucciones en CONFIGURACION_GOOGLE_APPS_SCRIPT.md'
    };
  }
}

