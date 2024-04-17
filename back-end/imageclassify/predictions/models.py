from django.db import models
from ai_models.models import AIModel
from utils.image import compress_image

def prediction_image_upload_path(instance, filename):
    model_name = instance.model.name.replace(' ', '_')
    return f'models/{model_name}/predictions/{filename}'

# Create your models here.
class Prediction(models.Model):
    model = models.ForeignKey(AIModel, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=prediction_image_upload_path)
    label = models.CharField(max_length=100, blank=True)
    prediction = models.CharField(max_length=100, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['uploaded_at']

    def __str__(self):
        return self.prediction

    def save(self, *args, **kwargs):
        # Generate prediction using the associated AIModel
        self.image = compress_image(self.image)
        self.prediction = self.model.predict(self.image)
        super().save(*args, **kwargs)
