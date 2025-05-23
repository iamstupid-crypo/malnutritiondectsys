from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np

app = Flask(__name__)
CORS(app)

# Load your trained MobileNetV2 model
model = load_model('malnutrition_mobilenetv2_final.keras')

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get uploaded image and form data
        image = request.files['image']
        age = request.form.get('age')
        weight = request.form.get('weight')

        # Validate inputs
        if not age or not weight:
            return jsonify({"error": "Missing age or weight"}), 400

        age = float(age)
        weight = float(weight)

        # Rule-based check
        healthy_threshold = 2 * (age + 5)
        rule_based_label = "Healthy" if weight >= healthy_threshold else "Malnourished"
        
        # Preprocess image for model prediction
        img = Image.open(image).convert('RGB')
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Predict using model
        prediction = model.predict(img_array)[0][0]
        image_label = "Malnourished" if prediction > 0.5 else "Healthy"
        confidence = float(prediction) if prediction > 0.5 else float(1 - prediction)

        # Final result: Malnourished if either model or rule says so
        final_label = "Malnourished" if image_label == "Malnourished" or rule_based_label == "Malnourished" else "Healthy"
       
        # Diet Recommendation Logic
        recommendation = ""
        message = ""
        
        # Check if there's a contradiction between the model's image prediction and rule-based check
        if final_label == "Healthy" and rule_based_label == "Malnourished":
            message = "⚠️ The child appears healthy based on the image, but is underweight according to the weight criteria. It's important to monitor their growth and ensure they receive adequate nutrition."
        
        # Malnourished conditions
        elif final_label == "Malnourished":
            if age <= 0.5:  # 0 to 6 months
                recommendation = "Ensure exclusive breastfeeding on demand, day and night. Consult a pediatrician if weight gain is not observed."
            elif age <= 2:  # 6 months to 2 years
                recommendation = "Introduce complementary foods rich in nutrients like mashed fruits, lentils, and iron-rich cereals along with breastfeeding."
            else:  # Above 2 years
                recommendation = "Provide a balanced diet with proteins, carbohydrates, vitamins, and minerals. Prioritize nutrient-dense foods like eggs, dairy, leafy greens, and pulses."
        else:
            recommendation = "Maintain a balanced diet to ensure healthy growth."

        # Return all details as JSON
        return jsonify({
            "label": final_label,
            "confidence": round(confidence * 100, 2),
            "image_label": image_label,
            "rule_label": rule_based_label,
            "age": age,
            "weight": weight,
            "recommendation": recommendation,
            "message": message  # Include the new message
        })

    except Exception as e:
        print("Prediction Error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
