from coride.models import Company, Client, Driver
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.hashers import check_password
from django.contrib.auth import authenticate, get_user_model

class CompanyAuthBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            user = Company.objects.get(email=email)
            if check_password(password, user.password):
                return user
        except Company.DoesNotExist:
            try:
                user = Client.objects.get(email=email)
                if check_password(password, user.password):
                    return user
            except Client.DoesNotExist:
                try:
                    user = Driver.objects.get(email=email)
                    if check_password(password, user.password):
                        return user
                except Driver.DoesNotExist:
                    return None
                return None
            return None

    def get_company(self, id):
        try:
            return Company.objects.get(pk=id)
        except Company.DoesNotExist:
            return None
    def get_client(self, id):
        try:
            return Client.objects.get(pk=id)
        except Client.DoesNotExist:
            return None
    def get_driver(self, id):
        try:
            return Driver.objects.get(pk=id)
        except Driver.DoesNotExist:
            return None