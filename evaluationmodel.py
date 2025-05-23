import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix, roc_curve, auc, precision_recall_curve
from tensorflow.keras.models import load_model
import tensorflow as tf

# Load model
model = load_model("malnutrition_mobilenetv2_final.keras")

# Load validation data
dataset_path = "/Users/sanjaygairola/Desktop/minor_pro/dataset"
img_size = 224
batch_size = 32

datagen = tf.keras.preprocessing.image.ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2
)

val_ds = datagen.flow_from_directory(
    dataset_path,
    target_size=(img_size, img_size),
    batch_size=batch_size,
    class_mode='binary',
    subset='validation',
    shuffle=False
)

# Predictions
y_pred_probs = model.predict(val_ds)
y_pred = (y_pred_probs > 0.5).astype(int).flatten()
y_true = val_ds.classes

# Confusion Matrix
cm = confusion_matrix(y_true, y_pred)
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=["Healthy", "Malnourished"], yticklabels=["Healthy", "Malnourished"])
plt.title("Confusion Matrix")
plt.xlabel("Predicted")
plt.ylabel("True")
plt.show()

# Classification Report
print(classification_report(y_true, y_pred, target_names=["Healthy", "Malnourished"]))

# ROC Curve
fpr, tpr, _ = roc_curve(y_true, y_pred_probs.ravel())
roc_auc = auc(fpr, tpr)
plt.plot(fpr, tpr, label=f"AUC = {roc_auc:.2f}")
plt.plot([0, 1], [0, 1], 'k--')
plt.title("ROC Curve")
plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")
plt.legend()
plt.show()

# Precision-Recall Curve
precision, recall, _ = precision_recall_curve(y_true, y_pred_probs.ravel())
plt.plot(recall, precision)
plt.title("Precision-Recall Curve")
plt.xlabel("Recall")
plt.ylabel("Precision")
plt.show()

# Class Distribution
sns.countplot(x=y_true)
plt.xticks([0, 1], ['Healthy', 'Malnourished'])
plt.title("Class Distribution in Validation Set")
plt.xlabel("Class")
plt.ylabel("Count")
plt.show()
