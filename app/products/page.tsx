"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Space, Modal, Form, Input, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

interface Product {
  product_id?: string;
  product_title: string;
  product_price: number;
  product_description?: string;
  product_category?: string;
  product_image?: string;
  created_timestamp?: string;
  updated_timestamp?: string;
}

export default function tablePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; 

    const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) return <p>Redirecting to login...</p>;


  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  //  Fetch products
  const fetchProducts = async (search = "", page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get("/api/products", {
        params: { search, page, limit: pageSize },
      });
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  // fetch first page
  useEffect(() => {
    setCurrentPage(1);
    fetchProducts(debouncedSearch, 1); 
  }, [debouncedSearch]);


  useEffect(() => {
    fetchProducts(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchProducts();
  }, []);

  //  Handle delete
  const handleDelete = (product_id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await axios.delete(`/api/product?product_id=${product_id}`);
          message.success("Product deleted successfully!");
          fetchProducts(); 
        } catch (error) {
          console.error("❌ Failed to delete:", error);
          message.error("Failed to delete product.");
        }
      },
    });
  };

  //  Handle edit
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditMode(true);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };


  //  create / edit 
  const handleSubmit = async (values: Product) => {
    try {
      if (isEditMode && editingProduct) {
        await axios.put("/api/product", {
          product_id: editingProduct.product_id,
          ...values,
        });
        form.resetFields();
      } else {
        await axios.post("/api/product", values);
        form.resetFields(); 
        setEditingProduct(null);
        setIsEditMode(false);
        setIsModalVisible(true);
      }
      setIsModalVisible(false);
      setIsEditMode(false);
      setEditingProduct(null);
      fetchProducts(); 
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };


  // modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditMode(false);
    setEditingProduct(null);
    form.resetFields();
  };

  const columns: ColumnsType<Product> = [
    {
      title: "Product Title",
      dataIndex: "product_title",
      key: "product_title",
    },
    {
      title: "Price",
      dataIndex: "product_price",
      key: "product_price",
      render: (price: number) => `Rp ${price?.toLocaleString()}`,
    },
    {
      title: "Category",
      dataIndex: "product_category",
      key: "product_category",
    },
    {
      title: "Description",
      dataIndex: "product_description",
      key: "product_description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            style={{ backgroundColor: "#2475EA" }}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            danger
            style={{ backgroundColor: "#EA5444", color: "white" }}
            onClick={() => handleDelete(record.product_id!)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];


  return (
    <div style={{ backgroundColor: "#F4F2EF", padding: "40px", height: '100vh'}}>
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <h1 style={{ fontSize: "35px", fontFamily: "inter" }}>Product List</h1>
        <div
          style={{
            display: "flex",
            width: '100%',
            alignItems: "center",
            height: "40px",
            marginBottom: "10px",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              height: "100%",
              border: "1px solid",
              borderRadius: "5px",
              borderColor: "#5B5B5B",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              paddingLeft: "10px",
              marginRight: "10px",
            }}
          >
            <img src="/search.svg" alt="search-icon" width="20px" />
            <input
              id="search-input"
              type="text"
              placeholder="search"
              aria-label="Search products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                marginLeft: "10px",
                fontSize: "17px",
                border: "none",
                outline: "none",
                background: "transparent",
              }}
            />

          </div>
          <Button
            type="primary"
            style={{
              backgroundColor: "#EDB035",
              border: "none",
              boxShadow:"none",
              borderRadius: "10px",
              fontFamily: "inter",
              fontSize: "16px",
              height: "45px",
            }}
            onClick={() => {
              setIsEditMode(false);
              setEditingProduct(null);
              setIsModalVisible(true);
            }}
          >
            <img src="plus.svg" alt="plus-icon" style={{width: '15px'}}/>
            New Product
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={products}
          rowKey="product_id"
          loading={loading}
          style={{ maxHeight: '60vh', overflowY: 'auto', minHeight: 0, }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            onChange: (page) => {
              setCurrentPage(page);
              fetchProducts(debouncedSearch, page);
            },
          }}
        />

        <Modal
          title={isEditMode ? "Edit Product" : "Create New Product"}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="product_title"
              label="Product Title"
              rules={[{ required: true, message: "Please input product title!" }]}
            >
              <Input placeholder="Enter product title" />
            </Form.Item>

            <Form.Item
              name="product_price"
              label="Price (Rp)"
              rules={[{ required: true, message: "Please input price!" }]}
            >
              <Input type="number" placeholder="Enter product price" />
            </Form.Item>

            <Form.Item name="product_category" label="Category">
              <Input placeholder="Enter category (optional)" />
            </Form.Item>

            <Form.Item name="product_description" label="Description">
              <Input.TextArea rows={3} placeholder="Enter description (optional)" />
            </Form.Item>

            <Form.Item name="product_image" label="Image URL">
              <Input placeholder="Enter image URL (optional)" />
            </Form.Item>

            <div style={{ textAlign: "right" }}>
              <Button onClick={handleCancel} style={{ marginRight: "10px" }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {isEditMode ? "Update Product" : "Save Product"}
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
