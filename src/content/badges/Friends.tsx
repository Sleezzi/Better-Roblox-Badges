import { useEffect, useState } from "react";
import Loading from "../../components/react/Loading";
import Translates from "../../components/translates";
import getAvatar from "../../components/api/user/getAvatar";

type Friend = {
	name?: string,
	username?: string,
	avatar?: string | "_deleted"
}
const localesToGet = ["badges_search"];

function friends({ placeId, userId }: { placeId: string, userId: string }) {
	const [friends, setFriends] = useState<{ [id: string]: Friend} | null>(null);
	const [research, setResearch] = useState<string | null>(null);
	const [locales, setLocales] = useState<{ [name: string]: string | null }>({});

	useEffect(() => {
		setLocales(Translates(localesToGet));
	}, []);

	const addFriend = (id: string, friend: Friend) => {
		setFriends((old) => {
			if (!old) return { [id]: friend };
			if (id in old) return {
				...old,
				[id]: {
					...old[id],
					...friend
				}
			}
			return {
				...old,
				[id]: friend
			}
		});
	}

	useEffect(() => {
		fetch(`https://friends.roblox.com/v1/users/${userId}/friends?userSort=1`, {
			method: "GET",
			cache: "force-cache",
			credentials: "include"
		})
		.then((response) => response.json())
		.then(async (response: { data: { id: number }[] }) => {
			for (const friend of response.data) {
				addFriend(`${friend.id}`, {});
			}
			const v = response.data.map((friend) => friend.id);
			getAvatar(150, "png", v).then((avatars) => {
				const entries = Object.entries(avatars);
				for (const [id, url] of entries) {
					addFriend(id, {
						avatar: url
					});
				}
				for (const friend of response.data.filter((friend) => !entries.find(([id]) => id === `${friend.id}`))) {
					addFriend(`${friend.id}`, {
						avatar: "_deleted"
					});
				}
				console.log(response.data.length, v.length, entries.length);
			});
			fetch("https://apis.roblox.com/user-profile-api/v1/user/profiles/get-profiles", {
				credentials: "include",
				headers: {
					"content-type": "application/json",
				},
				body: JSON.stringify({
					userIds: response.data.map((friend) => friend.id),
					fields:["names.combinedName","names.username",]
				}),
				method: "POST",
			})
			.then((response) => response.json())
			.then((response: {
				profileDetails: {
					userId: number,
					names: {
						username: string,
						combinedName: string,
					}
				}[]
			}) => {
				for (const friend of response.profileDetails) {
					addFriend(`${friend.userId}`, {
						name: friend.names.username, // Yes this is strange...
						username: friend.names.combinedName
					});
				}
			});
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
				placeholder={locales.badges_search || "Search"}
				maxLength={120}
				onInput={(e: any) => setResearch(e.target.value ? e.target.value.toLowerCase() : null)}
			/>
			{
				friends ?
				Object.entries(friends)
				.filter(([id, friend]) => {
					if (!friend.name || !friend.username) return true;
					if (!research) return true;
					if (friend.name.toLowerCase().includes(research) || friend.username.toLowerCase().includes(research)) return true;
					return false;
				})
				.map(([id, friend]) => (
					<a className="friend" key={id} href={`/better-badges/${placeId}/user/${id}`}>
						{
							friend.avatar ?
							(
								friend.avatar === "_deleted" ?
								<span className="thumbnail-2d-container icon-blocked avatar-card-image avatar"></span>
								:
								<img src={friend.avatar} alt={`${friend.username}'s avatar`} className="avatar" />
							)
							:
							<Loading className="avatar" />
						}
						<div className="profile-header-details">
							{
								friend.username ?
								<span className="user-display-name">{friend.username}</span>
								:
								<Loading style={{
									height: "2rem",
									width: "15rem",
								}} className="user-display-name" />
							}
							{
								friend.name ?
								<span className="user-name web-blox-css-tss-zzwi3a-Typography-body1-Typography-colorSecondary-Typography-root profile-header-usernam">@{friend.name}</span>
								:
								<Loading style={{
									height: "2.5rem",
									margin: ".5rem 0"
								}} className="user-name web-blox-css-tss-zzwi3a-Typography-body1-Typography-colorSecondary-Typography-root profile-header-usernam" />
							}
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