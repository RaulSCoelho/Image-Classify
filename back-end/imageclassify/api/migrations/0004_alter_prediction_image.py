# Generated by Django 5.0.4 on 2024-04-11 06:51

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0003_alter_prediction_image"),
    ]

    operations = [
        migrations.AlterField(
            model_name="prediction",
            name="image",
            field=models.ImageField(upload_to=""),
        ),
    ]