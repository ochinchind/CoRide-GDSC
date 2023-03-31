
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Route
from .serializers import RouteSerializer
from channels.db import database_sync_to_async


@database_sync_to_async
def get_table_data():
    route = Route.objects.all()
    serializer = RouteSerializer(route, many=True)
    return serializer.data

class RouteConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.group_name = 'route'
        print()
        #join to group
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        await self.accept()

    async def disconnect(self):
        #leave group
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    # Receive message from websocket 
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(text_data_json)
        message = text_data_json['message']

        event = {
            'type': 'send_message',
            'message': message
        }

        #send message to group
        await self.channel_layer.group_send(self.group_name, event)

    # Receive message from group
    async def send_message(self, event):
        message = await get_table_data()

        #send message to websocket '
        await self.send(text_data=json.dumps({'message': message}))
