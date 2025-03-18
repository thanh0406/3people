import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Table, Container } from "react-bootstrap";

const AccountAdmin = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:3000/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách tài khoản:", error);
        }
    };


    const lockUser = async (email) => {
        try {
            const response = await axios.post("http://localhost:3000/lock-user", { email });


            setUsers(users.map(user =>
                user.email === email ? { ...user, isLocked: true } : user
            ));

            alert(response.data.message);
        } catch (error) {
            console.error("Lỗi khi khóa tài khoản:", error);
        }
    };

    return (
        <Container className=" mt-4">
            <h2 className="text-center mb-4">Quản lý tài khoản</h2>
            <div className="table-responsive w-100">
                <Table striped bordered hover className="text-center">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <span className={`badge ${user.isLocked ? "bg-danger" : "bg-success"}`}>
                                        {user.isLocked ? "Đã khóa" : "Hoạt động"}
                                    </span>
                                </td>
                                <td>
                                    <Button
                                        variant={user.isLocked ? "secondary" : "danger"}
                                        onClick={() => lockUser(user.email)}
                                        disabled={user.isLocked}
                                    >
                                        {user.isLocked ? "Đã khóa" : "Khóa"}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};

export default AccountAdmin;
