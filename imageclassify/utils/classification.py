import torch
import pandas as pd
from PIL import Image
from typing import List
from torchvision import transforms

def read_model(model_path: str) -> torch.nn.Module:
    return torch.load(model_path)

def read_classes(classes_path: str, col_name: str = 'Class') -> List[str]:
    classes_df = pd.read_csv(classes_path)
    return classes_df[col_name].values

def classify(model: torch.nn.Module, image_path: str, image_transforms: transforms.Compose, classes: List[str]):
    model = model.eval()

    image = Image.open(image_path)
    image_transformed = image_transforms(image).float()
    image_transformed = image_transformed.unsqueeze(0)

    output = model(image_transformed)
    _, predicted = torch.max(output.data, 1)

    return classes[predicted.item()]
