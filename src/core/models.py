from django.db import models


class ColorPalette(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()
    colors = models.ManyToManyField("Color")


class Color(models.Model):
    name = models.CharField(max_length=50)
    rgb_value = models.CharField(
        max_length=7
    )  # Store RGB values as strings (e.g., "#RRGGBB")
