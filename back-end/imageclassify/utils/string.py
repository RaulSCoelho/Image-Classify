import re
from django.core.exceptions import ValidationError

def validate_int_list(value):
    # Check if the value is a string containing comma-separated numbers
    pattern = r'^\d+(,\s*\d+)*$'  # Pattern for integers

    if not re.match(pattern, value):
        raise ValidationError('Invalid format. Please provide comma-separated integers.')

def validate_float_list(value):
    # Check if the value is a string containing comma-separated numbers
    pattern = r'^\d+(\.\d+)?(,\s*\d+(\.\d+)?)*$'  # Pattern for floats

    if not re.match(pattern, value):
        raise ValidationError('Invalid format. Please provide comma-separated numbers.')

def parse_str_list(string, type=float):
    return list(map(type, string.replace(' ', '').split(',')))
