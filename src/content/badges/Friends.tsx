import { useEffect, useState } from "react";
import Loading from "../components/Loading";

type Friend = {
	id: string
	name: string,
	username: string,
	avatar?: string
}
const localesToGet = ["badges_search"];

function friends({ placeId, userId }: { placeId: string, userId: string }) {
	const [friends, setFriends] = useState<Friend[] | null>(null);
	const [research, setResearch] = useState<string | null>(null);
	const [locales, setLocales] = useState<{ [name: string]: string }>({});

	useEffect(() => {
		for (const locale of localesToGet) {
			window.sleezzi.translate(locale).then((value) => setLocales((old) => ({...old, [locale]: value})));
		}
	}, []);

	useEffect(() => {
		fetch(`https://friends.roblox.com/v1/users/${userId}/friends?userSort=1`, {
			method: "GET",
			cache: "force-cache",
			credentials: "include"
		})
		.then((response) => response.json())
		.then(async (response: { data: { id: number }[] }) => {
			const avatars = await window.sleezzi.roblox.user.avatar.headshot(150, "png", response.data.map((friend) => friend.id));
			for (const [id, url] of Object.entries(avatars)) {
				const details = await window.sleezzi.roblox.user.detail(id);
				const result = {
					id: id,
					name: details.name,
					username: details.displayName,
					avatar: url,
				}
				setFriends((old) => ( old ? [...old, result] : [result] ));
			}
		});
		return () => {
			setFriends(null);
		}
	}, [userId]);

	return (
		<>
			<input
				{...{"data-testid": "navigation-search-input-field"}}
				type="search"
				name="search-badges"
				id="search-badges"
				className="input-field new-input-field friend-search"
				autoComplete="off"
				placeholder={locales.badges_search}
				maxLength={120}
				onInput={(e: any) => setResearch(e.target.value ? e.target.value.toLowerCase() : null)}
			/>
			{
				friends ?
				friends
				.filter((friend) => {
					if (!research) return true;
					if (friend.name.toLowerCase().includes(research) || friend.username.toLowerCase().includes(research)) return true;
					return false;
				})
				.map((friend) => (
					<a className="friend" key={friend.id} href={`/better-badges/${placeId}/user/${friend.id}`}>
						{
							friend.avatar ?
							<img src={friend.avatar} alt={`${friend.username}'s avatar`} className="avatar" />
							:
							<span className="thumbnail-2d-container icon-blocked avatar-card-image avatar"></span>
						}
						<div className="profile-header-details">
							<span className="user-display-name">{friend.username}</span>
							<span className="user-name web-blox-css-tss-zzwi3a-Typography-body1-Typography-colorSecondary-Typography-root profile-header-usernam">@{friend.name}</span>
						</div>
					</a>
				)) :
				[...new Array(10)].map((_, index) => (
					<div className="friend" key={index}>
						<Loading className="avatar" />
						<div className="profile-header-details">
							<Loading style={{
								height: "2rem",
								width: "15rem",
							}} className="user-display-name" />
							<Loading style={{
								height: "2.5rem",
								margin: ".5rem 0"
							}} className="user-name web-blox-css-tss-zzwi3a-Typography-body1-Typography-colorSecondary-Typography-root profile-header-usernam" />
						</div>
					</div>
				))
			}
		</>
	);
}

export default friends;