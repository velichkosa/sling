from django.test import TestCase
from django.utils import timezone

from dict.models import Org, Location
from registry.models import Operator, Tech, Equipment, Shifts


class ModelsTestCase(TestCase):
    def setUp(self):
        # Создаем необходимые объекты для теста

        # Создаем фиктивную организацию
        self.org = Org.objects.create(name="Test Organization")

        # Создаем оператора с организацией
        self.operator = Operator.objects.create(
            first_name="John",
            last_name="Doe",
            phone_number=1234567890,
            experience=5,
            org=self.org  # Указываем организацию
        )
        # Создаем фиктивную организацию
        self.location = Location.objects.create(name="North")

        self.tech = Tech.objects.create(
            gos_num="A123BC", home_location=self.location, is_active=True
        )

        self.equipment = Equipment.objects.create(name="Excavator")
        self.tech.equipment.add(self.equipment)
        self.tech.save()

    def test_operator_creation(self):
        self.assertEqual(self.operator.first_name, "John")
        self.assertEqual(self.operator.last_name, "Doe")

    def test_tech_creation(self):
        self.assertEqual(self.tech.gos_num, "A123BC")
        self.assertTrue(self.tech.is_active)

    def test_shift_creation(self):
        shift = Shifts.objects.create(
            tech=self.tech, operator=self.operator, start_time=timezone.now(), end_time=None
        )
        self.assertEqual(shift.tech, self.tech)
        self.assertEqual(shift.operator, self.operator)
        self.assertIsNone(shift.end_time)
