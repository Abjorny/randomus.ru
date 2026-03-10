from django.db import models

class Number(models.Model):
    value = models.IntegerField()
    order = models.PositiveIntegerField(default=0, editable=False, db_index=True)
    used = models.BooleanField(default=False) 

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return str(self.value)
    

class Settings(models.Model):
    age = models.PositiveIntegerField(
        default=12,
        verbose_name="Age",
        help_text="Возраст с которого работаем"
    )

    number = models.BigIntegerField(
        default=2067172340,
        verbose_name="Количество случайных чисел",
        help_text="Общее количество доступных случайных чисел"
    )

    vk = models.PositiveIntegerField(
        default=148330,
        verbose_name="Победителей ВК",
        help_text="Количество победителей VK"
    )

    name = models.PositiveIntegerField(
        default=648049691,
        verbose_name="Количество случайных имён",
        help_text="Сколько доступно случайных имён"
    )

    nick = models.PositiveIntegerField(
        default=281527180,
        verbose_name="Количество случайных ников",
        help_text="Сколько доступно случайных ников"
    )

    pay = models.PositiveIntegerField(
        default=800,
        verbose_name="Разыграно",
        help_text="Сколько уже разыграно"
    )

    class Meta:
        verbose_name = "Настройки"
        verbose_name_plural = "Настройки"

    def save(self, *args, **kwargs):
        if not self.pk and Settings.objects.exists():
            self.pk = Settings.objects.first().pk
        super().save(*args, **kwargs)

    @classmethod
    def get_solo(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Глобальные настройки"