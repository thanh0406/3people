import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [messageClass, setMessageClass] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/register', {
                email,
                password,
                name,
            });

            setMessage(response.data.message);
            setMessageClass('alert alert-success');

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Lỗi đăng ký!';
            setMessage(errorMsg);
            setMessageClass('alert alert-danger');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card p-4 shadow-lg" style={{ width: '400px' }}>
                <h2 className="text-center mb-3">Đăng ký</h2>

                {message && <div className={messageClass}>{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Họ và tên:</label>
                        <input 
                            type="text" 
                            className="form-control"
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </div>
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
                    <button type="submit" className="btn btn-primary w-100">Đăng ký</button>
                </form>

                <div className="text-center mt-3">
                    <button onClick={() => navigate('/login')} className="btn btn-outline-secondary w-100">
                        Quay về trang đăng nhập
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;
