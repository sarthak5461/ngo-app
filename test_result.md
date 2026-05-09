#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  Build a modern NGO web application for "Shree Jagannath Swami Bhakt Shiromadi Maa Karma Devi Sangh Trust"
  using Next.js, focused on Education, Disaster Relief and Environment with Trust Blue theme.
  MVP Phase 1: Public NGO website + Donation flow with mocked Razorpay (real HMAC SHA-256 signature
  verification pattern), receipt generation, MongoDB persistence, contact form, volunteer signup, live stats.

backend:
  - task: "GET /api/stats — public live impact stats"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Aggregates donations collection. Returns totalRaised, donationCount, donorCount, volunteerCount, projectsCount, livesImpacted. Should work with empty collections (returns zeros + sensible base numbers)."
        - working: true
          agent: "testing"
          comment: "✅ PASSED. GET /api/stats returns 200 with all required fields: totalRaised, donationCount, donorCount, volunteerCount, projectsCount, livesImpacted. Works correctly with empty database (returns zeros and base numbers)."

  - task: "POST /api/donations/create-order — start donation flow"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Validates amount >= 10 INR, creates an orderId of form 'order_<uuid>', stores in donation_orders collection with status='created', returns {orderId, amount, currency:'INR', keyId, mock:true}."
        - working: true
          agent: "testing"
          comment: "✅ PASSED. POST /api/donations/create-order correctly validates minimum amount (rejects < 10 with 400), creates orderId starting with 'order_', returns proper response with amount, currency:INR, keyId, mock:true. Default cause='general' works when not provided."

  - task: "POST /api/donations/mock-pay — mock Razorpay checkout simulator"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Looks up donation_orders by orderId, generates a paymentId 'pay_<uuid>', computes HMAC SHA-256 signature over '<orderId>|<paymentId>' using mock secret. Returns {orderId, paymentId, signature}. Demonstrates the exact pattern Razorpay returns to the client."
        - working: true
          agent: "testing"
          comment: "✅ PASSED. POST /api/donations/mock-pay correctly looks up order, generates paymentId starting with 'pay_', computes HMAC SHA-256 signature (64 hex chars), returns {orderId, paymentId, signature}. Returns 404 for non-existent orders."

  - task: "POST /api/donations/verify — server-side signature verification + persist donation"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: |
            Critical endpoint. Recomputes HMAC SHA-256 server-side and uses crypto.timingSafeEqual.
            On valid signature: persists donation with receipt number (MKDS/<year>/<rand>), returns full donation doc.
            On invalid signature: persists a failed record + returns 400 'Payment signature verification failed'.
            Test scenarios:
              1. Happy path: create-order -> mock-pay -> verify with returned signature => 200 success.
              2. Tampered signature: send a wrong signature => 400 with verification failure error.
              3. Missing fields => 400.
              4. Unknown orderId => 404.
        - working: true
          agent: "testing"
          comment: "✅ PASSED ALL SCENARIOS. 🔴 CRITICAL TEST CONFIRMED: Signature verification using HMAC SHA-256 + crypto.timingSafeEqual works perfectly. (1) Valid signature: returns 200 with donation, receiptNumber (MKDS/2026/...), status='success'. (2) Tampered signature (replaced with '0'*64): correctly REJECTS with 400 'Payment signature verification failed'. (3) Missing fields: returns 400. (4) Unknown orderId: returns 404. Security verification is production-ready."

  - task: "GET /api/donations/receipt/:id — fetch existing receipt"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Fetch donation by id (uuid). Returns 404 if not found."
        - working: true
          agent: "testing"
          comment: "✅ PASSED. GET /api/donations/receipt/:id correctly returns donation with receiptNumber for valid ID (200), returns 404 for non-existent ID."

  - task: "GET /api/donations/recent — anonymised list for social proof"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "low"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Returns last 8 successful donations with only firstName + amount + cause + createdAt."
        - working: true
          agent: "testing"
          comment: "✅ PASSED. GET /api/donations/recent returns 200 with array of anonymised donations containing firstName, amount, cause, createdAt. Works with empty DB (returns empty array) and populated DB."

  - task: "POST /api/volunteer — volunteer signup"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Requires name and email. Saves to volunteers collection. Returns the created volunteer doc."
        - working: true
          agent: "testing"
          comment: "✅ PASSED. POST /api/volunteer correctly validates required fields (name, email), returns 400 when missing. Happy path returns 200 with success:true and volunteer document."

  - task: "POST /api/contact — contact form submission"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Requires name, email, message. Saves to contact_messages collection."
        - working: true
          agent: "testing"
          comment: "✅ PASSED. POST /api/contact correctly validates required fields (name, email, message), returns 400 'All fields are required' when missing. Happy path returns 200 with success:true and contact document."

frontend:
  - task: "NGO public homepage UI"
    implemented: true
    working: "NA"
    file: "/app/app/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Single-page site with hero, about, programs (Education/Disaster Relief/Environment), live impact stats, gallery, testimonials, volunteer form, contact form, footer. Trust Blue theme with amber CTAs. Frontend testing not requested yet."

  - task: "Donation Dialog (multi-step)"
    implemented: true
    working: "NA"
    file: "/app/app/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "3-step flow: form (cause/amount/donor) -> mock Razorpay confirm -> receipt with print button. Frontend testing not requested yet."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 1
  run_ui: false

test_plan:
  current_focus:
    - "POST /api/donations/create-order — start donation flow"
    - "POST /api/donations/mock-pay — mock Razorpay checkout simulator"
    - "POST /api/donations/verify — server-side signature verification + persist donation"
    - "GET /api/stats — public live impact stats"
    - "POST /api/volunteer — volunteer signup"
    - "POST /api/contact — contact form submission"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
    - agent: "main"
      message: |
        Phase 1 MVP built. Please test the donation pipeline end-to-end:
          1. POST /api/donations/create-order { amount: 1500, cause: 'education' } -> capture orderId.
          2. POST /api/donations/mock-pay { orderId } -> capture paymentId + signature.
          3. POST /api/donations/verify { orderId, paymentId, signature, donor:{name,email,phone,pan,message} } -> expect 200 + donation with receiptNumber.
          4. Tamper test: re-send /verify with signature='bad' -> expect 400.
          5. Test GET /api/stats, POST /api/volunteer, POST /api/contact (validation errors and happy path).
        Note: This is fully MOCKED Razorpay (no real keys); the HMAC verification path is real and is the production code path.
    - agent: "testing"
      message: |
        ✅ BACKEND TESTING COMPLETE - ALL TESTS PASSED (10/10)
        
        Comprehensive backend testing completed successfully. All endpoints working correctly:
        
        🔴 CRITICAL TEST CONFIRMED:
        - HMAC SHA-256 signature verification is PRODUCTION-READY
        - Valid signatures are accepted correctly
        - Tampered signatures are properly REJECTED with 400 error
        - Uses crypto.timingSafeEqual for constant-time comparison (prevents timing attacks)
        
        ✅ All Backend Endpoints Tested:
        1. GET /api/ - Health check working
        2. GET /api/stats - Returns all required fields, works with empty DB
        3. POST /api/donations/create-order - Validation working, orderId generation correct
        4. POST /api/donations/mock-pay - Generates valid HMAC signatures
        5. POST /api/donations/verify - Signature verification working perfectly (CRITICAL)
        6. GET /api/donations/receipt/:id - Fetches receipts correctly, 404 for invalid
        7. GET /api/donations/recent - Returns anonymised donations
        8. POST /api/volunteer - Validation and persistence working
        9. POST /api/contact - Validation and persistence working
        
        Test file: /app/backend_test.py (can be re-run anytime)
        
        NO ISSUES FOUND. Backend is production-ready for Phase 1 MVP.
