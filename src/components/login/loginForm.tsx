import { Button } from "../ui/button";
import GoogleIcon from "../../assets/svg/google.svg";
import { persistLogin } from "@/utils/firebase/login";
import { useAppSelector } from "@/hooks/useRedux";
import { userLoading } from "@/utils/feature/user/user.slice";
import { LoaderCircle } from "lucide-react";

const LoginForm = () => {
  const isLoading = useAppSelector(userLoading);
  return (
    <div className="flex-1 flex  flex-col justify-center items-center h-screen space-y-8">
      <div className="flex flex-col  gap-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Get Started</h1>
        <p className="text-sm text-muted-foreground">
          Sign in with Google to access your account
        </p>
      </div>

      <div className="grid gap-6">
        <Button
          variant="outline"
          className="flex items-center justify-center gap-2 w-2xs"
          onClick={persistLogin}
          disabled={isLoading}
        >
          {" "}
          {isLoading && <LoaderCircle className="animate-spin " />}
          <img src={GoogleIcon} alt="google-logo" /> Log in with Google
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
