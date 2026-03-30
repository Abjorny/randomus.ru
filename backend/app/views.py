from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from app.models import Number, Settings
import random

class GenerateNumberView(APIView):
    def get(self, request):
        numbers_from_admin = Number.objects.filter(
            used=False
        ).order_by("order")
        values = [number.value for number in numbers_from_admin]
        return Response(values)

    def post(self, request):
        value = request.data.get('value')
        updated_count = Number.objects.filter(value=value).update(used=True)
        return Response({
            "message": f"Обновлено {updated_count} записей",
            "updated_count": updated_count
        })


class PaymentView(APIView):
    def get(sefl, request):
        return render(request, "payment.html")
  

class InfoOfferView(APIView):
    def get(sefl, request):
        return render(request, "info/offer.html")
  
class InfoFaqView(APIView):
    def get(sefl, request):
        return render(request, "info/faq.html")
  
class InfoAboutView(APIView):
    def get(sefl, request):
        return render(request, "info/about.html")
  
class InfoHowtoView(APIView):
    def get(sefl, request):
        return render(request, "info/howto.html")
    
class InfoIdeasView(APIView):
    def get(sefl, request):
        return render(request, "info/ideas.html")

class InfoPayView(APIView):
    def get(sefl, request):
        return render(request, "info/pay.html")

class InfoSpecialView(APIView):
    def get(sefl, request):
        return render(request, "info/special.html")
    

class IndexView(APIView):
    def get(self, request):
        settings = Settings.get_solo()

        formatted_settings = {
            "age": f"{settings.age}",
            "number": f"{settings.number:,}".replace(",", " "),
            "vk": f"{settings.vk:,}".replace(",", " "),
            "name": f"{settings.name:,}".replace(",", " "),
            "nick": f"{settings.nick:,}".replace(",", " "),
            "pay": f"{settings.pay:,}".replace(",", " "),
        }

        return render(request, "index.html", {"settings": formatted_settings})

class SimpleView(APIView):
    def get(sefl, request):
        return render(request, "simple.html")
    
class SpecialView(APIView):
    def get(sefl, request):
        return render(request, "special.html")
    
class ScreencastView(APIView):
    def get(sefl, request):
        return render(request, "screencast.html")

class NumberrView(APIView):
    def get(sefl, request):
        return render(request, "number_type-generate.html")

class NumbercView(APIView):
    def get(sefl, request):
        return render(request, "number_type-create.html")

class LoginView(APIView):
    def get(sefl, request):
        return render(request, "login.html")

class VkView(APIView):
    def get(sefl, request):
        return render(request, "vk.html")

class WordleView(APIView):
    def get(sefl, request):
        return render(request, "wordle.html")

class HoroscopeView(APIView):
    def get(sefl, request):
        return render(request, "horoscope.html")

class PromocodeView(APIView):
    def get(sefl, request):
        return render(request, "promocode.html")

class PasswordView(APIView):
    def get(sefl, request):
        return render(request, "password.html")

class NameView(APIView):
    def get(sefl, request):
        return render(request, "name.html")

class NicknameView(APIView):
    def get(sefl, request):
        return render(request, "nickname.html")

class QuickView(APIView):
    def get(sefl, request):
        numbers = [
            "12", "35", "36", "67", "94"
        ]
        return render(request, "quick.html", context={'number': random.choice(numbers)})

class ListView(APIView):
    def get(sefl, request):
        return render(request, "list.html")
    
class SplitView(APIView):
    def get(sefl, request):
        return render(request, "split.html")

class AskView(APIView):
    def get(sefl, request):
        return render(request, "ask.html")