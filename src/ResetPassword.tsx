import { useState } from "react";
import { Link, useNavigate } from "react-router";
import supabase from "./supabase-client";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();

    const handleResetPassword = async (
        event: React.SubmitEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setErrorMessage("");

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password,
        });

        if (error) {
            setErrorMessage(error.message);
            setSuccessMessage("");
            return;
        }

        else {
            setErrorMessage("");
            setSuccessMessage("Password changed successfully! Redirecting back to login...")
        }

        setTimeout(() => {
            navigate("/");
          }, 2000);
    };

    return (
        <div className='flex flex-col h-screen items-center justify-center px-6 space-y-6'>

            {/* page name */}
            <h1 className='text-gray-800 text-2xl font-medium'>Reset Password</h1>

            <div className='w-full flex flex-col space-y-3 md:w-1/2 md:px-12'>
                <form className='w-full flex-col' onSubmit={handleResetPassword}>
                    <div className="w-full flex flex-col mb-6 md:flex-row md:space-x-3">

                        <input
                            id="password"
                            type="password"
                            className='w-full rounded-lg p-2 mb-3 focus:outline-gray-400
                            ring-1 ring-gray-200/5
                          bg-white/70
                            backdrop-blur-sm
                            shadow-[0_4px_8px_rgba(0,0,0,0.08)]'
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            placeholder="New Password"
                        />

                        <input
                            id="confirmPassword"
                            type="password"
                            className='w-full rounded-lg p-2 mb-3 focus:outline-gray-400
                            ring-1 ring-gray-200/5
                          bg-white/70
                            backdrop-blur-sm
                            shadow-[0_4px_8px_rgba(0,0,0,0.08)]'
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                            placeholder="Confirm New Password"
                        />
                    </div>

                    <button type="submit"
                        className="className='flex w-full rounded-lg p-2
                        bg-blue-500/80 text-white ring-1 ring-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.08)]
                        hover:bg-blue-500">
                        Reset password
                    </button>
                </form>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {successMessage && <p className="text-green-600">{successMessage}</p>}
            </div>

            <div className="flex w-full justify-between md:flex-row md:w-1/2 md:px-12">
                {/* login */}
                <Link className='text-gray-800 hover:underline' to="/">Back to Login</Link>
                {/* sign up */}
                <Link className='text-gray-800 hover:underline' to="/signup">Create Account</Link>
            </div>
        </div>
    );
};

export default ResetPassword;