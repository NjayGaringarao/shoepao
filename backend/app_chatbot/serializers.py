from rest_framework import serializers
from .models import Message, Conversation


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'content', 'role', 'created_at']
        read_only_fields = ['id', 'created_at']


class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Conversation
        fields = ['id', 'messages', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ConversationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new conversation"""
    class Meta:
        model = Conversation
        fields = ['id', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class MessageCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new message"""
    class Meta:
        model = Message
        fields = ['id', 'conversation', 'content', 'role', 'created_at']
        read_only_fields = ['id', 'created_at']
