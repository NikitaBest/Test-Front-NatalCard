#!/bin/bash

echo "🔍 Проверяем текущую конфигурацию..."
echo ""

# Проверяем env.local
if [ -f "env.local" ]; then
    echo "📄 env.local:"
    cat env.local | grep VITE_API_URL
    cat env.local | grep VITE_APP_ENV
    cat env.local | grep VITE_DEBUG
else
    echo "❌ env.local не найден"
fi

echo ""

# Проверяем env.development
if [ -f "env.development" ]; then
    echo "📄 env.development:"
    cat env.development | grep VITE_API_URL
fi

echo ""

# Проверяем env.production
if [ -f "env.production" ]; then
    echo "📄 env.production:"
    cat env.production | grep VITE_API_URL
fi

echo ""

# Проверяем запущенные процессы
echo "🔄 Запущенные процессы:"
ps aux | grep vite | grep -v grep || echo "Нет запущенных vite процессов"
