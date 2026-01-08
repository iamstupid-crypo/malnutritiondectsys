from flask import Flask, request, jsonify, render_template, redirect, url_for, session
from flask_cors import CORS
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np

# ======================
# App setup
# ======================
app = Flask(__name__)
app.secret_key = "root0123"
CORS(app)


model = load_model("malnutrition_mobilenetv2_final.keras")

# ======================
# Routes
# ======================

@app.route("/")
def home():
    if "user" not in session:
        return redirect(url_for("login"))
    return render_template("index_new.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        # Demo credentials
        if username == "admin" and password == "root0123":
            session["user"] = username
            return redirect(url_for("home"))

        return render_template("login.html", error="Invalid credentials")

    return render_template("login.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


@app.route("/predict", methods=["POST"])
def predict():
    try:
        # -------- Inputs --------
        age = request.form.get("age")
        weight = request.form.get("weight")
        image = request.files.get("image")

        if not age or not weight or not image:
            return jsonify({"error": "Missing age, weight, or image"}), 400

        age = float(age)
        weight = float(weight)

        # -------- Rule-based check --------
        healthy_threshold = 2 * (age + 5)
        rule_label = "Healthy" if weight >= healthy_threshold else "Malnourished"

        # -------- Image preprocessing --------
        img = Image.open(image).convert("RGB")
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # -------- Model prediction --------
        pred =float(model.predict(img_array)[0][0])
        image_label = "Malnourished" if pred > 0.5 else "Healthy"
        confidence = float(pred if pred > 0.5 else (1 - pred))

        # -------- Final decision --------
        final_label = (
            "Healthy"
    if image_label == "Healthy" and rule_label == "Healthy"
    else "Malnourished"
)
        # -------- Recommendation --------
        message = ""
        if final_label == "Healthy" and rule_label == "Malnourished":
            message = (
                "⚠️ Image suggests healthy appearance, but weight is below standard."
            )

        if final_label == "Malnourished":
            if age <= 0.5:
                recommendation = "Exclusive breastfeeding recommended."
            elif age <= 2:
                recommendation = "Introduce nutrient-rich complementary foods."
            else:
                recommendation = "Provide balanced diet with proteins and micronutrients."
        else:
            recommendation = "Maintain a balanced nutritious diet."

        # -------- Response --------
        return jsonify({
            "status": "success",
            "label": final_label,
            "confidence": round(confidence * 100, 2),
            "image_label": image_label,
            "rule_label": rule_label,
            "age": age,
            "weight": weight,
            "recommendation": recommendation,
            "message": message
        })

    except Exception as e:
        print("Prediction error:", e)
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(debug=True)

