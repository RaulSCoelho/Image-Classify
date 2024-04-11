from django.urls import path
from . import views

urlpatterns = [
    path("predictions/", views.PredictionListCreate.as_view(), name="prediction-list-create"),
    path("predictions/<int:pk>/", views.PredictionRetrieveUpdateDestroy.as_view(), name="prediction-retrieve-update-destroy"),
]
