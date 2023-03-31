from django.shortcuts import render, HttpResponseRedirect
from django.http import HttpResponse, Http404, JsonResponse
from coride.models import ExampleModel, Client, Company, Driver, Route, EndOrders
from coride.serializers import ExampleModelSerializer, CompanyAuthSerializer, CompanyPostSerializer, ClientSerializer, ClientAuthSerializer, ClientPostSerializer, CompanySerializer, DriverSerializer, DriverAuthSerializer, DriverPostSerializer, RouteSerializer, RoutePostSerializer, EndOrdersSerializer, EndOrdersPostSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import check_password
from django.contrib.auth import authenticate, login
import jwt, datetime
import decimal
import re
import json
import requests
from web3storage import Client as Web3Storage
import googlemaps

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


@csrf_exempt
def get_clients(request):
    data = Client.objects.all()
    if(request.method == 'GET'):
        serializer = ClientSerializer(data, many=True)
        return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
def post_clients(request):
    companies = Company.objects.all()
    drivers = Driver.objects.all()
    if(request.method == 'POST'):
        serializer = ClientPostSerializer(data=request.data)
        if serializer.is_valid():
            for driver in drivers:
                if request.data['email'] == driver.email:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            for company in companies:
                if request.data['email'] == company.email:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def get_companies(request):
    data = Company.objects.all()
    if(request.method == 'GET'):
        serializer = CompanySerializer(data, many=True)
        return JsonResponse(serializer.data, safe=False)

@api_view(('GET',))
@csrf_exempt
def get_user(request):
    token = request.headers['Authorization'].split()[1]
    if not token:
        return Response('No token')
    try:
        payload = jwt.decode(token, 'secret', algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return Response(jwt.ExpiredSignatureError)
    print(payload)
    if(payload['type'] == 'company'):
        if(Company.objects.filter(id=payload['id']).first()):
            user = Company.objects.filter(id=payload['id']).first()
            serializer = CompanySerializer(user)
            data = serializer.data
            data['type'] = 'company'
            return Response(data)
    if(payload['type'] == 'client'):
        if(Client.objects.filter(id=payload['id']).first()):
            user = Client.objects.filter(id=payload['id']).first()
            serializer = ClientSerializer(user)
            data = serializer.data
            data['type'] = 'client'
            return Response(data)   
    if(payload['type'] == 'driver'):   
        if(Driver.objects.filter(id=payload['id']).first()):
            user = Driver.objects.filter(id=payload['id']).first()
            serializer = DriverSerializer(user)
            data = serializer.data
            data['type'] = 'driver'

            return Response(data)     


@api_view(['POST'])
def logout(request):
    response = Response()
    response.delete_cookie('jwt')
    response.data = {
        'message':'success'
    }
    return response

@api_view(['POST'])
def auth(request):
    if(request.method == 'POST'):
        if(Company.objects.filter(email=request.data['email']).first()):
            email = request.data['email']
            password = request.data['password']
            user = Company.objects.filter(email=email).first()
            if user.check_password(password):
                # The user was authenticated successfully, log them in
                #login(request, user)
                # Redirect to a success page
                payload = {
                    'id': user.id,
                    'type': 'company',
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                    'iat': datetime.datetime.utcnow()
                }
                token = jwt.encode(payload, 'secret', algorithm='HS256')
                response = Response()
                response.set_cookie(key='jwt', value=token, httponly=False)
                response.data = {
                    'name': user.name,
                    'email' : user.email,
                    'jwt':token,
                    'type': 'company'
                }

                return response
            else:
                # The username and password were incorrect, show an error message
                return AuthenticationFailed('Incorrect password!')
        
        if(Driver.objects.filter(email=request.data['email']).first()):
            email = request.data['email']
            password = request.data['password']
            user = Driver.objects.filter(email=email).first()
            if user.check_password(password):
                # The user was authenticated successfully, log them in
                #login(request, user)
                # Redirect to a success page
                payload = {
                    'id': user.id,
                    'type': 'driver',
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                    'iat': datetime.datetime.utcnow()
                }
                token = jwt.encode(payload, 'secret', algorithm='HS256')
                response = Response()
                response.set_cookie(key='jwt', value=token, httponly=False)
                response.data = {
                    'firstname': user.firstname,
                    'email' : user.email,
                    'jwt':token,
                    'type': 'driver'
                }

                return response
            else:
                # The username and password were incorrect, show an error message
                return AuthenticationFailed('Incorrect password!')


        if(Client.objects.filter(email=request.data['email']).first()):
            email = request.data['email']
            password = request.data['password']
            user = Client.objects.filter(email=email).first()
            if user.check_password(password):
                # The user was authenticated successfully, log them in
                #login(request, user)
                # Redirect to a success page
                payload = {
                    'id': user.id,
                    'type': 'client',
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                    'iat': datetime.datetime.utcnow()
                }
                token = jwt.encode(payload, 'secret', algorithm='HS256')
                response = Response()
                response.set_cookie(key='jwt', value=token, httponly=False)
                response.data = {
                    'firstname': user.firstname,
                    'email' : user.email,
                    'jwt':token,
                    'type': 'client'
                }

                return response
            else:
                # The username and password were incorrect, show an error message
                return AuthenticationFailed('Incorrect password!')
        return AuthenticationFailed('User not found!')

@api_view(['POST'])
def post_companies(request):
    clients = Client.objects.all()
    drivers = Driver.objects.all()
    if(request.method == 'POST'):
        serializer = CompanyPostSerializer(data=request.data)
        if serializer.is_valid():
            for driver in drivers:
                if request.data['email'] == driver.email:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            for client in clients:
                if request.data['email'] == client.email:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def get_drivers(request):
    data = Driver.objects.all()
    if(request.method == 'GET'):
        serializer = DriverSerializer(data, many=True)
        return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
def post_drivers(request):
    companies = Company.objects.all()
    clients = Client.objects.all()
    if(request.method == 'POST'):
        serializer = DriverPostSerializer(data=request.data)
        if serializer.is_valid():
            for company in companies:
                if request.data['email'] == company.email:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            for client in clients:
                if request.data['email'] == client.email:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def get_routes(request):
    data = Route.objects.all()
    if(request.method == 'GET'):
        serializer = RouteSerializer(data, many=True)
        return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
def post_routes(request):
    if(request.method == 'POST'):
        data = request.data
        print(data)
        print(data['length_metres'].split()[0])
        client = Client.objects.get(id = data['client_id'])
        data['client_id'] = client.pk
        new_string = data['length_metres'].split()
        new_string = ''.join(new_string)
        new_string = new_string.replace(',','.')
        new_string = ''.join(re.findall(r'\d|\.', new_string)) 
        print(new_string)
        decimal_value = decimal.Decimal(new_string)
        decimal_value = decimal_value*1000
        data['length_metres']= decimal_value
        print(data['length_time'])
        time = data['length_time'].split()
        print(time)
        if(time[1] == 'ч.'):
            time_string = time[0] + ':' + time[2] + ':' + '0.0'
            endtime = datetime.datetime.strptime(time_string, '%H:%M:%S.%f').time()
            data['length_time'] = endtime
        else:
            time_string = '0' + ':' + time[0] + ':' + '0.0'
            endtime = datetime.datetime.strptime(time_string, '%H:%M:%S.%f').time()
            data['length_time'] = endtime
        print(data)
        serializer = RoutePostSerializer(data=data)
        if serializer.is_valid():
            results = EndOrders.objects.filter(end_address=data['end_address'])
            if results.exists():
                serializer.save()
                route = Route.objects.get(client_id = client.pk)
                endorder = EndOrders.objects.get(end_address=data['end_address'])
                route_ids = endorder.route_ids
                list_routes = route_ids.split("%")
                for i in (list_routes):
                    oldorder = Route.objects.get(id=i)
                    oldorder_address = oldorder.initial_address
                    gmaps = googlemaps.Client(key='AIzaSyACsRmvnafsvrTP2Wmd3tTSVLTLhLavG3o')
                    matrix = gmaps.distance_matrix(data['initial_address'], oldorder_address)
                    print(matrix)
                    distance_between_two_routes = matrix['rows'][0]['elements'][0]['distance']['value']
                    if((int(data['length_metres']) - distance_between_two_routes) >= 0):
                        endorder.route_ids += '%' +  str(route.pk)
                        endorder.all_lat_lngs_init += '%' + str(route.lat_init) + '%' + str(route.lng_init)
                        endorder.length_metres += decimal.Decimal(distance_between_two_routes)
                        endorder.save()
                        return Response(serializer.data, status=status.HTTP_201_CREATED)
                    else:
                        pass

            else:
                serializer.save()
                route = Route.objects.get(client_id = client.pk)
                print(route.pk)
                endorderdata = {'end_address': data['end_address'], 'lat_end': data['lat_end'], 'lng_end': data['lng_end'], 'length_time': data['length_time'], 'length_metres': data['length_metres'], 'route_ids': str(route.pk), 'all_lat_lngs_init': str(data['lat_init']) + '%' + str(data['lng_init']), 'price': int(int(data['length_metres'])*0.3), 'in_process': 0}
                endorderserializer = EndOrdersPostSerializer(data=endorderdata)
                if endorderserializer.is_valid():
                    endorderserializer.save()
                    web3data = Web3Storage('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQzRkU0NTYyYjBGMDdiOTY3MzNDQTAwNjMyN2QwZkE3MzU2MkY5MzEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Nzk5MzUyOTQxOTMsIm5hbWUiOiJDb1JpZGUifQ.G71lHpfqh9RH1EFPCjgMy_QxV64tIznsA62y1BQFp8c')
                    json_string = json.dumps(endorderserializer.data)
                    print(serializer.data)
                    with open('my_object.json', 'w') as f:
                        f.write(json_string)
                    response = web3data.upload_file('my_object.json')
                    print(response)
                    return Response(endorderserializer.data, status=status.HTTP_201_CREATED)
                return Response(endorderserializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def delete_routes(request):
    if(request.method == 'POST'):
        print(request.data)
        route = Route.objects.get(id = request.data['id'])
        route.delete()
        return Response(status=status.HTTP_201_CREATED)



@csrf_exempt
def get_endorders(request):
    data = EndOrders.objects.all()
    if(request.method == 'GET'):
        serializer = EndOrdersSerializer(data, many=True)
        return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
def post_endorders(request):
    if(request.method == 'POST'):
        serializer = EndOrdersPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

