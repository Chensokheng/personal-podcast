import Redirect from "@/components/Redirect";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import React, { useRef } from "react";

export default function Login() {
	const emailRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const passwordRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const supabase = useSupabaseClient();
	const user = useUser();

	if (user) {
		return <Redirect to="/editor" />;
	}

	const login = async () => {
		const email = emailRef.current.value;
		const password = passwordRef.current.value;
		const res = await supabase.auth.signInWithPassword({ email, password });
	};

	return (
		<div className="bg-gray-900 h-screen flex justify-center items-center">
			<div className="w-96 flex flex-col gap-5">
				<div>
					<label className="text-sm text-gray-300">Email</label>
					<input
						className="w-full bg-gray-800 outline-none px-3 py-4 text-gray-200 focus:ring-1 ring-gray-500 rounded-md mt-3"
						ref={emailRef}
						type="email"
					/>
				</div>

				<div>
					<label className="text-sm text-gray-300">Password</label>
					<input
						className="w-full bg-gray-800 outline-none px-3 py-4 text-gray-200 focus:ring-1 ring-gray-500 rounded-md mt-3"
						type="password"
						ref={passwordRef}
					/>
				</div>
				<button
					className="text-white bg-green-500 px-3 py-4 rounded-md hover:bg-green-600 mt-3"
					onClick={login}
				>
					Login
				</button>
			</div>
		</div>
	);
}
