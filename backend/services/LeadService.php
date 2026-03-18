<?php
/**
 * Lead Service - Handle healthcare expert form submissions
 * Stores form data in leads table
 */

class LeadService {
    private $conn;
    
    public function __construct($connection) {
        $this->conn = $connection;
    }
    
    /**
     * Create a new lead from healthcare expert form
     */
    public function createLead($data) {
        try {
            // Generate unique lead ID
            $lead_id = 'LEAD_' . time() . '_' . rand(1000, 9999);
            
            $sql = "INSERT INTO leads (
                id, first_name, last_name, phone, email,
                speciality, ug_qualification, pg_qualification, superspeciality,
                status, source, created_at, updated_at
            ) VALUES (
                :id, :first_name, :last_name, :phone, :email,
                :speciality, :ug_qualification, :pg_qualification, :superspeciality,
                'new', 'healthcare_expert_form', NOW(), NOW()
            )";

            $stmt = $this->conn->prepare($sql);
            $ok = $stmt->execute([
                ':id' => $lead_id,
                ':first_name' => $data['first_name'] ?? null,
                ':last_name' => $data['last_name'] ?? null,
                ':phone' => $data['phone'] ?? null,
                ':email' => $data['email'] ?? null,
                ':speciality' => $data['speciality'] ?? null,
                ':ug_qualification' => $data['ug_qualification'] ?? null,
                ':pg_qualification' => $data['pg_qualification'] ?? null,
                ':superspeciality' => $data['superspeciality'] ?? null,
            ]);

            if ($ok) {
                return [
                    'success' => true,
                    'lead_id' => $lead_id,
                    'message' => 'Lead created successfully'
                ];
            } else {
                $errorInfo = $stmt->errorInfo();
                throw new Exception("Failed to create lead: " . ($errorInfo[2] ?? 'unknown error'));
            }
            
        } catch (Exception $e) {
            error_log("Lead Service Error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to save lead data'
            ];
        }
    }
    
    /**
     * Get all leads with pagination
     */
    public function getAllLeads($page = 1, $limit = 10) {
        try {
            $offset = ($page - 1) * $limit;
            
            $sql = "SELECT * FROM leads 
                    ORDER BY created_at DESC 
                    LIMIT ? OFFSET ?";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(1, (int)$limit, PDO::PARAM_INT);
            $stmt->bindValue(2, (int)$offset, PDO::PARAM_INT);
            $stmt->execute();
            $leads = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Get total count
            $count_sql = "SELECT COUNT(*) as total FROM leads";
            $count_stmt = $this->conn->query($count_sql);
            $totalRow = $count_stmt->fetch(PDO::FETCH_ASSOC);
            $total = (int)($totalRow['total'] ?? 0);
            
            return [
                'success' => true,
                'leads' => $leads,
                'total' => $total,
                'page' => $page,
                'total_pages' => ceil($total / $limit)
            ];
            
        } catch (Exception $e) {
            error_log("Get Leads Error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to fetch leads'
            ];
        }
    }
    
    /**
     * Update lead status
     */
    public function updateLeadStatus($lead_id, $status, $notes = null) {
        try {
            $sql = "UPDATE leads SET status = :status, updated_at = NOW()";
            $params = [':status' => $status, ':id' => $lead_id];
            
            if ($notes !== null) {
                $sql .= ", notes = :notes";
                $params[':notes'] = $notes;
            }
            
            $sql .= " WHERE id = :id";
            
            $stmt = $this->conn->prepare($sql);
            $ok = $stmt->execute($params);
            
            if ($ok) {
                return [
                    'success' => true,
                    'message' => 'Lead status updated successfully'
                ];
            } else {
                throw new Exception("Failed to update lead status");
            }
            
        } catch (Exception $e) {
            error_log("Update Lead Status Error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to update lead status'
            ];
        }
    }
    
    /**
     * Get lead statistics
     */
    public function getLeadStats() {
        try {
            $sql = "SELECT 
                        COUNT(*) as total_leads,
                        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_leads,
                        SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contacted_leads,
                        SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) as converted_leads,
                        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed_leads,
                        DATE(created_at) as date
                    FROM leads 
                    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                    GROUP BY DATE(created_at)
                    ORDER BY date DESC";
            
            $result = $this->conn->query($sql);
            $stats = [];
            
            while ($row = $result->fetch_assoc()) {
                $stats[] = $row;
            }
            
            // Get overall stats
            $overall_sql = "SELECT 
                                COUNT(*) as total,
                                SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new,
                                SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contacted,
                                SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) as converted,
                                SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed
                            FROM leads";
            
            $overall_result = $this->conn->query($overall_sql);
            $overall = $overall_result->fetch_assoc();
            
            return [
                'success' => true,
                'daily_stats' => $stats,
                'overall' => $overall
            ];
            
        } catch (Exception $e) {
            error_log("Get Lead Stats Error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to fetch lead statistics'
            ];
        }
    }
}
?>
