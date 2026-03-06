from django.urls import path
import app.views as views

urlpatterns = [
    path("simple/", views.SimpleView.as_view(), name = "simple"),
    path("quick/", views.QuickView.as_view(), name = "quick"),
    path("list/", views.ListView.as_view(), name = "list"),
    path("split/", views.SplitView.as_view(), name = "simple"),
    path("ask/", views.AskView.as_view(), name = "ask"),
    path("", views.IndexView.as_view(), name = "index"),
    path("number/", views.GenerateNumberView.as_view(), name = "number"),
]
