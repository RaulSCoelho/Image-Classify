from django.urls import path, include

urlpatterns = [
    path('models/', include('ai_models.urls')),
    path('predictions/', include('predictions.urls')),
]
