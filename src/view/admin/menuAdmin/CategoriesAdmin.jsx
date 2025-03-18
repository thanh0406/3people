import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Container, Form, Row, Col, Card, Spinner } from "react-bootstrap";

const CategoriesAdmin = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState({ name: "", description: "" });
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:3000/categories")
            .then(response => {
                setCategories(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Lỗi lấy danh mục:", error);
                setLoading(false);
            });
    }, []);

    const handleAddCategory = () => {
        if (!newCategory.name || !newCategory.description) {
            alert("Vui lòng nhập đầy đủ thông tin danh mục");
            return;
        }

        axios.post("http://localhost:3000/categories", newCategory)
            .then(response => {
                setCategories([...categories, response.data]);
                setNewCategory({ name: "", description: "" });
            })
            .catch(error => {
                console.error("Lỗi thêm danh mục:", error);
            });
    };

    const handleEditCategory = (id) => {
        const category = categories.find(cat => cat.id === id);
        setEditingCategory(category);
    };

    const handleSaveEdit = () => {
        if (!editingCategory.name || !editingCategory.description) {
            alert("Vui lòng nhập đầy đủ thông tin danh mục");
            return;
        }

        axios.put(`http://localhost:3000/categories/${editingCategory.id}`, editingCategory)
            .then(response => {
                const updatedCategories = categories.map(cat =>
                    cat.id === editingCategory.id ? response.data : cat
                );
                setCategories(updatedCategories);
                setEditingCategory(null);
            })
            .catch(error => {
                console.error("Lỗi sửa danh mục:", error);
            });
    };

    const handleDeleteCategory = (id) => {
        axios.delete(`http://localhost:3000/categories/${id}`)
            .then(() => {
                setCategories(categories.filter(cat => cat.id !== id));
            })
            .catch(error => {
                console.error("Lỗi xóa danh mục:", error);
            });
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p>Đang tải danh mục...</p>
            </div>
        );
    }

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">📂 Quản lý Danh Mục</h2>

            <Card className="shadow p-3 mb-4 bg-white rounded">
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={5}>
                            <Form.Control
                                type="text"
                                placeholder="Tên danh mục"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            />
                        </Col>
                        <Col md={5}>
                            <Form.Control
                                type="text"
                                placeholder="Mô tả"
                                value={newCategory.description}
                                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                            />
                        </Col>
                        <Col md={2}>
                            <Button variant="primary" className="w-100" onClick={handleAddCategory}>
                                ➕ Thêm
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {editingCategory && (
                <Card className="shadow p-3 mb-4 bg-light rounded">
                    <Card.Body>
                        <Row className="mb-3">
                            <Col md={5}>
                                <Form.Control
                                    type="text"
                                    value={editingCategory.name}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                />
                            </Col>
                            <Col md={5}>
                                <Form.Control
                                    type="text"
                                    value={editingCategory.description}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                                />
                            </Col>
                            <Col md={2}>
                                <Button variant="success" className="w-100 mb-2" onClick={handleSaveEdit}>
                                    💾 Lưu
                                </Button>
                                <Button variant="secondary" className="w-100" onClick={() => setEditingCategory(null)}>
                                    ❌ Hủy
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}

            <Table striped bordered hover className="shadow">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Tên danh mục</th>
                        <th>Mô tả</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category => (
                        <tr key={category.id}>
                            <td>{category.id}</td>
                            <td>{category.name}</td>
                            <td>{category.description}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    className="me-2"
                                    onClick={() => handleEditCategory(category.id)}
                                >
                                    ✏️ Sửa
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDeleteCategory(category.id)}
                                >
                                    🗑️ Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default CategoriesAdmin;
