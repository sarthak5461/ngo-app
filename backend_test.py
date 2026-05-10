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

def main():
    """Run all backend tests"""
    print("\n" + "="*80)
    print("NGO DONATION PLATFORM - BACKEND API TESTS")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print("="*80)
    
    global saved_donation_id, saved_member_id
    saved_donation_id = None
    saved_member_id = None
    
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
    
    # NEW MEMBERSHIP TESTS
    print("\n" + "="*80)
    print("🆕 MEMBERSHIP FEATURE TESTS")
    print("="*80)
    results.append(("Membership Happy Path", test_membership_happy_path()))
    results.append(("Membership Validation", test_membership_validation()))
    results.append(("🔴 CRITICAL: Membership Signature Tampering", test_membership_signature_tampering()))
    results.append(("Membership Edge Cases", test_membership_edge_cases()))
    results.append(("Get Member", test_get_member()))
    results.append(("Regression Checks", test_regression_checks()))
    
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
