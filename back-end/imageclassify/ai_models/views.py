from rest_framework import generics
from .models import AIModel
from .serializers import AIModelSerializer

class AIModelListCreate(generics.ListCreateAPIView):
    queryset = AIModel.objects.all()
    serializer_class = AIModelSerializer

class AIModelRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = AIModel.objects.all()
    serializer_class = AIModelSerializer
    lookup_field = 'pk'
