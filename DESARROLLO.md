# 🚀 Guía Rápida de Desarrollo

## Iniciar Servidor

```bash
./dev.sh
```

## Reiniciar Limpio (si hay problemas)

```bash
./dev.sh clean
```

## URLs

- 🌐 **Local**: http://localhost:3000
- 📱 **Red**: http://192.168.18.49:3000
- 🔐 **Login**: http://localhost:3000/login

## Usuarios de Prueba

### Instructor
- Email: `instructor@fluideka.com`
- Password: `instructor123`

### Admin
- Email: `admin@fluideka.com`
- Password: `admin123`

### Estudiante
- Email: `estudiante@test.com`
- Password: `estudiante123`

## ⚡ Hard Refresh (Limpiar Cache del Navegador)

- **Windows/Linux**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`

O abre DevTools (F12) → Pestaña "Network" → Marca "Disable cache"

## 📝 Notas Importantes

- El servidor hace **hot reload automático** cuando editas archivos
- **NO necesitas reiniciar** el servidor en cada cambio
- Solo usa `./dev.sh clean` si hay problemas de cache persistentes
- El script mata TODOS los procesos Node y libera el puerto 3000 automáticamente

## 🐛 Solución de Problemas

### El navegador muestra contenido viejo
→ Haz hard refresh: `Ctrl + Shift + R`

### El servidor no arranca en puerto 3000
→ El script automáticamente mata procesos y libera el puerto

### Los cambios no se reflejan
1. Verifica que el archivo se guardó
2. Espera 2-3 segundos (hot reload)
3. Hard refresh en el navegador
4. Si persiste: `./dev.sh clean`

### Error "Port already in use"
→ Usa `./dev.sh` que mata todos los procesos automáticamente
