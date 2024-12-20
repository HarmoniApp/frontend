import MyJwtPayload from "@/components/types/myJwtPayload";
import { patchChangePassword } from "@/services/passwordService";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useState } from "react";


const useLogin = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordPath, setPasswordPath] = useState<string>('');
  
    const handleLogin = async (values: any) => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: values.email,
            password: values.password,
          }),
        });
  
        if (response.ok) {
          setLoginError(null);
          const data = await response.json();
          const tokenJWT = data.jwtToken;
          setPasswordPath(data.path);
  
          const decodedToken = jwtDecode<MyJwtPayload>(tokenJWT);
          const userId = decodedToken.id;
          const username = decodedToken.username;
          const isAdmin = decodedToken.authorities === 'ROLE_ADMIN';
  
          sessionStorage.setItem('tokenJWT', tokenJWT);
          sessionStorage.setItem('userId', userId.toString());
          sessionStorage.setItem('username', username);
          sessionStorage.setItem('isAdmin', JSON.stringify(isAdmin));
  
          const oneTimeUsedPass = data.path || '';
          if (oneTimeUsedPass.length > 0) {
            setIsChangePasswordModalOpen(true);
          } else {
            if (isAdmin) {
              router.push('/dashboard');
            } else {
              router.push('/schedule');
            }
          }
        } else if (response.status === 401) {
          setLoginError("Niepoprawne hasło lub login.");
        } else {
          setLoginError("Wystąpił błąd podczas logowania.");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        setLoginError("Wystąpił błąd podczas logowania.");
      } finally {
        setLoading(false);
      }
    };
  
    const handlePasswordChange = async (values: any) => {
      try {
        await patchChangePassword(values, passwordPath)
        setIsChangePasswordModalOpen(false);
      } catch (error) {
        console.error("An error occurred while changing password:", error);
      }
    };

    return {
        showPassword,
        setShowPassword,
        loginError,
        isChangePasswordModalOpen,
        loading,
        handleLogin,
        handlePasswordChange,
    };
}
export default useLogin;