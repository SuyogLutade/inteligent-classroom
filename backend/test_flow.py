import urllib.request
import urllib.error
import json

BASE_URL = "http://127.0.0.1:8000"

def make_request(path, method="GET", data=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    req_data = json.dumps(data).encode("utf-8") if data else None
    
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as res:
            return res.status, json.loads(res.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        try:
            err_data = json.loads(e.read().decode("utf-8"))
        except:
            err_data = e.reason
        return e.code, err_data

def run_tests():
    print("=== STARTING VERIFICATION TESTS ===")
    
    # 1. Health check
    status, body = make_request("/health")
    assert status == 200, f"Health check failed: {status}"
    print("OK - Health check ok")

    # 2. Login verification
    status, body = make_request("/api/auth/login", "POST", {"email": "admin@smartclass.edu", "password": "admin123"})
    assert status == 200, f"Admin login failed: {status}"
    assert body["user"]["role"] == "admin", "Admin role mismatch"
    print("OK - Admin login validation ok")

    # 3. Fetch stats
    status, body = make_request("/api/dashboard/admin")
    assert status == 200, f"Admin stats failed: {status}"
    print(f"OK - Admin stats retrieved. Students count: {body['totalStudents']}")

    # 4. Create class
    cls_payload = {
        "id": "cls-test",
        "name": "CSE-D",
        "section": "D",
        "batch": "2022-26",
        "department_id": "dept-1",
        "semester": 6,
        "class_teacher_id": "t-1"
    }
    status, body = make_request("/api/classes", "POST", cls_payload)
    print("Create class response:", body)
    assert status == 200 or status == 400, f"Class creation failed: {status}"
    print("OK - Create Class validation ok")

    # 5. Enroll students
    enroll_payload = {"student_ids": ["stu-1", "stu-2"]}
    status, body = make_request("/api/classes/cls-test/students", "POST", enroll_payload)
    print("Enroll students response:", body)
    assert status == 200, f"Enrolling students failed: {status}"
    assert body["strength"] >= 2, "Strength update validation failed"
    print("OK - Enroll student to class ok")

    # 6. Schedule Timetable slot and verify conflict check
    slot_payload = {
        "class_id": "cls-test",
        "subject_id": "sub-1",
        "teacher_id": "t-1",
        "room_id": "room-1",
        "day": "Monday",
        "start_time": "09:00",
        "end_time": "10:00"
    }
    # Attempt to post a slot (may already exist or be created)
    status1, body1 = make_request("/api/timetable", "POST", slot_payload)
    
    # Try again to trigger double-booking conflict
    status2, body2 = make_request("/api/timetable", "POST", slot_payload)
    assert status2 == 400, f"Conflict check failed to reject booking: {status2}"
    print("OK - Conflict detection successfully rejected double booking")

    print("=== ALL TESTS PASSED SUCCESSFULLY ===")

if __name__ == "__main__":
    run_tests()
