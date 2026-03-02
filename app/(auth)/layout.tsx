 const AuthLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="flex items-center justify-center h-screen flex-col">
                <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back!</h1>
                <div>
                {children}
                </div>
        </div>
    );
 }

export default AuthLayout