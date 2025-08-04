/**
 * Sistema Completo de Verificación de Pagos - MercadoPago + Google Sheets
 * Este script incluye: configuración, verificación real, emails y triggers automáticos
 */

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const SPREADSHEET_ID = '1rCNIwjzB--xtIyK4gMvqIxJGLETra4VqnF5aL8lRTMk';
const SHEET_NAME = 'Registros_Sorteo';
const MERCADOPAGO_ACCESS_TOKEN = 'APP_USR-5908100961878781-080320-3d4cf3e45d4723bffa7e302677cce571-2142366374';

// ============================================================================
// FUNCIÓN PRINCIPAL - RECEPCIÓN DE DATOS DEL FORMULARIO
// ============================================================================

function doPost(e) {
  try {
    console.log('📥 Recibiendo datos del formulario...');
    
    // Parsear los datos recibidos
    const data = JSON.parse(e.postData.contents);
    console.log('📊 Datos recibidos:', data);
    
    // Validar datos requeridos
    if (!data.nombre || !data.apellido || !data.email || !data.dni || !data.telefono || !data.cantidadChances) {
      console.error('❌ Datos incompletos recibidos');
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Datos incompletos'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Generar Session ID si no existe
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
// FUNCIÓN PARA GUARDAR EN GOOGLE SHEETS
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
// FUNCIÓN PRINCIPAL - VERIFICACIÓN DE PAGOS
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
    
    // Obtener todos los datos
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    console.log('📊 Headers encontrados:', headers);
    
    // Encontrar índices de columnas importantes
    const pagoConfirmadoIndex = headers.indexOf('Pago Confirmado');
    const estadoPagoIndex = headers.indexOf('Estado Pago');
    const sessionIdIndex = headers.indexOf('Session ID');
    const paymentIdIndex = headers.indexOf('Payment ID');
    const fechaRegistroIndex = headers.indexOf('Fecha de Registro');
    const emailIndex = headers.indexOf('Email');
    const nombreIndex = headers.indexOf('Nombre');
    
    console.log('🔍 Índices encontrados:', {
      pagoConfirmado: pagoConfirmadoIndex,
      estadoPago: estadoPagoIndex,
      sessionId: sessionIdIndex,
      paymentId: paymentIdIndex,
      fechaRegistro: fechaRegistroIndex,
      email: emailIndex,
      nombre: nombreIndex
    });
    
    if (pagoConfirmadoIndex === -1 || estadoPagoIndex === -1) {
      console.error('❌ Columnas requeridas no encontradas');
      return;
    }
    
    let pagosActualizados = 0;
    let pagosPendientes = 0;
    
    // Procesar cada fila (empezando desde la fila 2)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const pagoConfirmado = row[pagoConfirmadoIndex];
      const estadoPago = row[estadoPagoIndex];
      const sessionId = row[sessionIdIndex] || '';
      const paymentId = row[paymentIdIndex] || '';
      const email = row[emailIndex] || '';
      const nombre = row[nombreIndex] || '';
      
      // Solo verificar pagos pendientes
      if (pagoConfirmado === 'FALSE' && estadoPago === 'PENDIENTE') {
        pagosPendientes++;
        console.log(`🔍 Verificando pago pendiente ${pagosPendientes}:`, sessionId);
        
        // Verificar pago real en MercadoPago
        const pagoConfirmado = verificarPagoEnMercadoPago(sessionId, paymentId, email);
        
        if (pagoConfirmado) {
          console.log('✅ Pago confirmado:', sessionId);
          
          // Actualizar el registro
          const rowIndex = i + 1; // +1 porque getValues() es 0-indexed
          sheet.getRange(rowIndex, pagoConfirmadoIndex + 1).setValue('TRUE');
          sheet.getRange(rowIndex, estadoPagoIndex + 1).setValue('CONFIRMADO');
          
          // Actualizar fecha de confirmación si existe la columna
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
      }
    }
    
    console.log(`✅ Verificación completada: ${pagosActualizados} pagos actualizados de ${pagosPendientes} pendientes`);
    
  } catch (error) {
    console.error('❌ Error en verificación:', error);
  }
}

// ============================================================================
// VERIFICACIÓN REAL EN MERCADOPAGO
// ============================================================================

function verificarPagoEnMercadoPago(sessionId, paymentId, email) {
  try {
    console.log(`🔍 Verificando pago real en MercadoPago: sessionId=${sessionId}, paymentId=${paymentId}, email=${email}`);
    
    // Si tenemos paymentId válido, buscarlo directamente
    if (paymentId && paymentId !== 'N/A' && paymentId !== '') {
      console.log(`🔍 Buscando pago por Payment ID: ${paymentId}`);
      
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
        console.log(`📊 Datos del pago encontrado:`, paymentData);
        
        // Verificar si el pago está aprobado
        const isApproved = paymentData.status === 'approved' || 
                          paymentData.collection_status === 'approved';
        
        console.log(`✅ Estado del pago: ${paymentData.status}, Collection: ${paymentData.collection_status}`);
        console.log(`🎯 Resultado: ${isApproved ? 'CONFIRMADO' : 'PENDIENTE'}`);
        
        return isApproved;
      } else {
        console.log(`❌ Error al buscar pago por ID: ${response.getResponseCode()}`);
      }
    }
    
    // Si no tenemos paymentId, buscar por external_reference (sessionId)
    if (sessionId && sessionId !== 'N/A' && sessionId !== '') {
      console.log(`🔍 Buscando pago por external_reference: ${sessionId}`);
      
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
        console.log(`📊 Resultados de búsqueda:`, searchData);
        
        if (searchData.results && searchData.results.length > 0) {
          const payment = searchData.results[0];
          console.log(`📊 Pago encontrado:`, payment);
          
          // Verificar si el pago está aprobado
          const isApproved = payment.status === 'approved' || 
                            payment.collection_status === 'approved';
          
          console.log(`✅ Estado del pago: ${payment.status}, Collection: ${payment.collection_status}`);
          console.log(`🎯 Resultado: ${isApproved ? 'CONFIRMADO' : 'PENDIENTE'}`);
          
          return isApproved;
        } else {
          console.log(`❌ No se encontraron pagos para sessionId: ${sessionId}`);
        }
      } else {
        console.log(`❌ Error al buscar pago por sessionId: ${response.getResponseCode()}`);
      }
    }
    
    // Buscar por email (último recurso)
    if (email && email !== 'N/A' && email !== '') {
      console.log(`🔍 Buscando pago por email: ${email}`);
      
      const url = `https://api.mercadopago.com/v1/payments/search?payer.email=${email}`;
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
          console.log(`✅ Pago encontrado por email`);
          console.log(`📊 Total de pagos: ${searchData.results.length}`);
          
          // Buscar el pago más reciente aprobado
          const pagoAprobado = searchData.results.find(payment => 
            payment.status === 'approved' || payment.collection_status === 'approved'
          );
          
          if (pagoAprobado) {
            console.log(`✅ Pago aprobado encontrado por email:`, pagoAprobado);
            return true;
          } else {
            console.log(`❌ No se encontraron pagos aprobados para el email`);
          }
        } else {
          console.log(`❌ No se encontraron pagos para el email`);
        }
      } else {
        console.log(`❌ Error buscando por email: ${response.getResponseCode()}`);
      }
    }
    
    console.log(`❌ No se pudo verificar el pago: sin paymentId, sessionId ni email válidos`);
    return false;
    
  } catch (error) {
    console.error(`❌ Error verificando pago en MercadoPago:`, error);
    return false;
  }
}

// ============================================================================
// EMAIL DE CONFIRMACIÓN
// ============================================================================

function enviarEmailConfirmacion(rowData, headers) {
  try {
    // Buscar índices de nombre y email
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
// CONFIGURACIÓN DE ESTRUCTURA DE HOJA
// ============================================================================

function actualizarEstructuraHoja() {
  try {
    console.log('📊 Actualizando estructura de la hoja...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      console.error('❌ Hoja no encontrada:', SHEET_NAME);
      return;
    }
    
    // Obtener headers actuales
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('📋 Headers actuales:', headers);
    
    // Columnas que necesitamos agregar
    const columnasNecesarias = [
      'Estado Pago',
      'Session ID', 
      'Payment ID',
      'Fecha Confirmación'
    ];
    
    let columnaActual = headers.length + 1;
    
    columnasNecesarias.forEach(columna => {
      if (headers.indexOf(columna) === -1) {
        console.log(`➕ Agregando columna: ${columna} en posición ${columnaActual}`);
        sheet.getRange(1, columnaActual).setValue(columna);
        columnaActual++;
      } else {
        console.log(`✅ Columna ya existe: ${columna}`);
      }
    });
    
    // Actualizar registros existentes con valores por defecto
    const ultimaFila = sheet.getLastRow();
    if (ultimaFila > 1) {
      console.log('🔄 Actualizando registros existentes...');
      
      // Buscar índices de las nuevas columnas
      const headersActualizados = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const estadoPagoIndex = headersActualizados.indexOf('Estado Pago');
      const sessionIdIndex = headersActualizados.indexOf('Session ID');
      const paymentIdIndex = headersActualizados.indexOf('Payment ID');
      
      // Actualizar registros existentes
      for (let fila = 2; fila <= ultimaFila; fila++) {
        // Estado Pago por defecto: PENDIENTE
        if (estadoPagoIndex !== -1) {
          const pagoConfirmado = sheet.getRange(fila, headersActualizados.indexOf('Pago Confirmado') + 1).getValue();
          const estadoPago = pagoConfirmado === 'TRUE' ? 'CONFIRMADO' : 'PENDIENTE';
          sheet.getRange(fila, estadoPagoIndex + 1).setValue(estadoPago);
        }
        
        // Session ID por defecto
        if (sessionIdIndex !== -1) {
          const sessionId = sheet.getRange(fila, sessionIdIndex + 1).getValue();
          if (!sessionId) {
            sheet.getRange(fila, sessionIdIndex + 1).setValue('SES_' + Date.now() + '_' + fila);
          }
        }
        
        // Payment ID por defecto
        if (paymentIdIndex !== -1) {
          const paymentId = sheet.getRange(fila, paymentIdIndex + 1).getValue();
          if (!paymentId) {
            sheet.getRange(fila, paymentIdIndex + 1).setValue('N/A');
          }
        }
      }
    }
    
    console.log('✅ Estructura de hoja actualizada');
    
  } catch (error) {
    console.error('❌ Error actualizando estructura:', error);
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
// LIMPIEZA DE REGISTROS ANTIGUOS
// ============================================================================

function limpiarRegistrosAntiguos() {
  try {
    console.log('🧹 Iniciando limpieza de registros antiguos...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    const pagoConfirmadoIndex = headers.indexOf('Pago Confirmado');
    const estadoPagoIndex = headers.indexOf('Estado Pago');
    const fechaRegistroIndex = headers.indexOf('Fecha de Registro');
    
    const ahora = new Date();
    const limite24h = new Date(ahora.getTime() - (24 * 60 * 60 * 1000));
    
    let registrosLimpiados = 0;
    
    // Procesar desde el final para evitar problemas con índices
    for (let i = data.length - 1; i >= 1; i--) {
      const row = data[i];
      const pagoConfirmado = row[pagoConfirmadoIndex];
      const estadoPago = row[estadoPagoIndex];
      const fechaRegistro = row[fechaRegistroIndex];
      
      // Solo limpiar registros pendientes de más de 24 horas
      if (pagoConfirmado === 'FALSE' && estadoPago === 'PENDIENTE') {
        if (fechaRegistro) {
          const fechaRegistroDate = new Date(fechaRegistro);
          if (fechaRegistroDate < limite24h) {
            console.log(`🗑️ Limpiando registro antiguo en fila ${i + 1}`);
            
            // Marcar como cancelado en lugar de eliminar
            const rowIndex = i + 1;
            sheet.getRange(rowIndex, pagoConfirmadoIndex + 1).setValue('FALSE');
            sheet.getRange(rowIndex, estadoPagoIndex + 1).setValue('CANCELADO');
            
            registrosLimpiados++;
          }
        }
      }
    }
    
    console.log(`✅ Limpieza completada: ${registrosLimpiados} registros marcados como cancelados`);
    
  } catch (error) {
    console.error('❌ Error en limpieza:', error);
  }
}

// ============================================================================
// FUNCIONES DE PRUEBA Y DIAGNÓSTICO
// ============================================================================

function probarConexionBasica() {
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
    console.error('❌ Error en conexión básica:', error);
  }
}

function probarAPIMercadoPago() {
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
    console.error('❌ Error probando API de MercadoPago:', error);
  }
}

function probarTodo() {
  console.log('🧪 Iniciando pruebas completas...');
  
  probarConexionBasica();
  probarAPIMercadoPago();
  actualizarEstructuraHoja();
  verificarPagosPendientes();
  
  console.log('✅ Pruebas completadas');
}

function configurarTodo() {
  console.log('⚙️ Configurando sistema completo...');
  
  actualizarEstructuraHoja();
  configurarTrigger();
  
  console.log('✅ Sistema configurado correctamente');
}

// ============================================================================
// FUNCIÓN PRINCIPAL DE EJECUCIÓN
// ============================================================================

function ejecutarSistemaCompleto() {
  console.log('🚀 Ejecutando sistema completo de pagos...');
  
  try {
    // 1. Limpiar registros antiguos
    limpiarRegistrosAntiguos();
    
    // 2. Verificar pagos pendientes
    verificarPagosPendientes();
    
    console.log('✅ Sistema ejecutado correctamente');
    
  } catch (error) {
    console.error('❌ Error ejecutando sistema:', error);
  }
} 