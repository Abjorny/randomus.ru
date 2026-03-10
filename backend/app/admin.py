from django.contrib import admin
from .models import Number, Settings
from adminsortable2.admin import SortableAdminMixin
from django.utils.html import format_html

@admin.register(Number)
class NumberAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ("value", "used_colored")
    list_filter = ("used",)

    def used_colored(self, obj):
        color = "green" if obj.used else "red"
        status = "Отработало" if obj.used else "Не отработало"
        return format_html('<b style="color:{};">{}</b>', color, status)
    used_colored.short_description = "Статус"

@admin.register(Settings)
class SettingsAdmin(admin.ModelAdmin):
    list_display = ("age", "number", "vk", "name", "nick", "pay")

    def has_add_permission(self, request):
        if Settings.objects.exists():
            return False
        return True