from django.urls import path

from .views import HandleTeacher, HandleTeacherIndividual, LoginView, CSRFView, LogoutView, MeView, HandleStudentsData, HandleStudentsSubjectList, HandleStudentUpdate, HandleStudentBulkDelete, UpdateMarkView

urlpatterns = [
    path('teacher/', HandleTeacher.as_view()),
    path('teacher/<int:id>/', HandleTeacherIndividual.as_view()),
    path('csrf/', CSRFView.as_view()),
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('me/', MeView.as_view()),
    path('add-students/', HandleStudentsData.as_view()),
    path('student/', HandleStudentsSubjectList.as_view()),
    path('student/update/', HandleStudentUpdate.as_view()),
    path('student/bulk-delete/', HandleStudentBulkDelete.as_view()),
    path('mark/update/', UpdateMarkView.as_view()),
]
