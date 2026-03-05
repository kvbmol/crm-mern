import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { state, dispatch } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('/customers', {
        headers: { Authorization: `Bearer ${state.token}` }
      });
      setCustomers(res.data);
    } catch (err) {
      console.error('Failed to fetch customers');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        // Update
        await axios.put(`/customers/${editingCustomer._id}`, formData, {
          headers: { Authorization: `Bearer ${state.token}` }
        });
      } else {
        // Create
        await axios.post('/customers', formData, {
          headers: { Authorization: `Bearer ${state.token}` }
        });
      }
      setFormData({ name: '', email: '', phone: '' });
      setShowForm(false);
      setEditingCustomer(null);
      fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.error || 'Operation failed');
    }
  };

  const editCustomer = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone
    });
    setShowForm(true);
  };

  const deleteCustomer = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await axios.delete(`/customers/${id}`, {
          headers: { Authorization: `Bearer ${state.token}` }
        });
        fetchCustomers();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">CRM Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span>Welcome, {state.user?.name}</span>
              <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Customers</h2>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 font-semibold"
          >
            {showForm ? 'Cancel' : '+ Add Customer'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-8 rounded-2xl shadow-xl mb-8">
            <h3 className="text-xl font-bold mb-6">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <button type="submit" className="md:col-span-3 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700">
                {editingCustomer ? 'Update Customer' : 'Add Customer'}
              </button>
            </form>
          </div>
        )}

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    No customers. <button onClick={() => setShowForm(true)} className="text-blue-600 hover:underline font-medium">Add your first customer</button>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{customer.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{customer.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{customer.phone}</td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <button 
                        onClick={() => editCustomer(customer)}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteCustomer(customer._id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
