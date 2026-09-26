import { useEffect, useState } from "react";
import Select from "../../components/react/Select";
import { DateComposent } from "../../components/parseDate";
import Loading from "../../components/react/Loading";
import Translates from "../../components/translates";
import getAvatar from "../../components/api/user/getAvatar";
import { NumberComposent } from "../../components/splitNumber";
import Icon from "../../components/react/Icon";
import { User } from "../../components/user";
import Notify from "../global/Notifications";
import Console from "../../components/console";

type Badge = {
	thumbnail: string | null,
	name: string,
	description: string,
	owned: any,//string | false,
	stats: {
		pastDayAwardedCount: number,
		awardedCount: number,
		winRatePercentage: number
	},
	visible: boolean
}

const localesToGet = [
	"badges_total",
	"badges_rarity",
	"badges_won_yesterday",
	"badges_won_ever",
	"badges_search",
	"badges_not_filtered",
	"badges_owned_only",
	"badges_not_owned_only",
	"error",
	"error_message",
];

function Badges({ placeId, user }: { placeId: string, user: User }) {
	const [avatar, setAvatar] = useState<string | null>(null);
	const [universeId, setUniverseId] = useState<number | null>(null);
	const [index, setIndex] = useState<string>("");
	const [badges, setBadges] = useState<{ [id: number]: Badge } | null>(null);

	const [locales, setLocales] = useState<{ [name: string]: string | null }>({});

	useEffect(() => {
		setLocales(Translates(localesToGet));
	}, []);

	useEffect(() => {
		getAvatar(150, "png", [user.id])
		.then((avatars) => setAvatar(avatars[user.id as any]))
		.catch(async (err) => {
			console.error(err);
			await Console(`Failed to retreive the ${user.id}'s avatar - ${err}`);
			Notify(locales.error || "Error", locales.error_message || "An error occurred; check the console for more details.");
		});
	}, [user]);

	useEffect(() => {
	}, [location.href]);

	useEffect(() => {
		if (!placeId) return;
		fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`)
		.then((response) => response.json())
		.then((response: { universeId: number }) => {
			setUniverseId(response.universeId);
		})
		.catch(async (err) => {
			console.error(err);
			await Console(`https://apis.roblox.com/universes/v1/places/${placeId}/universe - ${err}`);
			Notify(locales.error || "Error", locales.error_message || "An error occurred; check the console for more details.");
		});
	}, [placeId]);

	useEffect(() => {
		if (!universeId) return;
		fetch(`https://badges.roblox.com/v1/universes/${universeId}/badges?limit=100&cursor=${index}&sortOrder=Asc`, {
			method: "GET",
			credentials: "include"
		})
		.then((response) => response.json())
		.then((response: {
			data: {
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
				awardingUniverse: {
					id: number,
					name: string,
					rootPlaceId: number
				}
			}[],
			nextPageCursor?: string,
		}) => {
			for (const badge of response.data) {
				const result: Badge = {
					name: badge.name,
					description: badge.description,
					owned: false,
					thumbnail: null,
					visible: true,
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
				credentials: "include"
			})
			.then((response) => response.json())
			.then((response: {
				data: {
					targetId: number,
					state: string,
					imageUrl: string,
					version: string
				}[]
			}) => {
				for (const icon of response.data) {
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
				await Console(`https://thumbnails.roblox.com/v1/badges/icons?badgeIds=${response.data.map((badge) => badge.id).join(",")}&size=150x150&format=png - ${err}`);
				Notify(locales.error || "Error", locales.error_message || "An error occurred; check the console for more details.");
			});

			fetch(`https://badges.roblox.com/v1/users/${user.id}/badges/awarded-dates?badgeIds=${response.data.map((badge) => badge.id).join(",")}`, {
				method: "GET",
				credentials: "include"
			})
			.then((response) => response.json())
			.then((response: {
				data: {
					badgeId: number,
					awardedDate: string
				}[]
			}) => {
				for (const badge of response.data) {
					setBadges((old: any) => ({
						...old,
						[badge.badgeId]: {
							...old[badge.badgeId],
							owned: badge.awardedDate
						}
					}));
				}
			})
			.catch(async (err) => {
				console.error(err);
				await Console(`https://badges.roblox.com/v1/users/${user.id}/badges/awarded-dates?badgeIds=${response.data.map((badge) => badge.id).join(",")} - ${err}`);
				Notify(locales.error || "Error", locales.error_message || "An error occurred; check the console for more details.");
			});

			if (response.nextPageCursor) {
				setIndex(response.nextPageCursor);
			}
		})
		.catch(async (err) => {
			console.error(err);
			await Console(`https://badges.roblox.com/v1/universes/${universeId}/badges?limit=100&cursor=${index}&sortOrder=Asc - ${err}`);
			Notify(locales.error || "Error", locales.error_message || "An error occurred; check the console for more details.");
		});
	}, [universeId, index]);

	return (
		<>
			<a href={`https://www.roblox.com/users/${user.id}/profile`} className="profile-header-main">
				{
					avatar ?
					<img className="avatar" src={avatar} alt={`${user.displayName}'s avatar`} title={`${user.displayName}'s avatar`} />
					:
					<Loading className="avatar" />
				}
				<div className="profile-header-details">
					<span className="user-display-name">
						{
							user.displayName || <Loading style={{height: "1.5rem", width: "10rem"}} />
						}
					</span>
					<span className="user-name web-blox-css-tss-zzwi3a-Typography-body1-Typography-colorSecondary-Typography-root profile-header-username">
						{
							user.username ? `@${user.username}` : <Loading style={{height: ".75rem", width: "5rem"}} />
						}
					</span>
					<p className="user-description">
						{locales.badges_total || "Total: "}
						<b>{badges ? Object.entries(badges).filter(([id, badge]) => badge.owned).length : 0}/{badges ? Object.keys(badges).length : 0}</b>
						<span> - </span>
						<b>{badges ? (Object.entries(badges).filter(([id, badge]) => badge.owned).length / Object.keys(badges).length * 100).toFixed(2) : 0}%</b>
					</p>
				</div>
				<a href={`/better-badges/${placeId}/`} style={{height: "1.5rem", width: "1.5rem"}}>
					<Icon color="var(--color-content-emphasis)" icon="arrow-right-left.png" />
				</a>
			</a>
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
			<Select name="" container={{id: "badges-filter"}} options={
				[
					{ text: locales.badges_not_filtered || "Show all", value: "all" },
					{ text: locales.badges_owned_only || "Owned only", value: "owned-only" },
					{ text: locales.badges_not_owned_only || "Not owned only", value: "owned-hidden" }
				]
			} selectProps={{"onChange": (e: any) => {
				if (!badges) return;
				const result = {...badges};
				if (e.target.value === "all") {
					for (const [id, badge] of Object.entries(badges)) {
						result[id as any].visible = true;
					}
				}
				if (e.target.value === "owned-only") {
					for (const [id, badge] of Object.entries(badges)) {
						result[id as any].visible = badge.owned ? true : false;
					}
				}
				
				if (e.target.value === "owned-hidden") {
					for (const [id, badge] of Object.entries(badges)) {
						result[id as any].visible = badge.owned ? false : true;
					}
				}

				setBadges(result);
			}, defaultValue: "all"}} />
			<div className="stack badge-container game-badges-list">
				<ul className="stack-list better-badges">
					{
						badges ?
						Object.entries(badges)
						.filter(([_id, badge]) => badge.visible)
						.map(([id, badge]) => (
							<li key={id} className="stack-row badge-row" {...{"badge-id": id}}>
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
								<div className="badge-owned-container">
									{
										badge.owned ?
										<span className="owned">
											✓
											<div className="text-label">
												<DateComposent date={badge.owned} />
											</div>
										</span>
										:
										<span>✖</span>
									}
								</div>
							</li>
						))
						:
						[...new Array(10)]
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

export default Badges;