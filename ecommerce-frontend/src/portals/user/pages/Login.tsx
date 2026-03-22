import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import type { UserRole } from '../../../shared/types/user.types';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, role, name);
    if (success) {
      if (role === 'seller') navigate('/seller');
      else navigate('/');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600 mb-2">Welcome Back</h1>
          <p className="text-gray-500">Sign in to continue to Jesify</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex gap-4 justify-center p-1 bg-gray-50 rounded-lg">
              {(['user', 'seller'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium capitalize transition-colors ${role === r ? 'bg-white text-primary-600 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" className="w-full" size="lg">
            Login as {role}
          </Button>
        </form>
      </div>
    </div>
  );
};
