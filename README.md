# DanGame – Нарисувай острова част по част
Статичен сайт (HTML/CSS/JS, без build). Отвори index.html през локален сървър (напр. `python3 -m http.server`) или го качи на произволен статичен хостинг.
- data.js – задачите (1. клас от grade1/tasks.json; 2.–4. клас извлечени от „Математика без граници“) + текстовете за четене на глас
- audio/ – MP3 за всяко условие и подсказка от кръстословиците (edge-tts, bg-BG-KalinaNeural); при липса на файл се ползва Web Speech API (bg-BG)
- mkdata.py / speak.py – скриптове за повторно генериране (speak.py --gen)
- прогресът се пази в localStorage (ключ dangame-progress-v1)
