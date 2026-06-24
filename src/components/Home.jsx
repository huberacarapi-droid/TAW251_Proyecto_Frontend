import { Link } from "react-router-dom";

function Home() {
    return (
        <div>
            
            {/* Servicios Destacados */}
            <section className="py-1 bg-light">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold text-primary">Nuestros Servicios</h2>
                        <p className="text-muted">Soluciones especializadas para cada necesidad tecnológica</p>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center p-4">
                                    <i className="fas fa-thermometer-half fa-3x text-primary mb-3"></i>
                                    <h5 className="card-title fw-semibold">Mapeo Térmico</h5>
                                    <p className="card-text text-secondary">
                                        Análisis preciso de condiciones térmicas y ambientales
                                        para optimizar tus procesos industriales.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center p-4">
                                    <i className="fas fa-chart-line fa-3x text-success mb-3"></i>
                                    <h5 className="card-title fw-semibold">Monitoreo Ambiental</h5>
                                    <p className="card-text text-secondary">
                                        Vigilancia continua con alertas automáticas y reportes
                                        detallados para cumplimiento normativo.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center p-4">
                                    <i className="fas fa-code fa-3x text-warning mb-3"></i>
                                    <h5 className="card-title fw-semibold">Desarrollo de Software</h5>
                                    <p className="card-text text-secondary">
                                        Aplicaciones web y móviles personalizadas que impulsan
                                        tu transformación digital.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-4">
                        <Link to="/servicios" className="btn btn-primary">
                            Ver Todos los Servicios
                        </Link>
                    </div>
                </div>
            </section>

            {/* Productos */}
            <section className="py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold text-primary">Nuestros Productos</h2>
                        <p className="text-muted">Tecnología de vanguardia para tus proyectos</p>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-3">
                            <div className="card h-100 border-0 shadow-sm text-center">
                                <div className="card-body p-4">
                                    <i className="fas fa-thermometer-half fa-2x text-primary mb-3"></i>
                                    <h6 className="card-title fw-semibold">Sensores</h6>
                                    <p className="card-text small text-secondary">
                                        Temperatura y humedad de alta precisión
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card h-100 border-0 shadow-sm text-center">
                                <div className="card-body p-4">
                                    <i className="fas fa-wifi fa-2x text-success mb-3"></i>
                                    <h6 className="card-title fw-semibold">IoT</h6>
                                    <p className="card-text small text-secondary">
                                        Dispositivos conectados inteligentes
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card h-100 border-0 shadow-sm text-center">
                                <div className="card-body p-4">
                                    <i className="fas fa-industry fa-2x text-warning mb-3"></i>
                                    <h6 className="card-title fw-semibold">Instrumentación</h6>
                                    <p className="card-text small text-secondary">
                                        Equipos industriales robustos
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card h-100 border-0 shadow-sm text-center">
                                <div className="card-body p-4">
                                    <i className="fas fa-chart-line fa-2x text-info mb-3"></i>
                                    <h6 className="card-title fw-semibold">Monitoreo</h6>
                                    <p className="card-text small text-secondary">
                                        Sistemas de supervisión avanzados
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-4">
                        <Link to="/productos" className="btn btn-outline-primary">
                            Explorar Productos
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-secondary text-white py-5">
                <div className="container text-center">
                    <h2 className="fw-bold text-primary mb-4">¿Listo para transformar tu empresa?</h2>
                    <p className="lead mb-4">
                        Contáctanos hoy y descubre cómo nuestras soluciones pueden impulsar tu crecimiento.
                    </p>
                    <Link to="/about" className="btn btn-light btn-lg">
                        <i className="fas fa-envelope me-2"></i>Contactar Ahora
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-dark text-white py-4">
                <div className="container text-center">
                    <p className="mb-0">© 2026 TiskoSolutions S.R.L. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;