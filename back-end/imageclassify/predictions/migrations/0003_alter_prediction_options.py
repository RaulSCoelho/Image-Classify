# Generated by Django 5.0.4 on 2024-04-17 00:32

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("predictions", "0002_prediction_model_alter_prediction_image"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="prediction",
            options={"ordering": ["uploaded_at"]},
        ),
    ]
