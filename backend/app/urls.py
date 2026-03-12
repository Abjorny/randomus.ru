from django.urls import path
import app.views as views

urlpatterns = [
    path("simple/", views.SimpleView.as_view(), name = "simple"),
    path("quick/", views.QuickView.as_view(), name = "quick"),
    path("list/", views.ListView.as_view(), name = "list"),
    path("split/", views.SplitView.as_view(), name = "simple"),
    path("ask/", views.AskView.as_view(), name = "ask"),
    path("", views.IndexView.as_view(), name = "index"),
    path("number/", views.GenerateNumberView.as_view(), name = "number"),
    path("special/", views.SpecialView.as_view(), name = "special"),
    path("screencast/", views.ScreencastView.as_view(), name = "screencast"),
    path("numberr/", views.NumberrView.as_view(), name = "numberr"),
    path("numberc/", views.NumbercView.as_view(), name = "numberc"),
    path("nickname/", views.NicknameView.as_view(), name = "nickname"),
    path("name/", views.NameView.as_view(), name = "name"),
    path("password/", views.PasswordView.as_view(), name = "name"),
    path("promocode/", views.PromocodeView.as_view(), name = "promocode"),
    path("horoscope/", views.HoroscopeView.as_view(), name = "horoscope"),
    path("wordle/", views.WordleView.as_view(), name = "wordle"),
    path("vk/", views.VkView.as_view(), name = "vk"),
    path("login/", views.LoginView.as_view(), name = "login"),
    path("payment_type-donate/", views.PaymentView.as_view(), name = "payment"),


    path("info/offer/", views.InfoOfferView.as_view(), name = "offer"),
    path("info/faq/", views.InfoFaqView.as_view(), name = "faq"),
    path("info/about/", views.InfoAboutView.as_view(), name = "about"),
    path("info/howto/", views.InfoHowtoView.as_view(), name = "howto"),
    path("info/ideas/", views.InfoIdeasView.as_view(), name = "ideas"),
    path("info/pay/", views.InfoPayView.as_view(), name = "pay"),
    path("info/special/", views.InfoSpecialView.as_view(), name = "special"),
]
