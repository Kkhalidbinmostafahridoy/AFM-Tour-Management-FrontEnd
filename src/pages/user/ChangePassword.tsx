import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePasswordMutation } from "@/redux/features/Auth/auth.api";

function ChangePassword() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    
    try {
      await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      }).unwrap();
      
      toast.success("Password changed successfully!");
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto min-h-screen relative">
      {/* 3D Background Decorative Elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="flex items-center gap-5 mb-12">
        <div className="w-16 h-16 rounded-2xl bg-[#222222] border border-[#2a2a2a] text-emerald-400 flex items-center justify-center shadow-xl glass-panel hover-3d-tilt" data-cursor="card">
          <span className="text-3xl font-black">🔒</span>
        </div>
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 tracking-tight">
            Security
          </h1>
          <p className="text-[#9ca3af] font-medium text-lg mt-1 tracking-wide">
            Update your password to keep your account safe
          </p>
        </div>
      </div>

      <div className="bg-[#222222] rounded-[2rem] shadow-2xl border border-[#2a2a2a] p-8 md:p-12 glass-panel transition-all duration-300">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
          <div>
            <Label htmlFor="oldPassword" className="text-gray-400 font-bold mb-2 block">Current Password</Label>
            <Input
              id="oldPassword"
              name="oldPassword"
              type="password"
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              required
              className="h-12 bg-[#1a1a1a] border-[#333] text-white focus-visible:ring-emerald-500 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="newPassword" className="text-gray-400 font-bold mb-2 block">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              required
              className="h-12 bg-[#1a1a1a] border-[#333] text-white focus-visible:ring-emerald-500 rounded-xl"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="text-gray-400 font-bold mb-2 block">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              required
              className="h-12 bg-[#1a1a1a] border-[#333] text-white focus-visible:ring-emerald-500 rounded-xl"
            />
          </div>
          <div className="pt-8">
            <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold h-12 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/40 text-lg">
              {isLoading ? "Changing Password..." : "Update Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
