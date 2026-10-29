from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Student(models.Model):
    surname = models.CharField(max_length=100, blank=False)
    first_name = models.CharField(max_length=100, blank=False)
    roll_no = models.IntegerField(blank=False)
    class_div = models.ForeignKey(to="Class", on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.first_name} {self.surname}"


class Subject(models.Model):
    sub = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.sub}"

class Exam(models.Model):
    name = models.CharField(max_length=100)
    abbreviation = models.CharField(max_length=100)
    def __str__(self):
        return f"{self.name} ({self.abbreviation})"


class Mark(models.Model):
    student = models.ForeignKey(
        to=Student, on_delete=models.CASCADE, related_name="marks")
    exam = models.ForeignKey(to=Exam, on_delete=models.CASCADE, related_name="marks")
    subject = models.ForeignKey(to=Subject, on_delete=models.CASCADE)
    score = models.FloatField()


class Class(models.Model):
    grade = models.IntegerField()
    division = models.CharField(max_length=1)
    
    def __str__(self):
        return f"{self.grade}{self.division}"


class Role(models.Model):
    role = models.CharField(max_length=50)
    def __str__(self):
        return f"{self.role}"


class Teacher(models.Model):
    first_name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    # subject = models.ManyToManyField(to=Subject, null=True, blank=True)
    # sub_classes = models.ManyToManyField(to="Class", related_name="subject_classes", null=True, blank=True)
    role = models.ForeignKey(to=Role, on_delete=models.SET_NULL, null=True)
    class_tr = models.OneToOneField(to="Class", on_delete=models.SET_NULL, null=True, blank=True, related_name="class_tr")
    user = models.OneToOneField(to=User, on_delete=models.SET_NULL, null=True, related_name="profile")
    def __str__(self) -> str:
        return f"{self.first_name} {self.surname}"

class TeacherSubjectClass(models.Model):
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        related_name="subject_classes"
    )

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE
    )

    classes = models.ManyToManyField(
        "Class",
        # on_delete=models.CASCADE
    )