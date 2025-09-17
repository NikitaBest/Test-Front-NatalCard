#!/bin/bash

echo "🔄 Переключаемся на DEV конфигурацию..."

# Останавливаем текущие процессы
pkill -f "vite" 2>/dev/null || true

# Обновляем env.local для dev
cat > env.local << EOF
# DEV конфигурация
VITE_API_URL=https://backend-dev.tma.thelifemission.com
VITE_APP_ENV=development
VITE_DEBUG=true
EOF

echo "✅ Переключено на DEV:"
echo "   API: https://backend-dev.tma.thelifemission.com"
echo "   Режим: development"
echo "   Debug: включен"
echo ""
echo "🚀 Запускаем dev сервер..."
npm run dev
