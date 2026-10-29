from .models import Student, Subject, Mark,Exam, Teacher,TeacherSubjectClass, Class, Role, TeacherSubjectClass
from rest_framework import serializers

class SubjectSerializer(serializers.ModelSerializer):
    # marks = MarksStudentsSerializer(many=True, read_only=True)
    class Meta:
        model = Subject
        fields = ("id", "sub")
        
class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = "__all__"

class MarksSerializer(serializers.ModelSerializer):
    # student_name = serializers.SerializerMethodField()
    # subject = serializers.CharField(source='subject.sub')
    exam = ExamSerializer()
    subject = SubjectSerializer()

    class Meta:
        model = Mark
        fields = ("student","exam", "subject", "score")

    def get_student_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}"
    


class ClassSerializer(serializers.ModelSerializer):
    # marks = MarksStudentsSerializer(many=True, read_only=True)
    class Meta:
        model = Class
        fields = ("id", "grade", "division")


class MarksStudentsSerializer(serializers.ModelSerializer):
    # student_name = serializers.SerializerMethodField()
    # subject = serializers.CharField(source='subject.sub')
    exam = ExamSerializer()
    subject = SubjectSerializer()

    class Meta:
        model = Mark
        fields = ("subject", "exam", "score")

    def get_student_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}"


class StudentDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ("id", "first_name", "surname", "roll_no", "class_div")


class StudentMarksSerializer(serializers.ModelSerializer):
    marks = MarksStudentsSerializer(many=True, read_only=True)
    class_div = ClassSerializer()

    class Meta:
        model = Student
        fields = ("id", "first_name", "surname",
                  "roll_no", "class_div", "marks")


class RoleSerializer(serializers.ModelSerializer):
    # marks = MarksStudentsSerializer(many=True, read_only=True)
    class Meta:
        model = Role
        fields = ("id", "role")








class TSCSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer()
    classes = ClassSerializer(many=True)
    class Meta:
        model = TeacherSubjectClass
        fields = ("id", "subject", "classes")


class TeacherSerializer(serializers.ModelSerializer):
    role = RoleSerializer()
    subject_classes = TSCSerializer(many=True)
    class_tr = ClassSerializer()
    username = serializers.CharField(source="user.username",read_only=True,
    allow_null=True)
    password = serializers.CharField(source="user.password",read_only=True,
    allow_null=True)
    # marks = MarksStudentsSerializer(many=True, read_only=True)

    class Meta:
        model = Teacher
        fields = ("id", "first_name", "surname",
                  "subject_classes", "role", "class_tr", "username", "password")
        
class SubjectClassInputSerializer(serializers.Serializer):
    subject = serializers.CharField()
    classes = serializers.CharField()

class CreateUpdateTeacherSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    surname = serializers.CharField()
    role = serializers.CharField()
    class_tr = serializers.CharField(required=False)
    username = serializers.CharField(required=False)
    password = serializers.CharField(required=False, allow_blank=True)
    subjects = SubjectClassInputSerializer(many=True)
    
class ExcelDataSerializerOne(serializers.Serializer):
    # first_name = 
    no = serializers.IntegerField()
    first_name = serializers.CharField()
    surname = serializers.CharField()
    subjects = serializers.ListField(
        child=serializers.CharField()
    )
    
class ExcelDataSerializerSheet(serializers.Serializer):
    # first_name = 
    class_name = serializers.CharField()
    excel_data = ExcelDataSerializerOne(many=True)
    
class ExcelDataSerializer(serializers.Serializer):
    # sheet_N
    sheets = ExcelDataSerializerSheet(many=True)