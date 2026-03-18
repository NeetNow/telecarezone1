<?php

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../services/JWTService.php';
require_once __DIR__ . '/../services/LeadService.php';

function handleLeadsRoutes($segments, $method, $data, $queryParams) {
    $conn = Database::getInstance()->getConnection();
    $leadService = new LeadService($conn);

    $leadId = $segments[1] ?? null;

    if ($method === 'POST') {
        if (!isset($data['first_name']) || !isset($data['last_name']) || !isset($data['phone']) || !isset($data['email'])) {
            sendError('Missing required fields', 400);
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            sendError('Invalid email format', 400);
        }

        if (!preg_match('/^[0-9+\-\s()]+$/', $data['phone'])) {
            sendError('Invalid phone number format', 400);
        }

        $result = $leadService->createLead($data);
        if (!($result['success'] ?? false)) {
            sendError($result['message'] ?? 'Failed to save lead', 500);
        }
        sendResponse($result);
    }

    if ($method === 'GET') {
        JWTService::verifyToken();
        $page = isset($queryParams['page']) ? (int)$queryParams['page'] : 1;
        $limit = isset($queryParams['limit']) ? (int)$queryParams['limit'] : 10;
        $result = $leadService->getAllLeads($page, $limit);
        if (!($result['success'] ?? false)) {
            sendError($result['message'] ?? 'Failed to fetch leads', 500);
        }
        sendResponse($result);
    }

    if ($method === 'PUT') {
        JWTService::verifyToken();
        if (empty($leadId)) {
            sendError('Lead ID required', 400);
        }
        $status = $data['status'] ?? null;
        $notes = $data['notes'] ?? null;
        if (empty($status)) {
            sendError('Status is required', 400);
        }
        $result = $leadService->updateLeadStatus($leadId, $status, $notes);
        if (!($result['success'] ?? false)) {
            sendError($result['message'] ?? 'Failed to update lead', 500);
        }
        sendResponse($result);
    }

    sendError('Method not allowed', 405);
}

