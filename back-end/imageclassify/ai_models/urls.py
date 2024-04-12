from django.urls import path

from . import views

urlpatterns = [
    path("", views.AIModelListCreate.as_view(), name="aimodel-list-create"),
    path("<int:pk>/", views.AIModelRetrieveUpdateDestroy.as_view(), name="aimodel-retrieve-update-destroy"),
]
