from rest_framework.routers import DefaultRouter

from registry.views import ShiftsViewSet, ShiftEventViewSet, TechViewSet, VwShiftSummaryViewSet, TechTableViewSet

router = DefaultRouter()
router.register('techs', TechViewSet, basename='techs')
router.register('vw-techs', TechTableViewSet, basename='vw-techs')  # Новый маршрут

router.register('shifts', ShiftsViewSet, basename='shifts')
router.register('shift_events', ShiftEventViewSet, basename='shift_events')
router.register('vw_shift_summary', VwShiftSummaryViewSet, basename='vw_shift_summary'),

urlpatterns = router.urls
