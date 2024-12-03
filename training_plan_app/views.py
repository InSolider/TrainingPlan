from django.shortcuts import render
from django.views.generic.base import View
from django.http import JsonResponse
from .models import Exercise
from .utils import predict
import pandas as pd

# Handling requests to the ukrainian homepage
class HomeUkrView(View):
    def get(self, request):
        return render(request, 'index_ukr.html')
    
    def post(self, request):
        gender = request.POST.get('gender')
        age = request.POST.get('age')
        height = request.POST.get('height')
        weight = request.POST.get('weight')
        duration = 60

        features = {
            'GenderCode': 0 if gender == 'male' else 1,
            'Age': age,
            'Height': height,
            'Weight': weight
        }
        features_df = pd.DataFrame([features])

        predictions = []

        for i in range(1, 34):
            exercise = Exercise.objects.get(id=i)

            features_df['ExerciseID'] = i
            features_df['Duration'] = duration

            prediction = predict(features_df)

            predictions.append({
                'name': exercise.name_ukr,
                'duration': duration,
                'prediction': round(prediction)
            })

        return render(request, 'index_ukr.html', {'predictions': predictions})

# Handling requests to the english homepage
class HomeEngView(View):
    def get(self, request):
        return render(request, 'index_eng.html')
    
    def post(self, request):
        gender = request.POST.get('gender')
        age = request.POST.get('age')
        height = request.POST.get('height')
        weight = request.POST.get('weight')
        duration = 60

        features = {
            'GenderCode': 0 if gender == 'male' else 1,
            'Age': age,
            'Height': height,
            'Weight': weight
        }
        features_df = pd.DataFrame([features])

        predictions = []

        for i in range(1, 34):
            exercise = Exercise.objects.get(id=i)

            features_df['ExerciseID'] = i
            features_df['Duration'] = duration

            prediction = predict(features_df)

            predictions.append({
                'name': exercise.name_eng,
                'duration': duration,
                'prediction': round(prediction)
            })

        return render(request, 'index_eng.html', {'predictions': predictions})

# Handling requests to the all exercises page
class AllExercisesView(View):
    def get(self, request):
        if request.headers.get('Accept') == 'application/json':
            exercises = Exercise.objects.all().values('name_ukr', 'link')
            return JsonResponse(list(exercises), safe=False)
        else:
            return render(request, 'all_exercises.html')

# Handling requests to the specific exercise page
class SpecificExerciseView(View):
    def get(self, request, link):
        specific_exercise = Exercise.objects.get(link=link)
        return render(request, 'specific_exercise.html', {'specific_exercise': specific_exercise})
