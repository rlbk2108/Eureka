
from rest_framework.generics import ListCreateAPIView
from .serializers import CourseSerializer
from .models import Course

class CourseListView(ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
