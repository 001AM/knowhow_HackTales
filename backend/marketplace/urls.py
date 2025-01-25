from django.urls import path
from .views import *
from django.views.generic import TemplateView
urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('get_profile/', get_profile, name='get_profile'),
    path('update_profile/',update_profile,name="update_profile"),
    path('add-points/', add_points_view, name='add-points'),
    path('purchase-product/', purchase_product_view, name='purchase-product'),
    path('get-bird-species/', birdclassify, name='get-bird-species'),
    path('products/', ProductListCreateView.as_view(), name='book-list-create'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='book-detail'),
    path('get-leaf-species/', leafclassify, name='get-leaf-species'),
    path('create-razorpay-order/', create_razorpay_order, name='create-razorpay-order'),
    path('verify-razorpay-payment/', verify_razorpay_payment, name='verify-razorpay-payment'),

    path('vr/', TemplateView.as_view(template_name='virt.html'), name='vr'),
]
