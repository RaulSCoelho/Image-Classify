from rest_framework import generics
from .models import Prediction
from .serializers import PredictionSerializer

class PredictionListCreate(generics.ListCreateAPIView):
    queryset = Prediction.objects.all()
    serializer_class = PredictionSerializer

    def perform_create(self, serializer: PredictionSerializer):
        prediction = 'predicted_label'
        serializer.save(prediction=prediction)

class PredictionRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Prediction.objects.all()
    serializer_class = PredictionSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer: PredictionSerializer):
        prediction = 'predicted_label'
        serializer.save(prediction=prediction)
