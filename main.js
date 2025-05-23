// Smooth scrolling for nav links (if using anchor links)
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Detection System Logic
document.addEventListener('DOMContentLoaded', () => {
    const detectionForm = document.getElementById('detectionform');
    const resultContainer = document.getElementById('result');

    detectionForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const age = document.getElementById('age').value.trim();
        const weight = document.getElementById('weight').value.trim();
        const image = document.getElementById('imageInput').files[0];

        if (!age || !weight || !image) {
            resultContainer.textContent = "⚠️ Please fill all fields and upload an image.";
            resultContainer.style.color = "red";
            return;
        }

        resultContainer.textContent = "🔍 Detecting malnutrition...";
        resultContainer.style.color = "#1976d2";

        const formData = new FormData();
        formData.append('image', image);
        formData.append('age', age);
        formData.append('weight', weight);

        try {
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                resultContainer.innerHTML = `
                    ✅ <strong>Status by weight factor:</strong> ${data.label}<br>
                    💯 <strong>Confidence:</strong> ${data.confidence}%<br>
                    🧠 <strong>AI Prediction:</strong> ${data.image_label}<br>
                    📏 <strong>Rule Check:</strong> ${data.rule_label}
                    🥗 <strong>Recommendation:</strong> ${data.recommendation}

                `;
                resultContainer.style.color = data.label === "Healthy" ? "green" : "red";
            } else {
                resultContainer.textContent = "❌ Error: " + (data.error || "Something went wrong.");
                resultContainer.style.color = "red";
            }
        } catch (error) {
            resultContainer.textContent = "❌ Network Error: " + error.message;
            resultContainer.style.color = "red";
        }
    });
});
