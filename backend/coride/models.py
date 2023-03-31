from django.db import models
from datetime import *
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
# Create your models here.



class ExampleModel(models.Model):
	firstname = models.CharField(max_length=200)
	lastname = models.CharField(max_length=200)


class Company(models.Model):
	id = models.BigAutoField(primary_key=True)
	name = models.CharField(max_length=200)
	email = models.CharField(max_length=200, unique=True)
	password = models.CharField(max_length=30)
	creation_date = models.DateTimeField(auto_now_add=True)
	last_login = models.DateTimeField(auto_now=True)

	def check_password(self,raw_secret):
		def setter(raw_secret):
			self.set_password(raw_secret)
			# Password hash upgrades shouldn't be considered password changes.
			self._password = None
			self.save(update_fields=["secret"])
		return check_password(raw_secret, self.password, setter) 

	def save(self, *args, **kwargs):
		# Hash the password before saving the object
		self.password = make_password(self.password)
		super().save(*args, **kwargs)

	def __str__(self):
		return self.name

class Client(models.Model):
	id = models.BigAutoField(primary_key=True)
	firstname = models.CharField(max_length=200)
	lastname = models.CharField(max_length=200)
	phone = models.CharField(max_length=13, unique=True)
	email = models.CharField(max_length=200, unique=True)
	password = models.CharField(max_length=30)
	creation_date = models.DateTimeField(auto_now_add=True)
	company_id = models.ForeignKey(Company, on_delete=models.DO_NOTHING, blank=True, null=True)
	last_login = models.DateTimeField(auto_now=True)
	def check_password(self,raw_secret):
		def setter(raw_secret):
			self.set_password(raw_secret)
			# Password hash upgrades shouldn't be considered password changes.
			self._password = None
			self.save(update_fields=["secret"])
		return check_password(raw_secret, self.password, setter) 
	def save(self, *args, **kwargs):
        # Hash the password before saving the object
		self.password = make_password(self.password)
		super().save(*args, **kwargs)
	def __str__(self):
		return self.firstname + " " + self.lastname

class Driver(models.Model):
	id = models.BigAutoField(primary_key=True)
	firstname = models.CharField(max_length=200)
	lastname = models.CharField(max_length=200)
	phone = models.CharField(max_length=13, unique=True)
	email = models.CharField(max_length=200, unique=True)
	password = models.CharField(max_length=30)
	creation_date = models.DateTimeField(auto_now_add=True)
	car = models.CharField(max_length=200)
	CarClass = models.CharField(max_length=30)
	last_login = models.DateTimeField(auto_now=True)
	def check_password(self,raw_secret):
		def setter(raw_secret):
			self.set_password(raw_secret)
			# Password hash upgrades shouldn't be considered password changes.
			self._password = None
			self.save(update_fields=["secret"])
		return check_password(raw_secret, self.password, setter)     
	def save(self, *args, **kwargs):
        # Hash the password before saving the object
		self.password = make_password(self.password)
		super().save(*args, **kwargs)
	def __str__(self):
		return self.firstname + " " + self.lastname

class Route(models.Model):
	id = models.BigAutoField(primary_key=True)
	initial_address = models.CharField(max_length=200)
	lat_init = models.CharField(max_length=200)
	lng_init = models.CharField(max_length=200)
	end_address = models.CharField(max_length=200)
	lat_end = models.CharField(max_length=200)
	lng_end = models.CharField(max_length=200)
	length_time = models.TimeField()
	length_metres = models.DecimalField(max_digits=10,decimal_places=2)
	client_id = models.ForeignKey(Client, on_delete=models.CASCADE)
	active = models.IntegerField()

	def __str__(self):
		return self.initial_address + "%" + self.end_address + "%" + str(self.length_time) + "%" + str(self.length_metres)

class EndOrders(models.Model):
	id = models.BigAutoField(primary_key=True)
	end_address = models.CharField(max_length=200)
	lat_end = models.CharField(max_length=200, default='0')
	lng_end = models.CharField(max_length=200, default='0')
	length_time = models.TimeField()
	length_metres = models.DecimalField(max_digits=10, decimal_places=2)
	route_ids = models.CharField(max_length=1000)
	all_lat_lngs_init = models.CharField(max_length=1000, null=True)
	price = models.IntegerField()
	driver_id = models.ForeignKey(Driver, on_delete=models.DO_NOTHING, null=True)
	date = models.DateTimeField(auto_now=True)
	in_process = models.IntegerField()

	def __str__(self):
		return str(self.id) + "%" + self.end_address + "%" + str(self.length_time) + "%" + str(self.length_metres) + "%" + str(self.price)
