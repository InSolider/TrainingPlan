from django.urls import path
from .views import HomeView, AllExercisesView, SpecificExerciseView

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('vpravy/', AllExercisesView.as_view(), name='all_exercises'),
    path('vpravy/<str:link>/', SpecificExerciseView.as_view(), name='specific_exercise'),
]