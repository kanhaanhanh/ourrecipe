import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../contexts/UserContext/UserContext";
import { Card, Form, Button, Alert, Row, Col, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.scss';
import Logo from '../../assets/Logo.PNG';

const Signup = () => {
    const { signUp } = useUserAuth();
    const [error, setError] = useState("");
    const [user, setUser] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        comfirmPassword: "",
    });
    const userhandler = (event) => {
        const { name, value } = event.target;
        console.log(name + ":::::::::::::" + value)
        setUser((perState) => ({ ...perState, [name]: value }));
    };

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

    const RegisterHandler = (e) => {
        e.preventDefault();
        const { email, password, comfirmPassword, firstName, lastName } = user;
        if (password !== comfirmPassword) {
            setInterval(() => {
                setError("");
            }, 5000);
            return setError("password does not match!");
        }
        if (error) {
            setInterval(() => {
                setError("");
            }, 5000);
            setError(error);
        }
        signUp(email, password, firstName, lastName);
    }

    return (
        <Container className="login-signup-body">
            <header>
                <Link className="techbook-logo" to="/" aria-label="Tech-Book">
                    <img src={Logo} alt="Tech-Book Logo" />
                </Link>
            </header>
            <main>
                <Row className="d-flex">
                    <Col md={6} className="ml-auto">
                        <Card className="position-absolute top-50 start-50 translate-middle flex-row">
                            <div className="img-right-sign_up d-none d-md-flex"></div>
                            <Card.Body className="card-body-sign-up">
                                <div className="logo-img">
                                    <img src={Logo} alt="Logo" />
                                </div>
                                <h3 className=" mt-1 text-center" style={{ color: 'blue' }}>
                                    Welcome to Tech-Book!
                                </h3>
                                <h5 className="text-center mt-4" style={{ marginBottom: '30px' }}>
                                    Create an account
                                </h5>
                                <Form className="form-box px-3" onSubmit={RegisterHandler}>
                                    <Row className="d-flex justify-content-between">
                                        <Col md={6}>
                                            <div className="form-input">
                                                <span><i className="fa fa-user"></i></span>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    placeholder="First Name"
                                                    onChange={userhandler}
                                                    required
                                                />
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="form-input">
                                                <span><i className="fa fa-user"></i></span>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    placeholder="Last Name"
                                                    onChange={userhandler}
                                                    required
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <div className="form-input">
                                            <span><i className="fa fa-envelope"></i></span>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                placeholder="Email Address"
                                                onChange={userhandler}
                                                required
                                            />
                                        </div>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <div className="form-input">
                                            <span><i className="fa fa-key"></i></span>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                placeholder="Password"
                                                onChange={userhandler}
                                                required
                                            />
                                        </div>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formConfirmPassword">
                                        <div className="form-input">
                                            <span><i className="fa fa-key"></i></span>
                                            <Form.Control
                                                type="password"
                                                name="comfirmPassword"
                                                placeholder="Confirm Password"
                                                onChange={userhandler}
                                                required
                                            />
                                            <span className="error-message" id="error-message"></span>
                                        </div>
                                    </Form.Group>
                                    {error && <Alert variant="danger">{error}</Alert>}
                                    <div className="d-grid gap-2">
                                        <Button type="submit" variant="primary" className="rounded-pill w-100">
                                            Sign up
                                        </Button>
                                    </div>

                                    <div className="text-center mb-3">or sign up with</div>
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
                                        Already have an account? <Link to="/login" className="login-link">Log In</Link>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </main>
        </Container>
    );
};

export default Signup;