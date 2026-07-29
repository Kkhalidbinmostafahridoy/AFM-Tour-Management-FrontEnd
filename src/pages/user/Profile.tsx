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
    return <div className="p-8">Loading profile...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="bg-white/50 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600 border-4 border-white shadow-lg overflow-hidden">
              {user?.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
              )}
            </div>
            <div className="text-center">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold tracking-wide uppercase">
                {user?.role}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 w-full">
            {!isEditMode ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                  <p className="text-lg font-semibold">{user?.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                  <p className="text-lg">{user?.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                  <p className="text-lg">{user?.phone || "Not provided"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  <p className="text-lg">{user?.address || "Not provided"}</p>
                </div>
                <div className="pt-4">
                  <Button onClick={handleEditClick}>Edit Profile</Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={user?.email}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
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
