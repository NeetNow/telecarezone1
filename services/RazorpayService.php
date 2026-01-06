<?php
/**
 * Razorpay Payment Gateway Service
 * Documentation: https://razorpay.com/docs/api/
 */
class RazorpayService {
    
    private $keyId;
    private $keySecret;
    
    public function __construct() {
        $this->keyId = RAZORPAY_KEY_ID;
        $this->keySecret = RAZORPAY_KEY_SECRET;
    }
    
    /**
     * Create Razorpay order
     * @param float $amount - Amount in rupees
     * @param string $currency - Currency code (INR)
     * @return array Order details
     */
    public function createOrder($amount, $currency = 'INR') {
        try {
            $url = 'https://api.razorpay.com/v1/orders';
            
            $data = [
                'amount' => intval($amount * 100), // Convert to paise
                'currency' => $currency,
                'payment_capture' => 1 // Auto capture
            ];
            
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json'
            ]);
            curl_setopt($ch, CURLOPT_USERPWD, $this->keyId . ':' . $this->keySecret);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            $result = json_decode($response, true);
            
            if ($httpCode === 200 && isset($result['id'])) {
                return [
                    'success' => true,
                    'order_id' => $result['id'],
                    'amount' => $result['amount'],
                    'currency' => $result['currency'],
                    'key_id' => $this->keyId
                ];
            }
            
            error_log('Razorpay: Order creation failed - ' . $response);
            return ['success' => false, 'error' => $response];
            
        } catch (Exception $e) {
            error_log('Razorpay Exception: ' . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    /**
     * Verify payment signature
     * @param string $orderId
     * @param string $paymentId  
     * @param string $signature
     * @return bool
     */
    public function verifyPaymentSignature($orderId, $paymentId, $signature) {
        $expectedSignature = hash_hmac('sha256', $orderId . '|' . $paymentId, $this->keySecret);
        return $expectedSignature === $signature;
    }
    
    /**
     * Split payment using Razorpay Route
     * @param string $paymentId
     * @param float $platformAmount
     * @param float $doctorAmount
     * @param string $doctorAccountId - Razorpay linked account ID
     * @return array
     */
    public function splitPayment($paymentId, $platformAmount, $doctorAmount, $doctorAccountId) {
        try {
            $url = "https://api.razorpay.com/v1/payments/{$paymentId}/transfers";
            
            $data = [
                'transfers' => [
                    [
                        'account' => $doctorAccountId,
                        'amount' => intval($doctorAmount * 100), // Convert to paise
                        'currency' => 'INR',
                        'on_hold' => 0 // Immediate transfer
                    ]
                ]
            ];
            
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json'
            ]);
            curl_setopt($ch, CURLOPT_USERPWD, $this->keyId . ':' . $this->keySecret);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            $result = json_decode($response, true);
            
            if ($httpCode === 200) {
                return ['success' => true, 'transfer' => $result];
            }
            
            error_log('Razorpay: Split payment failed - ' . $response);
            return ['success' => false, 'error' => $response];
            
        } catch (Exception $e) {
            error_log('Razorpay Split Exception: ' . $e->getMessage());
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
}
?>