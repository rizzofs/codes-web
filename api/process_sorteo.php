<?php
/**
 * API para procesar participación en el sorteo
 * Versión reorganizada con mejor estructura
 */

// Headers para API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Incluir archivos necesarios
require_once '../config/database.php';
require_once '../includes/Validator.php';
require_once '../includes/PaymentHandler.php';

// Función para enviar respuesta JSON
function sendResponse($success, $message, $data = null, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    exit;
}

// Verificar método HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Método no permitido', null, 405);
}

try {
    // Obtener conexión a la base de datos
    $pdo = getDatabaseConnection();
    
    // Inicializar clases
    $validator = new Validator();
    $paymentHandler = new PaymentHandler();
    
    // Obtener y sanitizar datos
    $participantData = [
        'nombre' => trim($_POST['nombre'] ?? ''),
        'apellido' => trim($_POST['apellido'] ?? ''),
        'email' => trim($_POST['email'] ?? ''),
        'dni' => trim($_POST['dni'] ?? ''),
        'telefono' => trim($_POST['telefono'] ?? ''),
        'cantidadChances' => intval($_POST['cantidadChances'] ?? 0)
    ];
    
    // Validar datos
    if (!$validator->validateParticipant($participantData)) {
        sendResponse(false, $validator->getErrorMessage(), null, 400);
    }
    
    // Verificar duplicados
    if (!$validator->checkDuplicates($participantData['email'], $participantData['dni'], $pdo)) {
        sendResponse(false, $validator->getErrorMessage(), null, 400);
    }
    
    // Calcular precio
    $precioTotal = $paymentHandler->calculatePrice($participantData['cantidadChances']);
    
    if ($precioTotal === 0) {
        sendResponse(false, 'Cantidad de chances inválida', null, 400);
    }
    
    // Generar ID de pago
    $paymentId = $paymentHandler->generatePaymentId($participantData['email']);
    
    // Insertar en la base de datos
    $stmt = $pdo->prepare("
        INSERT INTO participantes (
            nombre, apellido, email, dni, telefono, 
            cantidad_chances, precio_total, payment_id, 
            estado_pago, fecha_registro
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendiente', NOW())
    ");
    
    $stmt->execute([
        $participantData['nombre'],
        $participantData['apellido'],
        $participantData['email'],
        $participantData['dni'],
        $participantData['telefono'],
        $participantData['cantidadChances'],
        $precioTotal,
        $paymentId
    ]);
    
    $participanteId = $pdo->lastInsertId();
    
    // Generar enlace de pago
    $description = "Sorteo CODES++ - {$participantData['cantidadChances']} chance" . 
                   ($participantData['cantidadChances'] > 1 ? 's' : '');
    
    $paymentLink = $paymentHandler->generatePaymentLink(
        $paymentId, 
        $precioTotal, 
        $participantData['email'], 
        $description
    );
    
    // Enviar respuesta exitosa
    sendResponse(true, 'Participación registrada exitosamente', [
        'participante_id' => $participanteId,
        'payment_id' => $paymentId,
        'payment_link' => $paymentLink,
        'precio_total' => $precioTotal,
        'cantidad_chances' => $participantData['cantidadChances'],
        'email' => $participantData['email']
    ]);
    
} catch(Exception $e) {
    error_log("Error en process_sorteo.php: " . $e->getMessage());
    sendResponse(false, 'Error interno del servidor', null, 500);
}
?> 