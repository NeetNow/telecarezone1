<?php
/**
 * Fast2SMS WhatsApp Business API Service
 * Documentation: https://www.fast2sms.com/dashboard/dev-api
 */
class Fast2SMSService {
    
    private $apiKey;
    private $senderId;
    
    public function __construct() {
        $this->apiKey = FAST2SMS_API_KEY;
        $this->senderId = FAST2SMS_SENDER_ID;
    }
    
    /**
     * Send WhatsApp message via Fast2SMS
     * @param string $phone - Phone number with country code
     * @param string $message - Message text
     * @return array Response
     */
    public function sendWhatsAppMessage($phone, $message) {
        if (empty($this->apiKey) || $this->apiKey === 'your_fast2sms_api_key') {
            error_log('Fast2SMS: API key not configured');
            return ['status' => 'skipped', 'message' => 'Fast2SMS not configured'];
        }
        
        try {
            // Remove country code and special characters
            $phone = preg_replace('/[^0-9]/', '', $phone);
            if (strlen($phone) > 10) {
                $phone = substr($phone, -10); // Get last 10 digits
            }
            
            $url = 'https://www.fast2sms.com/dev/bulkV2';
            
            $data = [
                'authorization' => $this->apiKey,
                'route' => 'q', // Quick transactional route
                'message' => $message,
                'language' => 'english',
                'flash' => 0,
                'numbers' => $phone
            ];
            
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'authorization: ' . $this->apiKey,
                'Content-Type: application/x-www-form-urlencoded'
            ]);
            
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            
            $result = json_decode($response, true);
            
            if ($httpCode === 200 && $result['return'] === true) {
                error_log("Fast2SMS: Message sent to {$phone}");
                return ['status' => 'sent', 'response' => $result];
            }
            
            error_log("Fast2SMS: Failed to send message - " . $response);
            return ['status' => 'failed', 'error' => $response];
            
        } catch (Exception $e) {
            error_log('Fast2SMS Exception: ' . $e->getMessage());
            return ['status' => 'failed', 'error' => $e->getMessage()];
        }
    }
    
    /**
     * Send appointment confirmation to patient
     */
    public function sendAppointmentConfirmation($appointment, $professional) {
        $date = date('d M Y, h:i A', strtotime($appointment['appointment_datetime']));
        $message = "Hello {$appointment['patient_first_name']}, " .
                   "your appointment with Dr. {$professional['first_name']} {$professional['last_name']} " .
                   "is confirmed for {$date}. " .
                   "Meeting Link: {$appointment['meeting_link']}";
        
        return $this->sendWhatsAppMessage($appointment['patient_phone'], $message);
    }
    
    /**
     * Send doctor notification
     */
    public function sendDoctorNotification($appointment, $professional) {
        $date = date('d M Y, h:i A', strtotime($appointment['appointment_datetime']));
        $message = "Hello Dr. {$professional['first_name']}, " .
                   "New appointment scheduled for {$date}. " .
                   "Patient: {$appointment['patient_first_name']} {$appointment['patient_last_name']}. " .
                   "Issue: {$appointment['issue_detail']}. " .
                   "Meeting Link: {$appointment['meeting_link']}";
        
        return $this->sendWhatsAppMessage($professional['phone'], $message);
    }
    
    /**
     * Send appointment reminder (15 minutes before)
     */
    public function sendAppointmentReminder($appointment, $professional) {
        $message = "Reminder: Your appointment with Dr. {$professional['first_name']} {$professional['last_name']} " .
                   "starts in 15 minutes. " .
                   "Join here: {$appointment['meeting_link']}";
        
        return $this->sendWhatsAppMessage($appointment['patient_phone'], $message);
    }
}
?>