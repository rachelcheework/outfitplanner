import { useState } from "react";
import supabase from "./supabase-client";
import { Link } from "react-router";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleForgotPassword = async (
        event: React.SubmitEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setMessage("");
        setErrorMessage("");

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setErrorMessage(error.message);
            return;
        }

        setMessage("Check your email for a password reset link.");
    };

    return (
        <div className='flex flex-col h-screen items-center justify-center px-6 space-y-3'>

            {/* page name */}
            <h1 className='text-blue-600 text-2xl font-bold mb-6'>Forgot Password</h1>

            <div className='w-full flex flex-col space-y-3 md:justify-center md:w-1/2 md:px-12'>

                <form className='w-full flex flex-col space-y-3 items-center justify-center md:flex-row md:space-x-3 md:space-y-0' onSubmit={handleForgotPassword}>
                    <input
                        id="email"
                        type="email"
                        className="md:w-3/4 w-full border border-gray-200 rounded-lg p-2"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        placeholder="Email"
                    />

                    <button className="md:w-1/4 w-full border rounded-lg p-2 bg-blue-600 text-white hover:bg-white hover:border-blue-600 hover:text-blue-600" type="submit">
                        Reset
                    </button>
                </form>

                {message && <p className="text-green-500">{message}</p>}
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
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

export default ForgotPassword;