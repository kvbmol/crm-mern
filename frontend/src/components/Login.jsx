import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';  // ADD THIS
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();  // ADD THIS
  const [error, setError] = useState('');
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('/auth/login', { 
        name: data.name,
        password: data.password 
      });
      dispatch({ type: 'LOGIN', payload: res.data });
      navigate('/dashboard');  // ✅ React Router navigation
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">CRM Login</h1>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register('name', { required: 'Name required' })}
            type="text"
            placeholder="Name (admin)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            {...register('password', { required: 'Password required' })}
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
