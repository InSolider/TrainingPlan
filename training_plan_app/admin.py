from django.contrib import admin
from .models import Exercise

# Access to the Exercises table from the admin area 
@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ['name_ukr', 'link']
    fields = ['name_ukr', 'name_eng', 'link', 'desc']
    readonly_fields = ['link']
