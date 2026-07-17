#!/bin/bash

# Script para desarrollo limpio de Next.js
# Uso: ./dev.sh [clean]

echo "🚀 SmartChatix Dev Server"
echo "========================"

# Función para matar todos los procesos Node
kill_all() {
    echo "🔪 Matando procesos Node/Next.js..."
    pkill -9 node 2>/dev/null
    pkill -9 npm 2>/dev/null

    # Matar procesos específicos en puertos 3000-3010
    for port in {3000..3010}; do
        lsof -ti:$port 2>/dev/null | xargs -r kill -9 2>/dev/null
    done

    sleep 2
    echo "✅ Procesos eliminados"
}

# Función para limpiar cache
clean_cache() {
    echo "🧹 Limpiando cache de Next.js..."
    rm -rf .next
    rm -rf node_modules/.cache
    rm -rf .turbo
    echo "✅ Cache limpiado"
}

# Si se pasa el argumento "clean", limpiar todo
if [ "$1" == "clean" ]; then
    kill_all
    clean_cache
else
    kill_all
fi

# Verificar que el puerto 3000 está libre
echo "🔍 Verificando puerto 3000..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Puerto 3000 ocupado, liberando..."
    lsof -ti:3000 | xargs -r kill -9
    sleep 2
fi

echo "✅ Puerto 3000 disponible"
echo ""
echo "🎯 Iniciando servidor en http://localhost:3000"
echo "📱 Red local: http://192.168.18.49:3000"
echo ""
echo "💡 Tips:"
echo "   - Hard refresh: Ctrl+Shift+R (Win/Linux) o Cmd+Shift+R (Mac)"
echo "   - DevTools: F12 → Network → Disable cache"
echo "   - Para limpiar cache: ./dev.sh clean"
echo ""
echo "=========================================="
echo ""

# Iniciar servidor
npm run dev
