from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Message, Conversation
from .serializers import (
    ConversationSerializer, 
    ConversationCreateSerializer,
    MessageSerializer,
    MessageCreateSerializer
)
from django.conf import settings
from openai import OpenAI
import os
from .prompts import DEFAULT_SYSTEM_PROMPT


# Create your views here.

class ConversationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and managing conversations.
    
    list: Get all conversations
    retrieve: Get a specific conversation with its messages
    create: Create a new conversation
    destroy: Delete a conversation
    """
    queryset = Conversation.objects.all().prefetch_related('messages')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ConversationCreateSerializer
        return ConversationSerializer
    
    @action(detail=True, methods=['post'])
    def add_message(self, request, pk=None):
        """Add a message to a conversation"""
        conversation = self.get_object()
        serializer = MessageCreateSerializer(data={
            **request.data,
            'conversation': conversation.id
        })
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def chat(self, request, pk=None):
        """
        Send a message to the chatbot and get a response.
        
        Expected payload:
        {
            "content": "Hello, how are you?"
        }
        """
        conversation = self.get_object()
        user_content = request.data.get('content', '').strip()
        
        if not user_content:
            return Response(
                {'error': 'Message content is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get OpenAI API key
        api_key = os.environ.get('OPENAI_API_KEY') or settings.OPENAI_API_KEY
        if not api_key:
            return Response(
                {'error': 'OpenAI API key not configured'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Save user message
        user_message = Message.objects.create(
            conversation=conversation,
            content=user_content,
            role='user'
        )
        
        # Get conversation history for context
        previous_messages = conversation.messages.all().order_by('created_at')
        messages_for_api = [
            {
                'role': msg.role,
                'content': msg.content
            }
            for msg in previous_messages
        ]

        if not messages_for_api or messages_for_api[0]['role'] != 'system':
            messages_for_api.insert(0, {
                'role': 'system',
                'content': DEFAULT_SYSTEM_PROMPT
            })
        
        try:
            # Call OpenAI API
            client = OpenAI(api_key=api_key)
            response = client.chat.completions.create(
                model="gpt-4o-mini",  # or "gpt-4" for better quality
                messages=messages_for_api,
                max_tokens=500,
                temperature=0.7
            )
            
            assistant_content = response.choices[0].message.content
            
            # Save assistant response
            assistant_message = Message.objects.create(
                conversation=conversation,
                content=assistant_content,
                role='assistant'
            )
            
            # Update conversation timestamp
            conversation.save()  # This updates updated_at
            
            # Return both messages
            return Response({
                'conversation_id': conversation.id,  # Add this
                'user_message': MessageSerializer(user_message).data,
                'assistant_message': MessageSerializer(assistant_message).data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            # If OpenAI fails, still save user message but return error
            return Response(
                {'error': f'Failed to get chatbot response: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and managing messages.
    
    list: Get all messages (optionally filtered by conversation)
    retrieve: Get a specific message
    create: Create a new message
    update: Update a message
    destroy: Delete a message
    """
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    
    def get_queryset(self):
        queryset = Message.objects.all()
        conversation_id = self.request.query_params.get('conversation', None)
        if conversation_id:
            queryset = queryset.filter(conversation_id=conversation_id)
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'create':
            return MessageCreateSerializer
        return MessageSerializer
