import LoginForm from "@/components/login/loginForm";
import { Separator } from "@/components/ui/separator";
import { useAuthCredential } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

const Login = () => {
  const { user } = useAuthCredential();
  const { state } = useLocation();

  if (user)
    return <Navigate to={state?.form?.pathname || "/app/dashboard"} replace />;
  return (
    <section className="w-screen h-screen">
      <div className="flex p-0">
        <div className=" bg-black h-screen flex-1 hidden md:block " />
        <Separator orientation="vertical" />
        <LoginForm />
      </div>
    </section>
  );
};

export default Login;
