'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import './Userlist.css'; // Ensure this CSS file is created and linked

const LOCAL_API_URL = 'http://localhost:5000/users'; // URL of your Node.js server
const PLACEHOLDER_API_URL = 'https://jsonplaceholder.typicode.com/users'; // URL of JSONPlaceholder

export default function UserList() {
  const [localUsers, setLocalUsers] = useState([]);
  const [placeholderUsers, setPlaceholderUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', website: '' });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchLocalUsers();
    fetchPlaceholderUsers();
  }, []);

  const fetchLocalUsers = async () => {
    try {
      const response = await axios.get(LOCAL_API_URL);
      setLocalUsers(response.data);
    } catch (err) {
      setError('Failed to load local users. Please try again later.');
    }
  };

  const fetchPlaceholderUsers = async () => {
    try {
      const response = await axios.get(PLACEHOLDER_API_URL);
      setPlaceholderUsers(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load placeholder users. Please try again later.');
      setIsLoading(false);
    }
  };

  const addUser = async () => {
    try {
      const response = await axios.post(LOCAL_API_URL, newUser);
      setLocalUsers([...localUsers, response.data]);
      setNewUser({ name: '', email: '', phone: '', website: '' }); // Reset form
    } catch (err) {
      setError('Failed to add user. Please try again later.');
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${LOCAL_API_URL}/${id}`);
      setLocalUsers(localUsers.filter(user => user.id !== id));
    } catch (err) {
      setError('Failed to delete user. Please try again later.');
    }
  };

  const updateUser = async () => {
    try {
      const response = await axios.put(`${LOCAL_API_URL}/${editingUser.id}`, editingUser);
      setLocalUsers(localUsers.map(user => (user.id === editingUser.id ? response.data : user)));
      setEditingUser(null); // Reset editing
      setNewUser({ name: '', email: '', phone: '', website: '' }); // Reset form
    } catch (err) {
      setError('Failed to update user. Please try again later.');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setNewUser(user); // Pre-fill the form for editing
  };

  if (isLoading) return <div className="container mx-auto p-4">Loading users...</div>;
  if (error) return <div className="m-4 p-4 border border-red-500 bg-red-100 text-red-700">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">User List</h1>
      
      {/* Form to add or update users */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          type="tel"
          placeholder="Phone"
          value={newUser.phone}
          onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Website"
          value={newUser.website}
          onChange={(e) => setNewUser({ ...newUser, website: e.target.value })}
        />
        {editingUser ? (
          <button onClick={updateUser}>Update User</button>
        ) : (
          <button onClick={addUser}>Add User</button>
        )}
      </div>

      {localUsers.length > 0 ? (
        <table className="min-w-full border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Phone</th>
              <th className="border border-gray-300 p-2">Website</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {localUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{user.name}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">{user.phone}</td>
                <td className="border border-gray-300 p-2">
                  <a href={`http://${user.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Visit
                  </a>
                </td>
                <td className="border border-gray-300 p-2">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onClick={() => handleEdit(user)}>
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => deleteUser(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}

      <h2 className="text-xl font-bold mb-2">Placeholder Users</h2>
      {placeholderUsers.length > 0 ? (
        <table className="min-w-full border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Phone</th>
              <th className="border border-gray-300 p-2">Website</th>
            </tr>
          </thead>
          <tbody>
            {placeholderUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{user.name}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">{user.phone}</td>
                <td className="border border-gray-300 p-2">
                  <a href={`http://${user.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Visit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No placeholder users found.</p>
      )}
    </div>
  );
}
