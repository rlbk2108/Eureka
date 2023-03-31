from rest_framework import serializers
from .models import Course, CustomUser
from rest_framework.utils.field_mapping import get_nested_relation_kwargs


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        depth = 1
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'courses']
        extra_kwargs = {'password': {'write_only': True},
                        'courses': {'read_only': True}}

    def build_nested_field(self, field_name, relation_info, nested_depth):
        class NestedSerializer(serializers.ModelSerializer):
            class Meta:
                model = relation_info.related_model
                depth = nested_depth - 1
                exclude = ['author']

        field_class = NestedSerializer
        field_kwargs = get_nested_relation_kwargs(relation_info)

        return field_class, field_kwargs


class CourseSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())

    class Meta:
        model = Course
        depth = 1
        fields = ['id', 'title', 'description', 'content', 'price', 'author']
