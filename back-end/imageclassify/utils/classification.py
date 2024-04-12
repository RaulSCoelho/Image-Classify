import torch
import requests
from io import BytesIO
import pandas as pd
from PIL import Image
from typing import List
from torchvision import transforms

def read_model(url: str) -> torch.nn.Module:
    # Fetch model from URL
    response = requests.get(url)
    # Check if request was successful
    if response.status_code != 200:
        raise Exception(f"Failed to fetch model from {url}. Status code: {response.status_code}")

    # Load model from bytes-like object
    model_bytes = BytesIO(response.content)
    model = torch.load(model_bytes)

    return model

def read_classes(classes_path: str, col_name: str = 'Class') -> List[str]:
    classes_df = pd.read_csv(classes_path)
    return classes_df[col_name].values

def classify(image_path: str, model: torch.nn.Module, image_transforms: transforms.Compose, classes: List[str]):
    model = model.eval()

    image = Image.open(image_path)
    image_transformed = image_transforms(image).float()
    image_transformed = image_transformed.unsqueeze(0)

    output = model(image_transformed)
    _, predicted = torch.max(output.data, 1)

    return classes[predicted.item()]
