import chunks from "../../chunks";

type GetAvatar = (
	size: 48 | 50 | 60 | 75 | 100 | 110 | 150 | 180 | 352 | 420 | 720,
	format: "png" | "jpeg" | "webp",
	userIds: string[] | number[]
) => Promise<{
	[id: number]: string;
}>;



const getAvatar: GetAvatar = (size = 48, format = "png", userIds) => new Promise(async (resolve, error) => {
	const avatars: { [id: number]: string } = {};
	await Promise.all(chunks(userIds, 100).map((chunk) => 
		fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${chunk.join(",")}&format=${format}&size=${size}x${size}`)
		.then((response) => response.json())
		.then((response: {
			data: {
				targetId: number,
				state: string,
				imageUrl: string,
				version: string
			}[]
		}) => {
			for (const user of response.data.filter((user) => user.state === "Completed")) {
				avatars[user.targetId] = user.imageUrl;
			}
		})
	));
	resolve(avatars);
});

export default getAvatar;