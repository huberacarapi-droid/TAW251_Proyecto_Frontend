import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import logo from "../assets/logo.png";
import { login } from "../services/authService";

function Login() {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [captchaToken, setCaptchaToken] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const captchaRef = useRef(null);
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validar captcha
        if (!captchaToken || captchaToken.trim() === "") {
            setError("Por favor complete el captcha");
            return;
        }

        setLoading(true);

        try {
            // Pasar el captchaToken como tercer parámetro
            const data = await login(email, password, captchaToken);

            // El backend devuelve access_token
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));
            
            // Redirigir al inicio
            navigate("/");
        } catch (err) {
            setError(err.message || "Error de conexión con el servidor");
            console.error("Error en login:", err);
            
            // Resetear captcha en caso de error
            if (captchaRef.current) {
                captchaRef.current.reset();
                setCaptchaToken(null);
            }
        } finally {
            setLoading(false);
        }
    };

    // Manejar cambio de captcha
    const handleCaptchaChange = (token) => {
        console.log("Captcha completado:", token ? "Token recibido" : "Token vacío");
        setCaptchaToken(token);
    };

    // Manejar expiración del captcha
    const handleCaptchaExpired = () => {
        console.log("Captcha expirado");
        setCaptchaToken(null);
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center">
            <div className="row w-100">
                {/* Lado izquierdo: Logotipo */}
                <div className="col-md-6 d-flex justify-content-center align-items-center bg-light">
                    <div className="text-center">
                        <img 
                            src={logo} 
                            alt="TISKOSOLUTIONS S.R.L." 
                            className="img-fluid mb-4" 
                            style={{ maxWidth: "500px" }} 
                        />
                    </div>
                </div>

                {/* Lado derecho: Formulario de login */}
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "400px" }}>
                        <h4 className="mb-4 text-center">Iniciar Sesión</h4>

                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    {error}
                                    <button 
                                        type="button" 
                                        className="btn-close" 
                                        onClick={() => setError("")}
                                        aria-label="Close"
                                    ></button>
                                </div>
                            )}

                            <div className="form-group mb-3">
                                <label htmlFor="email">Correo</label>
                                <input
                                    id="email"
                                    type="email"
                                    className={`form-control ${error ? 'is-invalid' : ''}`}
                                    placeholder="ejemplo@email.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) setError("");
                                    }}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label htmlFor="password">Contraseña</label>
                                <input
                                    id="password"
                                    type="password"
                                    className={`form-control ${error ? 'is-invalid' : ''}`}
                                    placeholder="********"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (error) setError("");
                                    }}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* CAPTCHA */}
                            <div className="mb-3 d-flex justify-content-center">
                                <ReCAPTCHA
                                    ref={captchaRef}
                                    sitekey={siteKey}
                                    onChange={handleCaptchaChange}
                                    onExpired={handleCaptchaExpired}
                                    onError={() => {
                                        console.error("Error al cargar el captcha");
                                        setCaptchaToken(null);
                                    }}
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-primary w-100"
                                disabled={loading || !captchaToken}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Iniciando...
                                    </>
                                ) : "Ingresar"}
                            </button>
                        </form>

                        <div className="mt-3 text-center">
                            <small>
                                ¿No tienes cuenta?{" "}
                                <a href="/register" className="text-primary">
                                    Regístrate aquí
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

export default Login;