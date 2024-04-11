import torch
from torchvision import transforms
from utils.classification import classify, read_model, read_classes
from rest_framework import generics
from .models import Prediction
from .serializers import PredictionSerializer

class PredictionListCreate(generics.ListCreateAPIView):
    queryset = Prediction.objects.all()
    serializer_class = PredictionSerializer

    def perform_create(self, serializer: PredictionSerializer):
        # Read the image file and convert it to binary data
        image = self.request.FILES['image']

        serializer.save(prediction=predict_car(image))

class PredictionRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Prediction.objects.all()
    serializer_class = PredictionSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer: PredictionSerializer):
        # Read the image file and convert it to binary data
        image = self.request.FILES['image']

        serializer.save(prediction=predict_car(image))

def predict_car(image):
    mean = [0.4708, 0.4602, 0.4550]
    std = [0.2593, 0.2584, 0.2634]

    prediction = classify(
        read_model('https://images-classify.s3.amazonaws.com/models/cars/best_cars_model.pth'),
        image,
        transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(torch.Tensor(mean), torch.Tensor(std))
        ]),
        read_classes('https://images-classify.s3.amazonaws.com/models/cars/classes.csv')
    )

    return prediction
