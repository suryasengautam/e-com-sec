import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/auth';
import "./login.css";
function SignUp() {
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        const { name, email, password } = e.target;
        await signUp(email.value, password.value, name.value);
        navigate("/login");
    }
    return (
        <div className='login'>
            <form onSubmit={handleSignUp}>
                <h2 className='heading'>E-comm</h2>
                <section>
                    <label htmlFor="name"><strong>Name</strong></label>
                    <input type="text" name="name" id="name" />
                </section>
                <section>
                    <label htmlFor="email"><strong>Email</strong></label>
                    <input type="text" name="email" id="email" />
                </section>
                <section>
                    <label htmlFor="password"><strong>Password</strong></label>
                    <input type="password" name="password" id="password" />
                </section>
                <button type='submit'>Sign Up</button>
            </form>
        </div>
    )
}

export default SignUp