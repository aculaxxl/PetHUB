from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from apps.profiles.models import Profile
from django.conf import settings
from django.apps import AppConfig

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

class UserConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.user'

    def ready(self):
        import apps.user.signals 