import { useState } from 'react'
import { Link, useNavigate } from 'react-router';
import supabase from './supabase-client';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const submitLogin = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");


    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });


    if (error) {
      setMessage("Error signing in: " + error.message);
      setPassword("");
      return;
    }

    navigate("/dnd");
  };

  return (
    <div className='flex flex-col h-screen items-center justify-center px-6 space-y-6'>

      {/* page name */}
      <h1 className='text-blue-600 text-2xl font-bold'>Login Page</h1>

      {/* login form */}
      <div className='w-full flex justify-center md:w-1/2 md:px-12'>
        <form className='w-full' onSubmit={submitLogin}>
          <input
            className='w-full border border-gray-200 rounded-lg p-2 mb-3'
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
          />

          <input
            className='w-full border border-gray-200 rounded-lg p-2'
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
          />

          {/* error message */}
          {message && <p className='text-red-500 mt-2'>{message}</p>}

          <button
            className='w-full mt-6 border rounded-lg p-2 bg-blue-600 text-white hover:bg-white hover:border-blue-600 hover:text-blue-600' type='submit'>Log In</button>
        </form>
      </div>

      <div className="flex w-full justify-between md:flex-row md:w-1/2 md:px-12">
        {/* forgot password */}
          <Link className='text-blue-600 hover:underline' to="/forgot-password">Forget Password?</Link>
        {/* sign up */}
          <Link className='text-blue-600 hover:underline' to="/signup">Create Account</Link>
      </div>


    </div>
  )
}

export default Login;
