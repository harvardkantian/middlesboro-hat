from django.urls import path, include
from .views import home_view

urlpatterns = [
    path('', home_view, name="home"),
    path('teachers', home_view, name="teachers"),
    path('login', home_view, name="login"),
    path('mk-ta', home_view, name="mk-ta"),
]