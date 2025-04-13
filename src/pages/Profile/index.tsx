import ProfileSection from "@/components/profile/section";
import UserDetails from "@/components/profile/userDetails";
import UserSettings from "@/components/profile/userSettings";
import GlassCard from "@/components/shared/glassCard";
import Header from "@/components/shared/header";
import RootLayout from "@/components/shared/rootLayout";
import { useAuthCredential } from "@/hooks/useAuth";

const Profile = () => {
  const { user } = useAuthCredential();
  return (
    <RootLayout>
      <div className=" min-h-screen md:w-[90%] mx-auto  pt-4 pb-20">
        <Header title="Profile" />
        <GlassCard className=" flex flex-col gap-6 md:gap-7 mx-auto md:w-3/4 !shadow-none !border-none !p-0 ">
          <UserDetails user={user} />

          <UserSettings user={user} />
        </GlassCard>
      </div>
    </RootLayout>
  );
};

export default Profile;
