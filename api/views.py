from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Teacher, TeacherSubjectClass, Role, Class, Subject, Student, Mark, Exam
from .serializers import TeacherSerializer, TSCSerializer, CreateUpdateTeacherSerializer, ExcelDataSerializer, StudentMarksSerializer
from django.contrib.auth.models import User
from django.db import transaction

from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator

# Create your views here.

# /teacher


class HandleTeacher(APIView):
    # Get All Teachers
    serializer_class = TeacherSerializer

    def get(self, request, format=None):
        queryset = Teacher.objects.all()
        serializer_data = self.serializer_class(queryset, many=True)
        return Response(data=serializer_data.data, status=status.HTTP_200_OK)

    # Add Teacher
    create_serializer_class = CreateUpdateTeacherSerializer
    response_serializer_class = TeacherSerializer

    def post(self, request, format=None):
        serializer = self.create_serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response({"Error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)
        first_name = serializer.validated_data.get("first_name")
        surname = serializer.validated_data.get("surname")
        role = serializer.validated_data.get("role")
        class_tr = serializer.validated_data.get("class_tr")
        username = serializer.validated_data.get("username")
        password = serializer.validated_data.get("password")

        qs = User.objects.filter(username=username)
        if qs.exists():
            return Response({"Error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

        user = User(username=username)
        user.set_password(password)
        user.save()

        # convert class_tr like "10B" into [10, "B"]
        division = class_tr[-1] if class_tr != 'No' else None
        print(division)
        subjects = serializer.validated_data.get("subjects")
        role_obj = Role.objects.get(role=role)
        class_tr_obj = Class.objects.get(
            grade=10, division=division) if division else None
        teacher = Teacher(first_name=first_name,
                          surname=surname, role=role_obj, class_tr=class_tr_obj, user=user)
        teacher.save()
        for subject in subjects:
            print("hei", subject)
            sub_id = Subject.objects.get(
                sub=subject.get("subject") if isinstance(
                    subject, dict) else getattr(subject, "subject", None)
            )
            subject_class = (
                subject.get("classes") if isinstance(
                    subject, dict) else getattr(subject, "classes", None)
            )
            subject_class_letters = list(
                subject_class[2:]) if subject_class else []
            classes = [Class.objects.get(division=letter)
                       for letter in subject_class_letters]
            tsc = TeacherSubjectClass.objects.create(
                teacher=teacher, subject=sub_id)
            tsc.classes.set(classes)

        serialize_tr = self.response_serializer_class(teacher)
        return Response(data=serialize_tr.data, status=status.HTTP_201_CREATED)

# /teacher/id


class HandleTeacherIndividual(APIView):
    serializer_class = CreateUpdateTeacherSerializer
    response_serializer_class = TeacherSerializer
    # update teacher

    def patch(self, request, id, format=None):
        print("Hello", id, request)
        if not id:
            return Response({"Error": "ID Not Provided in Request"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response({"Error": "Invalid Data"}, status=status.HTTP_400_BAD_REQUEST)
        print("Hello", serializer.validated_data)

        teacher_qs = Teacher.objects.filter(id=id)
        if not teacher_qs.exists():
            return Response({"Error": "Teacher ID Does Not Exist"}, status=status.HTTP_404_NOT_FOUND)

        teacher = teacher_qs[0]
        print("Hello",  TeacherSerializer(teacher).data)
        first_name = serializer.validated_data.get("first_name")
        surname = serializer.validated_data.get("surname")
        role = serializer.validated_data.get("role")
        class_tr = serializer.validated_data.get("class_tr")
        subjects = serializer.validated_data.get("subjects")
        print("crno i belo", type(subjects))
        print("crno i belo", repr(subjects))
        print("jello", subjects, serializer.validated_data.keys())
        username = serializer.validated_data.get("username")
        password = serializer.validated_data.get("password")

        division = class_tr[-1] if class_tr != 'No' else None

        role_obj = Role.objects.get(role=role)
        class_tr_obj = Class.objects.get(
            grade=10, division=division) if division else None

        teacher.first_name = first_name
        teacher.surname = surname
        teacher.role = role_obj
        teacher.class_tr = class_tr_obj
        teacher.save(update_fields=(
            'first_name', 'surname', 'role', 'class_tr'))
        if username:
            user_qs = teacher.user
            print("booser", user_qs)
            # teacher.user may be a queryset/manager or a single User instance
            if user_qs is None:
                return Response({"Error": "User doesnt exist"})
            user = user_qs

            if password:
                user.username = username
                user.set_password(password)
                user.save(update_fields=["password", "username"])
            print("booser", username)

        # handling subjects
        new_subjects = []
        print("BEFORE LOOP")

        try:
            for subject in subjects:
                print("Hello", subject)
        except Exception as e:
            print("ERROR", repr(e))

        print("AFTER LOOP")
        for subject in subjects:
            print("Hello", subject)
            sub_obj = Subject.objects.get(
                sub=subject.get("subject") if isinstance(
                    subject, dict) else getattr(subject, "subject", None)
            )
            subject_class = (
                subject.get("classes") if isinstance(
                    subject, dict) else getattr(subject, "classes", None)
            )
            subject_class_letters = list(
                subject_class[2:]) if subject_class else []
            classes = [Class.objects.get(division=letter)
                       for letter in subject_class_letters]
            class_ids = tuple(sorted([cls.id for cls in classes]))
            new_subjects.append((sub_obj.id, class_ids, sub_obj, classes))

        old_tscs = TeacherSubjectClass.objects.filter(teacher=teacher)
        old_keys = set()
        old_map = {}
        for tsc_value in old_tscs:
            class_ids = tuple(
                sorted(tsc_value.classes.values_list("id", flat=True)))
            key = (tsc_value.subject.id, class_ids)
            old_keys.add(key)
            old_map.setdefault(key, []).append(tsc_value)

        new_keys = {(sub_id, class_ids)
                    for sub_id, class_ids, _, _ in new_subjects}

        to_delete = old_keys - new_keys
        to_add = new_keys - old_keys

        for key in to_delete:
            for tsc_value in old_map.get(key, []):
                tsc_value.delete()

        for sub_id, class_ids, sub_obj, classes in new_subjects:
            if (sub_id, class_ids) in to_add:
                tsc = TeacherSubjectClass.objects.create(
                    teacher=teacher, subject=sub_obj)
                tsc.classes.set(classes)

        serialize_tr = self.response_serializer_class(teacher)

        return Response(serialize_tr.data, status=status.HTTP_200_OK)

    def delete(self, request, id, format=None):
        teacher = Teacher.objects.get(id=id)
        teacher.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# auth


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CSRFView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"message": "CSRF cookie set"})


class LoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is None:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        login(request, user)

        return Response({
            "message": "Logged in",
            "username": user.username
        })


class LogoutView(APIView):

    def post(self, request):

        logout(request)

        return Response({
            "message": "Logged out"
        })


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        teacher = user.profile

        return Response({
            "id": teacher.id,
            "username": user.username,
            "first_name": teacher.first_name,
            "surname": teacher.surname,
            "role": teacher.role.role if teacher.role else None,
            "subjects": TSCSerializer(teacher.subject_classes.all(), many=True).data,
            "class_tr": (
                f"{teacher.class_tr.grade}-{teacher.class_tr.division}"
                if teacher.class_tr else None
            )
        })

# Handle Excel


class HandleStudentsData(APIView):
    serializer_class = ExcelDataSerializer
    exams = ["PT1", "PT2", "PT3", "MT", "PB1", "PB2"]

    def post(self, request, format=True):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data["sheets"]

        # -------------------------
        # Cache database objects
        # -------------------------
        subject_map = {s.sub: s for s in Subject.objects.all()}
        exam_map = {e.abbreviation: e for e in Exam.objects.all()}
        class_map = {(str(c.grade), c.division.strip())                     : c for c in Class.objects.all()}

        existing_students = set(
            Student.objects.values_list("first_name", "surname")
        )

        scholastic_subjects = [
            "Math",
            "English",
            "Hindi",
            "Sci",
            "French",
            "SS",
            "HS",
            "Painting",
            "HC",
            "AI",
            "IT",
        ]

        co_scholastic_subjects = [
            "PE",
            "Yoga",
            "NSS",
            "MA",
            "Comp",
            "WE",
            "ATL",
            "Art",
            "Music",
            "SD",
        ]

        students_to_create = []
        student_metadata = []

        # ---------------------------------------
        # Phase 1: Build Student objects only
        # ---------------------------------------
        for classe in data:
            class_name = classe["class_name"].strip()
            grade = class_name[:2].strip()
            division = class_name[2:].strip()

            class_obj = class_map[(grade, division)]

            for student_data in classe["excel_data"]:

                first_name = student_data["first_name"]
                surname = student_data["surname"]

                if (first_name, surname) in existing_students:
                    continue

                raw_subjects = student_data.get("subjects", [])

                subjects = set()

                for subject in raw_subjects:
                    if subject == "Maths":
                        subjects.add("Math")
                    elif subject == "Science":
                        subjects.add("Sci")
                    elif subject == "Social Science":
                        subjects.add("SS")
                    elif "instead" in subject.lower():
                        subjects.add(subject.split("instead")[0].strip())
                    else:
                        subjects.add(subject)

                student = Student(
                    first_name=first_name,
                    surname=surname,
                    class_div=class_obj,
                    roll_no=student_data.get("no"),
                )

                students_to_create.append(student)

                student_metadata.append({
                    "subjects": subjects,
                })

        # Nothing new
        if not students_to_create:
            students = Student.objects.select_related(
                "class_div"
            ).prefetch_related(
                "marks__subject",
                "marks__exam"
            )

            return Response(
                {
                    "message": "No new students.",
                    "data": StudentMarksSerializer(students, many=True).data,
                },
                status=status.HTTP_200_OK,
            )

        # ---------------------------------------
        # Save students
        # ---------------------------------------
        with transaction.atomic():

            created_students = Student.objects.bulk_create(
                students_to_create,
                batch_size=1000,
            )

            # ---------------------------------------
            # Build ALL marks
            # ---------------------------------------
            all_marks = []

            for student, metadata in zip(created_students, student_metadata):

                student_subjects = metadata["subjects"]

                for subject in scholastic_subjects:
                    subject_obj = subject_map[subject]

                    score = 1000 if subject in student_subjects else -1000

                    for exam in self.exams:
                        all_marks.append(
                            Mark(
                                student=student,
                                subject=subject_obj,
                                exam=exam_map[exam],
                                score=score,
                            )
                        )

                sp_exam = exam_map["SP"]

                for subject in co_scholastic_subjects:
                    all_marks.append(
                        Mark(
                            student=student,
                            subject=subject_map[subject],
                            exam=sp_exam,
                            score=1000 if subject in student_subjects else -1000,
                        )
                    )

            # ---------------------------------------
            # Save marks in batches
            # ---------------------------------------
            Mark.objects.bulk_create(
                all_marks,
                batch_size=5000,
            )

        students = (
            Student.objects
            .select_related("class_div")
            .prefetch_related(
                "marks__subject",
                "marks__exam",
            )
        )

        return Response(
            {
                "message": f"Success - {len(created_students)} Students Created",
                "data": StudentMarksSerializer(students, many=True).data,
            },
            status=status.HTTP_201_CREATED,
        )


class HandleStudentsSubjectList(APIView):
    serializer_class = StudentMarksSerializer

    def get(self, request, format=None):
        students = (
            Student.objects
            .select_related("class_div")
            .prefetch_related(
                "marks__subject",
                "marks__exam",
            )
        )
        serialize = self.serializer_class(students, many=True)
        return Response(serialize.data, status=status.HTTP_200_OK)


class HandleStudentUpdate(APIView):
    def patch(self, request):
        request_data = request.data
        for student in request_data:
            exam = student.get("exam")
            exam_obj = Exam.objects.get(abbreviation=exam)
            student_id = student.get("student_id")
            student_obj = Student.objects.get(id=student_id)
            print(student_id, student_obj)
            other_student_data = {
                key: value for key, value in student.items()
                if key != "student_id" and key != 'exam'
            }
            for key, value in other_student_data.items():
                print(repr(key))
                try:
                    subject = Subject.objects.get(sub=key.title())
                except Subject.DoesNotExist:
                    subject = Subject.objects.get(sub=key.upper())

                mark = Mark.objects.get(
                    exam=exam_obj, student=student_obj, subject=subject)
                mark.score = value
                print(mark.subject, mark.student, mark.exam, mark.score)
                mark.save(update_fields=["score"])

        return Response({"Updated": "Marks Modified"}, status=status.HTTP_200_OK)


class HandleStudentBulkDelete(APIView):
    def delete(self, request):
        ids = request.data.get("ids")
        for id in ids:
            student_qs = Student.objects.filter(id=id)
            if not student_qs.exists():
                return Response({"Error": f"Invalid Student ID {id}"}, status=status.HTTP_404_NOT_FOUND)
            student = student_qs[0]
            student.delete()
        return Response({"Message": "Students Deleted Successfully"}, status=status.HTTP_204_NO_CONTENT)


class UpdateMarkView(APIView):
    def post(self, request):
        exam_str = request.data.get("exam")
        marks_obj = request.data.get("marks")
        subject_str = request.data.get("subject").get("sub")

        exam_objqs = Exam.objects.filter(abbreviation=exam_str)
        if not exam_objqs.exists():
            return Response({"Error": "Exam value is invalid"}, status=status.HTTP_400_BAD_REQUEST)
        exam = exam_objqs.first()

        subject_objqs = Subject.objects.filter(sub=subject_str)
        if not subject_objqs.exists():
            return Response({"Error": "Subject value is invalid"}, status=status.HTTP_400_BAD_REQUEST)
        subject = subject_objqs.first()

        marks_to_be_updated = []

        for mark in marks_obj:
            student_id = mark.get("studentId")
            score = mark.get("score")
            studentqs = Student.objects.filter(id=student_id)
            if not studentqs.exists():
                return Response({"Error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)
            student = studentqs.first()
            mark_objqs = Mark.objects.filter(
                student=student, exam=exam, subject=subject)
            if not mark_objqs.exists():
                return Response({"Error": "Mark not found."}, status=status.HTTP_404_NOT_FOUND)
            mark_obj = mark_objqs.first()
            mark_obj.score = score
            marks_to_be_updated.append(mark_obj)

        Mark.objects.bulk_update(marks_to_be_updated, ["score"])
        return Response({"Message": "Updated"}, status=status.HTTP_200_OK)
