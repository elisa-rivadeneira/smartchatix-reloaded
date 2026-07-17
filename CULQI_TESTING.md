# 🧪 Testing de Culqi - SmartChatix

## ✅ Instalación Completa

- ✅ SDK de Culqi.js v4 integrado (script en layout.tsx)
- ✅ Endpoints API creados:
  - `/api/payment/charge` - Procesa pagos con token
- ✅ Componente `CulqiPaymentForm` creado con formulario custom
- ✅ Variables de entorno configuradas
- ✅ Campos con id y name para que Culqi los detecte

## 🌐 URL del Servidor

**IMPORTANTE**:
- ⚠️ Culqi NO funciona en localhost por restricciones CORS
- ✅ Debe probarse en producción con HTTPS o usando ngrok
- Local (solo desarrollo): http://localhost:3003
- Red: http://192.168.18.49:3003

## 🧪 Tarjetas de Prueba Culqi

### ✅ Tarjetas Exitosas

**Visa**
- Número: `4111 1111 1111 1111`
- CVV: `123`
- Fecha: `12/25` (cualquier fecha futura)

**Mastercard**
- Número: `5111 1111 1111 1118`
- CVV: `456`
- Fecha: `12/26`

### ❌ Tarjetas para Probar Errores

**Tarjeta con fondos insuficientes**
- Número: `4000 0000 0000 0002`
- CVV: `123`
- Fecha: `12/25`

**Tarjeta robada/perdida**
- Número: `4000 0000 0000 0069`
- CVV: `123`
- Fecha: `12/25`

## 📝 Pasos para Testing

### 1. Probar el formulario existente

Actualmente el formulario de compra está en:
- `/inscripcion-vivo?curso=SLUG_DEL_CURSO`
- `/comprar-grabado?curso=SLUG_DEL_CURSO`

### 2. Integrar CulqiPaymentForm

Para usar el componente de pago:

\`\`\`tsx
import CulqiPaymentForm from '@/components/CulqiPaymentForm';

<CulqiPaymentForm
  amount={149}
  courseSlug="aprende-dirigir-ia"
  courseTitle="Aprende a dirigir la IA"
  modality="vivo"
  email="student@example.com"
  fullName="Juan Pérez"
  phone="+51999999999"
  onSuccess={() => {
    // Mostrar mensaje de éxito
    // Redirigir al curso
  }}
  onError={(error) => {
    // Mostrar mensaje de error
    console.error(error);
  }}
/>
\`\`\`

### 3. Verificar en Panel Culqi

Después de cada pago exitoso:
1. Ve a https://integ-panel.culqi.com/
2. Menú "Ventas"
3. Verifica que aparezca el cargo

## 🔒 Seguridad

- ✅ Nunca guardamos datos de tarjeta
- ✅ Todo se tokeniza en el backend
- ✅ Culqi maneja PCI compliance
- ✅ Llaves en `.env.local` (no se suben a GitHub)

## 🚀 Estado Actual

1. ✅ Integrado CulqiPaymentForm en `/comprar-grabado/page.tsx`
2. ✅ Formulario custom con campos: número, mes, año, CVV
3. ✅ Tokenización funcional (requiere HTTPS o dominio permitido)
4. ⚠️ Pendiente: Probar en producción (localhost tiene restricciones CORS)
5. ⚠️ Pendiente: Verificar matrícula automática en BD después del pago
6. ⚠️ Pendiente: Integrar en `/inscripcion-vivo/page.tsx`

## 📞 Soporte Culqi

- Documentación: https://docs.culqi.com/
- Panel Test: https://integ-panel.culqi.com/
- Panel Producción: https://panel.culqi.com/
