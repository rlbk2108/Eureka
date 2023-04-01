from rest_framework import serializers
from .models import Course, CustomUser, Lesson, LessonBlock
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


class LessonBlockSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='block-detail')

    class Meta:
        model = LessonBlock
        fields = ['url', 'id', 'block_title', 'block_text', 'block_image']


class LessonSerializer(serializers.HyperlinkedModelSerializer):
    lesson_blocks = LessonBlockSerializer(required=True, many=True)

    # queryset = LessonBlock.objects.all()
    # lesson_blocks = LessonBlockSerializer()

    class Meta:
        model = Lesson
        depth = 1
        fields = ['url', 'lesson_title', 'lesson_description', 'lesson_blocks']


class CourseSerializer(serializers.HyperlinkedModelSerializer):
    author = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())

    class Meta:
        model = Course
        depth = 2
        fields = ['url', 'id', 'title', 'description', 'lessons', 'price', 'author', 'discount']

    def build_nested_field(self, field_name, relation_info, nested_depth):
        class NestedSerializer(serializers.ModelSerializer):
            class Meta:
                model = relation_info.related_model
                depth = nested_depth - 1
                exclude = ['course']

        field_class = NestedSerializer
        field_kwargs = get_nested_relation_kwargs(relation_info)

        return field_class, field_kwargs


    def create(self, validated_data):
        if int(validated_data['price']) > 50:
            validated_data['discount'] = str(float(validated_data['price']) / 30)
        else:
            validated_data['discount'] = 0

        course = Course.objects.create(**validated_data)

        return course