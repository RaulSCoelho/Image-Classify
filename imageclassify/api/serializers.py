from rest_framework import serializers
from .models import Prediction

class PredictionSerializer(serializers.ModelSerializer):
    label = serializers.CharField(read_only=True)
    prediction = serializers.CharField(read_only=True)
    uploaded_at = serializers.CharField(read_only=True)

    class Meta:
        model = Prediction
        fields = ['id', 'image', 'label', 'prediction', 'uploaded_at']
