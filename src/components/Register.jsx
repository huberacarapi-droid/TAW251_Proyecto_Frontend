import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import logo from "../assets/logo.png";

function Register() {
    const [email, setEmail] = useState("");
    const [nombre, setNombre] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        // Validar longitud mínima
        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setLoading(true);

        try {
            const data = await register(email, nombre, password);
            setSuccess(data.message || "Usuario registrado exitosamente. Redirigiendo al login...");
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(err.message || "Error al registrar usuario");
            console.error("Error en registro:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center">
            <div className="row w-100">
                <div className="col-md-6 d-flex justify-content-center align-items-center bg-light">
                    <div className="text-center">
                        <img 
                            src={logo} 
                            alt="TiskoSolutions" 
                            className="img-fluid mb-4" 
                            style={{ maxWidth: "400px" }} 
                        />
                    </div>
                </div>
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "400px" }}>
                        <h4 className="mb-4 text-center">Registrarse</h4>

                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    {error}
                                    <button 
                                        type="button" 
                                        className="btn-close" 
                                        onClick={() => setError("")}
                                    ></button>
                                </div>
                            )}
                            
                            {success && (
                                <div className="alert alert-success alert-dismissible fade show" role="alert">
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                    {success}
                                    <button 
                                        type="button" 
                                        className="btn-close" 
                                        onClick={() => setSuccess("")}
                                    ></button>
                                </div>
                            )}

                            <div className="form-group mb-3">
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tu nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label>Correo</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="ejemplo@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label>Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="******** (mínimo 6 caracteres)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    minLength="6"
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label>Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="********"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    minLength="6"
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Registrando...
                                    </>
                                ) : "Registrarse"}
                            </button>
                        </form>

                        <div className="mt-3 text-center">
                            <small>
                                ¿Ya tienes cuenta?{" "}
                                <a href="/login" className="text-primary">
                                    Inicia sesión aquí
                                </a>
                            </small>
                        </div>

                        <div className="mt-3 text-center">
                            <small className="text-muted">
                                © 2026 TISKOSOLUTIONS S.R.L.
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;