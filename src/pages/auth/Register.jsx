import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setError('');
    try {
      const user = await registerUser(data);
      toast.success(`Account created — welcome, ${user.name.split(' ')[0]}!`);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-secondary-900">Create your account</h1>
      <p className="mt-1.5 text-sm text-secondary-500">Set up staff access to the order queue.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
        <Input label="Full name" icon={User} placeholder="Aarav Sharma" error={errors.name?.message}
          {...register('name', { required: 'Name is required' })} />
        <Input label="Email address" icon={Mail} placeholder="you@chefqueue.app" error={errors.email?.message}
          {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email' } })} />
        <Input label="Phone number" icon={Phone} placeholder="+91 98765 43210" error={errors.phone?.message}
          {...register('phone', { required: 'Phone number is required' })} />
        <Select label="Role" options={[{ value: 'admin', label: 'Admin' }, { value: 'chef', label: 'Chef' }, { value: 'cashier', label: 'Cashier' }]}
          {...register('role', { required: true })} />
        <Input label="Password" type="password" icon={Lock} placeholder="••••••••" error={errors.password?.message}
          {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })} />
        <Input label="Confirm password" type="password" icon={Lock} placeholder="••••••••" error={errors.confirmPassword?.message}
          {...register('confirmPassword', { required: 'Please confirm your password', validate: (v) => v === watch('password') || 'Passwords do not match' })} />
        {error && <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-600">{error}</p>}
        <Button type="submit" className="w-full" loading={loading}>Create account</Button>
      </form>

      <p className="mt-6 text-center text-sm text-secondary-500">
        Already have an account? <Link to="/login" className="font-medium text-primary-600 hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
