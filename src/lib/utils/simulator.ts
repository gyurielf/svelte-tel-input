export const delaySimulator = async (delay = 1000, callback: () => void) => {
	const delayPromise = (ms: number) => new Promise((res) => setTimeout(res, ms));
	await delayPromise(delay);
	callback();
};
