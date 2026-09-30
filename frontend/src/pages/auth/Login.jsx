import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@chefqueue.app', password: 'admin123' },
  { role: 'Chef', email: 'chef@chefqueue.app', password: 'chef123' },
  { role: 'Cashier', email: 'cashier@chefqueue.app', password: 'cashier123' },
];

export default function Login() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setError('');
    try {
      const user = await login(data.email, data.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setError(err.message);
    }
  };

  const fillDemo = (acc) => {
    setValue('email', acc.email);
    setValue('password', acc.password);
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-secondary-900">Welcome back</h1>
      <p className="mt-1.5 text-sm text-secondary-500">Sign in to manage your kitchen queue.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
        <Input
          label="Email address" icon={Mail} placeholder="you@chefqueue.app"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email' } })}
        />
        <Input
          label="Password" type="password" icon={Lock} placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', { required: 'Password is required', minLength: { value: 4, message: 'Too short' } })}
        />
        {error && <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-600">{error}</p>}
        <Button type="submit" className="w-full" loading={loading}>Sign in</Button>
      </form>

      <div className="mt-6 rounded-xl border border-dashed border-secondary-200 p-3.5">
        <p className="mb-2 text-xs font-medium text-secondary-500">Quick demo access</p>
        <div className="flex flex-wrap gap-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <button key={acc.role} onClick={() => fillDemo(acc)} type="button" className="rounded-lg border border-secondary-200 px-2.5 py-1 text-xs font-medium text-secondary-600 hover:border-primary-300 hover:text-primary-600">
              {acc.role}
            </button>
          ))}
        </div>
      </div>

      {/* <p className="mt-6 text-center text-sm text-secondary-500">
        New here? <Link to="/register" className="font-medium text-primary-600 hover:underline">Create an account</Link>
      </p> */}
    </div>
  );
}
