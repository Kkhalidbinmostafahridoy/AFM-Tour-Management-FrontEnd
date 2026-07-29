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
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Change Password</h1>

      <div className="bg-white/50 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="oldPassword">Current Password</Label>
            <Input
              id="oldPassword"
              name="oldPassword"
              type="password"
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              required
            />
          </div>
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              required
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              required
            />
          </div>
          <div className="pt-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Changing Password..." : "Update Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
