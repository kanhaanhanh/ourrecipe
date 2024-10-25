import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../contexts/UserContext/UserContext";
import { Card, Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../../assets/Logo.PNG";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import './Login.scss';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn } = useUserAuth();
  const navigate = useNavigate();

  const auth = getAuth();

  const initialRememberMe = localStorage.getItem("rememberMe") === "true";
  const [rememberMe, setRememberMe] = useState(initialRememberMe);

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("rememberedEmail");

    if (storedEmail && rememberMe) {
      setEmail(storedEmail);
    }
  }, [rememberMe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const LogIn = await logIn(email, password);

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      if (LogIn === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReset = () => {
    navigate("/reset");
  };

  useEffect(() => {
    localStorage.setItem("rememberMe", rememberMe.toString());
  }, [rememberMe]);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const handleFacebookSignIn = () => {
    // Handle Facebook sign-in UI (no backend logic in this example)
  };

  return (
    <Container className="login-signup-body">
      <header>
        <Link className="techbook-logo" to="/" aria-label="Tech-Book">
          <img src={Logo} alt="Tech-Book Logo" />
        </Link>
      </header>
      <main>
        <div className="card flex-row mx-auto position-absolute top-50 start-50 translate-middle">
          <div className="img-right-sign_up d-none d-md-flex"></div>
          <Card.Body className="card-body-log-in">
            <div className="logo-img">
              <img src={Logo} alt="Logo" />
            </div>
            <h3 className=" mt-1 text-center" style={{ color: "blue" }}>
              Welcome to Tech-Book!
            </h3>
            <h5 className="text-center mt-4" style={{ marginBottom: "30px" }}>
              Login into your account!
            </h5>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form className="form-box px-3" onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <div className="form-input">
                  <span>
                    <i className="fa fa-envelope-o"></i>
                  </span>
                  <Form.Control
                    type="email"
                    placeholder="Email address"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <div className="form-input">
                  <span>
                    <i className="fa fa-key"></i>
                  </span>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>
              <Row className="mb-3">
                <Col xs={6}>
                  <Form.Check
                    type="checkbox"
                    label="Remember me"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                  />
                </Col>
                <Col xs={6} className="text-end">
                  <Link to="/reset" onClick={handleReset} className="forget-link">
                    <b>Forget Password</b>
                  </Link>
                </Col>
              </Row>
              <div className="d-grid gap-2 ">
                <Button
                  type="submit"
                  variant="primary"
                  className="rounded-pill w-100"
                >
                  Log in
                </Button>
              </div>

              <div className="text-center mb-3">or login with</div>
              <Row className="mb-3">
                <Col xs={6}>
                  <Link to="#" className="btn btn-block btn-social btn-facebook rounded-pill" onClick={handleGoogleSignIn}>

                  </Link>
                </Col>
                <Col xs={6}>
                  <Link to="#" className="btn btn-block btn-social btn-google rounded-pill" onClick={handleFacebookSignIn}>

                  </Link>
                </Col>
              </Row>


              <div className="text-center mt-3">
                Don&sbquo;t have an account? <Link to="/signup">
                  <b>Sign up</b>
                </Link>
              </div>
            </Form>
          </Card.Body>
        </div>
      </main>
    </Container>
  );
};

export default Login;
