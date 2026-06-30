import { useState } from 'react'
import { Link } from 'react-router';
import supabase from '../supabase-client';

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

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        });

        if (error) {
            setErrorMessage("Error signing up: " + error.message)
            return;
        } 

        const user = data.user;

        if (!user) {
            console.error('Signup succeeded, but no user was returned.')
            return
        }

        //adding user to users table
        const { error: insertError } = await supabase
            .from('Users')
            .insert([
                {
                    user_id: user.id,
                    firstName,
                    lastName,
                    email
                }
            ])

        if (insertError) {
            console.error('Account created, but failed to save user details: ' + insertError.message)
            return
        }

        setMessage('User account created!')
        setFirstName('')
        setLastName('')
        setEmail('')
        setPassword('')
    }

    return (
        <div className='flex flex-col h-screen items-center justify-center space-y-6'>

            {/* page name */}
            <h1 className='text-blue-600 text-2xl font-bold'>Sign Up Page</h1>

            <div className='w-full px-6 flex justify-center md:w-1/2 md:px-12'>
                <form className='w-full' onSubmit={submitSignUp}>

                    <div className="flex flex-row space-x-3 w-full mb-3">
                        <input
                            className='w-1/2 border border-gray-200 rounded-lg p-2'
                            type="text"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder='First Name'
                        />

                        <input
                            className='w-1/2 border border-gray-200 rounded-lg p-2'
                            type="text"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder='Last Name'
                        />
                    </div>

                    <input
                        className='w-full border border-gray-200 rounded-lg p-2 mb-3'
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Email'
                    />
                    <input
                        className='w-full border border-gray-200 rounded-lg p-2 mb-3'
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
                        className='w-full mt-6 border rounded-lg p-2 bg-blue-600 text-white hover:bg-white hover:border-blue-600 hover:text-blue-600'
                        type='submit'>Sign Up</button>
                </form>
            </div>

            <div className="flex space-x-2 text-gray-600">
                <span>Already Have an Account? </span><Link className='text-blue-600 hover:underline' to="/">Log In</Link>
            </div>
        </div>
    )
}

export default SignUp
