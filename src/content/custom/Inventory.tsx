import { useEffect, useState } from "react";
// import Select from "../../components/react/Select";
// import { DateComposent } from "../../components/parseDate";
import Loading from "../../components/react/Loading";
import Translates from "../../components/translates";
// import getAvatar from "../../components/api/user/getAvatar";
import { NumberComposent } from "../../components/splitNumber";
// import Icon from "../../components/react/Icon";
import _user, { User } from "../../components/user";
import Notify from "../global/Notifications";
import Console from "../../components/console";
import awaitForElement from "../../components/awaitForElement";
import { createRoot } from "react-dom/client";
import getUrlParts from "../../components/getUrlsParts";
import Select from "../../components/react/Select";

type Badge = {
	thumbnail: string | null,
	name: string,
	enabled: boolean,
	description: string,
	stats: {
		pastDayAwardedCount: number,
		awardedCount: number,
		winRatePercentage: number
	},
	awarder: number,
	visible: boolean
}

const localesToGet = [
	"badges_total",
	"badges_rarity",
	"badges_won_yesterday",
	"badges_won_ever",
	"badges_search",
	"error",
	"error_message",
];

function Inventory({ user }: { user: string }) {
	const [index, setIndex] = useState<string>("");
	const [places, setPlaces] = useState<Record<number, { name: string, universe: number, isFavoritedByUser: boolean }>>({});
	const [badges, setBadges] = useState<{ [id: number]: Badge } | null>(null);

	const [locales, setLocales] = useState<{ [name: string]: string | null }>({});

	useEffect(() => {
		setLocales(Translates(localesToGet));
	}, []);

	useEffect(() => {
		fetch(`https://badges.roblox.com/v1/users/${user}/badges?cursor=&limit=100&sortOrder=Desc&cursor=${index}`, {
			method: "GET",
			credentials: "include"
		})
		.then((response) => response.json())
		.then((response: {
			previousPageCursor: null | string,
			nextPageCursor: string | null,
			data: {
				creator: {
					id: number,
					name: string,
					type: "User" | "Group"
				},
				id: number,
				name: string,
				description: string,
				displayName: string,
				displayDescription: string,
				enabled: true,
				iconImageId: number,
				displayIconImageId: number,
				created: string,
				updated: string,
				statistics: {
					pastDayAwardedCount: number,
					awardedCount: number,
					winRatePercentage: number
				},
				awarder: {
					id: number,
					type: "Place"
				}
			}[],
		}) => {
			for (const badge of response.data) {
				const result: Badge = {
					name: badge.name,
					description: badge.description,
					thumbnail: null,
					visible: true,
					awarder: badge.awarder.id,
					enabled: badge.enabled,
					stats: {
						pastDayAwardedCount: badge.statistics.pastDayAwardedCount,
						awardedCount: badge.statistics.awardedCount,
						winRatePercentage: badge.statistics.winRatePercentage,
					}
				}
				setBadges((old) => (old ? {...old, [badge.id]: result } : { [badge.id]: result }));
			}
			fetch(`https://thumbnails.roblox.com/v1/badges/icons?badgeIds=${response.data.map((badge) => badge.id).join(",")}&size=150x150&format=png`, {
				method: "GET",
				credentials: "include",
				cache: "force-cache"
			})
			.then((_response) => _response.json())
			.then((_response: {
				data: {
					targetId: number,
					state: string,
					imageUrl: string,
					version: string
				}[]
			}) => {
				for (const icon of _response.data) {
					setBadges((old: any) => ({
						...old,
						[icon.targetId]: {
							...old[icon.targetId],
							thumbnail: icon.imageUrl
						}
					}));
				}
			})
			.catch(async (err) => {
				console.error(err);
				await Console(`Inventory.tsx | https://thumbnails.roblox.com/v1/badges/icons?badgeIds=${response.data.map((badge) => badge.id).join(",")}&size=150x150&format=png - ${err}`);
				Notify(locales.error || "Error", locales.error_message || "An error occurred; check the console for more details.");
			});
			
			const games: { universe: number, place: number }[] = [];

			Promise.all(
				response.data
				.map((async (badge) => {
					if (badge.awarder.type !== "Place") {
						alert(JSON.stringify(badge));
						return;
					}
					if (badge.awarder.id in places) return;
					if (games.find((game) => game.place === badge.awarder.id)) return;
					await fetch(`https://apis.roblox.com/universes/v1/places/${badge.awarder.id}/universe`, {
						method: "GET",
						credentials: "include",
						cache: "force-cache"
					})
					.then((_response) => _response.json())
					.then((_response) => games.push({ place: badge.awarder.id, universe: _response.universeId }))
					.catch(async (err) => {
						console.error(err);
						await Console(`Inventory.tsx | https://apis.roblox.com/universes/v1/places/${badge.awarder.id}/universe - ${err}`);
						Notify(locales.error || "Error", locales.error_message || "An error occurred; check the console for more details.");
					});
				}))
			).then(() => {
				const universes = games.filter((game) => game.universe).map((game) => game.universe);
				
				for (let index = 0; index < universes.length; index += 50) {
					fetch(`https://games.roblox.com/v1/games?universeIds=${universes.slice(index, index + 50).join(",")}`, {
						method: "GET",
						credentials: "include",
						cache: "force-cache"
					})
					.then((_response) => _response.json())
					.then((_response: {
						data: {
							id: number,
							rootPlaceId: number,
							name: string,
							isFavoritedByUser: boolean
						}[]
					}) => {
						for (const game of _response.data) {
							setPlaces((old) => ({
								...old,
								[game.rootPlaceId]: {
									name: game.name,
									universe: game.id,
									isFavoritedByUser: game.isFavoritedByUser
								}
							}));
						}
					})
					.catch(async (err) => {
						console.error(err);
						await Console(`Inventory.tsx | https://games.roblox.com/v1/games?universeIds=${universes.slice(index, index + 50).join(",")} - ${err}`);
						Notify(locales.error || "Error", locales.error_message || "An error occurred; check the console for more details.");
					});
				}
			});

			if (response.nextPageCursor) {
				setIndex(response.nextPageCursor);
			}
		})
		.catch(async (err) => {
			console.error(err);
			await Console(`Inventory.tsx | https://badges.roblox.com/v1/users/${user}/badges?cursor=&limit=100&sortOrder=Desc&cursor=${index} - ${err}`);
			Notify(locales.error || "Error", locales.error_message || "An error occurred; check the console for more details.");
		});
	}, [index]);

	return (
		<>
			<input
				{...{"data-testid": "navigation-search-input-field"}}
				type="search"
				className="input-field new-input-field badge-search"
				autoComplete="off"
				placeholder={locales.badges_search || "Search"}
				maxLength={120}
				onInput={(e: any) => {
					if (!badges) return;
					const result = {...badges};
					const research = e.target.value.toLowerCase();
					if (!research) return;

					for (const [id, badge] of Object.entries(badges)) {
						if (research.length === 0) {
							result[id as any].visible = true;
							continue;
						}
						
						if (
							badge.name.toLowerCase().includes(research) ||
							badge.description.toLowerCase().includes(research)
						) {
							result[id as any].visible = true;
							continue;
						}
						result[id as any].visible = false;
					}
					setBadges(result);
				}}
			/>
			<Select
				name=""
				container={{id: "games-filter"}}
				options={[{ text: "All", value: "all" }, ...Object.entries(places).map(([id, detail]) => ({ text: detail.name, value: id.toString() }))]}
				selectProps={{
					"onChange": (e: any) => {
						if (!badges) return;
						const result = {...badges};

						for (const [id, badge] of Object.entries(badges)) {
							result[id as any].visible = e.target.value === "all" || badge.awarder.toString() === e.target.value;
						}
						setBadges(result);
					},
					defaultValue: "all"
				}}
			/>
			<div className="stack badge-container game-badges-list">
				<ul className="stack-list better-badges">
					{
						badges ?
						Object.entries(badges)
						.filter(([_id, badge]) => badge.visible)
						.map(([id, badge]) => (
							<li data-place-id={badge.awarder.toString()} data-badge-id={id} key={id} className="stack-row badge-row">
								<div className="badge-image">
									<a href={`/badges/${id}/${badge.name}`}>
										<span className="thumbnail-2d-container badge-image-container">
											{
												badge.thumbnail ?
												<img src={badge.thumbnail} alt={badge.name} />
												:
												<div></div>
											}
										</span>
									</a>
								</div>
								<div className="badge-content">
									<div className="badge-data-container">
										<div className="font-header-2 badge-name">{badge.name}</div>
										<p className="para-overflow badge-description">{badge.description}</p>
									</div>
									<ul className="badge-stats-container">
										<li>
											<div className="text-label">{locales.badges_rarity || "Rarity"}</div>
											<div className="font-header-2 badge-stats-info">{(badge.stats.winRatePercentage * 100).toFixed(1)}%</div>
										</li>
										<li>
											<div className="text-label">{locales.badges_won_yesterday || "Won Yesterday"}</div>
											<div className="font-header-2 badge-stats-info">
												<NumberComposent number={badge.stats.pastDayAwardedCount} />
											</div>
										</li>
										<li>
											<div className="text-label">{locales.badges_won_ever || "Won Ever"}</div>
											<div className="font-header-2 badge-stats-info">
												<NumberComposent number={badge.stats.awardedCount} />
											</div>
										</li>
									</ul>
								</div>
							</li>
						))
						:
						[...new Array(100)]
						.map((_, index) => (
							<li key={index} className="stack-row badge-row">
								<div className="badge-image">
									<Loading className="thumbnail-2d-container badge-image-container" />
								</div>
								<div className="badge-content">
									<div className="badge-data-container">
										<Loading style={{
											height: "2rem",
											width: "15rem",
										}} className="font-header-2 badge-name" />
										<Loading style={{
											height: "2.5rem",
											margin: ".5rem 0"
										}} className="para-overflow badge-description" />
									</div>
									<ul className="badge-stats-container">
										<li>
											<div className="text-label">{locales.badges_rarity || "Rarity"}</div>
											<Loading className="font-header-2 badge-stats-info" />
										</li>
										<li>
											<div className="text-label">{locales.badges_won_yesterday || "Won Yesterday"}</div>
											<Loading className="font-header-2 badge-stats-info" />
										</li>
										<li>
											<div className="text-label">{locales.badges_won_ever || "Won Ever"}</div>
											<Loading className="font-header-2 badge-stats-info" />
										</li>
									</ul>
								</div>
							</li>
						))
					}
				</ul>
			</div>
		</>
	);
}


const listener =  async () => {
	const parent = await awaitForElement<"div">(".tab-content.rbx-tab-content .current-items");
	if (!parent) return;

	const hiddens = [await awaitForElement<"div">("#assetsItems"), await awaitForElement<"div">(".pager-holder")];
	for (const hidden of hiddens) {
		hidden.style.removeProperty("display");
	}

	if (location.hash !== "#!/badges") return;
	for (const hidden of hiddens) {
		hidden.style.display = "none";
	}

	let user: string = getUrlParts()[1];
	if (user === "inventory") {
		const u = await _user().catch((err) => {
			console.error(err);
			Notify("Error", "The extension failed to retrieve the user ID.");
			Console("Inventory.tsx | Inventory page - Unable to retrieve the user ID");
		});
		if (!u) {
			Notify("Error", "The extension failed to retrieve the user ID.");
			Console("Inventory.tsx | Inventory page - Unable to retrieve the user ID");
			return;
		}
		user = u.id.toString();
	}

	if (parent.querySelector("#better-badges-badges-container")) return;

	const container = document.createElement("div");
	container.id = "better-badges-badges-container";
	
	createRoot(container).render(<Inventory user={user} />);
	parent.appendChild(container);
}

navigation.addEventListener("navigate", listener);
listener();