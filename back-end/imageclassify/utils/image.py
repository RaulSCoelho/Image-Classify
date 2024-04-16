from .env import env
from PIL import Image
from django.core.exceptions import ValidationError

def compress_and_save_image(instance, filename):
    image = Image.open(instance.image.path)

    max_width = env('MAX_IMAGE_WIDTH', 1024, int)  # Default 1024px
    max_height = env('MAX_IMAGE_HEIGHT', 768, int)  # Default 768px
    max_file_size = env('MAX_IMAGE_SIZE', 5242880, int)  # Default 5MB in bytes

    # Validate image size
    if image.size[0] > max_width or image.size[1] > max_height:
        # Resize while maintaining aspect ratio
        image.thumbnail((max_width, max_height), Image.ANTIALIAS)

    # Adjust compression quality dynamically based on validation
    if image.size[0] * image.size[1] * image.getbands()[0] > max_file_size:
        quality = 80  # Start with a decent quality
        while image.size[0] * image.size[1] * image.getbands()[0] > max_file_size:
            quality -= 5  # Reduce quality in steps of 5 until file size is below limit
            if quality < 50:  # Set a minimum quality threshold
                raise ValidationError('Image exceeds size limit. Please upload a smaller image.')
            image.save(instance.image.path, optimize=True, quality=quality)
    else:
        image.save(instance.image.path, optimize=True, quality=95)  # Save at high quality if within size limit

    return filename
