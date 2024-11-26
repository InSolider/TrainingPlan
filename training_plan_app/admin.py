from django.contrib import admin
from .models import Exercise

@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ['name', 'link']
    fields = ['name', 'link', 'desc']
    readonly_fields = ['link']
