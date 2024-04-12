from django.contrib import admin
from .models import Prediction

class PredictionAdmin(admin.ModelAdmin):
    readonly_fields = ['prediction']

admin.site.register(Prediction, PredictionAdmin)
