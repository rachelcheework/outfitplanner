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
            <h1 className='text-blue-600 text-2xl font-bold'>Reset Password</h1>

            <div className='w-full flex flex-col space-y-3 md:w-1/2 md:px-12'>
                <form className='w-full flex-col' onSubmit={handleResetPassword}>
                    <div className="w-full flex flex-col md:flex-row md:space-x-3">

                        <input
                            id="password"
                            type="password"
                            className='w-full border border-gray-200 rounded-lg p-2 mb-3'
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            placeholder="New Password"
                        />

                        <input
                            id="confirmPassword"
                            type="password"
                            className='w-full border border-gray-200 rounded-lg p-2 mb-3'
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                            placeholder="Confirm New Password"
                        />
                    </div>

                    <button type="submit"
                        className="className='flex w-full border rounded-lg p-2 bg-blue-600 text-white hover:bg-white hover:border-blue-600 hover:text-blue-600">
                        Reset password
                    </button>
                </form>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {successMessage && <p className="text-green-600">{successMessage}</p>}
            </div>

            <div className="flex w-full justify-between md:flex-row md:w-1/2 md:px-12">
                {/* login */}
                <Link className='text-blue-600 hover:underline' to="/">Back to Login</Link>
                {/* sign up */}
                <Link className='text-blue-600 hover:underline' to="/signup">Create Account</Link>
            </div>
        </div>
    );
};

export default ResetPassword;