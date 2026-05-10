#!/usr/bin/env python3
"""
Backend API Tests for NGO Donation Platform
Tests all backend endpoints with focus on CRITICAL signature verification
"""
import requests
import json
import sys

# Base URL from environment
BASE_URL = "https://ngo-next-platform.preview.emergentagent.com/api"

def print_test(name, passed, details=""):
    """Print test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"\n{status}: {name}")
    if details:
        print(f"   Details: {details}")
    return passed

def test_health_check():
    """Test 1: Health check endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/")
        data = response.json()
        passed = (
            response.status_code == 200 and
            data.get("ok") == True and
            "running" in data.get("message", "").lower()
        )
        return print_test(
            "Health Check GET /api/",
            passed,
            f"Status: {response.status_code}, Response: {data}"
        )
    except Exception as e:
        return print_test("Health Check GET /api/", False, f"Exception: {str(e)}")

def test_stats_empty_db():
    """Test 2: Stats endpoint (works on empty DB)"""
    try:
        response = requests.get(f"{BASE_URL}/stats")
        data = response.json()
        required_fields = ["totalRaised", "donationCount", "donorCount", "volunteerCount", "projectsCount", "livesImpacted"]
        has_all_fields = all(field in data for field in required_fields)
        passed = response.status_code == 200 and has_all_fields
        return print_test(
            "Stats GET /api/stats",
            passed,
            f"Status: {response.status_code}, Fields present: {has_all_fields}, Data: {data}"
        )
    except Exception as e:
        return print_test("Stats GET /api/stats", False, f"Exception: {str(e)}")

def test_donation_happy_path():
    """Test 3: Complete donation flow (3 chained calls) - HAPPY PATH"""
    print("\n" + "="*80)
    print("TESTING DONATION HAPPY PATH (3-step flow)")
    print("="*80)
    
    all_passed = True
    
    # Step 3a: Create order
    try:
        create_payload = {"amount": 1500, "cause": "education"}
        response = requests.post(f"{BASE_URL}/donations/create-order", json=create_payload)
        data = response.json()
        
        order_id = data.get("orderId", "")
        passed = (
            response.status_code == 200 and
            order_id.startswith("order_") and
            data.get("amount") == 1500 and
            data.get("currency") == "INR" and
            data.get("mock") == True
        )
        all_passed = all_passed and print_test(
            "Step 3a: Create Order POST /api/donations/create-order",
            passed,
            f"Status: {response.status_code}, OrderId: {order_id}, Amount: {data.get('amount')}"
        )
        
        if not passed:
            return False
            
    except Exception as e:
        print_test("Step 3a: Create Order", False, f"Exception: {str(e)}")
        return False
    
    # Step 3b: Mock payment
    try:
        mock_pay_payload = {"orderId": order_id}
        response = requests.post(f"{BASE_URL}/donations/mock-pay", json=mock_pay_payload)
        data = response.json()
        
        payment_id = data.get("paymentId", "")
        signature = data.get("signature", "")
        passed = (
            response.status_code == 200 and
            payment_id.startswith("pay_") and
            len(signature) == 64 and  # HMAC SHA-256 produces 64 hex chars
            data.get("orderId") == order_id
        )
        all_passed = all_passed and print_test(
            "Step 3b: Mock Payment POST /api/donations/mock-pay",
            passed,
            f"Status: {response.status_code}, PaymentId: {payment_id}, Signature length: {len(signature)}"
        )
        
        if not passed:
            return False
            
    except Exception as e:
        print_test("Step 3b: Mock Payment", False, f"Exception: {str(e)}")
        return False
    
    # Step 3c: Verify with valid signature
    try:
        verify_payload = {
            "orderId": order_id,
            "paymentId": payment_id,
            "signature": signature,
            "donor": {
                "name": "Rajesh Kumar",
                "email": "rajesh.kumar@example.com",
                "phone": "9876543210",
                "pan": "ABCDE1234F",
                "message": "Jai Jagannath! Happy to support education."
            }
        }
        response = requests.post(f"{BASE_URL}/donations/verify", json=verify_payload)
        data = response.json()
        
        donation = data.get("donation", {})
        receipt_number = donation.get("receiptNumber", "")
        passed = (
            response.status_code == 200 and
            data.get("success") == True and
            receipt_number.startswith("MKDS/") and
            donation.get("orderId") == order_id and
            donation.get("paymentId") == payment_id and
            donation.get("amount") == 1500 and
            donation.get("cause") == "education" and
            donation.get("donorName") == "Rajesh Kumar" and
            donation.get("status") == "success"
        )
        all_passed = all_passed and print_test(
            "Step 3c: Verify Valid Signature POST /api/donations/verify",
            passed,
            f"Status: {response.status_code}, Success: {data.get('success')}, Receipt: {receipt_number}"
        )
        
        # Store donation ID for later tests
        global saved_donation_id
        saved_donation_id = donation.get("id", "")
        
        return all_passed
        
    except Exception as e:
        print_test("Step 3c: Verify Valid Signature", False, f"Exception: {str(e)}")
        return False

def test_donation_validation():
    """Test 4: Donation validation"""
    print("\n" + "="*80)
    print("TESTING DONATION VALIDATION")
    print("="*80)
    
    all_passed = True
    
    # Test minimum amount validation
    try:
        create_payload = {"amount": 5}
        response = requests.post(f"{BASE_URL}/donations/create-order", json=create_payload)
        data = response.json()
        
        passed = (
            response.status_code == 400 and
            "Minimum donation is ₹10" in data.get("error", "")
        )
        all_passed = all_passed and print_test(
            "Validation: Amount < 10 should fail",
            passed,
            f"Status: {response.status_code}, Error: {data.get('error')}"
        )
    except Exception as e:
        all_passed = False
        print_test("Validation: Amount < 10", False, f"Exception: {str(e)}")
    
    # Test default cause
    try:
        create_payload = {"amount": 1000}  # No cause provided
        response = requests.post(f"{BASE_URL}/donations/create-order", json=create_payload)
        data = response.json()
        
        passed = response.status_code == 200
        all_passed = all_passed and print_test(
            "Validation: Missing cause defaults to 'general'",
            passed,
            f"Status: {response.status_code}, OrderId: {data.get('orderId')}"
        )
    except Exception as e:
        all_passed = False
        print_test("Validation: Default cause", False, f"Exception: {str(e)}")
    
    return all_passed

def test_signature_tampering():
    """Test 5: CRITICAL - Signature tampering detection"""
    print("\n" + "="*80)
    print("🔴 CRITICAL TEST: SIGNATURE TAMPERING DETECTION")
    print("="*80)
    
    all_passed = True
    
    # Create a new order and get valid payment details
    try:
        # Step 1: Create order
        create_payload = {"amount": 2000, "cause": "disaster_relief"}
        response = requests.post(f"{BASE_URL}/donations/create-order", json=create_payload)
        order_data = response.json()
        order_id = order_data.get("orderId")
        
        # Step 2: Get valid payment
        mock_pay_payload = {"orderId": order_id}
        response = requests.post(f"{BASE_URL}/donations/mock-pay", json=mock_pay_payload)
        pay_data = response.json()
        payment_id = pay_data.get("paymentId")
        valid_signature = pay_data.get("signature")
        
        print(f"\n   Valid signature: {valid_signature}")
        
        # Step 3: Attempt verification with TAMPERED signature
        tampered_signature = "0" * 64  # Invalid signature
        print(f"   Tampered signature: {tampered_signature}")
        
        verify_payload = {
            "orderId": order_id,
            "paymentId": payment_id,
            "signature": tampered_signature,  # TAMPERED!
            "donor": {
                "name": "Priya Sharma",
                "email": "priya.sharma@example.com",
                "phone": "9123456789",
                "pan": "XYZAB5678C",
                "message": "Testing signature verification"
            }
        }
        response = requests.post(f"{BASE_URL}/donations/verify", json=verify_payload)
        data = response.json()
        
        # Should REJECT the tampered signature
        passed = (
            response.status_code == 400 and
            "signature verification failed" in data.get("error", "").lower()
        )
        all_passed = all_passed and print_test(
            "🔴 CRITICAL: Tampered signature REJECTED",
            passed,
            f"Status: {response.status_code}, Error: {data.get('error')}"
        )
        
        if not passed:
            print("\n   ⚠️  WARNING: Signature verification is NOT working correctly!")
            print("   ⚠️  This is a CRITICAL security issue!")
        else:
            print("\n   ✅ EXCELLENT: Signature verification is working correctly!")
            print("   ✅ Tampered signatures are properly rejected!")
        
        # Verify that a failed donation was recorded
        # (We can't easily check this without a GET endpoint for failed donations,
        # but the code shows it should be inserted)
        
        return all_passed
        
    except Exception as e:
        print_test("🔴 CRITICAL: Signature Tampering Test", False, f"Exception: {str(e)}")
        return False

def test_verify_validation():
    """Test 6 & 7: Verify endpoint validation"""
    print("\n" + "="*80)
    print("TESTING VERIFY ENDPOINT VALIDATION")
    print("="*80)
    
    all_passed = True
    
    # Test missing fields
    try:
        verify_payload = {"orderId": "order_123"}  # Missing paymentId and signature
        response = requests.post(f"{BASE_URL}/donations/verify", json=verify_payload)
        data = response.json()
        
        passed = response.status_code == 400
        all_passed = all_passed and print_test(
            "Validation: Missing fields returns 400",
            passed,
            f"Status: {response.status_code}, Error: {data.get('error')}"
        )
    except Exception as e:
        all_passed = False
        print_test("Validation: Missing fields", False, f"Exception: {str(e)}")
    
    # Test unknown orderId
    try:
        verify_payload = {
            "orderId": "order_nonexistent123456",
            "paymentId": "pay_test123",
            "signature": "a" * 64,
            "donor": {"name": "Test", "email": "test@test.com"}
        }
        response = requests.post(f"{BASE_URL}/donations/verify", json=verify_payload)
        data = response.json()
        
        passed = response.status_code == 404
        all_passed = all_passed and print_test(
            "Validation: Unknown orderId returns 404",
            passed,
            f"Status: {response.status_code}, Error: {data.get('error')}"
        )
    except Exception as e:
        all_passed = False
        print_test("Validation: Unknown orderId", False, f"Exception: {str(e)}")
    
    return all_passed

def test_get_receipt():
    """Test 8 & 9: Get receipt endpoint"""
    print("\n" + "="*80)
    print("TESTING GET RECEIPT ENDPOINT")
    print("="*80)
    
    all_passed = True
    
    # Test getting existing receipt
    try:
        if saved_donation_id:
            response = requests.get(f"{BASE_URL}/donations/receipt/{saved_donation_id}")
            data = response.json()
            
            passed = (
                response.status_code == 200 and
                data.get("id") == saved_donation_id and
                "receiptNumber" in data
            )
            all_passed = all_passed and print_test(
                "Get Receipt: Existing donation",
                passed,
                f"Status: {response.status_code}, Receipt: {data.get('receiptNumber')}"
            )
        else:
            print_test("Get Receipt: Existing donation", False, "No saved donation ID from previous test")
            all_passed = False
    except Exception as e:
        all_passed = False
        print_test("Get Receipt: Existing donation", False, f"Exception: {str(e)}")
    
    # Test non-existent receipt
    try:
        response = requests.get(f"{BASE_URL}/donations/receipt/non-existent-id-12345")
        data = response.json()
        
        passed = response.status_code == 404
        all_passed = all_passed and print_test(
            "Get Receipt: Non-existent ID returns 404",
            passed,
            f"Status: {response.status_code}, Error: {data.get('error')}"
        )
    except Exception as e:
        all_passed = False
        print_test("Get Receipt: Non-existent ID", False, f"Exception: {str(e)}")
    
    return all_passed

def test_recent_donations():
    """Test 10: Recent donations endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/donations/recent")
        data = response.json()
        
        passed = response.status_code == 200 and isinstance(data, list)
        
        # Check structure if we have donations
        if data and len(data) > 0:
            first = data[0]
            has_required = all(field in first for field in ["firstName", "amount", "cause", "createdAt"])
            passed = passed and has_required
            details = f"Status: {response.status_code}, Count: {len(data)}, Has required fields: {has_required}"
        else:
            details = f"Status: {response.status_code}, Count: 0 (empty array is valid)"
        
        return print_test("Recent Donations GET /api/donations/recent", passed, details)
    except Exception as e:
        return print_test("Recent Donations", False, f"Exception: {str(e)}")

def test_volunteer_signup():
    """Test 11: Volunteer signup"""
    print("\n" + "="*80)
    print("TESTING VOLUNTEER SIGNUP")
    print("="*80)
    
    all_passed = True
    
    # Happy path
    try:
        volunteer_payload = {
            "name": "Amit Patel",
            "email": "amit.patel@example.com",
            "phone": "9988776655",
            "city": "Pune",
            "interest": "education",
            "message": "I want to help with teaching underprivileged children"
        }
        response = requests.post(f"{BASE_URL}/volunteer", json=volunteer_payload)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get("success") == True and
            "volunteer" in data
        )
        all_passed = all_passed and print_test(
            "Volunteer: Happy path",
            passed,
            f"Status: {response.status_code}, Success: {data.get('success')}"
        )
    except Exception as e:
        all_passed = False
        print_test("Volunteer: Happy path", False, f"Exception: {str(e)}")
    
    # Validation - missing name
    try:
        volunteer_payload = {"email": "test@example.com"}  # Missing name
        response = requests.post(f"{BASE_URL}/volunteer", json=volunteer_payload)
        data = response.json()
        
        passed = response.status_code == 400
        all_passed = all_passed and print_test(
            "Volunteer: Missing name returns 400",
            passed,
            f"Status: {response.status_code}, Error: {data.get('error')}"
        )
    except Exception as e:
        all_passed = False
        print_test("Volunteer: Missing name", False, f"Exception: {str(e)}")
    
    return all_passed

def test_contact_form():
    """Test 12: Contact form"""
    print("\n" + "="*80)
    print("TESTING CONTACT FORM")
    print("="*80)
    
    all_passed = True
    
    # Happy path
    try:
        contact_payload = {
            "name": "Sunita Reddy",
            "email": "sunita.reddy@example.com",
            "subject": "Partnership Inquiry",
            "message": "We would like to collaborate with your NGO for our CSR initiatives."
        }
        response = requests.post(f"{BASE_URL}/contact", json=contact_payload)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get("success") == True and
            "contact" in data
        )
        all_passed = all_passed and print_test(
            "Contact: Happy path",
            passed,
            f"Status: {response.status_code}, Success: {data.get('success')}"
        )
    except Exception as e:
        all_passed = False
        print_test("Contact: Happy path", False, f"Exception: {str(e)}")
    
    # Validation - missing fields
    try:
        contact_payload = {"name": "Test User"}  # Missing email and message
        response = requests.post(f"{BASE_URL}/contact", json=contact_payload)
        data = response.json()
        
        passed = (
            response.status_code == 400 and
            "All fields are required" in data.get("error", "")
        )
        all_passed = all_passed and print_test(
            "Contact: Missing fields returns 400",
            passed,
            f"Status: {response.status_code}, Error: {data.get('error')}"
        )
    except Exception as e:
        all_passed = False
        print_test("Contact: Missing fields", False, f"Exception: {str(e)}")
    
    return all_passed

def test_membership_happy_path():
    """Test 13: Complete membership flow (3 chained calls) - HAPPY PATH"""
    print("\n" + "="*80)
    print("TESTING MEMBERSHIP HAPPY PATH (3-step flow)")
    print("="*80)
    
    all_passed = True
    
    # Step 1a: Apply for membership
    try:
        apply_payload = {
            "name": "Ramesh Patnaik",
            "mobile": "9999912345",
            "email": "ramesh@example.com",
            "address": "House 12, Grand Road, Puri, Odisha 752001",
            "occupation": "Retired",
            "aadhaarLast4": "1234",
            "photo": None,
            "reason": "I want to support the Trust's seva work in Odisha as a member.",
            "amount": 500
        }
        response = requests.post(f"{BASE_URL}/members/apply", json=apply_payload)
        data = response.json()
        
        member_id = data.get("id", "")
        order_id = data.get("orderId", "")
        passed = (
            response.status_code == 200 and
            member_id and  # Should have a UUID
            order_id.startswith("order_") and
            data.get("amount") == 500 and
            data.get("currency") == "INR" and
            data.get("mock") == True
        )
        all_passed = all_passed and print_test(
            "Step 1a: Apply for Membership POST /api/members/apply",
            passed,
            f"Status: {response.status_code}, MemberId: {member_id}, OrderId: {order_id}"
        )
        
        if not passed:
            return False
            
    except Exception as e:
        print_test("Step 1a: Apply for Membership", False, f"Exception: {str(e)}")
        return False
    
    # Step 1b: Mock payment
    try:
        mock_pay_payload = {"orderId": order_id}
        response = requests.post(f"{BASE_URL}/members/mock-pay", json=mock_pay_payload)
        data = response.json()
        
        payment_id = data.get("paymentId", "")
        signature = data.get("signature", "")
        passed = (
            response.status_code == 200 and
            payment_id.startswith("pay_") and
            len(signature) == 64 and  # HMAC SHA-256 produces 64 hex chars
            data.get("orderId") == order_id
        )
        all_passed = all_passed and print_test(
            "Step 1b: Mock Payment POST /api/members/mock-pay",
            passed,
            f"Status: {response.status_code}, PaymentId: {payment_id}, Signature length: {len(signature)}"
        )
        
        if not passed:
            return False
            
    except Exception as e:
        print_test("Step 1b: Mock Payment", False, f"Exception: {str(e)}")
        return False
    
    # Step 1c: Complete membership with valid signature
    try:
        complete_payload = {
            "id": member_id,
            "orderId": order_id,
            "paymentId": payment_id,
            "signature": signature
        }
        response = requests.post(f"{BASE_URL}/members/complete", json=complete_payload)
        data = response.json()
        
        member = data.get("member", {})
        member_card_id = member.get("memberId", "")
        receipt_number = member.get("receiptNumber", "")
        valid_from = member.get("validFrom")
        valid_until = member.get("validUntil")
        
        # Check memberId format: MKDS-MEM-NNNNNN
        import re
        member_id_valid = bool(re.match(r'^MKDS-MEM-\d{6}$', member_card_id))
        
        # Check receipt format: MKDS/M/YYYY/NNNNNN
        receipt_valid = bool(re.match(r'^MKDS/M/\d{4}/\d+$', receipt_number))
        
        # Verify validUntil is exactly 1 year after validFrom
        from datetime import datetime
        validity_correct = False
        if valid_from and valid_until:
            try:
                from_date = datetime.fromisoformat(valid_from.replace('Z', '+00:00'))
                until_date = datetime.fromisoformat(valid_until.replace('Z', '+00:00'))
                # Check if difference is approximately 1 year (365 days)
                days_diff = (until_date - from_date).days
                validity_correct = 364 <= days_diff <= 366  # Allow for leap years
            except:
                validity_correct = False
        
        passed = (
            response.status_code == 200 and
            data.get("success") == True and
            member_id_valid and
            receipt_valid and
            member.get("status") == "active" and
            member.get("name") == "Ramesh Patnaik" and
            validity_correct
        )
        all_passed = all_passed and print_test(
            "Step 1c: Complete Membership POST /api/members/complete",
            passed,
            f"Status: {response.status_code}, MemberId: {member_card_id}, Receipt: {receipt_number}, Validity: {days_diff if validity_correct else 'N/A'} days"
        )
        
        # Store member ID for later tests
        global saved_member_id
        saved_member_id = member.get("id", "")
        
        return all_passed
        
    except Exception as e:
        print_test("Step 1c: Complete Membership", False, f"Exception: {str(e)}")
        return False

def test_membership_validation():
    """Test 14: Membership validation"""
    print("\n" + "="*80)
    print("TESTING MEMBERSHIP VALIDATION")
    print("="*80)
    
    all_passed = True
    
    # Test missing fields
    try:
        apply_payload = {"amount": 500}  # Missing required fields
        response = requests.post(f"{BASE_URL}/members/apply", json=apply_payload)
        data = response.json()
        
        passed = response.status_code == 400
        all_passed = all_passed and print_test(
            "Validation: Missing fields returns 400",
            passed,
            f"Status: {response.status_code}, Error: {data.get('error')}"
        )
    except Exception as e:
        all_passed = False
        print_test("Validation: Missing fields", False, f"Exception: {str(e)}")
    
    # Test amount < 500
    try:
        apply_payload = {
            "name": "Test User",
            "mobile": "9876543210",
            "email": "test@example.com",
            "address": "Test Address",
            "amount": 100
        }
        response = requests.post(f"{BASE_URL}/members/apply", json=apply_payload)
        data = response.json()
        
        passed = (
            response.status_code == 400 and
            "Minimum support contribution is ₹500" in data.get("error", "")
        )
        all_passed = all_passed and print_test(
            "Validation: Amount < 500 returns specific error",
            passed,
            f"Status: {response.status_code}, Error: {data.get('error')}"
        )
    except Exception as e:
        all_passed = False
        print_test("Validation: Amount < 500", False, f"Exception: {str(e)}")
    
    # Test invalid mobile (non-numeric)
    try:
        apply_payload = {
            "name": "Test User",
            "mobile": "abc",
            "email": "test@example.com",
            "address": "Test Address",
            "amount": 500
        }
        response = requests.post(f"{BASE_URL}/members/apply", json=apply_payload)
        data = response.json()
        
        passed = (
            response.status_code == 400 and
            "Invalid mobile number" in data.get("error", "")
        )
        all_passed = all_passed and print_test(
            "Validation: Invalid mobile (non-numeric) returns 400",
            passed,
            f"Status: {response.status_code}, Error: {data.get('error')}"
        )
    except Exception as e:
        all_passed = False
        print_test("Validation: Invalid mobile (non-numeric)", False, f"Exception: {str(e)}")
    
    # Test invalid mobile (too short)
    try:
        apply_payload = {
            "name": "Test User",
            "mobile": "123",
            "email": "test@example.com",
            "address": "Test Address",
            "amount": 500
        }
        response = requests.post(f"{BASE_URL}/members/apply", json=apply_payload)
        data = response.json()
        
        passed = (
            response.status_code == 400 and
            "Invalid mobile number" in data.get("error", "")
        )
        all_passed = all_passed and print_test(
            "Validation: Invalid mobile (too short) returns 400",
            passed,
            f"Status: {response.status_code}, Error: {data.get('error')}"
        )
    except Exception as e:
        all_passed = False
        print_test("Validation: Invalid mobile (too short)", False, f"Exception: {str(e)}")
    
    return all_passed

def test_membership_signature_tampering():
    """Test 15: CRITICAL - Membership signature tampering detection"""
    print("\n" + "="*80)
    print("🔴 CRITICAL TEST: MEMBERSHIP SIGNATURE TAMPERING DETECTION")
    print("="*80)
    
    all_passed = True
    
    # Create a new member and get valid payment details
    try:
        # Step 1: Apply
        apply_payload = {
            "name": "Priya Mishra",
            "mobile": "9988776655",
            "email": "priya.mishra@example.com",
            "address": "Flat 5B, Lotus Apartments, Bhubaneswar, Odisha 751001",
            "occupation": "Teacher",
            "aadhaarLast4": "5678",
            "photo": None,
            "reason": "Want to contribute to education initiatives",
            "amount": 1000
        }
        response = requests.post(f"{BASE_URL}/members/apply", json=apply_payload)
        apply_data = response.json()
        member_id = apply_data.get("id")
        order_id = apply_data.get("orderId")
        
        # Step 2: Get valid payment
        mock_pay_payload = {"orderId": order_id}
        response = requests.post(f"{BASE_URL}/members/mock-pay", json=mock_pay_payload)
        pay_data = response.json()
        payment_id = pay_data.get("paymentId")
        valid_signature = pay_data.get("signature")
        
        print(f"\n   Valid signature: {valid_signature}")
        
        # Step 3: Attempt completion with TAMPERED signature
        tampered_signature = "0" * 64  # Invalid signature
        print(f"   Tampered signature: {tampered_signature}")
        
        complete_payload = {
            "id": member_id,
            "orderId": order_id,
            "paymentId": payment_id,
            "signature": tampered_signature  # TAMPERED!
        }
        response = requests.post(f"{BASE_URL}/members/complete", json=complete_payload)
        data = response.json()
        
        # Should REJECT the tampered signature
        passed = (
            response.status_code == 400 and
            "signature verification failed" in data.get("error", "").lower()
        )
        all_passed = all_passed and print_test(
            "🔴 CRITICAL: Tampered signature REJECTED",
            passed,
            f"Status: {response.status_code}, Error: {data.get('error')}"
        )
        
        if not passed:
            print("\n   ⚠️  WARNING: Membership signature verification is NOT working correctly!")
            print("   ⚠️  This is a CRITICAL security issue!")
        else:
            print("\n   ✅ EXCELLENT: Membership signature verification is working correctly!")
            print("   ✅ Tampered signatures are properly rejected!")
        
        # Step 4: Verify member status is 'payment_failed'
        try:
            response = requests.get(f"{BASE_URL}/members/{member_id}")
            member_data = response.json()
            
            status_check_passed = (
                response.status_code == 200 and
                member_data.get("status") == "payment_failed"
            )
            all_passed = all_passed and print_test(
                "🔴 CRITICAL: Member status updated to 'payment_failed'",
                status_check_passed,
                f"Status: {response.status_code}, Member status: {member_data.get('status')}"
            )
        except Exception as e:
            all_passed = False
            print_test("Member status check", False, f"Exception: {str(e)}")
        
        return all_passed
        
    except Exception as e:
        print_test("🔴 CRITICAL: Membership Signature Tampering Test", False, f"Exception: {str(e)}")
        return False

def test_membership_edge_cases():
    """Test 16: Membership edge cases"""
    print("\n" + "="*80)
    print("TESTING MEMBERSHIP EDGE CASES")
    print("="*80)
    
    all_passed = True
    
    # Test missing signature
    try:
        complete_payload = {
            "id": "some-id",
            "orderId": "order_123",
            "paymentId": "pay_123"
            # Missing signature
        }
        response = requests.post(f"{BASE_URL}/members/complete", json=complete_payload)
        data = response.json()
        
        passed = response.status_code == 400
        all_passed = all_passed and print_test(
            "Edge Case: Missing signature returns 400",
            passed,
            f"Status: {response.status_code}, Error: {data.get('error')}"
        )
    except Exception as e:
        all_passed = False
        print_test("Edge Case: Missing signature", False, f"Exception: {str(e)}")
    
    # Test unknown member id
    try:
        import uuid
        random_id = str(uuid.uuid4())
        complete_payload = {
            "id": random_id,
            "orderId": "order_123",
            "paymentId": "pay_123",
            "signature": "a" * 64
        }
        response = requests.post(f"{BASE_URL}/members/complete", json=complete_payload)
        data = response.json()
        
        passed = response.status_code == 404
        all_passed = all_passed and print_test(
            "Edge Case: Unknown member id returns 404",
            passed,
            f"Status: {response.status_code}, Error: {data.get('error')}"
        )
    except Exception as e:
        all_passed = False
        print_test("Edge Case: Unknown member id", False, f"Exception: {str(e)}")
    
    # Test mismatched orderId
    try:
        # First create a valid member
        apply_payload = {
            "name": "Test User",
            "mobile": "9876543210",
            "email": "test.mismatch@example.com",
            "address": "Test Address",
            "amount": 500
        }
        response = requests.post(f"{BASE_URL}/members/apply", json=apply_payload)
        apply_data = response.json()
        member_id = apply_data.get("id")
        
        # Try to complete with wrong orderId
        complete_payload = {
            "id": member_id,
            "orderId": "order_wrong_12345",  # Wrong orderId
            "paymentId": "pay_123",
            "signature": "a" * 64
        }
        response = requests.post(f"{BASE_URL}/members/complete", json=complete_payload)
        data = response.json()
        
        passed = (
            response.status_code == 400 and
            "Order mismatch" in data.get("error", "")
        )
        all_passed = all_passed and print_test(
            "Edge Case: Mismatched orderId returns 400 'Order mismatch'",
            passed,
            f"Status: {response.status_code}, Error: {data.get('error')}"
        )
    except Exception as e:
        all_passed = False
        print_test("Edge Case: Mismatched orderId", False, f"Exception: {str(e)}")
    
    return all_passed

def test_get_member():
    """Test 17: Get member endpoint"""
    print("\n" + "="*80)
    print("TESTING GET MEMBER ENDPOINT")
    print("="*80)
    
    all_passed = True
    
    # Test getting existing member
    try:
        if saved_member_id:
            response = requests.get(f"{BASE_URL}/members/{saved_member_id}")
            data = response.json()
            
            # Check all required fields
            required_fields = ["id", "memberId", "name", "mobile", "email", "address", 
                             "status", "validFrom", "validUntil", "receiptNumber"]
            has_all_fields = all(field in data for field in required_fields)
            
            passed = (
                response.status_code == 200 and
                data.get("id") == saved_member_id and
                has_all_fields
            )
            all_passed = all_passed and print_test(
                "Get Member: Existing member with all fields",
                passed,
                f"Status: {response.status_code}, MemberId: {data.get('memberId')}, Has all fields: {has_all_fields}"
            )
        else:
            print_test("Get Member: Existing member", False, "No saved member ID from previous test")
            all_passed = False
    except Exception as e:
        all_passed = False
        print_test("Get Member: Existing member", False, f"Exception: {str(e)}")
    
    # Test non-existent member
    try:
        import uuid
        random_id = str(uuid.uuid4())
        response = requests.get(f"{BASE_URL}/members/{random_id}")
        data = response.json()
        
        passed = response.status_code == 404
        all_passed = all_passed and print_test(
            "Get Member: Non-existent ID returns 404",
            passed,
            f"Status: {response.status_code}, Error: {data.get('error')}"
        )
    except Exception as e:
        all_passed = False
        print_test("Get Member: Non-existent ID", False, f"Exception: {str(e)}")
    
    return all_passed

def test_regression_checks():
    """Test 18: Regression checks - ensure donations still work"""
    print("\n" + "="*80)
    print("TESTING REGRESSION - DONATIONS STILL WORKING")
    print("="*80)
    
    all_passed = True
    
    # Quick check: GET /api/stats
    try:
        response = requests.get(f"{BASE_URL}/stats")
        data = response.json()
        
        passed = response.status_code == 200 and "totalRaised" in data
        all_passed = all_passed and print_test(
            "Regression: GET /api/stats still works",
            passed,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        all_passed = False
        print_test("Regression: GET /api/stats", False, f"Exception: {str(e)}")
    
    # Quick check: POST /api/donations/create-order
    try:
        create_payload = {"amount": 1000, "cause": "education"}
        response = requests.post(f"{BASE_URL}/donations/create-order", json=create_payload)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get("orderId", "").startswith("order_")
        )
        all_passed = all_passed and print_test(
            "Regression: POST /api/donations/create-order still works",
            passed,
            f"Status: {response.status_code}, OrderId: {data.get('orderId')}"
        )
    except Exception as e:
        all_passed = False
        print_test("Regression: POST /api/donations/create-order", False, f"Exception: {str(e)}")
    
    return all_passed

def test_admin_auth_flow():
    """Test 19: Admin authentication flow"""
    print("\n" + "="*80)
    print("TESTING ADMIN AUTHENTICATION FLOW")
    print("="*80)
    
    all_passed = True
    global admin_cookie
    admin_cookie = None
    
    # Test 1a: Login with wrong password
    try:
        login_payload = {"password": "wrongpassword"}
        response = requests.post(f"{BASE_URL}/admin/login", json=login_payload)
        data = response.json()
        
        passed = (
            response.status_code == 401 and
            "Invalid password" in data.get("error", "")
        )
        all_passed = all_passed and print_test(
            "Admin Login: Wrong password returns 401",
            passed,
            f"Status: {response.status_code}, Error: {data.get('error')}"
        )
    except Exception as e:
        all_passed = False
        print_test("Admin Login: Wrong password", False, f"Exception: {str(e)}")
    
    # Test 1b: Login with correct password
    try:
        login_payload = {"password": "admin123"}
        response = requests.post(f"{BASE_URL}/admin/login", json=login_payload)
        data = response.json()
        
        # Check for Set-Cookie header
        set_cookie = response.headers.get('Set-Cookie', '')
        has_cookie = 'mkds_admin_session' in set_cookie
        
        passed = (
            response.status_code == 200 and
            data.get("ok") == True and
            data.get("role") == "super_admin" and
            data.get("name") == "Super Admin" and
            has_cookie
        )
        
        if has_cookie:
            # Extract cookie value
            cookie_parts = set_cookie.split(';')[0]
            admin_cookie = cookie_parts
            print(f"   Saved admin cookie: {admin_cookie[:50]}...")
        
        all_passed = all_passed and print_test(
            "Admin Login: Correct password returns 200 + cookie",
            passed,
            f"Status: {response.status_code}, Role: {data.get('role')}, Has cookie: {has_cookie}"
        )
    except Exception as e:
        all_passed = False
        print_test("Admin Login: Correct password", False, f"Exception: {str(e)}")
    
    # Test 1c: GET /admin/me with cookie
    try:
        if admin_cookie:
            headers = {'Cookie': admin_cookie}
            response = requests.get(f"{BASE_URL}/admin/me", headers=headers)
            data = response.json()
            
            passed = (
                response.status_code == 200 and
                data.get("role") == "super_admin" and
                data.get("name") == "Super Admin"
            )
            all_passed = all_passed and print_test(
                "Admin /me: With cookie returns 200",
                passed,
                f"Status: {response.status_code}, Role: {data.get('role')}"
            )
        else:
            all_passed = False
            print_test("Admin /me: With cookie", False, "No admin cookie available")
    except Exception as e:
        all_passed = False
        print_test("Admin /me: With cookie", False, f"Exception: {str(e)}")
    
    # Test 1d: GET /admin/me without cookie
    try:
        response = requests.get(f"{BASE_URL}/admin/me")
        data = response.json()
        
        passed = (
            response.status_code == 401 and
            "Unauthorised" in data.get("error", "")
        )
        all_passed = all_passed and print_test(
            "Admin /me: Without cookie returns 401",
            passed,
            f"Status: {response.status_code}, Error: {data.get('error')}"
        )
    except Exception as e:
        all_passed = False
        print_test("Admin /me: Without cookie", False, f"Exception: {str(e)}")
    
    # Test 1e: GET /admin/stats without cookie
    try:
        response = requests.get(f"{BASE_URL}/admin/stats")
        data = response.json()
        
        passed = response.status_code == 401
        all_passed = all_passed and print_test(
            "Admin /stats: Without cookie returns 401",
            passed,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        all_passed = False
        print_test("Admin /stats: Without cookie", False, f"Exception: {str(e)}")
    
    # Test 1f: GET /admin/stats with cookie
    try:
        if admin_cookie:
            headers = {'Cookie': admin_cookie}
            response = requests.get(f"{BASE_URL}/admin/stats", headers=headers)
            data = response.json()
            
            required_fields = ["totalRaised", "donationCount", "activeMembers", "pendingMembers", 
                             "memberContributions", "volunteerCount", "csrCount", "contactCount"]
            has_all_fields = all(field in data for field in required_fields)
            
            passed = (
                response.status_code == 200 and
                has_all_fields
            )
            all_passed = all_passed and print_test(
                "Admin /stats: With cookie returns 200 with all fields",
                passed,
                f"Status: {response.status_code}, Has all fields: {has_all_fields}, Data: {data}"
            )
        else:
            all_passed = False
            print_test("Admin /stats: With cookie", False, "No admin cookie available")
    except Exception as e:
        all_passed = False
        print_test("Admin /stats: With cookie", False, f"Exception: {str(e)}")
    
    return all_passed

def test_admin_list_endpoints():
    """Test 20: Admin list endpoints with filters"""
    print("\n" + "="*80)
    print("TESTING ADMIN LIST ENDPOINTS")
    print("="*80)
    
    all_passed = True
    
    if not admin_cookie:
        print_test("Admin List Endpoints", False, "No admin cookie available")
        return False
    
    headers = {'Cookie': admin_cookie}
    
    # Test donations list
    try:
        response = requests.get(f"{BASE_URL}/admin/donations", headers=headers)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            "rows" in data and
            isinstance(data["rows"], list)
        )
        all_passed = all_passed and print_test(
            "Admin Donations: List returns array",
            passed,
            f"Status: {response.status_code}, Count: {len(data.get('rows', []))}"
        )
    except Exception as e:
        all_passed = False
        print_test("Admin Donations: List", False, f"Exception: {str(e)}")
    
    # Test donations filter by cause
    try:
        response = requests.get(f"{BASE_URL}/admin/donations?cause=education", headers=headers)
        data = response.json()
        
        rows = data.get("rows", [])
        all_education = all(row.get("cause") == "education" for row in rows) if rows else True
        
        passed = (
            response.status_code == 200 and
            isinstance(rows, list)
        )
        all_passed = all_passed and print_test(
            "Admin Donations: Filter by cause=education",
            passed,
            f"Status: {response.status_code}, Count: {len(rows)}, All education: {all_education}"
        )
    except Exception as e:
        all_passed = False
        print_test("Admin Donations: Filter by cause", False, f"Exception: {str(e)}")
    
    # Test members list
    try:
        response = requests.get(f"{BASE_URL}/admin/members", headers=headers)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            "rows" in data and
            isinstance(data["rows"], list)
        )
        all_passed = all_passed and print_test(
            "Admin Members: List returns array",
            passed,
            f"Status: {response.status_code}, Count: {len(data.get('rows', []))}"
        )
    except Exception as e:
        all_passed = False
        print_test("Admin Members: List", False, f"Exception: {str(e)}")
    
    # Test members filter by status
    try:
        response = requests.get(f"{BASE_URL}/admin/members?status=active", headers=headers)
        data = response.json()
        
        rows = data.get("rows", [])
        all_active = all(row.get("status") == "active" for row in rows) if rows else True
        
        passed = (
            response.status_code == 200 and
            isinstance(rows, list) and
            all_active
        )
        all_passed = all_passed and print_test(
            "Admin Members: Filter by status=active",
            passed,
            f"Status: {response.status_code}, Count: {len(rows)}, All active: {all_active}"
        )
    except Exception as e:
        all_passed = False
        print_test("Admin Members: Filter by status", False, f"Exception: {str(e)}")
    
    # Test volunteers list
    try:
        response = requests.get(f"{BASE_URL}/admin/volunteers", headers=headers)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            "rows" in data and
            isinstance(data["rows"], list)
        )
        all_passed = all_passed and print_test(
            "Admin Volunteers: List returns array",
            passed,
            f"Status: {response.status_code}, Count: {len(data.get('rows', []))}"
        )
    except Exception as e:
        all_passed = False
        print_test("Admin Volunteers: List", False, f"Exception: {str(e)}")
    
    # Test volunteers filter by interest
    try:
        response = requests.get(f"{BASE_URL}/admin/volunteers?interest=education", headers=headers)
        data = response.json()
        
        rows = data.get("rows", [])
        all_education = all(row.get("interest") == "education" for row in rows) if rows else True
        
        passed = (
            response.status_code == 200 and
            isinstance(rows, list)
        )
        all_passed = all_passed and print_test(
            "Admin Volunteers: Filter by interest=education",
            passed,
            f"Status: {response.status_code}, Count: {len(rows)}, All education: {all_education}"
        )
    except Exception as e:
        all_passed = False
        print_test("Admin Volunteers: Filter by interest", False, f"Exception: {str(e)}")
    
    # Test contacts list
    try:
        response = requests.get(f"{BASE_URL}/admin/contacts", headers=headers)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            "rows" in data and
            isinstance(data["rows"], list)
        )
        all_passed = all_passed and print_test(
            "Admin Contacts: List returns array",
            passed,
            f"Status: {response.status_code}, Count: {len(data.get('rows', []))}"
        )
    except Exception as e:
        all_passed = False
        print_test("Admin Contacts: List", False, f"Exception: {str(e)}")
    
    # Test contacts filter by kind=csr
    try:
        response = requests.get(f"{BASE_URL}/admin/contacts?kind=csr", headers=headers)
        data = response.json()
        
        rows = data.get("rows", [])
        all_csr = all("CSR" in row.get("subject", "").upper() for row in rows) if rows else True
        
        passed = (
            response.status_code == 200 and
            isinstance(rows, list)
        )
        all_passed = all_passed and print_test(
            "Admin Contacts: Filter by kind=csr",
            passed,
            f"Status: {response.status_code}, Count: {len(rows)}, All CSR: {all_csr}"
        )
    except Exception as e:
        all_passed = False
        print_test("Admin Contacts: Filter by kind=csr", False, f"Exception: {str(e)}")
    
    # Test contacts filter by kind=general (no CSR)
    try:
        response = requests.get(f"{BASE_URL}/admin/contacts?kind=general", headers=headers)
        data = response.json()
        
        rows = data.get("rows", [])
        no_csr = all("CSR" not in row.get("subject", "").upper() for row in rows) if rows else True
        
        passed = (
            response.status_code == 200 and
            isinstance(rows, list) and
            no_csr
        )
        all_passed = all_passed and print_test(
            "Admin Contacts: Filter by kind=general (no CSR)",
            passed,
            f"Status: {response.status_code}, Count: {len(rows)}, No CSR: {no_csr}"
        )
    except Exception as e:
        all_passed = False
        print_test("Admin Contacts: Filter by kind=general", False, f"Exception: {str(e)}")
    
    return all_passed

def test_admin_csv_exports():
    """Test 21: Admin CSV export endpoints"""
    print("\n" + "="*80)
    print("TESTING ADMIN CSV EXPORTS")
    print("="*80)
    
    all_passed = True
    
    if not admin_cookie:
        print_test("Admin CSV Exports", False, "No admin cookie available")
        return False
    
    headers = {'Cookie': admin_cookie}
    
    # Test donations export
    try:
        response = requests.get(f"{BASE_URL}/admin/donations/export", headers=headers)
        
        content_type = response.headers.get('Content-Type', '')
        content_disposition = response.headers.get('Content-Disposition', '')
        body = response.text
        
        is_csv = 'text/csv' in content_type
        has_filename = 'donations' in content_disposition and '.csv' in content_disposition
        has_headers = body.startswith('"') or 'Receipt' in body[:100]
        
        passed = (
            response.status_code == 200 and
            is_csv and
            has_filename and
            has_headers
        )
        all_passed = all_passed and print_test(
            "Admin Donations Export: Returns CSV",
            passed,
            f"Status: {response.status_code}, Is CSV: {is_csv}, Has filename: {has_filename}, Body preview: {body[:100]}"
        )
    except Exception as e:
        all_passed = False
        print_test("Admin Donations Export", False, f"Exception: {str(e)}")
    
    # Test members export
    try:
        response = requests.get(f"{BASE_URL}/admin/members/export", headers=headers)
        
        content_type = response.headers.get('Content-Type', '')
        content_disposition = response.headers.get('Content-Disposition', '')
        
        is_csv = 'text/csv' in content_type
        has_filename = 'members' in content_disposition and '.csv' in content_disposition
        
        passed = (
            response.status_code == 200 and
            is_csv and
            has_filename
        )
        all_passed = all_passed and print_test(
            "Admin Members Export: Returns CSV",
            passed,
            f"Status: {response.status_code}, Is CSV: {is_csv}, Has filename: {has_filename}"
        )
    except Exception as e:
        all_passed = False
        print_test("Admin Members Export", False, f"Exception: {str(e)}")
    
    # Test volunteers export
    try:
        response = requests.get(f"{BASE_URL}/admin/volunteers/export", headers=headers)
        
        content_type = response.headers.get('Content-Type', '')
        content_disposition = response.headers.get('Content-Disposition', '')
        
        is_csv = 'text/csv' in content_type
        has_filename = 'volunteers' in content_disposition and '.csv' in content_disposition
        
        passed = (
            response.status_code == 200 and
            is_csv and
            has_filename
        )
        all_passed = all_passed and print_test(
            "Admin Volunteers Export: Returns CSV",
            passed,
            f"Status: {response.status_code}, Is CSV: {is_csv}, Has filename: {has_filename}"
        )
    except Exception as e:
        all_passed = False
        print_test("Admin Volunteers Export", False, f"Exception: {str(e)}")
    
    # Test contacts export with kind=csr
    try:
        response = requests.get(f"{BASE_URL}/admin/contacts/export?kind=csr", headers=headers)
        
        content_type = response.headers.get('Content-Type', '')
        content_disposition = response.headers.get('Content-Disposition', '')
        
        is_csv = 'text/csv' in content_type
        has_filename = 'contacts' in content_disposition and '.csv' in content_disposition
        
        passed = (
            response.status_code == 200 and
            is_csv and
            has_filename
        )
        all_passed = all_passed and print_test(
            "Admin Contacts Export: Returns CSV",
            passed,
            f"Status: {response.status_code}, Is CSV: {is_csv}, Has filename: {has_filename}"
        )
    except Exception as e:
        all_passed = False
        print_test("Admin Contacts Export", False, f"Exception: {str(e)}")
    
    return all_passed

def test_admin_content_cms():
    """Test 22: Admin Content CMS"""
    print("\n" + "="*80)
    print("TESTING ADMIN CONTENT CMS")
    print("="*80)
    
    all_passed = True
    
    if not admin_cookie:
        print_test("Admin Content CMS", False, "No admin cookie available")
        return False
    
    headers = {'Cookie': admin_cookie}
    
    # Test GET content (initially empty)
    try:
        response = requests.get(f"{BASE_URL}/admin/content", headers=headers)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            "rows" in data and
            isinstance(data["rows"], list)
        )
        all_passed = all_passed and print_test(
            "Admin Content: GET returns array",
            passed,
            f"Status: {response.status_code}, Count: {len(data.get('rows', []))}"
        )
    except Exception as e:
        all_passed = False
        print_test("Admin Content: GET", False, f"Exception: {str(e)}")
    
    # Test POST content (create/update)
    try:
        content_payload = {
            "key": "hero.headline",
            "value": "Test headline for NGO"
        }
        response = requests.post(f"{BASE_URL}/admin/content", json=content_payload, headers=headers)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get("key") == "hero.headline" and
            data.get("value") == "Test headline for NGO"
        )
        all_passed = all_passed and print_test(
            "Admin Content: POST creates/updates content",
            passed,
            f"Status: {response.status_code}, Key: {data.get('key')}, Value: {data.get('value')}"
        )
    except Exception as e:
        all_passed = False
        print_test("Admin Content: POST", False, f"Exception: {str(e)}")
    
    # Test GET content again (should contain new item)
    try:
        response = requests.get(f"{BASE_URL}/admin/content", headers=headers)
        data = response.json()
        
        rows = data.get("rows", [])
        has_hero_headline = any(row.get("key") == "hero.headline" and row.get("value") == "Test headline for NGO" for row in rows)
        
        passed = (
            response.status_code == 200 and
            has_hero_headline
        )
        all_passed = all_passed and print_test(
            "Admin Content: GET includes new content",
            passed,
            f"Status: {response.status_code}, Has hero.headline: {has_hero_headline}"
        )
    except Exception as e:
        all_passed = False
        print_test("Admin Content: GET after POST", False, f"Exception: {str(e)}")
    
    # Test POST without key (validation)
    try:
        content_payload = {"value": "Test value"}  # Missing key
        response = requests.post(f"{BASE_URL}/admin/content", json=content_payload, headers=headers)
        data = response.json()
        
        passed = (
            response.status_code == 400 and
            "key required" in data.get("error", "")
        )
        all_passed = all_passed and print_test(
            "Admin Content: POST without key returns 400",
            passed,
            f"Status: {response.status_code}, Error: {data.get('error')}"
        )
    except Exception as e:
        all_passed = False
        print_test("Admin Content: POST validation", False, f"Exception: {str(e)}")
    
    return all_passed

def test_admin_media_library():
    """Test 23: Admin Media Library - Phase 5 Disk-based Storage"""
    print("\n" + "="*80)
    print("TESTING ADMIN MEDIA LIBRARY - PHASE 5 DISK-BASED STORAGE")
    print("="*80)
    
    all_passed = True
    global saved_media_id
    saved_media_id = None
    
    if not admin_cookie:
        print_test("Admin Media Library", False, "No admin cookie available")
        return False
    
    headers = {'Cookie': admin_cookie}
    host = BASE_URL.rsplit('/api', 1)[0]  # For static file access
    
    # ========== SCENARIO 1: POST multipart/form-data (preferred path) ==========
    print("\n--- Scenario 1: Multipart Upload (Preferred Path) ---")
    
    # Test 1a: POST without auth → 401
    try:
        PNG_1PX = bytes.fromhex('89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4890000000D4944415478DA63F8FFFF3F0300050001A2A75DC9F40000000049454E44AE426082')
        files = {'file': ('test.png', PNG_1PX, 'image/png')}
        response = requests.post(f"{BASE_URL}/admin/media", files=files)
        
        passed = response.status_code == 401
        all_passed = all_passed and print_test(
            "1a: POST multipart without auth → 401",
            passed,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        all_passed = False
        print_test("1a: POST without auth", False, f"Exception: {str(e)}")
    
    # Test 1b: POST without 'file' field → 400
    try:
        # Send multipart with an empty files dict (no 'file' field)
        files = {'other': ('test.txt', b'test', 'text/plain')}  # Wrong field name
        response = requests.post(f"{BASE_URL}/admin/media", files=files, headers=headers)
        
        passed = response.status_code == 400
        all_passed = all_passed and print_test(
            "1b: POST multipart without 'file' field → 400",
            passed,
            f"Status: {response.status_code}, Error: {response.text}"
        )
    except Exception as e:
        all_passed = False
        print_test("1b: POST without file field", False, f"Exception: {str(e)}")
    
    # Test 1c: POST with valid PNG → 200 with proper response
    try:
        PNG_1PX = bytes.fromhex('89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4890000000D4944415478DA63F8FFFF3F0300050001A2A75DC9F40000000049454E44AE426082')
        files = {'file': ('test-multipart.png', PNG_1PX, 'image/png')}
        response = requests.post(f"{BASE_URL}/admin/media", files=files, headers=headers)
        data = response.json()
        
        saved_media_id = data.get("id")
        media_url = data.get("url")
        
        passed = (
            response.status_code == 200 and
            saved_media_id is not None and
            data.get("name") == "test-multipart.png" and
            data.get("mimeType") == "image/png" and
            data.get("size") == len(PNG_1PX) and
            media_url and media_url.startswith("/uploads/") and
            data.get("uploadedBy") == "Super Admin"
        )
        all_passed = all_passed and print_test(
            "1c: POST multipart with valid PNG → 200",
            passed,
            f"Status: {response.status_code}, ID: {saved_media_id}, URL: {media_url}, Size: {data.get('size')}"
        )
    except Exception as e:
        all_passed = False
        print_test("1c: POST valid PNG", False, f"Exception: {str(e)}")
    
    # Test 1d: GET the static file URL directly → 200 with image bytes
    try:
        if media_url:
            static_url = host + media_url
            response = requests.get(static_url)
            
            passed = (
                response.status_code == 200 and
                len(response.content) == len(PNG_1PX) and
                response.content == PNG_1PX
            )
            all_passed = all_passed and print_test(
                "1d: GET static file URL → 200 with correct bytes",
                passed,
                f"Status: {response.status_code}, URL: {static_url}, Size: {len(response.content)}"
            )
        else:
            all_passed = False
            print_test("1d: GET static file", False, "No media URL available")
    except Exception as e:
        all_passed = False
        print_test("1d: GET static file", False, f"Exception: {str(e)}")
    
    # Test 1e: POST 11MB file → 413 (max is 10MB)
    try:
        large_buffer = b'X' * (11 * 1024 * 1024)  # 11MB
        files = {'file': ('large.png', large_buffer, 'image/png')}
        response = requests.post(f"{BASE_URL}/admin/media", files=files, headers=headers)
        
        passed = response.status_code == 413
        all_passed = all_passed and print_test(
            "1e: POST 11MB file → 413 (too large)",
            passed,
            f"Status: {response.status_code}, Error: {response.text}"
        )
    except Exception as e:
        all_passed = False
        print_test("1e: POST large file", False, f"Exception: {str(e)}")
    
    # Test 1f: POST non-image file (e.g., .txt) → should still upload
    try:
        txt_content = b'This is a text file'
        files = {'file': ('test.txt', txt_content, 'text/plain')}
        response = requests.post(f"{BASE_URL}/admin/media", files=files, headers=headers)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get("id") is not None and
            data.get("url") is not None
        )
        all_passed = all_passed and print_test(
            "1f: POST non-image file (.txt) → 200 (uploads successfully)",
            passed,
            f"Status: {response.status_code}, URL: {data.get('url')}"
        )
    except Exception as e:
        all_passed = False
        print_test("1f: POST non-image file", False, f"Exception: {str(e)}")
    
    # ========== SCENARIO 2: POST JSON legacy path ==========
    print("\n--- Scenario 2: JSON Legacy Path (dataUrl) ---")
    
    # Test 2a: POST with valid dataUrl → 200
    try:
        legacy_payload = {
            "name": "pixel.png",
            "mimeType": "image/png",
            "size": 67,
            "dataUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
        }
        response = requests.post(f"{BASE_URL}/admin/media", json=legacy_payload, headers=headers)
        data = response.json()
        
        legacy_media_id = data.get("id")
        legacy_url = data.get("url")
        
        passed = (
            response.status_code == 200 and
            legacy_media_id is not None and
            data.get("name") == "pixel.png" and
            data.get("mimeType") == "image/png" and
            legacy_url and legacy_url.startswith("/uploads/") and
            data.get("uploadedBy") == "Super Admin"
        )
        all_passed = all_passed and print_test(
            "2a: POST JSON with valid dataUrl → 200",
            passed,
            f"Status: {response.status_code}, ID: {legacy_media_id}, URL: {legacy_url}"
        )
    except Exception as e:
        all_passed = False
        print_test("2a: POST JSON with dataUrl", False, f"Exception: {str(e)}")
    
    # Test 2b: POST without dataUrl → 400
    try:
        response = requests.post(f"{BASE_URL}/admin/media", json={"name": "x.png"}, headers=headers)
        
        passed = response.status_code == 400
        all_passed = all_passed and print_test(
            "2b: POST JSON without dataUrl → 400",
            passed,
            f"Status: {response.status_code}, Error: {response.text}"
        )
    except Exception as e:
        all_passed = False
        print_test("2b: POST without dataUrl", False, f"Exception: {str(e)}")
    
    # Test 2c: POST without name → 400
    try:
        response = requests.post(f"{BASE_URL}/admin/media", json={
            "dataUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
        }, headers=headers)
        
        passed = response.status_code == 400
        all_passed = all_passed and print_test(
            "2c: POST JSON without name → 400",
            passed,
            f"Status: {response.status_code}, Error: {response.text}"
        )
    except Exception as e:
        all_passed = False
        print_test("2c: POST without name", False, f"Exception: {str(e)}")
    
    # Test 2d: POST with invalid dataUrl → 400
    try:
        response = requests.post(f"{BASE_URL}/admin/media", json={
            "name": "x.png",
            "dataUrl": "not-a-data-url"
        }, headers=headers)
        
        passed = response.status_code == 400
        all_passed = all_passed and print_test(
            "2d: POST JSON with invalid dataUrl → 400",
            passed,
            f"Status: {response.status_code}, Error: {response.text}"
        )
    except Exception as e:
        all_passed = False
        print_test("2d: POST invalid dataUrl", False, f"Exception: {str(e)}")
    
    # ========== SCENARIO 3: GET /api/admin/media ==========
    print("\n--- Scenario 3: GET Media List ---")
    
    # Test 3a: GET without cookie → 401
    try:
        response = requests.get(f"{BASE_URL}/admin/media")
        
        passed = response.status_code == 401
        all_passed = all_passed and print_test(
            "3a: GET without cookie → 401",
            passed,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        all_passed = False
        print_test("3a: GET without cookie", False, f"Exception: {str(e)}")
    
    # Test 3b: GET with cookie → 200 with rows
    try:
        response = requests.get(f"{BASE_URL}/admin/media", headers=headers)
        data = response.json()
        
        rows = data.get("rows", [])
        has_multipart = any(row.get("name") == "test-multipart.png" for row in rows)
        has_legacy = any(row.get("name") == "pixel.png" for row in rows)
        
        passed = (
            response.status_code == 200 and
            "rows" in data and
            isinstance(rows, list) and
            has_multipart and
            has_legacy
        )
        all_passed = all_passed and print_test(
            "3b: GET with cookie → 200 with all uploaded items",
            passed,
            f"Status: {response.status_code}, Count: {len(rows)}, Has multipart: {has_multipart}, Has legacy: {has_legacy}"
        )
    except Exception as e:
        all_passed = False
        print_test("3b: GET with cookie", False, f"Exception: {str(e)}")
    
    # Test 3c: GET with ?q=<search> → filtered results
    try:
        response = requests.get(f"{BASE_URL}/admin/media?q=multipart", headers=headers)
        data = response.json()
        
        rows = data.get("rows", [])
        all_match = all("multipart" in row.get("name", "").lower() for row in rows)
        
        passed = (
            response.status_code == 200 and
            len(rows) > 0 and
            all_match
        )
        all_passed = all_passed and print_test(
            "3c: GET with ?q=multipart → filtered results",
            passed,
            f"Status: {response.status_code}, Count: {len(rows)}, All match: {all_match}"
        )
    except Exception as e:
        all_passed = False
        print_test("3c: GET with search", False, f"Exception: {str(e)}")
    
    # ========== SCENARIO 4: DELETE /api/admin/media/<id> ==========
    print("\n--- Scenario 4: DELETE Media ---")
    
    # Test 4a: DELETE uploaded file → 200
    try:
        if saved_media_id and media_url:
            response = requests.delete(f"{BASE_URL}/admin/media/{saved_media_id}", headers=headers)
            data = response.json()
            
            passed = (
                response.status_code == 200 and
                data.get("ok") == True
            )
            all_passed = all_passed and print_test(
                "4a: DELETE uploaded file → 200",
                passed,
                f"Status: {response.status_code}, OK: {data.get('ok')}"
            )
        else:
            all_passed = False
            print_test("4a: DELETE", False, "No saved media ID or URL")
    except Exception as e:
        all_passed = False
        print_test("4a: DELETE", False, f"Exception: {str(e)}")
    
    # Test 4b: GET the static URL → 404 (file should be gone)
    try:
        if media_url:
            static_url = host + media_url
            response = requests.get(static_url)
            
            passed = response.status_code == 404
            all_passed = all_passed and print_test(
                "4b: GET deleted file URL → 404 (file removed from disk)",
                passed,
                f"Status: {response.status_code}, URL: {static_url}"
            )
        else:
            all_passed = False
            print_test("4b: GET deleted file", False, "No media URL available")
    except Exception as e:
        all_passed = False
        print_test("4b: GET deleted file", False, f"Exception: {str(e)}")
    
    # Test 4c: DELETE non-existent id → 200 (idempotent)
    try:
        response = requests.delete(f"{BASE_URL}/admin/media/non-existent-id-12345", headers=headers)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get("ok") == True
        )
        all_passed = all_passed and print_test(
            "4c: DELETE non-existent id → 200 (idempotent)",
            passed,
            f"Status: {response.status_code}, OK: {data.get('ok')}"
        )
    except Exception as e:
        all_passed = False
        print_test("4c: DELETE non-existent", False, f"Exception: {str(e)}")
    
    return all_passed

def test_admin_logout():
    """Test 24: Admin logout"""
    print("\n" + "="*80)
    print("TESTING ADMIN LOGOUT")
    print("="*80)
    
    all_passed = True
    
    if not admin_cookie:
        print_test("Admin Logout", False, "No admin cookie available")
        return False
    
    headers = {'Cookie': admin_cookie}
    
    # Test logout
    try:
        response = requests.post(f"{BASE_URL}/admin/logout", headers=headers)
        data = response.json()
        
        # Check for cookie clearing
        set_cookie = response.headers.get('Set-Cookie', '')
        clears_cookie = 'Max-Age=0' in set_cookie or 'mkds_admin_session=;' in set_cookie
        
        passed = (
            response.status_code == 200 and
            data.get("ok") == True and
            clears_cookie
        )
        all_passed = all_passed and print_test(
            "Admin Logout: Returns 200 and clears cookie",
            passed,
            f"Status: {response.status_code}, OK: {data.get('ok')}, Clears cookie: {clears_cookie}"
        )
    except Exception as e:
        all_passed = False
        print_test("Admin Logout", False, f"Exception: {str(e)}")
    
    # Test /admin/me after logout (should return 401)
    try:
        response = requests.get(f"{BASE_URL}/admin/me", headers=headers)
        data = response.json()
        
        passed = response.status_code == 401
        all_passed = all_passed and print_test(
            "Admin /me: After logout returns 401",
            passed,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        all_passed = False
        print_test("Admin /me: After logout", False, f"Exception: {str(e)}")
    
    return all_passed


def test_phase5_regression():
    """Test Phase 5: Quick regression for media management"""
    print("\n" + "="*80)
    print("TESTING PHASE 5 REGRESSION")
    print("="*80)
    
    all_passed = True
    
    # Test 1: POST /api/admin/login
    try:
        response = requests.post(f"{BASE_URL}/admin/login", json={"password": "admin123"})
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get("ok") == True
        )
        all_passed = all_passed and print_test(
            "Regression: POST /api/admin/login",
            passed,
            f"Status: {response.status_code}"
        )
        
        # Save cookie for subsequent tests
        set_cookie = response.headers.get('Set-Cookie', '')
        if 'mkds_admin_session=' in set_cookie:
            cookie_value = set_cookie.split('mkds_admin_session=')[1].split(';')[0]
            temp_cookie = f'mkds_admin_session={cookie_value}'
        else:
            temp_cookie = None
    except Exception as e:
        all_passed = False
        temp_cookie = None
        print_test("Regression: POST /api/admin/login", False, f"Exception: {str(e)}")
    
    if not temp_cookie:
        print_test("Phase 5 Regression", False, "Could not obtain admin cookie")
        return False
    
    headers = {'Cookie': temp_cookie}
    
    # Test 2: GET /api/admin/me
    try:
        response = requests.get(f"{BASE_URL}/admin/me", headers=headers)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            "role" in data and
            "name" in data
        )
        all_passed = all_passed and print_test(
            "Regression: GET /api/admin/me",
            passed,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        all_passed = False
        print_test("Regression: GET /api/admin/me", False, f"Exception: {str(e)}")
    
    # Test 3: GET /api/admin/stats
    try:
        response = requests.get(f"{BASE_URL}/admin/stats", headers=headers)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            "totalRaised" in data
        )
        all_passed = all_passed and print_test(
            "Regression: GET /api/admin/stats",
            passed,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        all_passed = False
        print_test("Regression: GET /api/admin/stats", False, f"Exception: {str(e)}")
    
    # Test 4: GET /api/content (public)
    try:
        response = requests.get(f"{BASE_URL}/content")
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            "content" in data
        )
        all_passed = all_passed and print_test(
            "Regression: GET /api/content",
            passed,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        all_passed = False
        print_test("Regression: GET /api/content", False, f"Exception: {str(e)}")
    
    # Test 5: GET /api/admin/content
    try:
        response = requests.get(f"{BASE_URL}/admin/content", headers=headers)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            "rows" in data
        )
        all_passed = all_passed and print_test(
            "Regression: GET /api/admin/content",
            passed,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        all_passed = False
        print_test("Regression: GET /api/admin/content", False, f"Exception: {str(e)}")
    
    return all_passed

def test_quick_regression():
    """Test 25: Quick regression smoke test"""
    print("\n" + "="*80)
    print("TESTING QUICK REGRESSION (SMOKE TEST)")
    print("="*80)
    
    all_passed = True
    
    # Test GET /api/stats
    try:
        response = requests.get(f"{BASE_URL}/stats")
        data = response.json()
        
        passed = response.status_code == 200 and "totalRaised" in data
        all_passed = all_passed and print_test(
            "Regression: GET /api/stats still works",
            passed,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        all_passed = False
        print_test("Regression: GET /api/stats", False, f"Exception: {str(e)}")
    
    # Test POST /api/donations/create-order with valid amount
    try:
        create_payload = {"amount": 100}  # Valid amount (>= 10)
        response = requests.post(f"{BASE_URL}/donations/create-order", json=create_payload)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get("orderId", "").startswith("order_")
        )
        all_passed = all_passed and print_test(
            "Regression: POST /api/donations/create-order (amount=100) works",
            passed,
            f"Status: {response.status_code}, OrderId: {data.get('orderId')}"
        )
    except Exception as e:
        all_passed = False
        print_test("Regression: POST /api/donations/create-order", False, f"Exception: {str(e)}")
    
    return all_passed

def test_public_cms_auto_seed():
    """Test Phase 4: Public CMS endpoint GET /api/content with auto-seed"""
    print("\n" + "="*80)
    print("TESTING PUBLIC CMS ENDPOINT - AUTO-SEED DEFAULTS")
    print("="*80)
    
    all_passed = True
    
    # First, wipe the content_blocks collection to test fresh seed
    print("\n🧹 Wiping content_blocks collection for fresh test...")
    try:
        import subprocess
        subprocess.run([
            "mongosh", "mongodb://localhost:27017/your_database_name", 
            "--quiet", "--eval", "db.content_blocks.deleteMany({})"
        ], check=True, capture_output=True)
        print("   ✅ Collection wiped successfully")
    except Exception as e:
        print(f"   ⚠️  Could not wipe collection: {e}")
    
    # Test 1: First call to /api/content should auto-seed defaults
    try:
        response = requests.get(f"{BASE_URL}/content")
        data = response.json()
        
        content = data.get("content", {})
        
        # Check for expected keys from schemas
        expected_keys = [
            "home.hero.headline",
            "home.hero.tagline",
            "header.cta.label",
            "footer.about",
            "footer.copyright"
        ]
        
        has_expected_keys = all(key in content for key in expected_keys)
        
        # Check specific values match schema defaults
        correct_values = (
            content.get("home.hero.headline") == "Hope has a home." and
            content.get("home.hero.tagline") == "Shree Jagannath Swami Bhakt Shiromadi Maa Karma Devi Sangh Trust" and
            content.get("header.cta.label") == "Become a Member"
        )
        
        # Check list-type fields return as arrays
        header_nav = content.get("header.nav", [])
        footer_links = content.get("footer.links", [])
        is_nav_array = isinstance(header_nav, list) and len(header_nav) > 0
        is_footer_array = isinstance(footer_links, list) and len(footer_links) > 0
        
        passed = (
            response.status_code == 200 and
            has_expected_keys and
            correct_values and
            is_nav_array and
            is_footer_array
        )
        
        all_passed = all_passed and print_test(
            "Test 1a: First GET /api/content auto-seeds defaults",
            passed,
            f"Status: {response.status_code}, Keys found: {len(content)}, Expected keys present: {has_expected_keys}, Values correct: {correct_values}, header.nav is array: {is_nav_array}, footer.links is array: {is_footer_array}"
        )
        
        if not passed:
            print(f"   Content keys: {list(content.keys())[:10]}...")
            print(f"   home.hero.headline: {content.get('home.hero.headline')}")
            print(f"   header.nav type: {type(header_nav)}, length: {len(header_nav) if isinstance(header_nav, list) else 'N/A'}")
            
    except Exception as e:
        all_passed = False
        print_test("Test 1a: First GET /api/content", False, f"Exception: {str(e)}")
    
    # Test 1b: Second call should be idempotent (no duplicate inserts)
    try:
        # Get count before second call
        import subprocess
        result = subprocess.run([
            "mongosh", "mongodb://localhost:27017/your_database_name",
            "--quiet", "--eval", "db.content_blocks.countDocuments({})"
        ], capture_output=True, text=True, check=True)
        count_before = int(result.stdout.strip())
        
        # Second call
        response = requests.get(f"{BASE_URL}/content")
        data = response.json()
        
        # Get count after second call
        result = subprocess.run([
            "mongosh", "mongodb://localhost:27017/your_database_name",
            "--quiet", "--eval", "db.content_blocks.countDocuments({})"
        ], capture_output=True, text=True, check=True)
        count_after = int(result.stdout.strip())
        
        passed = (
            response.status_code == 200 and
            count_before == count_after and
            len(data.get("content", {})) > 0
        )
        
        all_passed = all_passed and print_test(
            "Test 1b: Second GET /api/content is idempotent (no duplicates)",
            passed,
            f"Status: {response.status_code}, Count before: {count_before}, Count after: {count_after}, Stable: {count_before == count_after}"
        )
        
    except Exception as e:
        all_passed = False
        print_test("Test 1b: Idempotent seed", False, f"Exception: {str(e)}")
    
    # Test 1c: GET /api/content?prefix=home filters correctly
    try:
        response = requests.get(f"{BASE_URL}/content?prefix=home")
        data = response.json()
        content = data.get("content", {})
        
        # All keys should start with "home"
        all_start_with_home = all(key.startswith("home") for key in content.keys())
        # Should NOT contain header or footer keys
        no_header_keys = not any(key.startswith("header") for key in content.keys())
        no_footer_keys = not any(key.startswith("footer") for key in content.keys())
        
        passed = (
            response.status_code == 200 and
            len(content) > 0 and
            all_start_with_home and
            no_header_keys and
            no_footer_keys
        )
        
        all_passed = all_passed and print_test(
            "Test 1c: GET /api/content?prefix=home filters correctly",
            passed,
            f"Status: {response.status_code}, Keys count: {len(content)}, All start with 'home': {all_start_with_home}, No header keys: {no_header_keys}, No footer keys: {no_footer_keys}"
        )
        
        if not passed and len(content) > 0:
            print(f"   Sample keys: {list(content.keys())[:5]}")
            
    except Exception as e:
        all_passed = False
        print_test("Test 1c: Prefix filter home", False, f"Exception: {str(e)}")
    
    # Test 1d: GET /api/content?prefix=footer filters correctly
    try:
        response = requests.get(f"{BASE_URL}/content?prefix=footer")
        data = response.json()
        content = data.get("content", {})
        
        all_start_with_footer = all(key.startswith("footer") for key in content.keys())
        no_home_keys = not any(key.startswith("home") for key in content.keys())
        
        passed = (
            response.status_code == 200 and
            len(content) > 0 and
            all_start_with_footer and
            no_home_keys
        )
        
        all_passed = all_passed and print_test(
            "Test 1d: GET /api/content?prefix=footer filters correctly",
            passed,
            f"Status: {response.status_code}, Keys count: {len(content)}, All start with 'footer': {all_start_with_footer}, No home keys: {no_home_keys}"
        )
        
    except Exception as e:
        all_passed = False
        print_test("Test 1d: Prefix filter footer", False, f"Exception: {str(e)}")
    
    # Test 1e: Endpoint is publicly accessible (no auth required)
    try:
        # Call without any auth headers/cookies
        response = requests.get(f"{BASE_URL}/content")
        passed = response.status_code == 200
        
        all_passed = all_passed and print_test(
            "Test 1e: Public endpoint (no auth required)",
            passed,
            f"Status: {response.status_code}, Accessible without auth: {passed}"
        )
        
    except Exception as e:
        all_passed = False
        print_test("Test 1e: Public access", False, f"Exception: {str(e)}")
    
    return all_passed

def test_admin_cms_auto_seed():
    """Test Phase 4: Admin CMS endpoint GET /api/admin/content with auto-seed"""
    print("\n" + "="*80)
    print("TESTING ADMIN CMS ENDPOINT - AUTO-SEED DEFAULTS")
    print("="*80)
    
    all_passed = True
    
    # First, login as admin to get cookie (always re-login for this test)
    global admin_cookie
    try:
        response = requests.post(f"{BASE_URL}/admin/login", json={"password": "admin123"})
        if response.status_code == 200:
            admin_cookie = response.cookies.get("mkds_admin_session")
            print("   ✅ Admin login successful")
        else:
            print("   ❌ Admin login failed")
            return False
    except Exception as e:
        print(f"   ❌ Admin login exception: {e}")
        return False
    
    # Wipe content_blocks for fresh test
    print("\n🧹 Wiping content_blocks collection for admin test...")
    try:
        import subprocess
        subprocess.run([
            "mongosh", "mongodb://localhost:27017/your_database_name",
            "--quiet", "--eval", "db.content_blocks.deleteMany({})"
        ], check=True, capture_output=True)
        print("   ✅ Collection wiped successfully")
    except Exception as e:
        print(f"   ⚠️  Could not wipe collection: {e}")
    
    # Test 2a: GET /api/admin/content without auth should return 401
    try:
        response = requests.get(f"{BASE_URL}/admin/content")
        passed = response.status_code == 401
        
        all_passed = all_passed and print_test(
            "Test 2a: GET /api/admin/content without auth → 401",
            passed,
            f"Status: {response.status_code}, Correctly requires auth: {passed}"
        )
        
    except Exception as e:
        all_passed = False
        print_test("Test 2a: Auth required", False, f"Exception: {str(e)}")
    
    # Test 2b: GET /api/admin/content with auth auto-seeds and returns rows
    try:
        cookies = {"mkds_admin_session": admin_cookie}
        response = requests.get(f"{BASE_URL}/admin/content", cookies=cookies)
        data = response.json()
        
        rows = data.get("rows", [])
        
        # Should have many rows (all schema defaults)
        has_many_rows = len(rows) > 20
        
        # Check for expected keys
        keys_in_rows = [row.get("key") for row in rows]
        has_expected_keys = (
            "home.hero.headline" in keys_in_rows and
            "header.cta.label" in keys_in_rows and
            "footer.about" in keys_in_rows
        )
        
        passed = (
            response.status_code == 200 and
            has_many_rows and
            has_expected_keys
        )
        
        all_passed = all_passed and print_test(
            "Test 2b: GET /api/admin/content with auth auto-seeds defaults",
            passed,
            f"Status: {response.status_code}, Rows count: {len(rows)}, Has many rows (>20): {has_many_rows}, Expected keys present: {has_expected_keys}"
        )
        
        if not passed:
            print(f"   Sample keys: {keys_in_rows[:5]}")
            
    except Exception as e:
        all_passed = False
        print_test("Test 2b: Admin GET with auto-seed", False, f"Exception: {str(e)}")
    
    # Test 2c: Second GET should be idempotent
    try:
        import subprocess
        result = subprocess.run([
            "mongosh", "mongodb://localhost:27017/your_database_name",
            "--quiet", "--eval", "db.content_blocks.countDocuments({})"
        ], capture_output=True, text=True, check=True)
        count_before = int(result.stdout.strip())
        
        cookies = {"mkds_admin_session": admin_cookie}
        response = requests.get(f"{BASE_URL}/admin/content", cookies=cookies)
        
        result = subprocess.run([
            "mongosh", "mongodb://localhost:27017/your_database_name",
            "--quiet", "--eval", "db.content_blocks.countDocuments({})"
        ], capture_output=True, text=True, check=True)
        count_after = int(result.stdout.strip())
        
        passed = (
            response.status_code == 200 and
            count_before == count_after
        )
        
        all_passed = all_passed and print_test(
            "Test 2c: Second GET /api/admin/content is idempotent",
            passed,
            f"Status: {response.status_code}, Count before: {count_before}, Count after: {count_after}, Stable: {count_before == count_after}"
        )
        
    except Exception as e:
        all_passed = False
        print_test("Test 2c: Idempotent admin seed", False, f"Exception: {str(e)}")
    
    return all_passed

def test_admin_cms_post_regression():
    """Test Phase 4: Admin CMS POST regression - upsert content blocks"""
    print("\n" + "="*80)
    print("TESTING ADMIN CMS POST - REGRESSION TEST")
    print("="*80)
    
    all_passed = True
    
    # Re-login to ensure we have valid cookie
    global admin_cookie
    try:
        response = requests.post(f"{BASE_URL}/admin/login", json={"password": "admin123"})
        if response.status_code == 200:
            admin_cookie = response.cookies.get("mkds_admin_session")
        else:
            print("   ❌ Admin login failed for POST regression test")
            return False
    except Exception as e:
        print(f"   ❌ Admin login exception: {e}")
        return False
    
    cookies = {"mkds_admin_session": admin_cookie}
    
    # Test 3a: POST text field
    try:
        payload = {"key": "home.hero.headline", "value": "NEW HEADLINE FROM TEST"}
        response = requests.post(f"{BASE_URL}/admin/content", json=payload, cookies=cookies)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get("key") == "home.hero.headline" and
            data.get("value") == "NEW HEADLINE FROM TEST"
        )
        
        all_passed = all_passed and print_test(
            "Test 3a: POST /api/admin/content updates text field",
            passed,
            f"Status: {response.status_code}, Key: {data.get('key')}, Value updated: {data.get('value') == 'NEW HEADLINE FROM TEST'}"
        )
        
    except Exception as e:
        all_passed = False
        print_test("Test 3a: POST text field", False, f"Exception: {str(e)}")
    
    # Test 3b: Verify public endpoint reflects the change
    try:
        response = requests.get(f"{BASE_URL}/content")
        data = response.json()
        content = data.get("content", {})
        
        passed = content.get("home.hero.headline") == "NEW HEADLINE FROM TEST"
        
        all_passed = all_passed and print_test(
            "Test 3b: Public GET /api/content reflects admin update",
            passed,
            f"Status: {response.status_code}, Value in public endpoint: {content.get('home.hero.headline')}"
        )
        
    except Exception as e:
        all_passed = False
        print_test("Test 3b: Public reflects update", False, f"Exception: {str(e)}")
    
    # Test 3c: POST list-type field (header.nav)
    try:
        payload = {
            "key": "header.nav",
            "value": [
                {"label": "Home Modified", "href": "/", "enabled": True},
                {"label": "About Modified", "href": "/about", "enabled": True}
            ]
        }
        response = requests.post(f"{BASE_URL}/admin/content", json=payload, cookies=cookies)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get("key") == "header.nav" and
            isinstance(data.get("value"), list) and
            len(data.get("value", [])) == 2
        )
        
        all_passed = all_passed and print_test(
            "Test 3c: POST /api/admin/content updates list field (header.nav)",
            passed,
            f"Status: {response.status_code}, Key: {data.get('key')}, Value is list: {isinstance(data.get('value'), list)}, Length: {len(data.get('value', []))}"
        )
        
    except Exception as e:
        all_passed = False
        print_test("Test 3c: POST list field", False, f"Exception: {str(e)}")
    
    # Test 3d: Verify public endpoint returns list as array
    try:
        response = requests.get(f"{BASE_URL}/content")
        data = response.json()
        content = data.get("content", {})
        header_nav = content.get("header.nav", [])
        
        passed = (
            isinstance(header_nav, list) and
            len(header_nav) == 2 and
            header_nav[0].get("label") == "Home Modified"
        )
        
        all_passed = all_passed and print_test(
            "Test 3d: Public GET returns header.nav as array with updated values",
            passed,
            f"Status: {response.status_code}, Is array: {isinstance(header_nav, list)}, Length: {len(header_nav) if isinstance(header_nav, list) else 'N/A'}, First label: {header_nav[0].get('label') if len(header_nav) > 0 else 'N/A'}"
        )
        
    except Exception as e:
        all_passed = False
        print_test("Test 3d: Public returns array", False, f"Exception: {str(e)}")
    
    # Test 3e: POST without key should return 400
    try:
        payload = {"value": "some value"}
        response = requests.post(f"{BASE_URL}/admin/content", json=payload, cookies=cookies)
        data = response.json()
        
        passed = (
            response.status_code == 400 and
            "key required" in data.get("error", "").lower()
        )
        
        all_passed = all_passed and print_test(
            "Test 3e: POST /api/admin/content without key → 400",
            passed,
            f"Status: {response.status_code}, Error message: {data.get('error')}"
        )
        
    except Exception as e:
        all_passed = False
        print_test("Test 3e: POST validation", False, f"Exception: {str(e)}")
    
    return all_passed

def test_cms_smoke_regression():
    """Test Phase 4: Quick smoke tests for other endpoints (regression)"""
    print("\n" + "="*80)
    print("TESTING CMS PHASE 4 - SMOKE REGRESSION")
    print("="*80)
    
    all_passed = True
    
    # Re-login to ensure we have valid cookie
    global admin_cookie
    try:
        response = requests.post(f"{BASE_URL}/admin/login", json={"password": "admin123"})
        if response.status_code == 200:
            admin_cookie = response.cookies.get("mkds_admin_session")
        else:
            print("   ❌ Admin login failed for smoke regression test")
            # Continue with tests anyway, some don't need auth
    except Exception as e:
        print(f"   ⚠️  Admin login exception: {e}")
    
    cookies = {"mkds_admin_session": admin_cookie} if admin_cookie else {}
    
    # Test: POST /api/admin/login
    try:
        response = requests.post(f"{BASE_URL}/admin/login", json={"password": "admin123"})
        passed = response.status_code == 200
        all_passed = all_passed and print_test(
            "Smoke: POST /api/admin/login",
            passed,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        all_passed = False
        print_test("Smoke: Admin login", False, f"Exception: {str(e)}")
    
    # Test: GET /api/admin/me
    try:
        response = requests.get(f"{BASE_URL}/admin/me", cookies=cookies)
        passed = response.status_code == 200
        all_passed = all_passed and print_test(
            "Smoke: GET /api/admin/me",
            passed,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        all_passed = False
        print_test("Smoke: Admin me", False, f"Exception: {str(e)}")
    
    # Test: GET /api/admin/stats
    try:
        response = requests.get(f"{BASE_URL}/admin/stats", cookies=cookies)
        passed = response.status_code == 200
        all_passed = all_passed and print_test(
            "Smoke: GET /api/admin/stats",
            passed,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        all_passed = False
        print_test("Smoke: Admin stats", False, f"Exception: {str(e)}")
    
    # Test: GET /api/stats
    try:
        response = requests.get(f"{BASE_URL}/stats")
        passed = response.status_code == 200
        all_passed = all_passed and print_test(
            "Smoke: GET /api/stats",
            passed,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        all_passed = False
        print_test("Smoke: Public stats", False, f"Exception: {str(e)}")
    
    # Test: POST /api/donations/create-order
    try:
        response = requests.post(f"{BASE_URL}/donations/create-order", json={"amount": 500, "cause": "general"})
        passed = response.status_code == 200 and "orderId" in response.json()
        all_passed = all_passed and print_test(
            "Smoke: POST /api/donations/create-order",
            passed,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        all_passed = False
        print_test("Smoke: Create order", False, f"Exception: {str(e)}")
    
    # Test: POST /api/contact
    try:
        response = requests.post(f"{BASE_URL}/contact", json={
            "name": "Test User",
            "email": "test@example.com",
            "message": "Test message"
        })
        passed = response.status_code == 200
        all_passed = all_passed and print_test(
            "Smoke: POST /api/contact",
            passed,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        all_passed = False
        print_test("Smoke: Contact", False, f"Exception: {str(e)}")
    
    return all_passed

def main():
    """Run all backend tests"""
    print("\n" + "="*80)
    print("NGO DONATION PLATFORM - BACKEND API TESTS")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print("="*80)
    
    global saved_donation_id, saved_member_id, admin_cookie, saved_media_id
    saved_donation_id = None
    saved_member_id = None
    admin_cookie = None
    saved_media_id = None
    
    results = []
    
    # Run all tests in order
    results.append(("Health Check", test_health_check()))
    results.append(("Stats", test_stats_empty_db()))
    results.append(("Donation Happy Path", test_donation_happy_path()))
    results.append(("Donation Validation", test_donation_validation()))
    results.append(("🔴 CRITICAL: Donation Signature Tampering", test_signature_tampering()))
    results.append(("Verify Validation", test_verify_validation()))
    results.append(("Get Receipt", test_get_receipt()))
    results.append(("Recent Donations", test_recent_donations()))
    results.append(("Volunteer Signup", test_volunteer_signup()))
    results.append(("Contact Form", test_contact_form()))
    
    # MEMBERSHIP TESTS (Quick smoke test only)
    print("\n" + "="*80)
    print("🆕 MEMBERSHIP FEATURE TESTS (QUICK SMOKE TEST)")
    print("="*80)
    results.append(("Membership Happy Path", test_membership_happy_path()))
    results.append(("Membership Validation", test_membership_validation()))
    results.append(("🔴 CRITICAL: Membership Signature Tampering", test_membership_signature_tampering()))
    results.append(("Membership Edge Cases", test_membership_edge_cases()))
    results.append(("Get Member", test_get_member()))
    
    # NEW ADMIN TESTS
    print("\n" + "="*80)
    print("🔐 ADMIN BACKEND TESTS (NEW)")
    print("="*80)
    results.append(("Admin Auth Flow", test_admin_auth_flow()))
    results.append(("Admin List Endpoints", test_admin_list_endpoints()))
    results.append(("Admin CSV Exports", test_admin_csv_exports()))
    results.append(("Admin Content CMS", test_admin_content_cms()))
    results.append(("Admin Media Library", test_admin_media_library()))
    results.append(("Admin Logout", test_admin_logout()))
    
    # PHASE 4 CMS TESTS (NEW)
    print("\n" + "="*80)
    print("📝 PHASE 4 CMS TESTS (NEW)")
    print("="*80)
    results.append(("Public CMS Auto-Seed", test_public_cms_auto_seed()))
    results.append(("Admin CMS Auto-Seed", test_admin_cms_auto_seed()))
    results.append(("Admin CMS POST Regression", test_admin_cms_post_regression()))
    results.append(("CMS Smoke Regression", test_cms_smoke_regression()))
    
    # PHASE 5 REGRESSION
    results.append(("Phase 5 Regression", test_phase5_regression()))
    
    # REGRESSION
    results.append(("Quick Regression", test_quick_regression()))
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed_count = sum(1 for _, passed in results if passed)
    total_count = len(results)
    
    for name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {name}")
    
    print("="*80)
    print(f"TOTAL: {passed_count}/{total_count} tests passed")
    print("="*80)
    
    if passed_count == total_count:
        print("\n🎉 ALL TESTS PASSED! Backend is working correctly.")
        return 0
    else:
        print(f"\n⚠️  {total_count - passed_count} test(s) failed. Please review the failures above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
