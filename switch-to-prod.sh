#!/bin/bash

echo "🔄 Переключаемся на PROD конфигурацию..."

# Останавливаем текущие процессы
pkill -f "vite" 2>/dev/null || true

# Обновляем env.local для prod
cat > env.local << EOF
# PROD конфигурация
VITE_API_URL=https://backend.tma.thelifemission.com
VITE_APP_ENV=production
VITE_DEBUG=false
EOF

echo "✅ Переключено на PROD:"
echo "   API: https://backend.tma.thelifemission.com"
echo "   Режим: production"
echo "   Debug: отключен"
echo ""
echo "🚀 Собираем и запускаем prod версию..."
npm run build
npm run start:prod
