from rest_framework.routers import DefaultRouter

from dict.views import FormFactorViewSet, WorkTypeViewSet

router = DefaultRouter()
router.register(r'form-factor', FormFactorViewSet)
router.register(r'work-type', WorkTypeViewSet)

urlpatterns = router.urls
