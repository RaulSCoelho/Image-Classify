from rest_framework import status
from rest_framework.response import Response
from rest_framework import generics
from .models import Prediction
from .serializers import PredictionSerializer, PredictionCreateSerializer

class PredictionListCreate(generics.ListCreateAPIView):
    queryset = Prediction.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PredictionCreateSerializer
        return PredictionSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        # Serialize the created instance using PredictionSerializer
        instance = serializer.instance
        response_serializer = PredictionSerializer(instance)
        headers = self.get_success_headers(response_serializer.data)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class PredictionRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Prediction.objects.all()
    serializer_class = PredictionSerializer
    lookup_field = 'pk'
