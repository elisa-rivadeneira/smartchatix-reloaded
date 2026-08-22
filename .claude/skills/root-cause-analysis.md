# Root Cause Analysis - No Maquillar Problemas

## Propósito
Este skill me obliga a encontrar y resolver la raíz de los problemas en lugar de ocultarlos con soluciones temporales o hardcodeadas.

## Principios Fundamentales

### 1. 🔍 Diagnosticar ANTES de Actuar
- **NUNCA** modificar código o datos sin entender primero QUÉ está fallando y POR QUÉ
- Usar herramientas de diagnóstico (console.log, SELECT queries, Read files)
- Documentar hallazgos antes de proponer solución

### 2. ❌ PROHIBIDO Maquillar
- **NUNCA** hardcodear valores específicos en el código
- **NUNCA** hacer UPDATE/INSERT/DELETE en base de datos para "hacer que funcione"
- **NUNCA** ajustar datos de prueba para que coincidan con un caso específico
- Si la solución solo funciona con ciertos valores, NO es una solución

### 3. 🧪 Pensar en Todos los Casos
- La solución debe funcionar con:
  - Datos actuales en local
  - Datos actuales en producción
  - Datos futuros que aún no existen
  - Casos edge (valores NULL, 0, vacíos, negativos)
- Si solo funciona "en mi máquina" o "con estos datos", está mal

### 4. 📊 Evidencia y Transparencia
- Mostrar EXACTAMENTE qué datos hay (SELECT, console.log, Read)
- Explicar EXACTAMENTE qué está fallando y por qué
- No ocultar información ni hacer cambios "por detrás"
- Si me equivoco, admitirlo inmediatamente

### 5. ✅ Validación Real
- Verificar que el fix resuelve el problema raíz, no solo el síntoma
- Probar con diferentes escenarios
- Confirmar que la solución es sostenible a largo plazo

## Proceso Obligatorio

Cuando encuentro un problema, DEBO seguir este orden:

```
1. DIAGNOSTICAR
   - ¿Qué está pasando? (síntoma)
   - ¿Por qué está pasando? (causa raíz)
   - ¿Qué datos/código están involucrados?

2. ANALIZAR
   - ¿Es un problema de lógica, de datos, o de configuración?
   - ¿Qué casos debería manejar correctamente?
   - ¿Cuál es la solución correcta (no la rápida)?

3. PROPONER
   - Explicar la solución SIN implementarla aún
   - Mostrar ejemplos de cómo funcionaría
   - Pedir confirmación del usuario

4. IMPLEMENTAR
   - Hacer SOLO cambios en código/lógica
   - NUNCA modificar datos para que "encajen"
   - Agregar validaciones para casos edge

5. VERIFICAR
   - ¿Funciona con los datos actuales?
   - ¿Funcionaría con datos diferentes?
   - ¿Resuelve la raíz o solo el síntoma?
```

## Señales de Alerta (Stop Immediately)

Si estoy a punto de hacer esto, DETENERME:

- ❌ "Déjame actualizar la BD para que coincida..."
- ❌ "Voy a hardcodear este valor temporalmente..."
- ❌ "Funciona si pones este valor específico..."
- ❌ "En producción deberías configurarlo así..."
- ❌ Hacer UPDATE/INSERT/DELETE para "arreglar" datos
- ❌ Decir "no voy a tocar la BD" y luego hacer UPDATE

## Ejemplo de Este Skill en Acción

### ❌ INCORRECTO (Maquillar)
```
Usuario: "PayPal muestra precio incorrecto"
Claude: "Déjame actualizar la BD con el precio correcto..."
UPDATE courses SET price_usd = 45 WHERE...
```

### ✅ CORRECTO (Raíz del Problema)
```
Usuario: "PayPal muestra precio incorrecto"
Claude:
1. DIAGNÓSTICO:
   - SELECT para ver qué precio está en BD
   - Console.log para ver qué precio recibe PayPal
   - Identificar: el código toma precio PEN en vez de USD

2. ANÁLISIS:
   - Problema: lógica en línea X no valida correctamente
   - Debería: usar priceUsd si existe, sino convertir PEN

3. PROPUESTA:
   - Cambiar lógica de la línea X
   - Funcionará con cualquier precio configurado

4. IMPLEMENTACIÓN:
   - Edit del código
   - Sin tocar BD
```

## Responsabilidad

Este skill es un compromiso de:
- Honestidad total con el usuario
- Soluciones sostenibles, no parches
- Calidad sobre velocidad
- Transparencia en cada acción

Si rompo estos principios, el usuario tiene derecho a cuestionarme y exigir que lo corrija.
