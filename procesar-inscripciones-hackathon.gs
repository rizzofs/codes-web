/**
 * Script para procesar inscripciones del Hackathon
 * Recibe datos del formulario y envía emails de confirmación
 */

// Configuración
const CONFIG = {
  SPREADSHEET_ID: '10xC2zcFGQgLtIHtR1BWM3BhoNYSDntq3T6QAq0KuE-8',
  EMAIL_FROM: 'codes.unlu@gmail.com',
  EMAIL_SUBJECT_EQUIPO: '✅ Confirmación de Inscripción - Hackathon CODES++',
  EMAIL_SUBJECT_INDIVIDUAL: '✅ Confirmación de Inscripción Individual - Hackathon CODES++'
};

/**
 * Función principal para procesar inscripción de equipo
 * Se llama desde el formulario HTML
 */
function doPost(e) {
  try {
    let data;
    
    // Check if data is JSON or form data
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonError) {
        // If not JSON, treat as form data
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }
    
    if (data.tipo === 'equipo') {
      return procesarInscripcionEquipo(data);
    } else if (data.tipo === 'individual') {
      return procesarInscripcionIndividual(data);
    } else {
      return crearPaginaError('Tipo de inscripción no válido');
    }
  } catch (error) {
    console.error('Error en doPost:', error);
    return crearPaginaError('Error al procesar la solicitud: ' + error.toString());
  }
}

/**
 * Función para manejar solicitudes GET (visitas directas a la URL)
 */
function doGet(e) {
  return crearPaginaInfo();
}

/**
 * Función para manejar solicitudes OPTIONS (CORS preflight)
 */
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

/**
 * Procesar inscripción de equipo
 */
function procesarInscripcionEquipo(data) {
  try {
    // 1. Guardar en Google Sheet
    const sheetId = guardarEquipoEnSheet(data);
    
    // 2. Enviar email de confirmación
    const emailEnviado = enviarEmailEquipo(data);
    
    if (sheetId && emailEnviado) {
      return crearPaginaExito('equipo', data);
    } else {
      throw new Error('Error al procesar la inscripción');
    }
  } catch (error) {
    console.error('Error al procesar equipo:', error);
    return crearPaginaError('Error al procesar la inscripción del equipo: ' + error.toString());
  }
}

/**
 * Procesar inscripción individual
 */
function procesarInscripcionIndividual(data) {
  try {
    // 1. Guardar en Google Sheet
    const sheetId = guardarIndividualEnSheet(data);
    
    // 2. Enviar email de confirmación
    const emailEnviado = enviarEmailIndividual(data);
    
    if (sheetId && emailEnviado) {
      return crearPaginaExito('individual', data);
    } else {
      throw new Error('Error al procesar la inscripción');
    }
  } catch (error) {
    console.error('Error al procesar individual:', error);
    return crearPaginaError('Error al procesar la inscripción individual: ' + error.toString());
  }
}

/**
 * Guardar equipo en Google Sheet
 */
function guardarEquipoEnSheet(data) {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName('Equipos');
    
    if (!sheet) {
      throw new Error('Hoja "Equipos" no encontrada');
    }
    
    const timestamp = new Date();
    const rowData = [
      timestamp,
      data.teamName,
      data.member1_name,
      data.member1_surname,
      data.member1_email,
      data.member1_discord,
      data.member2_name,
      data.member2_surname,
      data.member2_email,
      data.member2_discord,
      data.member3_name,
      data.member3_surname,
      data.member3_email,
      data.member3_discord,
      'Pendiente',
      ''
    ];
    
    sheet.appendRow(rowData);
    console.log('✅ Equipo guardado en sheet:', data.teamName);
    return sheet.getLastRow();
  } catch (error) {
    console.error('Error al guardar equipo:', error);
    throw error;
  }
}

/**
 * Guardar participante individual en Google Sheet
 */
function guardarIndividualEnSheet(data) {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName('Individual');
    
    if (!sheet) {
      throw new Error('Hoja "Individual" no encontrada');
    }
    
    const timestamp = new Date();
    const rowData = [
      timestamp,
      data.name,
      data.surname,
      data.email,
      data.discord,
      'Pendiente',
      '',
      ''
    ];
    
    sheet.appendRow(rowData);
    console.log('✅ Participante individual guardado:', data.name);
    return sheet.getLastRow();
  } catch (error) {
    console.error('Error al guardar individual:', error);
    throw error;
  }
}

/**
 * Enviar email de confirmación para equipo
 */
function enviarEmailEquipo(data) {
  try {
    const htmlBody = generarHTMLEmailEquipo(data);
    
    // Enviar a los 3 integrantes
    const emails = [data.member1_email, data.member2_email, data.member3_email];
    
    emails.forEach(email => {
      GmailApp.sendEmail(
        email,
        CONFIG.EMAIL_SUBJECT_EQUIPO,
        '', // Texto plano vacío
        {
          htmlBody: htmlBody,
          name: 'CODES++ - Centro de Estudiantes'
        }
      );
    });
    
    console.log('✅ Emails enviados al equipo:', data.teamName);
    return true;
  } catch (error) {
    console.error('Error al enviar email equipo:', error);
    return false;
  }
}

/**
 * Enviar email de confirmación para participante individual
 */
function enviarEmailIndividual(data) {
  try {
    const htmlBody = generarHTMLEmailIndividual(data);
    
    GmailApp.sendEmail(
      data.email,
      CONFIG.EMAIL_SUBJECT_INDIVIDUAL,
      '', // Texto plano vacío
      {
        htmlBody: htmlBody,
        name: 'CODES++ - Centro de Estudiantes'
      }
    );
    
    console.log('✅ Email enviado a participante individual:', data.name);
    return true;
  } catch (error) {
    console.error('Error al enviar email individual:', error);
    return false;
  }
}

/**
 * Generar HTML del email para equipo
 */
function generarHTMLEmailEquipo(data) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación Hackathon</title>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            background: #0a0a0a;
            color: #ffffff;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #1a1a1a;
            border-radius: 15px;
            border: 2px solid #00ff88;
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            padding: 30px;
            text-align: center;
            border-bottom: 3px solid #00ff88;
        }
        .logo {
            width: 80px;
            height: 80px;
            margin-bottom: 20px;
        }
        .title {
            color: #00ff88;
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            text-shadow: 0 0 20px #00ff88;
        }
        .subtitle {
            color: #0088ff;
            font-size: 16px;
            margin: 10px 0 0 0;
        }
        .content {
            padding: 30px;
        }
        .success-icon {
            color: #00ff88;
            font-size: 48px;
            text-align: center;
            margin-bottom: 20px;
        }
        .team-info {
            background: rgba(0, 255, 136, 0.1);
            border: 1px solid #00ff88;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }
        .team-name {
            color: #00ff88;
            font-size: 24px;
            font-weight: 600;
            text-align: center;
            margin-bottom: 20px;
        }
        .member {
            background: rgba(0, 136, 255, 0.1);
            border: 1px solid #0088ff;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
        }
        .member-name {
            color: #0088ff;
            font-weight: 600;
            margin-bottom: 5px;
        }
        .member-details {
            color: #888;
            font-size: 14px;
        }
        .timeline {
            margin: 30px 0;
        }
        .timeline-item {
            display: flex;
            align-items: center;
            margin: 15px 0;
            padding: 10px;
            background: rgba(255, 0, 136, 0.1);
            border-radius: 8px;
            border-left: 4px solid #ff0088;
        }
        .timeline-date {
            color: #ff0088;
            font-weight: 600;
            min-width: 120px;
        }
        .timeline-desc {
            color: #ffffff;
            margin-left: 15px;
        }
        .footer {
            background: #0a0a0a;
            padding: 20px;
            text-align: center;
            border-top: 2px solid #00ff88;
        }
        .contact-info {
            color: #888;
            font-size: 14px;
            margin: 10px 0;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-link {
            color: #00ff88;
            text-decoration: none;
            margin: 0 10px;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">🎉 ¡INSCRIPCIÓN CONFIRMADA!</div>
            <div class="subtitle">Hackathon de Fin de Semana - CODES++</div>
        </div>
        
        <div class="content">
            <div class="success-icon">✅</div>
            
            <p style="text-align: center; font-size: 18px; color: #00ff88;">
                <strong>¡Felicitaciones! Tu equipo ha sido inscrito exitosamente</strong>
            </p>
            
            <div class="team-info">
                <div class="team-name">${data.teamName}</div>
                
                <div class="member">
                    <div class="member-name">👑 ${data.member1_name} ${data.member1_surname} (Capitán)</div>
                    <div class="member-details">📧 ${data.member1_email} | 💬 ${data.member1_discord}</div>
                </div>
                
                <div class="member">
                    <div class="member-name">👤 ${data.member2_name} ${data.member2_surname}</div>
                    <div class="member-details">📧 ${data.member2_email} | 💬 ${data.member2_discord}</div>
                </div>
                
                <div class="member">
                    <div class="member-name">👤 ${data.member3_name} ${data.member3_surname}</div>
                    <div class="member-details">📧 ${data.member3_email} | 💬 ${data.member3_discord}</div>
                </div>
            </div>
            
            <div class="timeline">
                <h3 style="color: #ff0088; text-align: center;">📅 Cronograma del Hackathon</h3>
                
                <div class="timeline-item">
                    <div class="timeline-date">Lunes 23/9</div>
                    <div class="timeline-desc">Se enviará la consigna del Hackathon</div>
                </div>
                
                <div class="timeline-item">
                    <div class="timeline-date">Jueves 25/9 - 23:59</div>
                    <div class="timeline-desc">Entrega de 3 propuestas</div>
                </div>
                
                <div class="timeline-item">
                    <div class="timeline-date">Viernes 26/9 - 22:00</div>
                    <div class="timeline-desc">Notificación de propuesta seleccionada</div>
                </div>
                
                <div class="timeline-item">
                    <div class="timeline-date">Sábado 27/9 y Domingo 28/9</div>
                    <div class="timeline-desc">48 horas de desarrollo del proyecto</div>
                </div>
                
                <div class="timeline-item">
                    <div class="timeline-date">Domingo 28/9 - 22:00</div>
                    <div class="timeline-desc">Entrega final del proyecto</div>
                </div>
            </div>
            
            <div style="background: rgba(0, 255, 136, 0.1); border: 1px solid #00ff88; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <h4 style="color: #00ff88; margin-top: 0;">📋 Próximos pasos:</h4>
                <ul style="color: #ffffff;">
                    <li>Mantente atento a tu email para recibir la consigna</li>
                    <li>Únete al Discord del CODES++ si aún no lo has hecho</li>
                    <li>Prepara tu entorno de desarrollo</li>
                    <li>¡Prepárate para 48 horas de programación intensiva!</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <div class="contact-info">
                <strong>Centro Organizado de Estudiantes de Sistemas - CODES++</strong><br>
                📧 codes.unlu@gmail.com
            </div>
            
            <div class="social-links">
                <a href="https://www.instagram.com/codes_unlu/" class="social-link">Instagram</a>
                <a href="https://discord.gg/rDtEx4dMvD" class="social-link">Discord</a>
                <a href="https://github.com/CODES-UNLU" class="social-link">GitHub</a>
            </div>
            
            <div style="color: #888; font-size: 12px; margin-top: 20px;">
                © 2025 CODES++. Todos los derechos reservados.
            </div>
        </div>
    </div>
</body>
</html>
  `;
}

/**
 * Generar HTML del email para participante individual
 */
function generarHTMLEmailIndividual(data) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación Hackathon Individual</title>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            background: #0a0a0a;
            color: #ffffff;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #1a1a1a;
            border-radius: 15px;
            border: 2px solid #0088ff;
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            padding: 30px;
            text-align: center;
            border-bottom: 3px solid #0088ff;
        }
        .title {
            color: #0088ff;
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            text-shadow: 0 0 20px #0088ff;
        }
        .subtitle {
            color: #00ff88;
            font-size: 16px;
            margin: 10px 0 0 0;
        }
        .content {
            padding: 30px;
        }
        .success-icon {
            color: #0088ff;
            font-size: 48px;
            text-align: center;
            margin-bottom: 20px;
        }
        .individual-info {
            background: rgba(0, 136, 255, 0.1);
            border: 1px solid #0088ff;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }
        .individual-name {
            color: #0088ff;
            font-size: 24px;
            font-weight: 600;
            text-align: center;
            margin-bottom: 15px;
        }
        .individual-details {
            color: #888;
            font-size: 16px;
            text-align: center;
        }
        .team-formation {
            background: rgba(0, 255, 136, 0.1);
            border: 1px solid #00ff88;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }
        .timeline {
            margin: 30px 0;
        }
        .timeline-item {
            display: flex;
            align-items: center;
            margin: 15px 0;
            padding: 10px;
            background: rgba(255, 0, 136, 0.1);
            border-radius: 8px;
            border-left: 4px solid #ff0088;
        }
        .timeline-date {
            color: #ff0088;
            font-weight: 600;
            min-width: 120px;
        }
        .timeline-desc {
            color: #ffffff;
            margin-left: 15px;
        }
        .footer {
            background: #0a0a0a;
            padding: 20px;
            text-align: center;
            border-top: 2px solid #0088ff;
        }
        .contact-info {
            color: #888;
            font-size: 14px;
            margin: 10px 0;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-link {
            color: #0088ff;
            text-decoration: none;
            margin: 0 10px;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">🎉 ¡INSCRIPCIÓN CONFIRMADA!</div>
            <div class="subtitle">Hackathon de Fin de Semana - CODES++</div>
        </div>
        
        <div class="content">
            <div class="success-icon">✅</div>
            
            <p style="text-align: center; font-size: 18px; color: #0088ff;">
                <strong>¡Felicitaciones! Tu inscripción individual ha sido confirmada</strong>
            </p>
            
            <div class="individual-info">
                <div class="individual-name">👤 ${data.name} ${data.surname}</div>
                <div class="individual-details">
                    📧 ${data.email}<br>
                    💬 ${data.discord}
                </div>
            </div>
            
            <div class="team-formation">
                <h4 style="color: #00ff88; margin-top: 0;">🤝 Formación de Equipos</h4>
                <p style="color: #ffffff;">
                    <strong>¡No te preocupes si no tenés equipo!</strong> Te ayudaremos a formar un equipo con otros participantes individuales. 
                    Nos pondremos en contacto contigo pronto para conectarte con otros estudiantes.
                </p>
                <ul style="color: #ffffff;">
                    <li>Te contactaremos por email para formar tu equipo</li>
                    <li>Podrás conocer a tus futuros compañeros</li>
                    <li>Trabajarás en equipo de 3 personas</li>
                </ul>
            </div>
            
            <div class="timeline">
                <h3 style="color: #ff0088; text-align: center;">📅 Cronograma del Hackathon</h3>
                
                <div class="timeline-item">
                    <div class="timeline-date">Lunes 23/9</div>
                    <div class="timeline-desc">Se enviará la consigna del Hackathon</div>
                </div>
                
                <div class="timeline-item">
                    <div class="timeline-date">Jueves 25/9 - 23:59</div>
                    <div class="timeline-desc">Entrega de 3 propuestas</div>
                </div>
                
                <div class="timeline-item">
                    <div class="timeline-date">Viernes 26/9 - 22:00</div>
                    <div class="timeline-desc">Notificación de propuesta seleccionada</div>
                </div>
                
                <div class="timeline-item">
                    <div class="timeline-date">Sábado 27/9 y Domingo 28/9</div>
                    <div class="timeline-desc">48 horas de desarrollo del proyecto</div>
                </div>
                
                <div class="timeline-item">
                    <div class="timeline-date">Domingo 28/9 - 22:00</div>
                    <div class="timeline-desc">Entrega final del proyecto</div>
                </div>
            </div>
            
            <div style="background: rgba(0, 136, 255, 0.1); border: 1px solid #0088ff; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <h4 style="color: #0088ff; margin-top: 0;">📋 Próximos pasos:</h4>
                <ul style="color: #ffffff;">
                    <li>Espera nuestro contacto para formar tu equipo</li>
                    <li>Únete al Discord del CODES++ si aún no lo has hecho</li>
                    <li>Prepara tu entorno de desarrollo</li>
                    <li>¡Prepárate para 48 horas de programación intensiva!</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <div class="contact-info">
                <strong>Centro Organizado de Estudiantes de Sistemas - CODES++</strong><br>
                📧 codes.unlu@gmail.com
            </div>
            
            <div class="social-links">
                <a href="https://www.instagram.com/codes_unlu/" class="social-link">Instagram</a>
                <a href="https://discord.gg/rDtEx4dMvD" class="social-link">Discord</a>
                <a href="https://github.com/CODES-UNLU" class="social-link">GitHub</a>
            </div>
            
            <div style="color: #888; font-size: 12px; margin-top: 20px;">
                © 2025 CODES++. Todos los derechos reservados.
            </div>
        </div>
    </div>
</body>
</html>
  `;
}

/**
 * Función de prueba para testing
 */
function testProcesarEquipo() {
  const testData = {
    tipo: 'equipo',
    teamName: 'Los CodeMasters',
    member1_name: 'Juan',
    member1_surname: 'Pérez',
    member1_email: 'juan.perez@test.com',
    member1_discord: 'juanperez#1234',
    member2_name: 'María',
    member2_surname: 'García',
    member2_email: 'maria.garcia@test.com',
    member2_discord: 'mariagarcia#5678',
    member3_name: 'Carlos',
    member3_surname: 'López',
    member3_email: 'carlos.lopez@test.com',
    member3_discord: 'carloslopez#9012'
  };
  
  return procesarInscripcionEquipo(testData);
}

/**
 * Crear página de éxito
 */
function crearPaginaExito(tipo, data) {
  const titulo = tipo === 'equipo' ? '¡Equipo Inscrito Exitosamente!' : '¡Inscripción Individual Exitosa!';
  const mensaje = tipo === 'equipo' ? 
    `Tu equipo "${data.teamName}" ha sido inscrito correctamente. Recibirás una confirmación por email pronto.` :
    `Tu inscripción individual ha sido confirmada. Te contactaremos pronto para formar tu equipo.`;
  
  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscripción Exitosa - Hackathon CODES++</title>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            background: #0a0a0a;
            color: #ffffff;
            margin: 0;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .container {
            max-width: 600px;
            background: #1a1a1a;
            border-radius: 15px;
            border: 2px solid #00ff88;
            padding: 40px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 255, 136, 0.3);
        }
        .success-icon {
            font-size: 64px;
            color: #00ff88;
            margin-bottom: 20px;
            text-shadow: 0 0 20px #00ff88;
        }
        .title {
            color: #00ff88;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 20px;
            text-shadow: 0 0 10px #00ff88;
        }
        .message {
            color: #ffffff;
            font-size: 18px;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        .btn {
            background: linear-gradient(135deg, #00ff88 0%, #0088ff 100%);
            border: 2px solid #00ff88;
            color: #0a0a0a;
            padding: 15px 30px;
            font-size: 16px;
            font-weight: 700;
            border-radius: 50px;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 255, 136, 0.4);
            color: #0a0a0a;
        }
        .footer {
            margin-top: 30px;
            color: #888;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="success-icon">✅</div>
        <h1 class="title">${titulo}</h1>
        <p class="message">${mensaje}</p>
        <a href="https://codes-unlu.github.io/hackathon.html" class="btn">Volver al Hackathon</a>
        <div class="footer">
            Centro Organizado de Estudiantes de Sistemas - CODES++
        </div>
    </div>
</body>
</html>
  `;
  
  return HtmlService.createHtmlOutput(html);
}

/**
 * Crear página informativa
 */
function crearPaginaInfo() {
  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hackathon CODES++ - Sistema de Inscripciones</title>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            background: #0a0a0a;
            color: #ffffff;
            margin: 0;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .container {
            max-width: 600px;
            background: #1a1a1a;
            border-radius: 15px;
            border: 2px solid #0088ff;
            padding: 40px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 136, 255, 0.3);
        }
        .info-icon {
            font-size: 64px;
            color: #0088ff;
            margin-bottom: 20px;
            text-shadow: 0 0 20px #0088ff;
        }
        .title {
            color: #0088ff;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 20px;
            text-shadow: 0 0 10px #0088ff;
        }
        .message {
            color: #ffffff;
            font-size: 16px;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        .btn {
            background: linear-gradient(135deg, #0088ff 0%, #00ff88 100%);
            border: 2px solid #0088ff;
            color: #0a0a0a;
            padding: 15px 30px;
            font-size: 16px;
            font-weight: 700;
            border-radius: 50px;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 10px;
        }
        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 136, 255, 0.4);
            color: #0a0a0a;
        }
        .footer {
            margin-top: 30px;
            color: #888;
            font-size: 14px;
        }
        .links {
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="info-icon">ℹ️</div>
        <h1 class="title">Sistema de Inscripciones</h1>
        <p class="message">
            Este es el sistema de inscripciones para el <strong>Hackathon de Fin de Semana</strong> 
            organizado por <strong>CODES++</strong>.
        </p>
        <div class="links">
            <a href="https://codes-unlu.github.io/hackathon.html" class="btn">Ver Hackathon</a>
            <a href="https://codes-unlu.github.io/incripcion-hakathon-equipos.html" class="btn">Inscribir Equipo</a>
            <a href="https://codes-unlu.github.io/incripcion-hackathon-individual.html" class="btn">Inscribirse Solo</a>
        </div>
        <div class="footer">
            Centro Organizado de Estudiantes de Sistemas - CODES++<br>
            📧 codes.unlu@gmail.com
        </div>
    </div>
</body>
</html>
  `;
  
  return HtmlService.createHtmlOutput(html);
}

/**
 * Crear página de error
 */
function crearPaginaError(mensaje) {
  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error - Hackathon CODES++</title>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            background: #0a0a0a;
            color: #ffffff;
            margin: 0;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .container {
            max-width: 600px;
            background: #1a1a1a;
            border-radius: 15px;
            border: 2px solid #ff0088;
            padding: 40px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(255, 0, 136, 0.3);
        }
        .error-icon {
            font-size: 64px;
            color: #ff0088;
            margin-bottom: 20px;
            text-shadow: 0 0 20px #ff0088;
        }
        .title {
            color: #ff0088;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 20px;
            text-shadow: 0 0 10px #ff0088;
        }
        .message {
            color: #ffffff;
            font-size: 16px;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        .btn {
            background: linear-gradient(135deg, #ff0088 0%, #0088ff 100%);
            border: 2px solid #ff0088;
            color: #ffffff;
            padding: 15px 30px;
            font-size: 16px;
            font-weight: 700;
            border-radius: 50px;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(255, 0, 136, 0.4);
            color: #ffffff;
        }
        .footer {
            margin-top: 30px;
            color: #888;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-icon">❌</div>
        <h1 class="title">Error en la Inscripción</h1>
        <p class="message">${mensaje}</p>
        <a href="javascript:history.back()" class="btn">Volver e Intentar de Nuevo</a>
        <div class="footer">
            Centro Organizado de Estudiantes de Sistemas - CODES++
        </div>
    </div>
</body>
</html>
  `;
  
  return HtmlService.createHtmlOutput(html);
}

/**
 * Función de prueba para testing individual
 */
function testProcesarIndividual() {
  const testData = {
    tipo: 'individual',
    name: 'Ana',
    surname: 'Martínez',
    email: 'ana.martinez@test.com',
    discord: 'anamartinez#3456'
  };
  
  return procesarInscripcionIndividual(testData);
}
