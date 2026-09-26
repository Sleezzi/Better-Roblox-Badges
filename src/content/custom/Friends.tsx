import { useEffect, useState } from "react";
import Loading from "../../components/react/Loading";
import Translates from "../../components/translates";
import user from "../../components/user";
import getAvatar from "../../components/api/user/getAvatar";
import awaitForElement from "../../components/awaitForElement";
import { createRoot } from "react-dom/client";
import Notify from "../global/Notifications";
import Console from "../../components/console";

type Friend = {
	name: string,
	username: string,
	avatar?: string | "_deleted"
}
const localesToGet = ["badges_search", "error","error_message"];

const fetchAllFriends = async (id: string) => {
	const total: number = await fetch("https://friends.roblox.com/v1/my/friends/count", {
		method: "GET",
		credentials: "include",
	}).then((response) => response.json())
	.then((response) => response.count);

	let cursor: string | null = "";
	const friends = new Map<string, {
		name: string,
		username: string,
	}>();

	for (let index = 0; index < 100 && friends.size < total && typeof cursor === "string"; index++) {
		const { PageItems: data, NextCursor }: { PageItems: { id: number }[], NextCursor: string | null } = await fetch(`https://friends.roblox.com/v1/users/${id}/friends/find?userSort=1&cursor=${cursor}&limit=50`, {
			method: "GET",
			cache: "force-cache",
			credentials: "include"
		}).then((response) => response.json());
		if (data.length === 0) break;

		const profiles: {
			profileDetails: {
				userId: number,
				names: {
					username: string,
					combinedName: string,
				}
			}[]
		} = await fetch("https://apis.roblox.com/user-profile-api/v1/user/profiles/get-profiles", {
			credentials: "include",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify({
				userIds: data.map((friend) => friend.id),
				fields:["names.combinedName","names.username",]
			}),
			method: "POST",
		})
		.then((response) => response.json());

		const sizeBefore = friends.size;
		for (const friend of profiles.profileDetails) {
			friends.set(
				friend.userId.toString(),
				{
					name: friend.names.username, // Yes this is strange...
					username: friend.names.combinedName
				}
			);
		}
		
		if (friends.size === sizeBefore) break;
		cursor = NextCursor;
	}

	return Array.from(friends);
}


function Friends() {
	const [placeId, setPlaceId] = useState<string | null>(null);
	const [userId, setUserId] = useState<string | null>(null);
	const [friends, setFriends] = useState<{ [id: string]: Friend} | null>(null);
	const [research, setResearch] = useState<string | null>(null);
	const [locales, setLocales] = useState<{ [name: string]: string | null }>({});
	
	useEffect(() => {
		setLocales(Translates(localesToGet));
	}, []);

	useEffect(() => {
		setPlaceId(location.href.split("/")[4]);
		user().then((u) => setUserId(u ? u.id : null));
	}, [location.href]);

	const setFriend = (id: string, details: any) => {
		setFriends((old) => {
			if (!old) return { [id]: details };
			if (id in old) return {
				...old,
				[id]: {
					...old[id],
					...details
				}
			}
			return {
				...old,
				[id]: details
			}
		});
	}

	useEffect(() => {
		if (!userId || !placeId) return;
		fetchAllFriends(userId).then(async (friends) => {
			for (const friend of friends) setFriend(friend[0], friend[1]);
			
			getAvatar(150, "png", friends.map((friend) => friend[0])).then((avatars) => {
				const entries = Object.entries(avatars);
				for (const [id, url] of entries) {
					setFriend(id, {
						avatar: url
					});
				}
				for (const [id] of friends.filter((friend) => !entries.find(([id]) => id === friend[0]))) {
					setFriend(id, {
						avatar: "_deleted"
					});
				}
			})
			.catch(async (err) => {
				console.error(err);
				await Console(`An error occurred while retrieving the avatars for "${friends.map((friend) => friend[0]).join("\n")}" - ${err}`);
				Notify(locales.error || "Error", locales.error_message || "An error occurred; check the console for more details.");
			});
		})
		.catch(async (err) => {
			console.error(err);
			await Console(`An error occurred while retrieving the friends list - ${err}`);
			Notify(locales.error || "Error", locales.error_message || "An error occurred; check the console for more details.");
		});
	}, [placeId, userId]);

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
			<div className="friends">
				{
					friends ?
					Object.entries(friends)
					.filter(([, friend]) => {
						if (!friend.name || !friend.username) return true;
						if (!research) return true;
						if (friend.name.toLowerCase().includes(research) || friend.username.toLowerCase().includes(research)) return true;
						return false;
					})
					.map(([id, friend]) => (
						<a className="friend" key={id} href={`/better-badges/${placeId}/${id}`}>
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
							<div className="avatar-card-caption" style={{ display: "flex", flexDirection: "column", padding: "1rem 2rem" }}>
								<span className="user-display-name" style={{ fontSize: "1.25rem" }}>{friend.username}</span>
								<span className="user-name web-blox-css-tss-zzwi3a-Typography-body1-Typography-colorSecondary-Typography-root profile-header-usernam">@{friend.name}</span>
							</div>
						</a>
					)) :
					[...new Array(10)].map((_, index) => (
						<div className="friend" key={index}>
							<Loading className="avatar" />
							<div className="avatar-card-caption" style={{ display: "flex", flexDirection: "column", padding: "1rem 2rem" }}>
								<Loading style={{
									height: "2.5rem",
									width: "15rem",
								}} className="user-display-name" />
								<Loading style={{
									height: "1.5rem",
									margin: ".5rem 0"
								}} className="user-name web-blox-css-tss-zzwi3a-Typography-body1-Typography-colorSecondary-Typography-root profile-header-usernam" />
							</div>
						</div>
					))
				}
			</div>
		</>
	);
}

(async () => {
	const parent = await awaitForElement<"div">("#content");
	if (!parent) return;

	if (parent.querySelector("#better-badges-custom-friends-container")) return;

	const container = document.createElement("div");
	container.id = "better-badges-custom-friends-container";
	

	createRoot(container).render(<Friends  />);
	parent.appendChild(container);
})();