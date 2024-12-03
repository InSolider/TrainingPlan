from django.conf import settings
import joblib

# Function for loading the local RFR model
def load_model():
    return joblib.load(settings.RFR_MODEL_PATH)

# Function for prediction using the loaded model
def predict(features_df):
    model = load_model()
    prediction = model.predict(features_df)
    return prediction[0]
