import LoginForm from "@/components/login/loginForm";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/hooks/useRedux";
import { currentUser } from "@/utils/feature/user/user.slice";
import { Navigate, useLocation } from "react-router-dom";

interface LocationState {
  from?: { pathname?: string };
}

const Login = () => {
  const user = useAppSelector(currentUser);
  const location = useLocation();
  const state = location.state as LocationState | null;

  if (user)
    return <Navigate to={state?.from?.pathname || "/app/dashboard"} replace />;
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
