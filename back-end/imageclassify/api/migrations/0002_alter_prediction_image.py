# Generated by Django 5.0.4 on 2024-04-11 05:18

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="prediction",
            name="image",
            field=models.FileField(upload_to="images/"),
        ),
    ]