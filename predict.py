import numpy as np
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from PIL import Image
import os
import io
# Load the trained model
model = load_model('malnutrition_mobilenetv2_final.keras')
app = Flask(__name__)
def predict_image(image_path,age):
# Calculate the weight using the formula: weight = 2 * (age + 5)
    weight = 2 * (age + 5)
# Load and preprocess the image
    img = Image.open(image_path).convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0  # Normalize
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
# Make prediction
    prediction = model.predict(img_array)[0][0]
    label = "Malnourished" if prediction > 0.5 else "Healthy"
    confidence = prediction if prediction > 0.5 else 1 - prediction

    print(f"\nPrediction: {label}")
    print(f"Confidence: {confidence * 100:.2f}%")
    return label
@app.route('/predict', methods=['POST'])
def predict():
    # Get the image and age from the request
    file = request.files.get('file')  # File is being uploaded
    age = request.form.get('age')  # Get age from the form
    age = int(age) if age else 0

    # Save the uploaded image temporarily
    image_path = os.path.join("temp_image.jpg")
    file.save(image_path)
    
    # Predict the image
    label, confidence = predict_image(image_path, age)

    # Return the result as JSON
    return jsonify({
        "label": label,
        "confidence": confidence
    })


if __name__ == '__main__':
    app.run(debug=True)
# Run prediction on a sample image
# if __name__ == "__main__":
    # image_path = os.path.join("/Users/sanjaygairola/Desktop/minor_pro/test_images/When to start Solid foods for baby and Baby Feeding Schedule.jpeg") 
    # image_path2=os.path.join("/Users/sanjaygairola/Desktop/minor_pro/test_images/Screenshot 2025-04-17 at 8.21.28 PM.png")
    
    # # predict_image(image_path) 
    # # predict_image(image_path) #healthy
    # predict_image(image_path2) 
  
   

    
    
