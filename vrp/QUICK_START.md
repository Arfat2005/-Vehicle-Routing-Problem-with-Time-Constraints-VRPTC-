# 🚀 Quick Start - 2 Easy Steps!

## Step 1: Start the Backend

Double-click the file:
```
start_backend.bat
```

Or in terminal:
```bash
cd "c:\Users\Ujjwal Pandey\Desktop\vrp"
start_backend.bat
```

Wait for the message: `Uvicorn running on http://0.0.0.0:8000`

**✅ Keep this window open!**

---

## Step 2: Start the Frontend

Open a **NEW** terminal/command prompt and double-click:
```
start_frontend.bat
```

Or in terminal:
```bash
cd "c:\Users\Ujjwal Pandey\Desktop\vrp"
start_frontend.bat
```

The browser will automatically open at `http://localhost:3000`

**✅ Keep this window open too!**

---

## 🎯 Quick Test (2 minutes)

### Add Your First Phlebotomist:
1. Fill in the "Add Phlebotomist" form (green):
   - **Name**: Sarah Johnson
   - **Latitude**: 28.7000
   - **Longitude**: 77.1000
   - **Gender**: Female
   - **Max Visits**: 5
2. Click **"Add Phlebotomist"**

### Add Your First Patient:
1. Fill in the "Add Patient" form (blue):
   - **Name**: Alice Williams
   - **Latitude**: 28.7041
   - **Longitude**: 77.1025
   - **Visit Time**: 09:00 (use the time picker)
   - **Gender Preference**: Any
2. Click **"Add Patient"**

### Add More Patients (Optional):
Repeat the patient form with different locations and times:

**Patient 2**:
- Name: Bob Smith
- Lat: 28.6900, Lng: 77.0950
- Time: 11:00
- Preference: Any

**Patient 3**:
- Name: Carol Davis
- Lat: 28.7150, Lng: 77.1150
- Time: 14:00
- Preference: Female Only ⚠️ (This will ensure Carol is assigned to Sarah!)

### Run Optimization:
1. Click the big green **"Optimize Assignments"** button
2. See the results below showing:
   - ✅ Which phlebotomist visits which patients
   - ✅ Visit times (sorted chronologically)
   - ✅ Distance for each visit (in km)
   - ✅ Total distance traveled
   - ✅ Gender constraints respected!

---

## 📍 Sample Locations (Delhi, India)

You can use these coordinates for testing:

| Location | Latitude | Longitude |
|----------|----------|-----------|
| Central Delhi | 28.7041 | 77.1025 |
| South Delhi | 28.6139 | 77.2090 |
| North Delhi | 28.7503 | 77.1190 |
| East Delhi | 28.6517 | 77.2219 |
| West Delhi | 28.6692 | 77.0953 |

---

## 🎨 Key Features to Try

1. **Gender Constraints**:
   - Add a male and female phlebotomist
   - Add patients with "Female Only" preference
   - Watch the optimizer respect the constraint!

2. **Multiple Visits**:
   - Add 8-10 patients
   - Add 2 phlebotomists
   - See how visits get distributed (max 5 per phlebotomist)

3. **Distance Optimization**:
   - Add patients in different areas
   - See how the optimizer minimizes total travel distance

4. **Unassigned Patients**:
   - Add 3 patients all with "Female Only" preference
   - Add only 1 female phlebotomist with max 2 visits
   - 1 patient will be unassigned (shown in warning)

---

## ⚠️ Troubleshooting

**Backend won't start?**
- Make sure Python 3.8+ is installed: `python --version`
- Try: `pip install --upgrade pip`

**Frontend won't start?**
- Make sure Node.js is installed: `node --version`
- Delete `node_modules` folder and run `start_frontend.bat` again

**Port already in use?**
- Backend (8000): Kill the process or restart your computer
- Frontend (3000): It will ask to use port 3001 (press Y)

**Can't add patients/phlebotomists?**
- Check the backend terminal - is it running?
- Make sure you see "Uvicorn running on http://0.0.0.0:8000"

---

## 🛑 Stopping the Application

1. In backend window: Press `Ctrl+C`
2. In frontend window: Press `Ctrl+C`
3. Close both terminal windows

---

## 📚 Want More Details?

- Full documentation: See **README.md**
- Detailed setup: See **SETUP_GUIDE.md**
- API testing: Visit http://localhost:8000/docs (when backend is running)

**Enjoy optimizing! 🎉**
