import React, { useState } from "react";
import { Link , useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../store/useAuth";

const Register = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const navigate=useNavigate()
  const {storeTokenInLS}=useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

 const handleSubmit= async(e)=>{
  e.preventDefault();
  console.log(values)
  if( !values.email || !values.password){
    return toast.error("please fill all fields")
  }
   try {
    const response= await fetch("http://localhost:6680/api/v1/user/login",{
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(values),
    });
    console.log(response);
    
    const res_data=await response.json();
    console.log("res_data",res_data);

    if(response.ok){
      toast.success("Login Successful")
      //to stored the token in localStorage
      storeTokenInLS(res_data.token);                    //method 2 
      // localStorage.setItem("token",res_data.token);   //method 1

      setValues({email:"",  password:"",})

      //
      navigate('/dashboard')
  } else{
      toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.msg )
  }
   } catch (error) {
     console.log("login >>",error)
   }
 }

  return (
    <>
      <div className="form-container">
        <form className="card p-3" onSubmit={handleSubmit}>
          <div className="mb-1">
            <label htmlFor="inputEmail4" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="inputEmail4"
              name="email"
              value={values.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-1">
            <label htmlFor="inputPassword4" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="inputPassword4"
              name="password"
              value={values.password}
              onChange={handleChange}
            />
          </div>
          <div className="d-flex justify-content-between" style={{margin:8}}>
            <p>New user? <Link to="/register">Register</Link></p>
            <div className="mb-1">
              <button type="submit" className="btn btn-primary">Login</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
