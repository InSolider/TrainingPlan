from django.conf import settings
import joblib

def load_model():
    return joblib.load(settings.RFR_MODEL_PATH)

def predict(features_df):
    model = load_model()
    prediction = model.predict(features_df)
    return prediction[0]
