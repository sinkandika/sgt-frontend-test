"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Flex } from "antd";

export default function LoginPage() {

  
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  const router = useRouter();

  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      router.push("/products");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={{
      backgroundColor: '#F4F2EF', 
      justifyContent:'center', 
      display:'flex', 
      height:"100vh", 
      alignItems:'center'
    }}>
      <div style={{ 
        height:'50vh', 
        backgroundColor: 'white', 
        borderRadius:"10px", 
        alignContent:'center', 
        display:'flex',
      }}>
        <div style={{ 
          padding:'30px',
          display:'flex', 
          flexDirection:'column', 
          alignItems:'center', 
          height:'50%',
        }}>
          <h2 style={{marginBottom:'50px', fontFamily:'inter', fontSize:'30px'}}>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ 
                display: "block", 
                marginBottom: "10px", 
                padding: "8px",
                width:'30vh',
                border: '1px solid',
                borderRadius:'5px',
                fontFamily:'inter',
                fontSize:'16px'
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ 
                display: "block", 
                marginBottom: "10px", 
                padding: "8px",
                width:'30vh',
                border: '1px solid',
                borderRadius:'5px',
                fontFamily:'inter',
                fontSize:'16px',
              }}
            />
            <button
            type="submit"
            style={{ 
              padding: "10px", 
              backgroundColor: "#EDB035", 
              border: "none", 
              borderRadius: "5px",
              width: '100%',
              fontFamily:'inter',
              fontSize:'16px',
              marginTop:'25px',
            }}>
              Login
            </button>
            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
