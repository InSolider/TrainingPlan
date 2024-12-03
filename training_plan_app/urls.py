from django.urls import path
from .views import HomeUkrView, HomeEngView, AllExercisesView, SpecificExerciseView

# URLs for different pages
urlpatterns = [
    path('', HomeUkrView.as_view(), name='home_ukr'),
    path('eng/', HomeEngView.as_view(), name='home_eng'),
    path('vpravy/', AllExercisesView.as_view(), name='all_exercises'),
    path('vpravy/<str:link>/', SpecificExerciseView.as_view(), name='specific_exercise'),
]
