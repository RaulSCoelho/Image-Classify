from rest_framework import generics
from .models import Prediction
from .serializers import PredictionSerializer

class PredictionListCreate(generics.ListCreateAPIView):
    queryset = Prediction.objects.all()
    serializer_class = PredictionSerializer

class PredictionRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Prediction.objects.all()
    serializer_class = PredictionSerializer
    lookup_field = 'pk'
