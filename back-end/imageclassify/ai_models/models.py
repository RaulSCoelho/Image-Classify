import torch
from django.db import models
from torchvision import transforms
from utils.string import parse_str_list, validate_float_list, validate_int_list
from utils.classification import classify, read_classes, read_model
from utils.validation import validate_model_extension, validate_classes_file

def upload_path(instance, filename):
    return f'models/{instance.name}/{filename}'

# Create your models here.
class AIModel(models.Model):
    name = models.CharField(max_length=100)
    model_file = models.FileField(upload_to=upload_path, validators=[validate_model_extension])
    classes_file = models.FileField(upload_to=upload_path, validators=[validate_classes_file])
    resize = models.CharField(max_length=100, default='224, 224', validators=[validate_int_list])
    mean = models.CharField(max_length=100, default='0.4708, 0.4602, 0.4550', validators=[validate_float_list])
    std = models.CharField(max_length=100, default='0.2593, 0.2584, 0.2634', validators=[validate_float_list])

    def __str__(self):
        return self.name

    def predict(self, image):
        model = read_model(self.model_file.url)
        classes = read_classes(self.classes_file.url)
        resize = parse_str_list(self.resize, int)
        mean = parse_str_list(self.mean)
        std = parse_str_list(self.std)
        transform = transforms.Compose([
            transforms.Resize(resize),
            transforms.ToTensor(),
            transforms.Normalize(torch.Tensor(mean), torch.Tensor(std))
        ])

        return classify(image, model, transform, classes)
