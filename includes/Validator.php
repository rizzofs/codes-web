<?php
/**
 * Clase Validator
 * Maneja todas las validaciones del formulario de sorteo
 */

class Validator {
    private $errors = [];
    
    /**
     * Validar datos del participante
     */
    public function validateParticipant($data) {
        $this->errors = [];
        
        // Validar nombre
        $this->validateField($data['nombre'] ?? '', 'nombre', MIN_NOMBRE_LENGTH);
        
        // Validar apellido
        $this->validateField($data['apellido'] ?? '', 'apellido', MIN_APELLIDO_LENGTH);
        
        // Validar email
        $this->validateEmail($data['email'] ?? '');
        
        // Validar DNI
        $this->validateDNI($data['dni'] ?? '');
        
        // Validar teléfono
        $this->validatePhone($data['telefono'] ?? '');
        
        // Validar cantidad de chances
        $this->validateChances($data['cantidadChances'] ?? '');
        
        return empty($this->errors);
    }
    
    /**
     * Validar campo de texto
     */
    private function validateField($value, $fieldName, $minLength) {
        $value = trim($value);
        
        if (empty($value)) {
            $this->errors[] = "El campo $fieldName es requerido";
            return false;
        }
        
        if (strlen($value) < $minLength) {
            $this->errors[] = "El campo $fieldName debe tener al menos $minLength caracteres";
            return false;
        }
        
        return true;
    }
    
    /**
     * Validar email
     */
    private function validateEmail($email) {
        $email = trim($email);
        
        if (empty($email)) {
            $this->errors[] = 'El email es requerido';
            return false;
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->errors[] = 'El email debe ser válido';
            return false;
        }
        
        return true;
    }
    
    /**
     * Validar DNI
     */
    private function validateDNI($dni) {
        $dni = trim($dni);
        
        if (empty($dni)) {
            $this->errors[] = 'El DNI es requerido';
            return false;
        }
        
        if (!preg_match(DNI_PATTERN, $dni)) {
            $this->errors[] = 'El DNI debe tener 7 u 8 dígitos';
            return false;
        }
        
        return true;
    }
    
    /**
     * Validar teléfono
     */
    private function validatePhone($phone) {
        $phone = trim($phone);
        
        if (empty($phone)) {
            $this->errors[] = 'El teléfono es requerido';
            return false;
        }
        
        if (!preg_match(PHONE_PATTERN, $phone)) {
            $this->errors[] = 'El teléfono debe ser válido';
            return false;
        }
        
        return true;
    }
    
    /**
     * Validar cantidad de chances
     */
    private function validateChances($chances) {
        $chances = intval($chances);
        
        if (!in_array($chances, [1, 3, 4])) {
            $this->errors[] = 'La cantidad de chances debe ser 1, 3 o 4';
            return false;
        }
        
        return true;
    }
    
    /**
     * Verificar duplicados en la base de datos
     */
    public function checkDuplicates($email, $dni, $pdo) {
        try {
            $stmt = $pdo->prepare("SELECT id FROM participantes WHERE email = ? OR dni = ?");
            $stmt->execute([$email, $dni]);
            
            if ($stmt->fetch()) {
                $this->errors[] = 'Ya existe una participación con este email o DNI';
                return false;
            }
            
            return true;
        } catch(PDOException $e) {
            $this->errors[] = 'Error al verificar duplicados';
            return false;
        }
    }
    
    /**
     * Obtener errores
     */
    public function getErrors() {
        return $this->errors;
    }
    
    /**
     * Obtener mensaje de errores
     */
    public function getErrorMessage() {
        return implode('. ', $this->errors);
    }
}
?> 