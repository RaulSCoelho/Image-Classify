from rest_framework import serializers
from ai_models.serializers import AIModelSerializer
from .models import Prediction

class PredictionSerializer(serializers.ModelSerializer):
    model = AIModelSerializer()
    prediction = serializers.CharField(read_only=True)

    class Meta:
        model = Prediction
        fields = ['id', 'model', 'image', 'label', 'prediction', 'uploaded_at']
