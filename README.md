# malnutritiondectsys
# 🥗 FeedHope – AI-Powered Malnutrition Detection System

FeedHope is a **hybrid AI + rule-based malnutrition detection system** designed to support early identification of child malnutrition, especially in **resource-limited and grassroots healthcare settings**.

This project combines **image-based deep learning** with **clinical rule checks** to ensure **safe, explainable, and reliable decisions**, avoiding over-reliance on a single signal.

---

## 🚩 Problem Statement

Conventional malnutrition screening methods such as **BMI** and **MUAC** often fail in real-world rural settings due to:

- Lack of trained healthcare workers  
- Broken or uncalibrated weighing scales  
- Inconsistent measurement practices  
- Manual data entry errors  

As a result, early signs of malnutrition are frequently missed.

---

## 💡 Solution Overview

FeedHope addresses these challenges by:

- Using **image-based AI inference** to reduce dependence on precise measurements  
- Combining it with **age–weight rule-based checks**  
- Applying a **safety-first AND-gate decision logic**

### 🔐 Decision Logic (Critical Design Choice)

> **Healthy** → only if  
> - AI image analysis = Healthy  
> - Weight-based rule = Healthy  

> **Malnourished** → if **either** check indicates risk  

This ensures the system **never falsely reassures** in borderline or contradictory cases.

---

## 🧠 System Architecture

**Frontend**
- Collects age, weight, and image
- Sends data to backend via REST API
- Displays explainable results and dietary recommendations

**Backend**
- Handles authentication and protected routes
- Runs AI inference and rule-based checks
- Returns structured, explainable JSON responses

**ML Model**
- MobileNetV2-based CNN trained on child nutrition images
- Optimized for lightweight deployment

---

## 🛠️ Tech Stack

### Frontend
- HTML5  
- CSS3  
- JavaScript (ES6)  
- Fetch API  

### Backend
- Python  
- Flask  
- Flask-CORS  
- Flask Sessions  

### Machine Learning
- TensorFlow / Keras  
- MobileNetV2  
- NumPy  
- Pillow (PIL)  

---

## 🔄 Workflow

1. User logs in (session-based authentication)
2. Uploads child image + age + weight
3. Backend performs:
   - Image-based AI prediction
   - Rule-based weight validation
   - AND-gate final decision
4. System returns:
   - Final nutrition status
   - Confidence score
   - AI & rule explanations
   - Diet recommendations

---

## 📊 Output Example

- **Final Status:** Malnourished  
- **AI Analysis:** Healthy  
- **Weight Check:** Malnourished  
- **Decision Reason:** Safety-first hybrid logic  
- **Recommendation:** Age-appropriate nutritional guidance  

---

## 🚀 How to Run Locally

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/feedhope.git
cd feedhope
