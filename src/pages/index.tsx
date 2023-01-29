import React, { useRef, useState } from "react";

import Image from "next/image";
import {
	AiFillPlayCircle,
	AiFillBackward,
	AiFillForward,
	AiFillPauseCircle,
} from "react-icons/ai";

import { IEpisode } from "@/types";
import convertSecondsToTime from "@/utils/convertSeconds";
import supabase from "@/utils/supabase";
export default function Home({ data }: { data: IEpisode[] }) {
	const audioRef = useRef() as React.MutableRefObject<HTMLAudioElement>;
	const [selectEpisode, setEpisode] = useState<IEpisode>();
	const [isPlay, setPlay] = useState(false);

	const handlePlay = () => {
		setPlay(!isPlay);
		if (isPlay) {
			audioRef.current.pause();
		} else {
			audioRef.current.play();
		}
	};

	return (
		<>
			<div className="bg-gray-900 min-h-screen">
				<div className="max-w-6xl mx-auto min-h-screen py-20 flex flex-col gap-10">
					<nav className="flex justify-between items-center text-white p-5 sm:p-0">
						<h1 className="text-2xl font-bold">Daily PodCast</h1>
						<h1>About</h1>
					</nav>
					<div className="flex-1 flex justify-center items-center pb-24">
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-y-10 gap-x-10">
							{data.map((episode, index) => {
								const { title, cover } = episode;
								return (
									<div
										className="w-80 flex flex-col gap-5"
										key={index}
										onClick={() => {
											setEpisode(episode);
										}}
									>
										<div className="w-80 h-80 relative">
											<Image
												src={cover.url}
												alt="javascript"
												fill
												className="object-cover object-center rounded-md hover:scale-105 transition-all"
												sizes="(max-width: 500px) 100px"
												priority
											/>
										</div>
										<h1 className="text-xl text-white">
											{index + 1}. {title}
										</h1>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
			<div className="w-full bottom-0 fixed py-10 bg-gray-900 ">
				<h1 className="text-center pb-5 text-gray-400 text-sm">
					{selectEpisode?.title}
				</h1>
				<div className="max-w-6xl mx-auto h-10 text-white flex items-center">
					<div className="w-20">
						<Image
							src={selectEpisode?.cover.url || ""}
							alt=""
							width={50}
							height={50}
							sizes="(max-width: 100px) 100px"
							priority
						/>
					</div>
					<div className="flex-1 flex justify-center items-center ">
						<div className="flex gap-10 items-center">
							<AiFillBackward className="w-10 h-10 hover:scale-105 cursor-pointer transition-all" />
							{!isPlay ? (
								<AiFillPlayCircle
									className="w-14 h-14 hover:scale-105 cursor-pointer transition-all"
									onClick={handlePlay}
								/>
							) : (
								<AiFillPauseCircle
									className="w-14 h-14 hover:scale-105 cursor-pointer transition-all"
									onClick={handlePlay}
								/>
							)}
							<AiFillForward className="w-10 h-10 hover:scale-105 cursor-pointer transition-all" />
						</div>
					</div>
					<div className="w-20">
						<h1 className="text-sm text-right">
							{convertSecondsToTime(
								audioRef.current?.duration || 0
							)}
						</h1>
					</div>
				</div>
			</div>
			<audio
				src={selectEpisode?.audio.url}
				ref={audioRef}
				id="audio_element"
			/>
		</>
	);
}

export async function getStaticProps() {
	const { data, error } = await supabase.from("episodes").select();
	if (error) {
		return {
			props: {}, // will be passed to the page component as props
		};
	}
	console.log(data);
	return {
		props: { data }, // will be passed to the page component as props
	};
}
