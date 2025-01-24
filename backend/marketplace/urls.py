from django.urls import path
from .views import *

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('add-points/', add_points_view, name='add-points'),
    path('purchase-product/', purchase_product_view, name='purchase-product'),
]