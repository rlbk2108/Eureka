# Generated by Django 4.1.5 on 2023-03-13 17:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0008_alter_course_author_allusercourses_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='courses',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='course.allusercourses'),
        ),
    ]
