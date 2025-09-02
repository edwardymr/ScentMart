
import emailjs from '@emailjs/browser';
import { OrderDetails } from '../types';

// --- CONFIGURACIÓN DE EMAILJS ---
// Las siguientes credenciales fueron proporcionadas y configuradas.
const SERVICE_ID = 'service_izdlxnw';
const TEMPLATE_ID = 'template_di24rwu';
const PUBLIC_KEY = 'cbMBtEKYL9MrUE46r';
// --------------------------------------------------------------------------------

// Inicializa EmailJS con tu Public Key.
emailjs.init({ publicKey: PUBLIC_KEY });

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
};

export const sendOrderConfirmationEmail = async (orderDetails: OrderDetails): Promise<void> => {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    const errorMessage = "Las credenciales de EmailJS no están configuradas en 'services/emailService.ts'.";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  // Validación: Asegurarse de que hay un email de destino.
  if (!orderDetails.customer.email) {
      throw new Error("El campo de correo electrónico del cliente está vacío. No se puede enviar la confirmación.");
  }
  
  const itemsText = orderDetails.items.map(item => 
      `• ${item.perfume.name} (x${item.quantity}) - ${formatCurrency(item.perfume.price * item.quantity)}`
  ).join('\n');

  /*
   * =================================================================================
   * ¡ACCIÓN URGENTE REQUERIDA! SOLUCIÓN AL ERROR "VARIABLES CORRUPTED"
   * =================================================================================
   * Este error significa que tu plantilla en la web de EmailJS tiene un error de sintaxis.
   * Para solucionarlo, sigue estos pasos EXACTAMENTE:
   *
   * 1. Ve a tu cuenta de EmailJS -> Email Templates -> y abre la plantilla con ID: 'template_di24rwu'.
   *
   * 2. BORRA TODO el contenido actual del cuerpo del correo (el editor grande).
   *
   * 3. COPIA Y PEGA el siguiente texto EXACTAMENTE como está:
   *
   * ---------------------------------------------------------------------------------
   * ¡Hola, {{customer_name}}! 🎉
   *
   * ¡Gracias por tu compra en ScentMart Perfumes! Hemos recibido tu pedido y lo estamos preparando.
   *
   * --- RESUMEN DEL PEDIDO ---
   * N° de Pedido: {{order_number}}
   *
   * Productos:
   * {{items_text}}
   *
   * --- TOTALES ---
   * Subtotal: {{subtotal}}
   * Envío: {{shipping}}
   * Total a Pagar: {{total}}
   * Método de Pago: {{payment_method}}
   *
   * --- DATOS DE ENVÍO ---
   * Dirección: {{customer_address}}
   * Ciudad: {{customer_city}}
   * WhatsApp: {{customer_whatsapp}}
   *
   * Nos pondremos en contacto contigo pronto para coordinar la entrega.
   *
   * Saludos,
   * El equipo de ScentMart Perfumes.
   * ---------------------------------------------------------------------------------
   *
   * 4. Ve a la pestaña "Settings" de la plantilla.
   * 5. Asegúrate de que el campo "To Email" contenga EXACTAMENTE esto: {{to_email}}
   *
   * 6. Guarda la plantilla. Con esto el error se solucionará.
   * =================================================================================
   */
  const templateParams = {
    // --- Parámetros de destino (para la configuración de EmailJS) ---
    to_email: orderDetails.customer.email, 
    to_name: orderDetails.customer.name,

    // --- Parámetros de respuesta (opcional pero recomendado) ---
    from_name: 'ScentMart Perfumes',
    reply_to: orderDetails.customer.email,

    // --- Variables para el contenido del cuerpo de la plantilla ---
    order_number: orderDetails.orderNumber,
    customer_name: orderDetails.customer.name,
    customer_whatsapp: orderDetails.customer.whatsapp,
    customer_address: `${orderDetails.customer.address}${orderDetails.customer.addressDetails ? `, ${orderDetails.customer.addressDetails}` : ''}`,
    customer_city: orderDetails.customer.city,
    customer_email: orderDetails.customer.email,
    items_text: itemsText,
    subtotal: formatCurrency(orderDetails.subtotal),
    shipping: orderDetails.shipping === 0 ? 'Gratis' : formatCurrency(orderDetails.shipping),
    total: formatCurrency(orderDetails.total),
    payment_method: orderDetails.paymentMethod === 'cod' ? 'Contra Entrega' : 'Tarjeta',
  };

  try {
    console.log("Intentando enviar correo con EmailJS con los siguientes parámetros:", templateParams);
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    console.log('¡Correo de confirmación enviado exitosamente a través de EmailJS!');
  } catch (error) {
    console.error('Fallo al enviar correo con EmailJS. Error completo:', error);
    
    // Extrae el mensaje de error de la respuesta de EmailJS para un feedback más claro.
    const errorMessage = (error as { text?: string })?.text 
        || 'No se pudo obtener una respuesta del servicio de correo. Verifica la consola del navegador y tu configuración de EmailJS.';
    
    throw new Error(errorMessage);
  }
};