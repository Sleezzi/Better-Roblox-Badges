type GetDetails = (id: string | number) => Promise<{
	id: number;
	displayName: string;
	name: string;
	description: string;
	created: string;
	externalAppDisplayName: null | string;
	hasVerifiedBadge: boolean;
	isBanned: boolean;
} | null>;

const getDetails: GetDetails = async (id) => {
	try {
		const raw = await fetch(`https://users.roblox.com/v1/users/${id}`)
		const response: {
			id: number;
			displayName: string;
			name: string;
			description: string;
			created: string;
			externalAppDisplayName: null | string;
			hasVerifiedBadge: boolean;
			isBanned: boolean;
		} = await raw.json();
		return response;
	} catch (err) {
		return null;
	}
}

export default getDetails;