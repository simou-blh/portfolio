from django.contrib import admin

# Register your models here.
# contact/admin.py
from django.contrib import admin
from .models import ContactMessage

admin.site.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "message", "created_at")