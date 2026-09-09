import { useState } from 'react';
import { Camera } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setEditOpen(false); toast.success('Profile updated'); }, 700);
  };
  const handlePasswordChange = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setPwOpen(false); toast.success('Password changed'); }, 700);
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
          <Input label="Full name" defaultValue={user?.name} />
          <Input label="Phone" defaultValue={user?.phone} />
        </div>
      </Modal>

      <Modal open={pwOpen} onClose={() => setPwOpen(false)} title="Change password"
        footer={<><Button variant="outline" onClick={() => setPwOpen(false)}>Cancel</Button><Button loading={saving} onClick={handlePasswordChange}>Update password</Button></>}>
        <div className="space-y-4">
          <Input label="Current password" type="password" />
          <Input label="New password" type="password" />
          <Input label="Confirm new password" type="password" />
        </div>
      </Modal>
    </div>
  );
}
