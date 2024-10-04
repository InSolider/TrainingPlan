from django.shortcuts import render
from django.views.generic.base import View
from .models import Exercise

# Handling requests to the homepage
class HomeView(View):
    def get(self, request):
        return render(request, "index.html")

# Handling requests to the all exercises page
class AllExercisesView(View):
    def get(self, request):
        all_exercises = Exercise.objects.all()
        return render(request, "all_exercises.html", {'all_exercises': all_exercises})

# Handling requests to the specific exercise page
class SpecificExerciseView(View):
    def get(self, request, link):
        specific_exercise = Exercise.objects.get(link=link)
        return render(request, 'specific_exercise.html', {'specific_exercise': specific_exercise})