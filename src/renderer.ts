import './index.css';

// Получаем элементы DOM
const dropZone = document.getElementById('dropZone')!;
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const spinner = document.getElementById('spinner')!;
const resultContainer = document.getElementById('resultContainer')!;
const resultImage = document.getElementById('resultImage') as HTMLImageElement;

// Обработка клика на drop zone для открытия диалога выбора файла
dropZone.addEventListener('click', () => {
  fileInput.click();
});

// Обработка выбора файла через input
fileInput.addEventListener('change', (e) => {
  const files = (e.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    handleImageUpload(files[0]);
  }
});

// Drag and Drop обработчики
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dropZone.classList.remove('dragover');

  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    const file = files[0];
    // Проверяем, что это изображение
    if (file.type.startsWith('image/')) {
      handleImageUpload(file);
    } else {
      alert('Пожалуйста, загрузите изображение');
    }
  }
});

// Функция для отправки изображения на backend
async function handleImageUpload(file: File) {
  // Скрываем результаты и показываем спиннер
  resultContainer.style.display = 'none';
  spinner.style.display = 'flex';

  try {
    // Создаем FormData для отправки файла
    const formData = new FormData();
    formData.append('image', file);

    // Отправляем запрос на backend
    const response = await fetch('http://localhost:8005/api/detect', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.statusText}`);
    }

    // Получаем изображение в ответе
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    // Отображаем результат
    resultImage.src = imageUrl;
    spinner.style.display = 'none';
    resultContainer.style.display = 'block';

  } catch (error) {
    console.error('Ошибка при загрузке изображения:', error);
    spinner.style.display = 'none';
    alert(`Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
  }
}
