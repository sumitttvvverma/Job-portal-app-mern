import React, { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../store/useAuth";

const Register = () => {
  const [values, setValues] = useState({ name: "", email: "", password: "",location:"" });

  const navigate=useNavigate();
  const {storeTokenInLS}=useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

 const handleSubmit=async(e)=>{
  e.preventDefault();
  if(!values.name || !values.email || !values.password){
    return toast.error("please fill all fields")
  }
  console.log(values);
  //backend-frontend Mix
  try {
    const response= await fetch("http://localhost:6680/api/v1/user/register",{
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
          toast.success("Registration successful")   
          navigate("/login")
          setValues({ username:"",  email:"",  password:""}) 
         }
         else{
          // alert("delulu")
          // console.log(res_data.extraDetails)
          toast.error("Registration not succeed , Try again");
         }

  } catch (error) {
    console.log("register >>",error)
  }
 }

  return (
    <>
      <div className="form-container">
        <form className="card p-3" onSubmit={handleSubmit}>
          <div className="mb-1">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
            />
          </div>
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
            <label htmlFor="location" className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              id="location"
              name="location"
              value={values.location}
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
            <p>Already Registered? <Link to="/login">Login</Link></p>
            <div className="mb-1">
              <button type="submit" className="btn btn-primary">Register</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
