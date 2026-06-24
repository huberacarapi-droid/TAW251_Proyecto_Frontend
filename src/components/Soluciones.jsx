function Soluciones() {
    return (
        <div className="container mt-1">
            <div className="text-center mb-2">
                <h2 className="fw-bold text-primary">Soluciones Tecnológicas</h2>
                <p className="text-muted mx-auto" style={{ maxWidth: "720px" }}>
                    Ofrecemos soluciones integrales que combinan hardware, software y servicios especializados
                    para optimizar tus procesos y potenciar tu transformación digital.
                </p> 
            </div>

            <div className="row g-4">
                <div className="col-sm-12 col-xl-6">
                    <div className="card h-100 shadow-sm border-0 rounded-4">
                        <div className="card-body p-4">
                            <div className="mb-3 d-flex align-items-center justify-content-between">
                                <span className="badge bg-primary py-2 px-3 rounded-pill">Solución</span>
                                <i className="fas fa-code fa-2x text-primary"></i>
                            </div>
                            <h5 className="card-title fw-semibold">Desarrollo de Software</h5>
                            <ul className="list-unstyled">
                                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Análisis, diseño y desarrollo</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Aplicaciones web y móviles</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Software como servicio (SaaS)</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Soluciones en la nube</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-sm-12 col-xl-6">
                    <div className="card h-100 shadow-sm border-0 rounded-4">
                        <div className="card-body p-4">
                            <div className="mb-3 d-flex align-items-center justify-content-between">
                                <span className="badge bg-success py-2 px-3 rounded-pill">Solución</span>
                                <i className="fas fa-cogs fa-2x text-success"></i>
                            </div>
                            <h5 className="card-title fw-semibold">Control y Automatización</h5>
                            <ul className="list-unstyled">
                                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Automatización industrial</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Sistemas SCADA</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Programación de PLCs</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>IoT e Industria 4.0</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-sm-12 col-xl-6">
                    <div className="card h-100 shadow-sm border-0 rounded-4">
                        <div className="card-body p-4">
                            <div className="mb-3 d-flex align-items-center justify-content-between">
                                <span className="badge bg-warning text-dark py-2 px-3 rounded-pill">Solución</span>
                                <i className="fas fa-network-wired fa-2x text-warning"></i>
                            </div>
                            <h5 className="card-title fw-semibold">Redes y Telecomunicaciones</h5>
                            <ul className="list-unstyled">
                                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Cableado estructurado</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Configuración de servidores</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-sm-12 col-xl-6">
                    <div className="card h-100 shadow-sm border-0 rounded-4">
                        <div className="card-body p-4">
                            <div className="mb-3 d-flex align-items-center justify-content-between">
                                <span className="badge bg-info text-dark py-2 px-3 rounded-pill">Solución</span>
                                <i className="fas fa-tools fa-2x text-info"></i>
                            </div>
                            <h5 className="card-title fw-semibold">Soporte Técnico</h5>
                            <ul className="list-unstyled">
                                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Mantenimiento preventivo</li>
                                <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Mantenimiento correctivo</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Soluciones;