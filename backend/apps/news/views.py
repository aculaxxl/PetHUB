from django.shortcuts import render, redirect
from .models import Articles
from .forms import ArticlesForm
from django.views.generic import DetailView, UpdateView, DeleteView
from django.contrib.auth.decorators import login_required 
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from rest_framework import viewsets, permissions
from .serializers import NewsSerializer

class NewsViewSet(viewsets.ModelViewSet): 
    queryset = Articles.objects.all().order_by('-created_at')
    serializer_class = NewsSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] 

class NewsDetailView(DetailView):
    model = Articles
    template_name = 'news/details_view.html'
    context_object_name = 'article'

class NewsUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Articles
    template_name = 'news/create.html'
    form_class = ArticlesForm
    def test_func(self):
        article = self.get_object()
        return self.request.user == article.author_pet.owner.user
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs.update({'user': self.request.user})
        return kwargs


class NewsDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Articles
    template_name = 'news/delete.html'
    success_url = '/news/'
    def test_func(self):
        article = self.get_object()
        return self.request.user == article.author_pet.owner.user

def create(request):
    if not request.user.is_authenticated:
        return render(request, 'news/not_authenticated.html')
    error = ''
    if request.method == 'POST':
        form = ArticlesForm(request.POST, user=request.user)
        if form.is_valid():
            form.save()
            return redirect('news_home')
        else:
            error = 'Форма була не коректна'
    else:
        form = ArticlesForm(user=request.user)

    data = {
        'form':form,
        'error': error
    }
    return render(request, 'news/create.html', data)
