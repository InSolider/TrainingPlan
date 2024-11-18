from django.db import models
import re
from translitua import translit, UkrainianKMU
from tinymce.models import HTMLField

# Model for the table Exercises
class Exercise(models.Model):

    name = models.CharField(verbose_name='Назва', unique=True, max_length=100)
    link = models.CharField(verbose_name='Посилання', unique=True, max_length=100)
    desc = HTMLField(verbose_name='Опис')

    def save(self, *args, **kwargs):
        self.link = translit(self.name, UkrainianKMU).lower()
        self.link = re.sub(r'[^a-z0-9]+', '-', self.link)
        self.link = self.link.strip('-')
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.name}'

    class Meta:
        verbose_name = 'вправу'
        verbose_name_plural = 'Вправи'
