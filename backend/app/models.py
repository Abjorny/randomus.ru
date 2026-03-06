from django.db import models

class Number(models.Model):
    value = models.IntegerField()
    order = models.PositiveIntegerField(default=0, editable=False, db_index=True)
    used = models.BooleanField(default=False) 

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return str(self.value)