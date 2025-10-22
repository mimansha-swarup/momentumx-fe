import UserDetails from "@/components/profile/userDetails";
import UserSettings from "@/components/profile/userSettings";
import GlassCard from "@/components/shared/glassCard";
import Header from "@/components/shared/header";
import { useAuthCredential } from "@/hooks/useAuth";

const Profile = () => {
  const { user } = useAuthCredential();
  return (
    <div className=" min-h-screen md:w-[90%] mx-auto  md:pt-4 pb-20">
      <Header title="Profile" />
      <GlassCard className=" flex flex-col gap-6 md:gap-7 mx-auto  md:p-10 !shadow-none bg-sidebar  ">
        <UserDetails user={user} />
        <UserSettings user={user} />
      </GlassCard>
    </div>
  );
};

export default Profile;
