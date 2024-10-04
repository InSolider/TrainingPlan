from django.urls import path
from . import views

urlpatterns = [
    path('', views.HomeView.as_view(), name='home'),
    path('vpravy/', views.AllExercisesView.as_view(), name='exercises'),
    path('vpravy/<str:link>/', views.SpecificExerciseView.as_view(), name='exercise'),
]