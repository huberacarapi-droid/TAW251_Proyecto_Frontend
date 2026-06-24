function Servicios() {
    return (
        <div className="container-fluid mt-1">
            <div className="text-center mb-2">
                <h2 className="fw-bold text-primary">Servicios</h2>
                <p className="text-muted mx-auto" style={{ maxWidth: "720px" }}>
                    Nuestros servicios especializados en monitoreo y análisis ambiental garantizan la calidad y seguridad de tus procesos.
                    Utilizamos tecnología avanzada para proporcionar datos precisos y reportes detallados.
                </p>
            </div>

            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card h-100 shadow-sm border-0 rounded-4">
                        <div className="card-body p-4">
                            <div className="mb-3 d-flex align-items-center justify-content-between">
                                <span className="badge bg-primary py-2 px-3 rounded-pill">Servicio</span>
                                <i className="fas fa-thermometer-half fa-2x text-primary"></i>
                            </div>
                            <h5 className="card-title fw-semibold">Mapeo Térmico</h5>
                            <p className="card-text text-secondary mb-3">
                                Análisis completo de condiciones térmicas y de humedad en tus instalaciones,
                                con mediciones precisas y reportes técnicos detallados.
                            </p>
                            <ul className="list-unstyled">
                                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Medición de temperatura (-20°C a 70°C)</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Medición de humedad (0%RH a 90%RH)</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Informe técnico completo</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Métricas MKT, MAX, MIN, AVG</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100 shadow-sm border-0 rounded-4">
                        <div className="card-body p-4">
                            <div className="mb-3 d-flex align-items-center justify-content-between">
                                <span className="badge bg-success py-2 px-3 rounded-pill">Servicio</span>
                                <i className="fas fa-chart-line fa-2x text-success"></i>
                            </div>
                            <h5 className="card-title fw-semibold">Monitoreo Ambiental</h5>
                            <p className="card-text text-secondary mb-3">
                                Vigilancia continua de variables ambientales con alertas automáticas
                                y registro histórico para cumplimiento normativo.
                            </p>
                            <ul className="list-unstyled">
                                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Monitoreo en tiempo real</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Histórico de alarmas</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Registro de mediciones</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Reportes para auditoría</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Servicios;