function About() {
    return (
        <div className="container mt-1">
            <div className="text-center mb-2">
                <h2 className="fw-bold text-primary">Sobre Nosotros</h2>
                <p className="text-muted mx-auto" style={{ maxWidth: "680px" }}>
                    En TISKOSOLUTIONS S.R.L. trabajamos para ofrecer valor real a nuestros clientes,
                    a través de soluciones tecnológicas seguras, eficientes y adaptadas a cada desafío.
                </p>
            </div>

            <div className="row g-4">
                <div className="col-md-6">
                    <div className="card shadow-sm rounded-4 border-0 h-100">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center mb-3">
                                <span className="badge bg-primary rounded-pill me-3 py-2 px-3">
                                    Misión
                                </span>
                                <i className="fas fa-bullseye fa-lg text-primary"></i>
                            </div>
                            <p className="card-text text-secondary lh-lg">
                                Nuestra misión es ofrecer servicios y soluciones tecnológicas avanzadas de alta calidad, diseñadas para satisfacer las necesidades específicas de cada cliente.
                                Nos comprometemos a proporcionar soluciones innovadoras, eficientes y seguras que impulsen la transformación digital, garanticen la seguridad de la información y optimicen la gestión de datos, para mejorar la productividad y competitividad de nuestros clientes.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card shadow-sm rounded-4 border-0 h-100">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center mb-3">
                                <span className="badge bg-success rounded-pill me-3 py-2 px-3">
                                    Visión
                                </span>
                                <i className="fas fa-eye fa-lg text-success"></i>
                            </div>
                            <p className="card-text text-secondary lh-lg">
                                Ser reconocidos como líderes globales en el desarrollo de soluciones integrales, destacando por nuestra excelencia en el servicio, innovación tecnológica y capacidad para resolver los desafíos más complejos.
                                Aspiramos a transformar la industria mediante la integración de tecnologías avanzadas y el desarrollo de soluciones que permitan a nuestros clientes alcanzar sus objetivos estratégicos.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;