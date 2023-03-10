from django.urls import path, include
from .views import *

urlpatterns = [
    path('', CourseListView.as_view(), name='post_list')
]