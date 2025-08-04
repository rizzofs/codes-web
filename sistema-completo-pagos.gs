/**
 * Sistema Simple de Pagos - CODES++
 * Maneja el registro y verificación de pagos del sorteo
 */

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const SPREADSHEET_ID = '1rCNIwjzB--xtIyK4gMvqIxJGLETra4VqnF5aL8lRTMk';
const SHEET_NAME = 'Registros_Sorteo';
const MERCADOPAGO_ACCESS_TOKEN = 'APP_USR-5908100961878781-080320-3d4cf3e45d4723bffa7e302677cce571-2142366374';

// ============================================================================
// RECEPCIÓN DE DATOS DEL FORMULARIO
// ============================================================================

function doPost(e) {
  try {
    console.log('📥 Recibiendo datos del formulario...');
    
    const data = JSON.parse(e.postData.contents);
    console.log('📊 Datos recibidos:', data);
    
    // Verificar si es una actualización de pago (solo tiene sessionId y datos de pago)
    if (data.sessionId && !data.nombre && !data.apellido && !data.email) {
      console.log('🔄 Actualizando pago existente...');
      const result = actualizarPagoExistente(data);
      
      if (result.success) {
        console.log('✅ Pago actualizado exitosamente');
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          sessionId: data.sessionId,
          message: 'Pago actualizado correctamente'
        })).setMimeType(ContentService.MimeType.JSON);
      } else {
        console.error('❌ Error actualizando pago:', result.error);
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: result.error
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Validar datos requeridos para nuevo registro
    if (!data.nombre || !data.apellido || !data.email || !data.dni || !data.telefono || !data.cantidadChances) {
      console.error('❌ Datos incompletos');
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Datos incompletos'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Generar Session ID único
    if (!data.sessionId) {
      data.sessionId = 'SES_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Establecer estado inicial
    data.estadoPago = data.estadoPago || 'PENDIENTE';
    data.pagoConfirmado = data.pagoConfirmado || false;
    data.fechaRegistro = data.fechaRegistro || new Date().toISOString();
    data.paymentId = data.paymentId || 'N/A';
    
    // Guardar en Google Sheets
    const result = guardarEnGoogleSheets(data);
    
    if (result.success) {
      console.log('✅ Datos guardados exitosamente');
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        sessionId: data.sessionId,
        message: 'Datos registrados correctamente'
      })).setMimeType(ContentService.MimeType.JSON);
    } else {
      console.error('❌ Error guardando datos:', result.error);
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: result.error
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    console.error('❌ Error en doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================================
// ACTUALIZAR PAGO EXISTENTE
// ============================================================================

function actualizarPagoExistente(data) {
  try {
    console.log('🔄 Actualizando pago existente con sessionId:', data.sessionId);
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      console.error('❌ Hoja no encontrada:', SHEET_NAME);
      return { success: false, error: 'Hoja no encontrada' };
    }
    
    const dataRange = sheet.getDataRange().getValues();
    const headers = dataRange[0];
    
    // Encontrar índices de columnas
    const sessionIdIndex = headers.indexOf('Session ID');
    const pagoConfirmadoIndex = headers.indexOf('Pago Confirmado');
    const estadoPagoIndex = headers.indexOf('Estado Pago');
    const paymentIdIndex = headers.indexOf('Payment ID');
    const fechaConfirmacionIndex = headers.indexOf('Fecha Confirmación');
    
    if (sessionIdIndex === -1) {
      console.error('❌ Columna Session ID no encontrada');
      return { success: false, error: 'Columna Session ID no encontrada' };
    }
    
    // Buscar la fila con el sessionId
    let rowIndex = -1;
    for (let i = 1; i < dataRange.length; i++) {
      if (dataRange[i][sessionIdIndex] === data.sessionId) {
        rowIndex = i + 1; // +1 porque las filas en Sheets empiezan en 1
        break;
      }
    }
    
    if (rowIndex === -1) {
      console.error('❌ No se encontró registro con sessionId:', data.sessionId);
      return { success: false, error: 'Registro no encontrado' };
    }
    
    console.log('✅ Registro encontrado en fila:', rowIndex);
    
    // Actualizar campos específicos
    if (pagoConfirmadoIndex !== -1) {
      sheet.getRange(rowIndex, pagoConfirmadoIndex + 1).setValue('TRUE');
    }
    
    if (estadoPagoIndex !== -1) {
      sheet.getRange(rowIndex, estadoPagoIndex + 1).setValue('CONFIRMADO');
    }
    
    if (paymentIdIndex !== -1 && data.paymentId) {
      sheet.getRange(rowIndex, paymentIdIndex + 1).setValue(data.paymentId);
    }
    
    if (fechaConfirmacionIndex !== -1) {
      sheet.getRange(rowIndex, fechaConfirmacionIndex + 1).setValue(new Date().toISOString());
    }
    
    console.log('✅ Pago actualizado exitosamente');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error actualizando pago:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// GUARDAR EN GOOGLE SHEETS
// ============================================================================

function guardarEnGoogleSheets(data) {
  try {
    console.log('📊 Guardando datos en Google Sheets...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      console.error('❌ Hoja no encontrada:', SHEET_NAME);
      return { success: false, error: 'Hoja no encontrada' };
    }
    
    // Obtener headers actuales
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('📋 Headers actuales:', headers);
    
    // Preparar datos para insertar
    const rowData = [];
    
    // Mapear datos según los headers existentes
    const fieldMapping = {
      'Nombre': data.nombre,
      'Apellido': data.apellido,
      'Email': data.email,
      'DNI': data.dni,
      'Teléfono': data.telefono,
      'Cantidad de Chances': data.cantidadChances,
      'Pago Confirmado': data.pagoConfirmado ? 'TRUE' : 'FALSE',
      'Estado Pago': data.estadoPago,
      'Session ID': data.sessionId,
      'Payment ID': data.paymentId,
      'Fecha de Registro': data.fechaRegistro,
      'Timestamp': data.timestamp || Date.now()
    };
    
    // Construir fila según headers existentes
    headers.forEach(header => {
      rowData.push(fieldMapping[header] || '');
    });
    
    console.log('📊 Datos a insertar:', rowData);
    
    // Insertar nueva fila
    sheet.appendRow(rowData);
    
    console.log('✅ Datos guardados exitosamente');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error guardando en Google Sheets:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// VERIFICACIÓN DE PAGOS PENDIENTES
// ============================================================================

function verificarPagosPendientes() {
  try {
    console.log('🔄 Iniciando verificación de pagos pendientes...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      console.error('❌ Hoja no encontrada:', SHEET_NAME);
      return;
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    console.log('📊 Headers encontrados:', headers);
    console.log('📊 Total de filas:', data.length);
    
    // Encontrar índices de columnas
    const pagoConfirmadoIndex = headers.indexOf('Pago Confirmado');
    const estadoPagoIndex = headers.indexOf('Estado Pago');
    const sessionIdIndex = headers.indexOf('Session ID');
    const paymentIdIndex = headers.indexOf('Payment ID');
    const emailIndex = headers.indexOf('Email');
    const nombreIndex = headers.indexOf('Nombre');
    
    console.log('🔍 Índices encontrados:', {
      pagoConfirmado: pagoConfirmadoIndex,
      estadoPago: estadoPagoIndex,
      sessionId: sessionIdIndex,
      paymentId: paymentIdIndex,
      email: emailIndex,
      nombre: nombreIndex
    });
    
    if (pagoConfirmadoIndex === -1 || estadoPagoIndex === -1) {
      console.error('❌ Columnas requeridas no encontradas');
      return;
    }
    
    let pagosActualizados = 0;
    let pagosPendientes = 0;
    
    // Procesar cada fila
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      const pagoConfirmado = row[pagoConfirmadoIndex];
      const estadoPago = row[estadoPagoIndex];
      const sessionId = sessionIdIndex !== -1 ? (row[sessionIdIndex] || '') : '';
      const paymentId = paymentIdIndex !== -1 ? (row[paymentIdIndex] || '') : '';
      const email = emailIndex !== -1 ? (row[emailIndex] || '') : '';
      const nombre = nombreIndex !== -1 ? (row[nombreIndex] || '') : '';
      
      console.log(`\n📊 Procesando fila ${i + 1}:`);
      console.log(`  👤 Nombre: ${nombre}`);
      console.log(`  📧 Email: ${email}`);
      console.log(`  💳 Pago Confirmado: ${pagoConfirmado}`);
      console.log(`  📋 Estado Pago: ${estadoPago}`);
      console.log(`  🔑 Session ID: ${sessionId}`);
      console.log(`  🆔 Payment ID: ${paymentId}`);
      
      // Solo verificar pagos pendientes
      if (pagoConfirmado === 'FALSE' && estadoPago === 'PENDIENTE') {
        pagosPendientes++;
        console.log(`🔍 Verificando pago pendiente ${pagosPendientes}:`, sessionId);
        
        // Verificar pago en MercadoPago
        const pagoConfirmado = verificarPagoEnMercadoPago(sessionId, paymentId, email);
        
        if (pagoConfirmado) {
          console.log('✅ Pago confirmado:', sessionId);
          
          // Actualizar el registro
          const rowIndex = i + 1;
          sheet.getRange(rowIndex, pagoConfirmadoIndex + 1).setValue('TRUE');
          sheet.getRange(rowIndex, estadoPagoIndex + 1).setValue('CONFIRMADO');
          
          // Actualizar fecha de confirmación
          const fechaConfirmacionIndex = headers.indexOf('Fecha Confirmación');
          if (fechaConfirmacionIndex !== -1) {
            sheet.getRange(rowIndex, fechaConfirmacionIndex + 1).setValue(new Date().toISOString());
          }
          
          pagosActualizados++;
          
          // Enviar email de confirmación
          enviarEmailConfirmacion(row, headers);
          
        } else {
          console.log('⏳ Pago aún pendiente:', sessionId);
        }
      } else if (pagoConfirmado === 'TRUE') {
        console.log('✅ Pago ya confirmado');
      } else {
        console.log('❓ Estado desconocido');
      }
    }
    
    console.log(`✅ Verificación completada: ${pagosActualizados} pagos actualizados de ${pagosPendientes} pendientes`);
    
  } catch (error) {
    console.error('❌ Error en verificación:', error);
  }
}

// ============================================================================
// VERIFICACIÓN EN MERCADOPAGO
// ============================================================================

function verificarPagoEnMercadoPago(sessionId, paymentId, email) {
  try {
    console.log(`🔍 Verificando pago: sessionId=${sessionId}, paymentId=${paymentId}, email=${email}`);
    
    // Buscar por Payment ID
    if (paymentId && paymentId !== 'N/A' && paymentId !== '') {
      console.log(`🔍 Buscando por Payment ID: ${paymentId}`);
      
      const url = `https://api.mercadopago.com/v1/payments/${paymentId}`;
      const response = UrlFetchApp.fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.getResponseCode() === 200) {
        const paymentData = JSON.parse(response.getContentText());
        console.log(`📊 Pago encontrado por Payment ID:`, paymentData);
        
        const isApproved = paymentData.status === 'approved' || 
                          paymentData.collection_status === 'approved';
        
        console.log(`✅ Estado: ${paymentData.status}, Aprobado: ${isApproved}`);
        return isApproved;
      }
    }
    
    // Buscar por Session ID
    if (sessionId && sessionId !== 'N/A' && sessionId !== '') {
      console.log(`🔍 Buscando por Session ID: ${sessionId}`);
      
      const url = `https://api.mercadopago.com/v1/payments/search?external_reference=${sessionId}`;
      const response = UrlFetchApp.fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.getResponseCode() === 200) {
        const searchData = JSON.parse(response.getContentText());
        
        if (searchData.results && searchData.results.length > 0) {
          const payment = searchData.results[0];
          console.log(`📊 Pago encontrado por Session ID:`, payment);
          
          const isApproved = payment.status === 'approved' || 
                            payment.collection_status === 'approved';
          
          console.log(`✅ Estado: ${payment.status}, Aprobado: ${isApproved}`);
          return isApproved;
        }
      }
    }
    
        // Buscar por collector_id (pagos que te hacen a ti)
    const collectorId = 2142366374;
    
    if (collectorId) {
      console.log(`🔍 Buscando por collector_id: ${collectorId}`);
      
             // Obtener todos los pagos y filtrar por collector_id
       const url = `https://api.mercadopago.com/v1/payments/search?limit=200`;
      const response = UrlFetchApp.fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.getResponseCode() === 200) {
        const searchData = JSON.parse(response.getContentText());
        
        // Filtrar pagos por collector_id (pagos que te hacen a ti)
        const pagosRecibidos = searchData.results.filter(payment => 
          payment.collector_id === collectorId
        );
        
        if (pagosRecibidos.length > 0) {
          console.log(`✅ Pago encontrado por collector_id: ${collectorId}`);
          console.log(`📊 Total de pagos recibidos: ${pagosRecibidos.length}`);
          
          // Buscar el pago más reciente aprobado
          const pagoAprobado = pagosRecibidos.find(payment => 
            payment.status === 'approved' || payment.collection_status === 'approved'
          );
          
          if (pagoAprobado) {
            console.log(`✅ Pago aprobado encontrado:`, pagoAprobado);
            return true;
          }
        }
      } else {
        console.log(`❌ Error en API para collector_id ${collectorId}: ${response.getResponseCode()}`);
      }
    }
    
    console.log(`❌ No se pudo verificar el pago`);
    return false;
    
  } catch (error) {
    console.error(`❌ Error verificando pago:`, error);
    return false;
  }
}

// ============================================================================
// EMAIL DE CONFIRMACIÓN
// ============================================================================

function enviarEmailConfirmacion(rowData, headers) {
  try {
    const nombreIndex = headers.indexOf('Nombre');
    const emailIndex = headers.indexOf('Email');
    
    if (nombreIndex !== -1 && emailIndex !== -1) {
      const nombre = rowData[nombreIndex];
      const email = rowData[emailIndex];
      
      if (email && nombre) {
        const subject = '¡Tu participación ha sido confirmada! - CODES++';
        const body = `
          <h2>¡Hola ${nombre}!</h2>
          <p>Tu pago ha sido confirmado exitosamente.</p>
          <p>Tu participación en el sorteo de la Tablet Android 15 ha sido registrada.</p>
          <p>Te notificaremos si resultas ganador/a.</p>
          <br>
          <p>Saludos,</p>
          <p>Equipo CODES++</p>
        `;
        
        MailApp.sendEmail(email, subject, '', {htmlBody: body});
        console.log('📧 Email de confirmación enviado a:', email);
      }
    }
    
  } catch (error) {
    console.error('❌ Error enviando email:', error);
  }
}

// ============================================================================
// FUNCIONES DE PRUEBA
// ============================================================================

function probarConexion() {
  try {
    console.log('🔍 Probando conexión básica...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (sheet) {
      console.log('✅ Conexión a Google Sheets exitosa');
      console.log('📊 Total de filas:', sheet.getLastRow());
      console.log('📊 Total de columnas:', sheet.getLastColumn());
    } else {
      console.log('❌ No se pudo acceder a la hoja');
    }
    
  } catch (error) {
    console.error('❌ Error en conexión:', error);
  }
}

function probarMercadoPago() {
  try {
    console.log('🔍 Probando API de MercadoPago...');
    
    const url = 'https://api.mercadopago.com/v1/payments/search?limit=1';
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.getResponseCode() === 200) {
      console.log('✅ Conexión a MercadoPago exitosa');
      const data = JSON.parse(response.getContentText());
      console.log('📊 Total de pagos disponibles:', data.paging?.total || 'N/A');
    } else {
      console.log('❌ Error en API de MercadoPago:', response.getResponseCode());
    }
    
  } catch (error) {
    console.error('❌ Error probando MercadoPago:', error);
  }
}

function buscarPagosUsuario() {
  try {
    console.log('🔍 Buscando pagos recibidos...');
    console.log('👤 Usuario: RF20241206142733');
    console.log('📧 Email MercadoPago: rizzofs.eu@gmail.com');
    console.log('📱 Teléfono: +542346612609');
    console.log('🏪 Collector ID: 2142366374');
    
    console.log(`\n💰 Buscando pagos recibidos como vendedor...`);
    
    // Obtener todos los pagos y filtrar por collector_id (tus pagos recibidos)
    const url = `https://api.mercadopago.com/v1/payments/search?limit=200`;
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.getResponseCode() === 200) {
      const searchData = JSON.parse(response.getContentText());
      
      console.log(`📊 Total de pagos disponibles: ${searchData.results.length}`);
      
      // Filtrar solo los pagos que te hacen a ti (collector_id: 2142366374)
      const pagosRecibidos = searchData.results.filter(payment => 
        payment.collector_id === 2142366374
      );
      
      console.log(`📊 Pagos recibidos (collector_id: 2142366374): ${pagosRecibidos.length}`);
      
      if (pagosRecibidos.length > 0) {
        pagosRecibidos.forEach((payment, index) => {
          console.log(`\n📊 Pago recibido ${index + 1}:`);
          console.log(`  🆔 ID: ${payment.id}`);
          console.log(`  📊 Estado: ${payment.status}`);
          console.log(`  💰 Monto: ${payment.transaction_amount}`);
          console.log(`  📅 Fecha: ${payment.date_created}`);
          console.log(`  🔑 External Reference: ${payment.external_reference || 'N/A'}`);
          console.log(`  📧 Email del pagador: ${payment.payer?.email || 'N/A'}`);
          console.log(`  🏪 Collector ID: ${payment.collector_id}`);
        });
      } else {
        console.log(`❌ No se encontraron pagos recibidos`);
      }
    } else {
      console.log(`❌ Error en API: ${response.getResponseCode()}`);
    }
    
  } catch (error) {
    console.error('❌ Error buscando pagos:', error);
  }
}

// ============================================================================
// CONFIGURACIÓN DE TRIGGERS
// ============================================================================

function configurarTrigger() {
  try {
    // Eliminar triggers existentes
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'verificarPagosPendientes') {
        ScriptApp.deleteTrigger(trigger);
        console.log('🗑️ Trigger anterior eliminado');
      }
    });
    
    // Crear nuevo trigger para ejecutar cada hora
    ScriptApp.newTrigger('verificarPagosPendientes')
      .timeBased()
      .everyHours(1)
      .create();
    
    console.log('✅ Trigger configurado para ejecutar cada hora');
    
  } catch (error) {
    console.error('❌ Error configurando trigger:', error);
  }
}

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================

function ejecutarSistema() {
  console.log('🚀 Ejecutando sistema de pagos...');
  
  try {
    verificarPagosPendientes();
    console.log('✅ Sistema ejecutado correctamente');
    
  } catch (error) {
    console.error('❌ Error ejecutando sistema:', error);
  }
} 