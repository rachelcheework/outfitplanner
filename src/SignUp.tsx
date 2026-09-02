import { useState } from 'react'
import { Link } from 'react-router';
// import { USERS_TABLE } from './constants/TableNames';
import supabase from './supabase-client';

const SignUp = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const submitSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); //prevents webpage from reloading by default
        setMessage('');

        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                },
            },
        });

        if (error) {
            setErrorMessage("Error signing up: " + error.message)
            return;
        }

        // const user = data.user;

        // if (!user) {
        //     console.error('Signup succeeded, but no user was returned.')
        //     return
        // }

        // //adding user to users table
        // const { error: insertError } = await supabase
        //     .from(USERS_TABLE)
        //     .insert([
        //         {
        //             user_id: user.id,
        //             firstName,
        //             lastName,
        //             email
        //         }
        //     ])

        // if (insertError) {
        //     console.error('Account created, but failed to save user details: ' + insertError.message)
        //     return
        // }

        setMessage('User account created!')
        setFirstName('')
        setLastName('')
        setEmail('')
        setPassword('')
        setErrorMessage("")
    }

    return (
        <div className='flex flex-col h-screen items-center justify-center space-y-6'>

            {/* page name */}
            <h1 className='text-gray-800 text-2xl font-medium'>Sign Up Page</h1>

            <div className='w-full px-6 flex justify-center md:w-1/2 md:px-12'>
                <form className='w-full' onSubmit={submitSignUp}>

                    <div className="flex flex-row space-x-3 w-full mb-3">
                        <input
                            className='w-full rounded-lg p-2 mb-3 focus:outline-gray-400
                            ring-1 ring-gray-200/5
                            bg-white/70
                            backdrop-blur-sm
                            shadow-[0_4px_8px_rgba(0,0,0,0.08)]'
                            type="text"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder='First Name'
                        />

                        <input
                            className='w-full rounded-lg p-2 mb-3 focus:outline-gray-400
                            ring-1 ring-gray-200/5
                            bg-white/70
                            backdrop-blur-sm
                            shadow-[0_4px_8px_rgba(0,0,0,0.08)]'
                            type="text"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder='Last Name'
                        />
                    </div>

                    <input
                        className='w-full rounded-lg p-2 mb-3 focus:outline-gray-400
                        ring-1 ring-gray-200/5
                        bg-white/70
                        backdrop-blur-sm
                        shadow-[0_4px_8px_rgba(0,0,0,0.08)]'
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Email'
                    />
                    <input
                        className='w-full rounded-lg p-2 mb-3 focus:outline-gray-400
                        ring-1 ring-gray-200/5
                        bg-white/70
                        backdrop-blur-sm
                        shadow-[0_4px_8px_rgba(0,0,0,0.08)]'
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password'
                    />

                    {/* message */}
                    {errorMessage && <p className='text-red-600 mt-2'>{errorMessage}</p>}
                    {message && <p className='text-green-600 mt-2'>{message}</p>}

                    <button
                        className='w-full mt-6 rounded-lg p-2
                        bg-blue-500/80 text-white ring-1 ring-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.08)]
                        hover:bg-blue-500'
                        type='submit'>Sign Up</button>
                </form>
            </div>

            <div className="flex space-x-2 text-gray-500">
                <span>Already Have an Account? </span><Link className='text-gray-800 hover:underline' to="/">Log In</Link>
            </div>
        </div>
    )
}

export default SignUp
