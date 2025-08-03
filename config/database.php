<?php
/**
 * Configuración de Base de Datos
 * Archivo centralizado para la configuración de la BD
 */

// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_NAME', 'sorteo_db');
define('DB_USER', 'tu_usuario');
define('DB_PASS', 'tu_password');
define('DB_CHARSET', 'utf8mb4');

// Configuración de la aplicación
define('APP_NAME', 'Sorteo CODES++');
define('APP_VERSION', '2.0.0');
define('APP_URL', 'https://tu-sitio.com');

// Configuración de pagos
define('PAYMENT_GATEWAY', 'mercadopago'); // mercadopago, stripe, etc.
define('PAYMENT_PUBLIC_KEY', 'tu_public_key');
define('PAYMENT_ACCESS_TOKEN', 'tu_access_token');

// Configuración de precios
define('PRECIOS_CHANCES', [
    1 => 1000,
    3 => 2800,
    4 => 4000
]);

// Configuración de validación
define('MIN_NOMBRE_LENGTH', 2);
define('MIN_APELLIDO_LENGTH', 2);
define('DNI_PATTERN', '/^\d{7,8}$/');
define('PHONE_PATTERN', '/^[\d\s\-\+\(\)]{10,}$/');

/**
 * Obtener conexión PDO
 */
function getDatabaseConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $pdo;
    } catch(PDOException $e) {
        error_log("Error de conexión a la BD: " . $e->getMessage());
        throw new Exception('Error de conexión a la base de datos');
    }
}
?> 