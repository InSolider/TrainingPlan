from django.shortcuts import render
from django.views.generic.base import View
from django.http import JsonResponse
from .models import Exercise
from .utils import predict
import pandas as pd

# Handling requests to the homepage
class HomeView(View):
    def get(self, request):
        return render(request, 'index.html')
    
    def post(self, request):
        gender = request.POST.get('gender')
        age = request.POST.get('age')
        height = request.POST.get('height')
        weight = request.POST.get('weight')
        duration = 60

        features = {
            'GenderCode': 0 if gender == 'male' else 1,
            'Age': int(age),
            'Height': int(height),
            'Weight': int(weight)
        }

        features_df = pd.DataFrame([features])

        predictions = []

        for i in range(1, 34):
            name = Exercise.objects.get(id=i)

            features_df['ExerciseID'] = i
            features_df['Duration'] = duration

            prediction = predict(features_df)

            predictions.append({
                'name': name,
                'duration': duration,
                'prediction': round(prediction)
            })

        return render(request, 'index.html', {'predictions': predictions})

class AllExercisesView(View):
    def get(self, request):
        if request.headers.get('Accept') == 'application/json':
            exercises = Exercise.objects.all().values('id', 'name', 'link')
            return JsonResponse(list(exercises), safe=False)
        else:
            return render(request, 'all_exercises.html')

# Handling requests to the specific exercise page
class SpecificExerciseView(View):
    def get(self, request, link):
        specific_exercise = Exercise.objects.get(link=link)
        return render(request, 'specific_exercise.html', {'specific_exercise': specific_exercise})