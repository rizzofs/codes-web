<?php
/**
 * Clase PaymentHandler
 * Maneja la integración con pasarelas de pago
 */

class PaymentHandler {
    private $gateway;
    private $publicKey;
    private $accessToken;
    
    public function __construct() {
        $this->gateway = PAYMENT_GATEWAY;
        $this->publicKey = PAYMENT_PUBLIC_KEY;
        $this->accessToken = PAYMENT_ACCESS_TOKEN;
    }
    
    /**
     * Generar enlace de pago
     */
    public function generatePaymentLink($paymentId, $amount, $email, $description = '') {
        switch ($this->gateway) {
            case 'mercadopago':
                return $this->generateMercadoPagoLink($paymentId, $amount, $email, $description);
            case 'stripe':
                return $this->generateStripeLink($paymentId, $amount, $email, $description);
            default:
                return $this->generateGenericLink($paymentId, $amount, $email, $description);
        }
    }
    
    /**
     * Generar enlace de MercadoPago
     */
    private function generateMercadoPagoLink($paymentId, $amount, $email, $description) {
        // Aquí integrarías con la API de MercadoPago
        $baseUrl = 'https://mpago.la/';
        $params = [
            'payment_id' => $paymentId,
            'amount' => $amount,
            'email' => $email,
            'description' => $description ?: 'Sorteo CODES++ - Participación'
        ];
        
        return $baseUrl . '?' . http_build_query($params);
    }
    
    /**
     * Generar enlace de Stripe
     */
    private function generateStripeLink($paymentId, $amount, $email, $description) {
        // Aquí integrarías con la API de Stripe
        $baseUrl = 'https://checkout.stripe.com/';
        $params = [
            'payment_id' => $paymentId,
            'amount' => $amount,
            'email' => $email,
            'description' => $description ?: 'Sorteo CODES++ - Participación'
        ];
        
        return $baseUrl . '?' . http_build_query($params);
    }
    
    /**
     * Generar enlace genérico
     */
    private function generateGenericLink($paymentId, $amount, $email, $description) {
        $baseUrl = APP_URL . '/payment.php';
        $params = [
            'payment_id' => $paymentId,
            'amount' => $amount,
            'email' => $email,
            'description' => $description ?: 'Sorteo CODES++ - Participación'
        ];
        
        return $baseUrl . '?' . http_build_query($params);
    }
    
    /**
     * Calcular precio según cantidad de chances
     */
    public function calculatePrice($chances) {
        return PRECIOS_CHANCES[$chances] ?? 0;
    }
    
    /**
     * Generar ID único de pago
     */
    public function generatePaymentId($email) {
        return 'SORTEO_' . date('Ymd') . '_' . strtoupper(substr(md5($email . time()), 0, 8));
    }
    
    /**
     * Verificar estado de pago
     */
    public function checkPaymentStatus($paymentId) {
        // Aquí implementarías la verificación con la pasarela de pago
        // Por ahora retornamos un estado simulado
        return 'pending';
    }
    
    /**
     * Procesar webhook de pago
     */
    public function processWebhook($data) {
        // Aquí procesarías los webhooks de la pasarela de pago
        $paymentId = $data['payment_id'] ?? '';
        $status = $data['status'] ?? '';
        
        if ($status === 'approved') {
            return $this->markPaymentAsCompleted($paymentId);
        }
        
        return false;
    }
    
    /**
     * Marcar pago como completado
     */
    private function markPaymentAsCompleted($paymentId) {
        try {
            $pdo = getDatabaseConnection();
            $stmt = $pdo->prepare("UPDATE participantes SET estado_pago = 'completado' WHERE payment_id = ?");
            return $stmt->execute([$paymentId]);
        } catch(Exception $e) {
            error_log("Error al marcar pago como completado: " . $e->getMessage());
            return false;
        }
    }
}
?> 