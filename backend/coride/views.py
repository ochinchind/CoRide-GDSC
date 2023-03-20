from django.shortcuts import render, HttpResponseRedirect
from django.http import HttpResponse, Http404, JsonResponse
from coride.models import ExampleModel
from coride.serializers import ExampleModelSerializer

from django.views.decorators.csrf import csrf_exempt


# Create your views here.
def index(request):
    context = 1
    return render(request, 'coride/index.html', {'context':context})

@csrf_exempt
def get_data(request):
    data = ExampleModel.objects.all()
    if request.method == 'GET':
        serializer = ExampleModelSerializer(data, many=True)
        return JsonResponse(serializer.data, safe=False)

        
