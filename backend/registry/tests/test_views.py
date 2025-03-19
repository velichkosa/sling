from rest_framework.test import APITestCase
from rest_framework import status

from django.utils import timezone

from registry.models import Operator, Tech, Equipment, Shifts


class ShiftsViewSetTestCase(APITestCase):
    def setUp(self):
        # Создаем необходимые объекты
        self.operator = Operator.objects.create(
            first_name="John", last_name="Doe", phone_number=1234567890, experience=5
        )
        self.tech = Tech.objects.create(
            gos_num="A123BC", is_active=True
        )
        self.equipment = Equipment.objects.create(name="Excavator")
        self.tech.equipment.add(self.equipment)
        self.tech.save()

    def test_qr_start_shift(self):
        # Делаем POST запрос для начала смены
        url = '/shifts/qr/start/'
        data = {'tech_id': str(self.tech.id), 'operator_id': str(self.operator.id)}
        response = self.client.post(url, data)

        # Проверяем, что ответ успешен и возвращен статус 201
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('shift_id', response.data)
        self.assertEqual(response.data['message'], "Смена начата")

    def test_qr_finish_shift(self):
        # Сначала начнем смену
        start_url = '/shifts/qr/start/'
        start_data = {'tech_id': str(self.tech.id), 'operator_id': str(self.operator.id)}
        start_response = self.client.post(start_url, start_data)
        shift_id = start_response.data['shift_id']

        # Теперь завершаем смену
        finish_url = '/shifts/qr/finish/'
        finish_data = {'tech_id': str(self.tech.id), 'operator_id': str(self.operator.id)}
        finish_response = self.client.post(finish_url, finish_data)

        # Проверяем успешное завершение смены
        self.assertEqual(finish_response.status_code, status.HTTP_200_OK)
        self.assertEqual(finish_response.data['message'], "Смена завершена")
        self.assertEqual(finish_response.data['shift_id'], shift_id)

        # Проверяем, что смена теперь закрыта
        shift = Shifts.objects.get(id=shift_id)
        self.assertIsNotNone(shift.end_time)

    def test_no_unfinished_shifts(self):
        # Попытка завершить смену, когда нет незакрытых смен
        url = '/shifts/qr/finish/'
        data = {'tech_id': str(self.tech.id), 'operator_id': str(self.operator.id)}
        response = self.client.post(url, data)

        # Проверяем, что возвращается ошибка
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], "Нет незакрытых смен для данной техники и оператора")
