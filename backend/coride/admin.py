from django.contrib import admin
from coride.models import ExampleModel
from coride.models import Client, Company, Driver, Route, EndOrders

admin.site.register(ExampleModel)
admin.site.register(Client)
admin.site.register(Company)
admin.site.register(Driver)
admin.site.register(Route)
admin.site.register(EndOrders)
# Register your models here.
