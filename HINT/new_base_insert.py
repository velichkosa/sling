from your_app.models import Category, SubGroup, SubCategory

# Создаем категории
category_work = Category.objects.create(name="По виду работ")
category_form = Category.objects.create(name="По форм-фактору")

# Создаем подгруппы для "По виду работ"
subgroup_vsr = SubGroup.objects.create(category=category_work, name="ВСР", description="Внутрискважинные работы, зарезка боковых стволов, вторичные материальные ресурсы")
subgroup_eb_zbs_vmr = SubGroup.objects.create(category=category_work, name="ЭБ, ЗБС и ВМР", description="Электробезопасность, зарезка боковых стволов, вторичные материальные ресурсы")
subgroup_ceha = SubGroup.objects.create(category=category_work, name="ЦЕХА", description="Цеха по перекачке и подготовке нефти, обеспечения добычи")
subgroup_kap_stroy = SubGroup.objects.create(category=category_work, name="КАП.СТРОЙ", description="Капитальное строительство")

# Создаем подгруппы для "По форм-фактору"
subgroup_long = SubGroup.objects.create(category=category_form, name="Длинномерный", description="Балки, трубы, швеллеры")
subgroup_sheet = SubGroup.objects.create(category=category_form, name="Листовой", description="Металлопрокат, стекло")
subgroup_container = SubGroup.objects.create(category=category_form, name="Контейнерный", description="Ящики, блоки, контейнеры")
subgroup_volume = SubGroup.objects.create(category=category_form, name="Объемный", description="Бочки, катушки, рулоны")
subgroup_nonstandard = SubGroup.objects.create(category=category_form, name="Нестандартный", description="Оборудование, конструкции сложной формы")
subgroup_modular = SubGroup.objects.create(category=category_form, name="Модульные здания и бытовки", description="Всякие вагончики")

# Связываем каждую подгруппу "По виду работ" с категориями "По форм-фактору"
for sub_group in [subgroup_vsr, subgroup_eb_zbs_vmr, subgroup_ceha, subgroup_kap_stroy]:
    for category in [category_form]:
        SubCategory.objects.create(sub_group=sub_group, category=category)

# Связываем каждую подгруппу "По форм-фактору" с категориями "По виду работ"
for sub_group in [subgroup_long, subgroup_sheet, subgroup_container, subgroup_volume, subgroup_nonstandard, subgroup_modular]:
    for category in [category_work]:
        SubCategory.objects.create(sub_group=sub_group, category=category)
