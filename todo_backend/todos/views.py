from rest_framework import viewsets
from .models import Todo
from .serializers import TodoSerializer
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to the Todo API! Visit /api/todos/ to see the todos.")

class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer