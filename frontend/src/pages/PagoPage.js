import React, { useState, useEffect } from 'react';
import './PagoPage.css';
import { Navigate } from 'react-router-dom';
import Check from '../imagenes/Check.png';
import WhatsButton from '../components/WhatsButton';
import ModalEditVendors from '../components/ModalEditVendors';
import VendorsPage from './VendorsPage';
import { getTokenData } from '../services/auth';
import { getUserData } from '../services/user.js';
import whatsapp from '../imagenes/whatsapp.png';
import { checkToken } from '../services/auth';
import jsPDF from 'jspdf';
import "jspdf-autotable";



function PagoPage({ cart, vendor, clearCart, orden }) {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const obtenerDatos = async () => {
      const data = await checkToken(token);
      const usuario =
      {
        id: data.data.id,
        nombre: data.data.nombreUsuario,
        apellido: data.data.apellidoUsuario,
        email: data.data.correoUsuario,
        telefono: data.data.telefonoUsuario
      }
      setUsuario(usuario);
    };

    obtenerDatos();
  }, [token]);


  useEffect(() => {
    const orderNum = generateRandomOrderNumber();
    setOrderNumber(orderNum);
  }, []);

  useEffect(() => {
    handlePayment();
  }, []);

  const handlePayment = () => {
    setPaymentSuccess(true);
  };

  const [redirect, setRedirect] = useState(false);

  const handleBuyButtonClick = () => {
    setRedirect(true);
  };

  const generateRandomOrderNumber = () => {
    return Math.floor(Math.random() * 900000) + 100000;
  };

  if (redirect) {
    return <Navigate to="/tienda" />;
  }

  const handleContinueShoppingClick = () => {
    clearCart();
    setRedirect(true);
  };



  const enviarCorreo = () => {
    const logoUrl = 'https://media.discordapp.net/attachments/1157817962267426861/1217555996055048293/zyro-image_2.png?ex=66047462&is=65f1ff62&hm=229b05eccf55d81d23be809d04a26a73b7f1a5be0cf220f5a738e6b7760cd720&=&format=webp&quality=lossless&width=1252&height=587';
    const pdf = new jsPDF();

    // Configurar estilo del texto
    pdf.setFont('times');
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0); // Color en RGB (negro)

    // Agregar el logo
    pdf.addImage(logoUrl, 'JPEG', 10, 10, 50, 20);

 // Agregar el título de la factura en negrita y negro
pdf.setFont('times', 'bold'); // Cambiar a 'times' y establecer el estilo en negrita
pdf.setFontSize(22);
pdf.setTextColor(0, 0, 0); // Negro
pdf.text('Confirmación del Pedido', 70, 30);
pdf.setFont('times', 'normal'); // Restaurar el estilo de fuente normal

    // Agregar los detalles del cliente
    pdf.setFontSize(12);
    pdf.text(`Estimado/a ${usuario.nombre},`, 10, 60);
    pdf.text(`Gracias por comprar con nosotros. Tu pedido ${orderNumber} está confirmado. Te avisaremos cuando se envíe.`, 10, 70);

    // Agregar los detalles del pedido
    pdf.text('Detalles del Pedido', 10, 90);
    pdf.text(`Nº de orden: ${orderNumber}`, 10, 100);

    // Agregar los detalles de los productos en una tabla más estilizada
    let yPosition = 110;
    const tableHeaders = ['Producto', 'Cantidad', 'Precio Unitario', 'Total', 'Vendedor'];
    const tableData = cart.map(product => {
        const precio = product.precio || 15; // Si el precio no está definido, asignar 0
        return [
            product.pro_nombre,
            `${product.cantidad} ${product.pro_medida}`,
            `$${precio.toFixed(2)}`,
            `$${(precio * product.cantidad).toFixed(2)}`,
            product.pro_vendedor
        ];
    });

    // Agregar la tabla con estilos personalizados
    pdf.autoTable({
        startY: yPosition,
        head: [tableHeaders],
        body: tableData,
        theme: 'grid',
        margin: { top: 10 }
    });

    // Mensaje adicional
    pdf.setTextColor(0, 0, 0); // Negro
    pdf.text('Quedo a la espera de cualquier confirmación o instrucciones adicionales.', 10, pdf.autoTable.previous.finalY + 10);

    // Firma y enlaces tipo botón
    pdf.text('Saludos cordiales,', 10, pdf.autoTable.previous.finalY + 20);
    pdf.text('ProwessAgrícola', 10, pdf.autoTable.previous.finalY + 30);

    // Agregar botones de enlace
    const buttons = [
      { text: 'Facebook', link: 'https://www.facebook.com/profile.php?id=100094846861007&mibextid=gik2fB' },
      { text: 'Instagram', link: 'https://www.instagram.com/prowessec7?igshid=NGVhN2U2NjQ0Yg%3D%3D' },
      { text: 'Sitio Web', link: 'https://prowessec.com' },
      { text: 'TikTok', link: 'https://www.tiktok.com/@prowess.ec?is_from_webapp=1&sender_device=pc' }
    ];

    buttons.forEach((button, index) => {
      pdf.textWithLink(button.text, 10, pdf.autoTable.previous.finalY + 40 + (index * 12), { url: button.link });
    });

    // Texto en el footer
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.text('ProwessAgrícola | Dr. Luis Simbaña Taipe | lesimbania@espe.edu.ec', 10, footerY + 15);
    pdf.text('Todos los derechos reservados - Prowess Ecuador © 2024 | Revisa nuestros Términos y Condiciones', 10, footerY + 25);


    // Obtener el contenido del PDF en formato base64
    const pdfBase64 = pdf.output('datauristring');

    // Construir el enlace de descarga del PDF
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfBase64;
    downloadLink.download = `${orderNumber}_confirmacion_pedido.pdf`;

    // Posicionar los botones al final de la página
    const buttonsMarginTop = 10; // Margen superior para los botones
    const buttonsY = footerY - buttonsMarginTop;

  
    // Simular el clic en el enlace para iniciar la descarga
    downloadLink.click();

    // Restaurar los estilos originales para el correo electrónico
    pdf.setFont('helvetica');
    pdf.setFontSize(12);

    const confirmacionMensaje = `Hemos recibido tu pedido con el número de orden ${orderNumber}. Gracias por confiar en nosotros.`;
    const saludoPersonalizado = `Estimado/a ${usuario.nombre},`;
   const despedidaMensaje = 'Gracias nuevamente por tu compra. Si tienes alguna pregunta o necesitas asistencia adicional, no dudes en ponerte en contacto con nosotros. ¡Que tengas un excelente día!';
   window.location.href = `mailto:${usuario.email}?subject=Confirmación de Pedido ${orderNumber} &body=${saludoPersonalizado}%0A%0A${confirmacionMensaje}%0A%0A${despedidaMensaje}`;
};




  const handleShareButtonClick = () => {
    const shareLink = 'whatsapp://send?text=¡Echa un vistazo a este producto que encontré en nuestra tienda!%0A%0AEncuentra más en: https://prowessagricola.prowessec.com';
    navigator.clipboard.writeText(shareLink).then(() => {
      setShowCopiedMessage(true); // Mostrar el mensaje de enlace copiado
      setTimeout(() => setShowCopiedMessage(false), 3000); // Ocultar el mensaje después de 3 segundos
    }).catch(error => {
      console.error('Error al copiar al portapapeles:', error);
    });
  };

  return (
    <div className="pagopage-container">
      <div className="pagopage-form">
        {paymentSuccess && (
          <>
            <div className='AboutUsInfo h1'>
              <h1>Su pago se ha completado correctamente</h1>
            </div>
            <div className="pagopage-factura-container">
              <img src={Check} alt="Imagen Pago" className="pagopage-image" />
              {cart && cart.map((product, index, vendor) => (
                <div key={index} style={{ padding: '0px 40px', paddingBottom: '40px' }}>
                  <div className="contenedor-alineado">
                    <div>
                      <img src={product.pro_imagen} alt={product.pro_nombre} className="imagen-producto-factura" />
                    </div>
                    <div>
                      <p className="datos-factura-centrada">
                        <span className="pagopage-factura-label">Nº de orden:</span>
                        {orderNumber}
                      </p>
                      <p className="datos-factura-centrada">
                        <span className="pagopage-factura-label">Vendedor:</span>
                        {product.pro_vendedor}
                      </p>
                      <p className="datos-factura-centrada">
                        <span className="pagopage-factura-label">Compra:</span>
                        {product.pro_nombre}
                      </p>
                      <p className="datos-factura-centrada">
                        <span className="pagopage-factura-label">Cantidad:</span>
                        {product.cantidad} {product.pro_medida}
                      </p>
                    </div>
                  </div>
                  <p className="pagopage-gracias">¡Gracias por su compra!</p>
                  <a href={`https://wa.me/${product.pro_numero}?text=Hola,%20he%20completado%20mi%20compra.%20¿Podemos%20ponernos%20en%20contacto%3F`}
                    target="_blank" rel="noopener noreferrer">
                    <button className="btn btn-success btn-whatsapp">
                      <i className="fab fa-whatsapp"></i> ¡Contáctanos! <div className="image-whatsapp">
                        <img src={whatsapp} alt="Whatsapp" />
                      </div>
                    </button>
                  </a>
                  <button className="btn btn-success btn-share" onClick={handleShareButtonClick}>
                    <i className="fab fa-whatsapp"></i> Compartir
                    <div className="image-whatsapp"></div>
                  </button>
                  <p className="pagopage-factura-datos"></p>
                </div>
              ))}
                  <button className="boton-enviar" onClick={enviarCorreo}>Enviar comprobante</button>
                   <p className="pagopage-gracias">En breve nos pondremos en contacto con usted</p>            
                   </div>
                  <button className="btn-buy" onClick={handleContinueShoppingClick}>
              <b>Seguir comprando</b>
            </button>
          </>
        )}
        {showCopiedMessage && (
          <div className="copied-link-message">
            <span className="copied-link-message-text">¡El enlace ha sido copiado al portapapeles!</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PagoPage;