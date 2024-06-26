import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./AdvertisementSection.css";
import { useState } from "react";
import Loading from "components/General/Loading";

function AdvertisementSection() {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false); // Establece isLoading en false cuando todas las imágenes se han cargado correctamente
  };

  return (
    <Container>
      {isLoading && <Loading />}
      <center>
        <h1 style={{ textShadow: "none", fontFamily: "Roboto", WebkitTextStroke: "1.5px white", color: "white" }}>PROWESS PLANES</h1>
        <div className="p-anuncios">
          <p>Descubre la Excelencia en Agricultura con Prowess Agrícola</p>
          <p>
            ¡Aumenta la productividad y optimiza tus cultivos con nuestras
            soluciones avanzadas!
          </p>
        </div>
      </center>
      <Row className="advertisement-section-anuncios">
        <Col md={12}>
          <Row className="image-pair-anuncios">
            <Col>
              <img
                src="https://prowessec.com/wp-content/uploads/2024/02/1.png"
                alt="Imagen Planes"
                className="advertisement-image-anuncios"
                onLoad={handleImageLoad}
              />
            </Col>
            <Col>
              <img
                src="https://prowessec.com/wp-content/uploads/2024/02/2.png"
                alt="Imagen Planes"
                className="advertisement-image-anuncios"
                onLoad={handleImageLoad}
              />
            </Col>
          </Row>
        </Col>
        <Col md={12}>
          <Row className="image-pair-anuncios">
            <Col>
              <img
                src="https://prowessec.com/wp-content/uploads/2024/02/3.png"
                alt="Imagen Planes"
                className="advertisement-image-anuncios"
                onLoad={handleImageLoad}
              />
            </Col>
            <Col>
              <img
                src="https://prowessec.com/wp-content/uploads/2024/02/4.png"
                alt="Imagen Planes"
                className="advertisement-image-anuncios"
                onLoad={handleImageLoad}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default AdvertisementSection;