from django.urls import path

from . import views

urlpatterns = [
    path("", views.PredictionListCreate.as_view(), name="prediction-list-create"),
    path("<int:pk>/", views.PredictionRetrieveUpdateDestroy.as_view(), name="prediction-retrieve-update-destroy"),
]
