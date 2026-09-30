import { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  useEffect(() => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
  }, [user, editOpen]);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = async () => {
    setSaving(true);
    try {
      await userService.updateMyProfile({ name, phone });
      await refreshUser();
      toast.success('Profile updated');
      setEditOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await userService.changeMyPassword(currentPassword, newPassword);
      toast.success('Password changed');
      setPwOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-xl font-bold text-secondary-900">Profile</h1>
      <p className="mt-1 text-sm text-secondary-500">Your personal account details.</p>

      <Card className="mt-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={user?.avatar} alt={user?.name} className="h-20 w-20 rounded-2xl object-cover" />
            <button className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 text-white shadow-md hover:bg-primary-600">
              <Camera size={13} />
            </button>
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-secondary-900">{user?.name}</p>
            <p className="text-sm capitalize text-secondary-500">{user?.role}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-secondary-400">Email</p>
            <p className="mt-1 text-sm text-secondary-800">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-secondary-400">Phone</p>
            <p className="mt-1 text-sm text-secondary-800">{user?.phone || '+91 90000 00000'}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={() => setPwOpen(true)}>Change password</Button>
          <Button onClick={() => setEditOpen(true)}>Edit profile</Button>
        </div>
      </Card>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit profile"
        footer={<><Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button><Button loading={saving} onClick={handleSave}>Save changes</Button></>}>
        <div className="space-y-4">
          <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </Modal>

      <Modal open={pwOpen} onClose={() => setPwOpen(false)} title="Change password"
        footer={<><Button variant="outline" onClick={() => setPwOpen(false)}>Cancel</Button><Button loading={saving} onClick={handlePasswordChange}>Update password</Button></>}>
        <div className="space-y-4">
          <Input label="Current password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          <Input label="New password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <Input label="Confirm new password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}
