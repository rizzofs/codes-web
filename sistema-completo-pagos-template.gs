// ===========================================
// SISTEMA COMPLETO DE PAGOS - TEMPLATE
// ===========================================
// IMPORTANTE: Reemplaza los valores de configuración con tus datos reales
// NO subas este archivo con tokens reales al repositorio

// CONFIGURACIÓN DE MERCADOPAGO
const MERCADOPAGO_ACCESS_TOKEN = 'TU_ACCESS_TOKEN_AQUI'; // Reemplaza con tu token real
const GOOGLE_SHEET_ID = 'TU_SHEET_ID_AQUI'; // Reemplaza con tu ID de Google Sheet
const GOOGLE_SHEET_NAME = 'TU_NOMBRE_DE_HOJA_AQUI'; // Reemplaza con el nombre de tu hoja

// CONFIGURACIÓN DE COLECTOR
const COLLECTOR_ID = 2142366374; // Tu ID de colector en MercadoPago
const COLLECTOR_EMAIL = 'rizzofs.eu@gmail.com'; // Tu email de MercadoPago

// ===========================================
// FUNCIONES PRINCIPALES
// ===========================================

/**
 * Función principal para recibir datos del formulario
 */
function doPost(e) {
  try {
    console.log('📥 Datos recibidos:', e.postData.contents);
    const data = JSON.parse(e.postData.contents);
    
    // Verificar si es una actualización de pago existente
    if (data.sessionId && !data.nombre && !data.apellido && !data.email) {
      console.log('🔄 Actualizando pago existente...');
      const result = actualizarPagoExistente(data);
      
      if (result.success) {
        return ContentService
          .createTextOutput(JSON.stringify({ success: true, message: 'Pago actualizado correctamente' }))
          .setMimeType(ContentService.MimeType.JSON);
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
    
    const timestamp = new Date();
    const rowData = [
      timestamp,                    // Fecha y Hora
      data.sessionId || 'N/A',     // Session ID
      data.nombre || '',           // Nombre
      data.apellido || '',         // Apellido
      data.email || '',            // Email
      data.dni || '',              // DNI
      data.telefono || '',         // Teléfono
      data.cantidadChances || 0,   // Cantidad de Chances
      data.precioTotal || 0,       // Precio Total
      'PENDIENTE',                 // Estado Pago
      false,                       // Pago Confirmado
      'N/A',                       // Payment ID
      '',                          // Fecha Confirmación
      data.observaciones || ''     // Observaciones
    ];
    
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
    
    // Buscar la fila por Session ID
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const sessionIdColumn = 1; // Columna B (índice 1)
    
    let rowIndex = -1;
    for (let i = 1; i < values.length; i++) { // Empezar desde la fila 2 (después del header)
      if (values[i][sessionIdColumn] === data.sessionId) {
        rowIndex = i + 1; // +1 porque getValues() devuelve índices basados en 0
        break;
      }
    }
    
    if (rowIndex === -1) {
      throw new Error('No se encontró el Session ID en la hoja');
    }
    
    // Actualizar solo las columnas de pago
    const pagoConfirmadoColumn = 10; // Columna K
    const estadoPagoColumn = 11;     // Columna L
    const paymentIdColumn = 12;      // Columna M
    const fechaConfirmacionColumn = 13; // Columna N
    
    sheet.getRange(rowIndex, pagoConfirmadoColumn).setValue(true);
    sheet.getRange(rowIndex, estadoPagoColumn).setValue('CONFIRMADO');
    sheet.getRange(rowIndex, paymentIdColumn).setValue(data.paymentId || 'N/A');
    sheet.getRange(rowIndex, fechaConfirmacionColumn).setValue(new Date());
    
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
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    let pagosActualizados = 0;
    
    // Empezar desde la fila 2 (después del header)
    for (let i = 1; i < values.length; i++) {
      const estadoPago = values[i][10]; // Columna K
      const pagoConfirmado = values[i][9]; // Columna J
      const sessionId = values[i][1]; // Columna B
      
      if (estadoPago === 'PENDIENTE' && !pagoConfirmado && sessionId) {
        console.log(`🔍 Verificando pago para sessionId: ${sessionId}`);
        
        const resultado = verificarPagoEnMercadoPago(sessionId);
        
        if (resultado.confirmado) {
          // Actualizar la fila
          const rowIndex = i + 1;
          sheet.getRange(rowIndex, 10).setValue(true); // Pago Confirmado
          sheet.getRange(rowIndex, 11).setValue('CONFIRMADO'); // Estado Pago
          sheet.getRange(rowIndex, 12).setValue(resultado.paymentId); // Payment ID
          sheet.getRange(rowIndex, 13).setValue(new Date()); // Fecha Confirmación
          
          console.log(`✅ Pago confirmado para sessionId: ${sessionId}`);
          pagosActualizados++;
          
          // Enviar email de confirmación
          const email = values[i][4]; // Columna E
          if (email) {
            enviarEmailConfirmacion(email, sessionId, resultado.paymentId);
          }
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
 * Envía email de confirmación
 */
function enviarEmailConfirmacion(email, sessionId, paymentId) {
  try {
    console.log(`📧 Enviando email de confirmación a: ${email}`);
    
    const subject = '🎉 ¡Tu participación en el sorteo ha sido confirmada!';
    const body = `
      <h2>¡Gracias por participar!</h2>
      <p>Tu pago ha sido confirmado exitosamente.</p>
      <p><strong>Session ID:</strong> ${sessionId}</p>
      <p><strong>Payment ID:</strong> ${paymentId}</p>
      <p>Te notificaremos cuando se realice el sorteo.</p>
      <br>
      <p>Saludos,<br>Equipo del Sorteo</p>
    `;
    
    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: body
    });
    
    console.log('✅ Email de confirmación enviado');
    
  } catch (error) {
    console.error('❌ Error enviando email:', error);
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

// ===========================================
// INSTRUCCIONES DE CONFIGURACIÓN
// ===========================================
/*
1. Reemplaza TU_ACCESS_TOKEN_AQUI con tu token real de MercadoPago
2. Reemplaza TU_SHEET_ID_AQUI con el ID de tu Google Sheet
3. Reemplaza TU_NOMBRE_DE_HOJA_AQUI con el nombre de la hoja donde guardar los datos
4. Copia este archivo a Google Apps Script
5. Ejecuta configurarTrigger() una vez para configurar la verificación automática
6. Ejecuta probarMercadoPago() para verificar la conexión
7. Ejecuta buscarPagosUsuario() para ver los pagos recibidos
*/ 