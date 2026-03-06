from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    data = {
        'title':'Привіт! Це головна сторінка!',
        'values':['Some text','Hi!','123']
    }
    return render(request, 'main/index.html', data)

def about(request):
    return render(request, 'main/about.html')

def contacts(request):
    return render(request, 'main/contacts.html')