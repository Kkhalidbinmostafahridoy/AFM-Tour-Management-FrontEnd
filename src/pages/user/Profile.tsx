import { useState } from "react";
import { useUserInfoQuery } from "@/redux/features/Auth/auth.api";
import { useUpdateUserMutation } from "@/redux/features/user/user.api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Profile() {
  const { data: userData, isLoading } = useUserInfoQuery(undefined);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const user = userData?.data;

  // Initialize form data when entering edit mode
  const handleEditClick = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user?._id) {
        await updateUser({ id: user._id, data: formData }).unwrap();
        toast.success("Profile updated successfully!");
        setIsEditMode(false);
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen relative">
      {/* 3D Background Decorative Elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="flex items-center gap-5 mb-12">
        <div className="w-16 h-16 rounded-2xl bg-[#222222] border border-[#2a2a2a] text-blue-400 flex items-center justify-center shadow-xl glass-panel hover-3d-tilt" data-cursor="card">
          <span className="text-3xl font-black">🧑</span>
        </div>
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 tracking-tight">
            My Profile
          </h1>
          <p className="text-[#9ca3af] font-medium text-lg mt-1 tracking-wide">
            Manage your personal information and preferences
          </p>
        </div>
      </div>

      <div className="bg-[#222222] rounded-[2rem] shadow-2xl border border-[#2a2a2a] p-8 glass-panel transition-all duration-300">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-6" data-cursor="image">
            <div className="relative w-40 h-40 rounded-full p-1 bg-gradient-to-br from-blue-500 to-purple-600 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center text-5xl font-black text-blue-400 border-4 border-[#222222] overflow-hidden group">
                {user?.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <span>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
                )}
              </div>
            </div>
            <div className="text-center">
              <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-black tracking-widest uppercase shadow-lg shadow-blue-500/5">
                {user?.role}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 w-full bg-[#1a1a1a]/50 rounded-3xl p-8 border border-[#2a2a2a]">
            {!isEditMode ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Full Name</h3>
                    <p className="text-xl font-bold text-white">{user?.name}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Email Address</h3>
                    <p className="text-lg text-gray-300">{user?.email}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Phone Number</h3>
                    <p className="text-lg text-gray-300">{user?.phone || "—"}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Address</h3>
                    <p className="text-lg text-gray-300">{user?.address || "—"}</p>
                  </div>
                </div>
                <div className="pt-6 border-t border-[#2a2a2a]">
                  <Button onClick={handleEditClick} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40">
                    Edit Profile
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-400 font-bold mb-2 block">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="h-12 bg-[#222222] border-[#333] text-white focus-visible:ring-blue-500 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-400 font-bold mb-2 block">Email Address</Label>
                  <Input
                    id="email"
                    value={user?.email}
                    disabled
                    className="h-12 bg-[#1a1a1a] border-[#2a2a2a] text-gray-500 rounded-xl cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-600 mt-2 font-medium">Email cannot be changed.</p>
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gray-400 font-bold mb-2 block">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="h-12 bg-[#222222] border-[#333] text-white focus-visible:ring-blue-500 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-gray-400 font-bold mb-2 block">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    className="h-12 bg-[#222222] border-[#333] text-white focus-visible:ring-blue-500 rounded-xl"
                  />
                </div>
                <div className="flex gap-4 pt-6 border-t border-[#2a2a2a]">
                  <Button type="submit" disabled={isUpdating} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-blue-500/20">
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel} className="h-12 px-8 rounded-xl bg-transparent border-[#333] text-gray-400 hover:bg-[#222222] hover:text-white">
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
