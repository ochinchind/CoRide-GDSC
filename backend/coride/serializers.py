from rest_framework import serializers
from coride.models import ExampleModel, Client, Company, Driver, Route, EndOrders

class ExampleModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExampleModel
        fields = ('firstname', 'lastname')


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ('id', 'name', 'email', 'password', 'creation_date')

class CompanyAuthSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ('email', 'password')

class CompanyPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ('name', 'email', 'password')

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ('id', 'firstname', 'lastname', 'phone', 'email', 'password', 'creation_date', 'company_id')

class ClientAuthSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ('email', 'password')

class ClientPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ('firstname', 'lastname', 'phone', 'email', 'password', 'company_id')

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ('id', 'firstname', 'lastname', 'phone', 'email', 'password', 'creation_date', 'car', 'CarClass')

class DriverAuthSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ('email', 'password')

class DriverPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ('firstname', 'lastname', 'phone', 'email', 'password', 'car', 'CarClass')

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ('id', 'initial_address', 'end_address', 'length_time', 'length_metres', 'client_id', 'active')
    
class RoutePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ('initial_address', 'end_address', 'length_time', 'length_metres', 'client_id', 'active')

class EndOrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = EndOrders
        fields = ('id', 'end_address', 'length_time', 'length_metres', 'route_ids', 'price', 'driver_id', 'date', 'in_process')

class EndOrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = EndOrders
        fields = ('end_address', 'length_time', 'length_metres', 'route_ids', 'price', 'driver_id', 'in_process')