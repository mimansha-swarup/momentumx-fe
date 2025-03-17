import LoginForm from "@/components/login/loginForm";
import { Separator } from "@/components/ui/separator";

const Login = () => {
  return (
    <section className="w-screen h-screen">
      <div className="flex p-0">
        <div className=" bg-black h-screen flex-1 " />
        <Separator orientation="vertical" />
        <LoginForm />
      </div>
    </section>
  );
};

export default Login;
