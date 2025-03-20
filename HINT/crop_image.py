import cv2
import os

input_folder = "images"  # Папка с исходными изображениями
output_folder = "cropped_images"  # Куда сохранять обрезанные изображения

os.makedirs(output_folder, exist_ok=True)

# Координаты обрезки (измените под нужные)
# x_start, y_start = 130, 40  # Левый верхний угол обрезки
# x_end, y_end = 1190, 1630  # Правый нижний угол обрезки

x_start, y_start = 155, 68  # Левый верхний угол обрезки
x_end, y_end = 1695, 1030  # Правый нижний угол обрезки

for filename in os.listdir(input_folder):
    if filename.endswith((".jpg", ".png")):
        img_path = os.path.join(input_folder, filename)
        img = cv2.imread(img_path)

        cropped = img[y_start:y_end, x_start:x_end]  # Обрезка по координатам
        cv2.imwrite(os.path.join(output_folder, filename), cropped)

print("Обрезка завершена!")
