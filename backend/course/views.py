from django.views.generic import ListView
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action

from .serializers import CourseSerializer, UserSerializer
from .models import Course, CustomUser


class CourseListView(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]

    # Search function
    @action(detail=False, methods=['get'])
    def search(self, request):
        search_term = request.query_params.get('q')
        if not search_term:
            return Response([])
        queryset = self.queryset.filter(title__icontains=search_term)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class UsersListView(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
