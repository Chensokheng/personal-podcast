export default function convertSecondsToTime(seconds: any) {
	let minutes: any = Math.floor(seconds / 60);
	seconds = (seconds % 60).toFixed(0);

	minutes = minutes > 10 ? minutes : "0" + minutes;
	seconds = seconds > 10 ? seconds : "0" + seconds;

	return `${minutes}:${seconds}`;
}
