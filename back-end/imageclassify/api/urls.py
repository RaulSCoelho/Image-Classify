from django.urls import path, include

urlpatterns = [
    path('predictions/', include('predictions.urls')),
]
