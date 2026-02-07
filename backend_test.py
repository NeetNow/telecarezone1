#!/usr/bin/env python3
"""
TeleCareZone Backend API Testing Suite
Tests all API endpoints for the Healthcare SAAS Platform
"""

import requests
import sys
import json
from datetime import datetime

class TeleCareZoneAPITester:
    def __init__(self, base_url="https://carebridge-39.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_professional_id = None
        self.test_appointment_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        
        if self.admin_token and not headers:
            test_headers['Authorization'] = f'Bearer {self.admin_token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(str(response_data)) < 500:
                        print(f"   Response: {response_data}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root Endpoint", "GET", "", 200)

    def test_create_default_admin(self):
        """Test creating default admin user"""
        return self.run_test(
            "Create Default Admin",
            "POST",
            "admin/create-default",
            200
        )

    def test_admin_login(self):
        """Test admin login and get token"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "admin/login",
            200,
            data={"username": "admin", "password": "admin123"}
        )
        if success and 'access_token' in response:
            self.admin_token = response['access_token']
            print(f"   Token obtained: {self.admin_token[:20]}...")
            return True
        return False

    def test_admin_login_invalid(self):
        """Test admin login with invalid credentials"""
        return self.run_test(
            "Admin Login (Invalid)",
            "POST",
            "admin/login",
            401,
            data={"username": "wrong", "password": "wrong"}
        )

    def test_professional_onboarding(self):
        """Test professional onboarding submission"""
        test_data = {
            "first_name": "John",
            "last_name": "Doe",
            "phone": "+919876543210",
            "email": "john.doe@example.com",
            "speciality": "Cardiologist",
            "ug_qualification": "MBBS",
            "pg_qualification": "MD Cardiology",
            "superspeciality": "Interventional Cardiology",
            "area_of_expertise": "Heart surgery and cardiac interventions",
            "instagram": "@drjohndoe",
            "youtube": "Dr John Doe Channel",
            "twitter": "@drjohndoe",
            "consulting_fees": 1500.0
        }
        
        success, response = self.run_test(
            "Professional Onboarding",
            "POST",
            "onboarding/submit",
            200,
            data=test_data
        )
        
        if success and 'id' in response:
            self.test_professional_id = response['id']
            print(f"   Professional ID: {self.test_professional_id}")
            return True
        return False

    def test_get_all_professionals_admin(self):
        """Test getting all professionals (admin only)"""
        if not self.admin_token:
            print("❌ Skipped - No admin token")
            return False
        return self.run_test("Get All Professionals (Admin)", "GET", "professionals", 200)

    def test_get_pending_professionals(self):
        """Test getting pending professionals"""
        if not self.admin_token:
            print("❌ Skipped - No admin token")
            return False
        return self.run_test("Get Pending Professionals", "GET", "professionals?status=pending", 200)

    def test_get_approved_professionals_public(self):
        """Test getting approved professionals (public endpoint)"""
        return self.run_test("Get Approved Professionals (Public)", "GET", "professionals/approved", 200, headers={})

    def test_approve_professional(self):
        """Test approving a professional"""
        if not self.admin_token or not self.test_professional_id:
            print("❌ Skipped - No admin token or professional ID")
            return False
        
        return self.run_test(
            "Approve Professional",
            "PUT",
            f"professionals/{self.test_professional_id}",
            200,
            data={"status": "approved"}
        )

    def test_get_professional_by_id(self):
        """Test getting professional by ID"""
        if not self.admin_token or not self.test_professional_id:
            print("❌ Skipped - No admin token or professional ID")
            return False
        
        return self.run_test(
            "Get Professional by ID",
            "GET",
            f"professionals/{self.test_professional_id}",
            200
        )

    def test_get_professional_by_subdomain(self):
        """Test getting professional by subdomain (public)"""
        return self.run_test(
            "Get Professional by Subdomain",
            "GET",
            "public/professional/johndoe",
            200,
            headers={}
        )

    def test_create_appointment(self):
        """Test creating an appointment"""
        if not self.test_professional_id:
            print("❌ Skipped - No professional ID")
            return False
        
        appointment_data = {
            "professional_id": self.test_professional_id,
            "appointment_datetime": "2025-01-15T10:00:00Z",
            "patient_first_name": "Jane",
            "patient_last_name": "Smith",
            "patient_phone": "+919876543211",
            "patient_email": "jane.smith@example.com",
            "patient_gender": "Female",
            "patient_age": 35,
            "referral_source": "Google Search",
            "issue_detail": "Chest pain and shortness of breath"
        }
        
        success, response = self.run_test(
            "Create Appointment",
            "POST",
            "appointments",
            200,
            data=appointment_data,
            headers={}
        )
        
        if success and 'id' in response:
            self.test_appointment_id = response['id']
            print(f"   Appointment ID: {self.test_appointment_id}")
            return True
        return False

    def test_get_appointment(self):
        """Test getting appointment by ID"""
        if not self.test_appointment_id:
            print("❌ Skipped - No appointment ID")
            return False
        
        return self.run_test(
            "Get Appointment",
            "GET",
            f"appointments/{self.test_appointment_id}",
            200,
            headers={}
        )

    def test_create_razorpay_order(self):
        """Test creating Razorpay order"""
        if not self.test_appointment_id:
            print("❌ Skipped - No appointment ID")
            return False
        
        return self.run_test(
            "Create Razorpay Order",
            "POST",
            f"payments/create-order?appointment_id={self.test_appointment_id}",
            200,
            headers={}
        )

    def test_platform_analytics(self):
        """Test platform analytics"""
        if not self.admin_token:
            print("❌ Skipped - No admin token")
            return False
        
        return self.run_test("Platform Analytics", "GET", "admin/analytics/overview", 200)

    def test_professional_analytics(self):
        """Test professional analytics"""
        if not self.admin_token or not self.test_professional_id:
            print("❌ Skipped - No admin token or professional ID")
            return False
        
        return self.run_test(
            "Professional Analytics",
            "GET",
            f"admin/analytics/{self.test_professional_id}",
            200
        )

    def test_unauthorized_access(self):
        """Test unauthorized access to admin endpoints"""
        # Temporarily remove token
        temp_token = self.admin_token
        self.admin_token = None
        
        success, _ = self.run_test(
            "Unauthorized Access Test",
            "GET",
            "professionals",
            401,
            headers={}
        )
        
        # Restore token
        self.admin_token = temp_token
        return success

def main():
    print("🏥 TeleCareZone Backend API Testing Suite")
    print("=" * 50)
    
    tester = TeleCareZoneAPITester()
    
    # Test sequence
    tests = [
        # Basic connectivity
        tester.test_root_endpoint,
        
        # Admin setup and authentication
        tester.test_create_default_admin,
        tester.test_admin_login_invalid,
        tester.test_admin_login,
        
        # Professional onboarding workflow
        tester.test_professional_onboarding,
        tester.test_get_all_professionals_admin,
        tester.test_get_pending_professionals,
        tester.test_approve_professional,
        tester.test_get_professional_by_id,
        tester.test_get_professional_by_subdomain,
        
        # Public endpoints
        tester.test_get_approved_professionals_public,
        
        # Appointment workflow
        tester.test_create_appointment,
        tester.test_get_appointment,
        tester.test_create_razorpay_order,
        
        # Analytics
        tester.test_platform_analytics,
        tester.test_professional_analytics,
        
        # Security
        tester.test_unauthorized_access,
    ]
    
    print(f"\n🚀 Running {len(tests)} tests...\n")
    
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test {test.__name__} failed with exception: {str(e)}")
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())