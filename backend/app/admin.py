from django.contrib import admin
from .models import Number
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
