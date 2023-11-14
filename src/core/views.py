from django.shortcuts import render
from django.views.generic import TemplateView, ListView, CreateView, DetailView

from .models import *


class HomeView(TemplateView):
    """Explains the purpose of the app and displays call-to-action buttons"""

    template_name = "core/home.html"


class ColorsListView(ListView):
    """View all named colours in the database"""

    model = Color
    template_name = "core/colors.html"
    context_object_name = "colors"


class CreatePaletteView(CreateView):
    """Create a single palette based on key colours"""

    template_name = "core/create-palette.html"


class PaletteDetailView(DetailView):
    """View a selected palette in multiple contexts"""

    template_name = "core/explore-palette.html"


class WebStandardsView(TemplateView):
    """View used to assess the"""
