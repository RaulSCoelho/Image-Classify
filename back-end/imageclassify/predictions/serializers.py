from rest_framework import serializers
from ai_models.serializers import AIModelSerializer
from ai_models.models import AIModel
from .models import Prediction

class PredictionSerializer(serializers.ModelSerializer):
    model = AIModelSerializer(read_only=True)
    image = serializers.ImageField(read_only=True)
    prediction = serializers.CharField(read_only=True)

    class Meta:
        model = Prediction
        fields = '__all__'

class PredictionCreateSerializer(serializers.ModelSerializer):
    model = serializers.PrimaryKeyRelatedField(queryset=AIModel.objects.all())

    class Meta:
        model = Prediction
        fields = ['model', 'image']
