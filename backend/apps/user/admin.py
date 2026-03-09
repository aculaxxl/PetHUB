from django.contrib import admin
from .models import User, SMSCode

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('phone_number', 'is_staff', 'is_active', 'date_joined')
    search_fields = ('phone_number',)

@admin.register(SMSCode)
class SMSCodeAdmin(admin.ModelAdmin):
    list_display = ('phone', 'code', 'created_at')