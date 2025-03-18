import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageClass, setMessageClass] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', {
                email,
                password,
            });

            console.log('API Response:', response.data);

            setMessage(response.data.message);
            setMessageClass('alert alert-success');

            if (response.data.user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/home');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Lỗi đăng nhập!';
            setMessage(errorMsg);
            setMessageClass('alert alert-danger');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card p-4 shadow-lg" style={{ width: '400px' }}>
                <h2 className="text-center mb-3">Đăng nhập</h2>
                
                {message && <div className={messageClass}>{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email:</label>
                        <input 
                            type="email" 
                            className="form-control"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Mật khẩu:</label>
                        <input 
                            type="password" 
                            className="form-control"
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Đăng nhập</button>
                </form>

                <div className="text-center mt-3">
                    <p>Chưa có tài khoản? <Link to="/register">Tạo tài khoản</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
