from django.db import models
from translitua import translit, UkrainianKMU
from tinymce.models import HTMLField
import re

# Model for the Exercises table
class Exercise(models.Model):
    name_ukr = models.CharField(verbose_name='Назва українською', unique=True, max_length=100)
    name_eng = models.CharField(verbose_name='Назва англійською', unique=True, max_length=100)
    link = models.CharField(verbose_name='Посилання на вправу', unique=True, max_length=100)
    desc = HTMLField(verbose_name='Опис вправи')

    def save(self, *args, **kwargs):
        self.link = translit(self.name_ukr, UkrainianKMU).lower()
        self.link = re.sub(r'[^a-z0-9]+', '-', self.link)
        self.link = self.link.strip('-')
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.name_ukr}'

    class Meta:
        db_table = 'Exercises'
        verbose_name = 'вправу'
        verbose_name_plural = 'Вправи'
