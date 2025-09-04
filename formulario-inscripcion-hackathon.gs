/**
 * FORMULARIO DE INSCRIPCIÓN - HACKATHON DE FIN DE SEMANA
 * Centro de Estudiantes CODES++ - UNLu
 * 
 * Este script genera un formulario de inscripción para equipos
 * del Hackathon de Fin de Semana organizado por CODES++
 */

function crearFormularioInscripcionHackathon() {
  // Crear el formulario principal
  var form = FormApp.create('Inscripción de Equipos - Hackathon de Fin de Semana - CODES++')
    .setDescription('Inscribí tu equipo al Hackathon de Fin de Semana organizado por CODES++. ' +
                   '¡Una competencia de programación en equipos de 3 personas para estudiantes de Sistemas UNLu!')
    .setConfirmationMessage('¡Gracias por inscribir tu equipo al Hackathon! 🚀\n\n' +
                           'Tu inscripción ha sido registrada exitosamente. Te contactaremos próximamente con más detalles sobre:\n' +
                           '• Fecha exacta del evento (Viernes 22:00 a Domingo 22:00)\n' +
                           '• Consigna del Hackathon\n' +
                           '• Reconocimientos y certificados\n' +
                           '• Acceso a Discord y canales de comunicación\n' +
                           '• Herramientas y plataformas a utilizar\n' +
                           '• Evaluación y anuncio de ganadores (semana siguiente)\n\n' +
                           '¡Preparate para 48 horas increíbles de programación virtual!');

  // ========================================
  // SECCIÓN 1: INFORMACIÓN DEL EQUIPO
  // ========================================
  form.addPageBreakItem()
    .setTitle('👥 Información del Equipo')
    .setHelpText('Información básica del equipo para la inscripción al Hackathon');

  // Nombre del equipo
  form.addTextItem()
    .setTitle('Nombre del equipo')
    .setHelpText('Ingresá el nombre que identificará a tu equipo durante el Hackathon')
    .setRequired(true);

  // ========================================
  // SECCIÓN 2: INTEGRANTES DEL EQUIPO
  // ========================================
  form.addPageBreakItem()
    .setTitle('👤 Integrantes del Equipo')
    .setHelpText('Datos personales de los 3 integrantes del equipo');

  // INTEGRANTE 1 (Capitán)
  form.addSectionHeaderItem()
    .setTitle('👑 Integrante 1 - Capitán del Equipo');

  // Nombre y apellido - Integrante 1
  form.addTextItem()
    .setTitle('Nombre y apellido - Integrante 1')
    .setHelpText('Nombre completo del capitán del equipo')
    .setRequired(true);

  // Sede - Integrante 1
  var sede1Item = form.addListItem()
    .setTitle('Sede - Integrante 1')
    .setHelpText('Seleccioná la sede donde estudia el integrante 1')
    .setRequired(true);
  
  sede1Item.setChoices([
    sede1Item.createChoice('Luján'),
    sede1Item.createChoice('Chivilcoy'),
    sede1Item.createChoice('San Miguel')
  ]);

  // Teléfono - Integrante 1
  form.addTextItem()
    .setTitle('Teléfono - Integrante 1')
    .setHelpText('Número de teléfono con código de área (ej: 11-1234-5678)')
    .setRequired(true);

  // Email - Integrante 1
  form.addTextItem()
    .setTitle('Email - Integrante 1')
    .setHelpText('Dirección de correo electrónico del integrante 1')
    .setRequired(true);

  // INTEGRANTE 2
  form.addSectionHeaderItem()
    .setTitle('👤 Integrante 2');

  // Nombre y apellido - Integrante 2
  form.addTextItem()
    .setTitle('Nombre y apellido - Integrante 2')
    .setHelpText('Nombre completo del segundo integrante')
    .setRequired(true);

  // Sede - Integrante 2
  var sede2Item = form.addListItem()
    .setTitle('Sede - Integrante 2')
    .setHelpText('Seleccioná la sede donde estudia el integrante 2')
    .setRequired(true);
  
  sede2Item.setChoices([
    sede2Item.createChoice('Luján'),
    sede2Item.createChoice('Chivilcoy'),
    sede2Item.createChoice('San Miguel')
  ]);

  // Teléfono - Integrante 2
  form.addTextItem()
    .setTitle('Teléfono - Integrante 2')
    .setHelpText('Número de teléfono con código de área (ej: 11-1234-5678)')
    .setRequired(true);

  // Email - Integrante 2
  form.addTextItem()
    .setTitle('Email - Integrante 2')
    .setHelpText('Dirección de correo electrónico del integrante 2')
    .setRequired(true);

  // INTEGRANTE 3
  form.addSectionHeaderItem()
    .setTitle('👤 Integrante 3');

  // Nombre y apellido - Integrante 3
  form.addTextItem()
    .setTitle('Nombre y apellido - Integrante 3')
    .setHelpText('Nombre completo del tercer integrante')
    .setRequired(true);

  // Sede - Integrante 3
  var sede3Item = form.addListItem()
    .setTitle('Sede - Integrante 3')
    .setHelpText('Seleccioná la sede donde estudia el integrante 3')
    .setRequired(true);
  
  sede3Item.setChoices([
    sede3Item.createChoice('Luján'),
    sede3Item.createChoice('Chivilcoy'),
    sede3Item.createChoice('San Miguel')
  ]);

  // Teléfono - Integrante 3
  form.addTextItem()
    .setTitle('Teléfono - Integrante 3')
    .setHelpText('Número de teléfono con código de área (ej: 11-1234-5678)')
    .setRequired(true);

  // Email - Integrante 3
  form.addTextItem()
    .setTitle('Email - Integrante 3')
    .setHelpText('Dirección de correo electrónico del integrante 3')
    .setRequired(true);

  // ========================================
  // CONFIGURACIÓN FINAL
  // ========================================
  
  // Configurar el formulario
  form.setAcceptingResponses(true)
      .setPublishingSummary(false)
      .setShowLinkToRespondAgain(false)
      .setLimitOneResponsePerUser(false);

  // Obtener la URL del formulario
  var formUrl = form.getPublishedUrl();
  
  // Mostrar información del formulario creado
  Logger.log('✅ Formulario de inscripción creado exitosamente!');
  Logger.log('📋 Título: ' + form.getTitle());
  Logger.log('🔗 URL del formulario: ' + formUrl);
  Logger.log('📊 URL de respuestas: ' + form.getResponseUrl());
  
  // Retornar la URL para uso posterior
  return formUrl;
}

/**
 * Función auxiliar para ejecutar el script
 */
function ejecutarCreacionFormulario() {
  try {
    var url = crearFormularioInscripcionHackathon();
    Logger.log('🎉 ¡Formulario creado exitosamente!');
    Logger.log('🔗 URL: ' + url);
    return url;
  } catch (error) {
    Logger.log('❌ Error al crear el formulario: ' + error.toString());
    throw error;
  }
}