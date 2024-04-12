import os
import pandas as pd
from django.core.exceptions import ValidationError

def validate_model_extension(value):
    valid_extensions = ['.pt', '.pth']
    ext = os.path.splitext(value.name)[1]
    if ext.lower() not in valid_extensions:
        raise ValidationError('Invalid model file extension. Must be .pt or .pth.')

def validate_classes_file(value):
    try:
        df = pd.read_csv(value)
        if len(df.columns) != 1 or df.columns[0] != 'Class':
            raise ValidationError('Invalid format for classes file. Must be a CSV with a single column named "Class".')
    except pd.errors.ParserError:
        raise ValidationError('Invalid CSV file.')
