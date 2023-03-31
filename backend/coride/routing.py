from django.urls import re_path

from . import consumers


websocket_urlpatterns = [
    path(r'ws/route/$', consumers.RouteConsumer.as_asgi() ),
]