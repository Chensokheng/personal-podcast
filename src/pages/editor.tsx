import React, { useRef, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
registerPlugin(
	FilePondPluginFileValidateType,
	FilePondPluginImagePreview,
	FilePondPluginImageExifOrientation
);

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Redirect from "@/components/Redirect";

export default function Editor() {
	const titleRef = useRef() as React.MutableRefObject<HTMLInputElement>;
	const noteRef = useRef() as React.MutableRefObject<HTMLTextAreaElement>;
	const coverRef = useRef() as React.MutableRefObject<FilePond>;
	const audioRef = useRef() as React.MutableRefObject<FilePond>;
	const [audio, setAudio] = useState();
	const [cover, setCover] = useState();

	const supabase = useSupabaseClient();
	const user = useUser();

	if (!user) {
		return <Redirect to="/login" />;
	}

	const handleSubmit = async () => {
		const episode = {
			title: titleRef.current.value,
			note: noteRef.current.value,
			audio: audio,
			cover: cover,
		};
		// TODO validate
		const { error } = await supabase.from("episodes").insert(episode);
		if (error) {
			// TODO: toast
			console.log(error.message);
		}
		reset();
	};

	const reset = () => {
		noteRef.current.value = "";
		titleRef.current.value = "";
		coverRef.current.removeFiles();
		audioRef.current.removeFile();
		setAudio(undefined);
		setCover(undefined);
	};

	return (
		<div className="bg-gray-900 min-h-screen ">
			<div className="max-w-4xl mx-auto min-h-screen py-10">
				<nav className="flex justify-between items-center text-white p-5 sm:p-0">
					<h1 className="text-2xl font-bold">Daily PodCast</h1>
					<h1>About</h1>
				</nav>
				<div className="mt-10 flex flex-col gap-10">
					<FilePond
						ref={coverRef}
						acceptedFileTypes={["image/*"]}
						server={{
							load: "/api/upload",
							process: "/api/upload?bucket=image",
							revert: "/api/remove",
						}}
						labelIdle='Drag & Drop your cover image here here or <span class="filepond--label-action">Browse</span>'
						className="bg-gray-900"
						onprocessfile={(_, file) => {
							if (file.serverId) {
								setCover(JSON.parse(file.serverId));
							}
						}}
					/>
					<input
						className="w-full bg-gray-800 py-5 px-3 text-gray-300 text-xl outline-none rounded-md focus:ring-gray-500 focus:ring-2 tracking-wider"
						placeholder="Title"
						ref={titleRef}
					/>
					<textarea
						className="w-full bg-gray-800 resize-none h-96 text-xl outline-none rounded-md focus:ring-gray-500 focus:ring-2 text-gray-300 px-3 py-5 tracking-wider"
						placeholder="note"
						ref={noteRef}
					/>
					<FilePond
						ref={audioRef}
						acceptedFileTypes={["audio/*"]}
						server={{
							load: "/api/upload",
							process: "/api/upload?bucket=audio",
							revert: "/api/remove",
						}}
						labelIdle='Drag & Drop your audio here or <span class="filepond--label-action">Browse</span>'
						className="bg-gray-900"
						onprocessfile={(_, file) => {
							if (file.serverId) {
								setAudio(JSON.parse(file.serverId));
							}
						}}
					/>
					<button
						onClick={handleSubmit}
						className="bg-green-500 text-white py-5 rounded-md"
					>
						Submit
					</button>
				</div>
			</div>
		</div>
	);
}
