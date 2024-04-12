from rest_framework import serializers
from .models import AIModel

class AIModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIModel
        fields = ['id', 'name', 'model_file', 'classes_file', 'resize', 'mean', 'std']
