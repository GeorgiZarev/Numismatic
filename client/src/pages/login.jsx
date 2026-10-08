import AuthForm from "../components/auth/AuthForm";
import { useAuthPageForms } from "../hooks/useAuthPageForms";

const Login = () => <AuthForm forms={useAuthPageForms()} />;

export default Login;
