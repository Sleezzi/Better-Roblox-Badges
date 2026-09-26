import React, { useCallback, useEffect, useRef, useState } from "react";
import { createRoot, Root } from "react-dom/client";
import awaitForElement from "../../components/awaitForElement";
import browser from "webextension-polyfill";
import Translates from "../../components/translates";

type Phase = "enter" | "consuming" | "paused" | "leave";

const Notification = ({ parent, title, message, duration, color }: { parent: HTMLDivElement, title: string, message: string, duration: number, color: string }) => {
	const [phase, setPhase] = useState<Phase>("enter");
	const timer = useRef<null | number>(null);

	const dismiss = useCallback(() => {
		setPhase("leave");
		setTimeout(() => parent.remove(), 380);
	}, []);

	const startTimer = useCallback(() => {
		timer.current = setTimeout(() => dismiss(), duration);
	}, [dismiss, duration]);

	const pauseTimer = () => {
		if (!timer.current) return;
		clearTimeout(timer.current);
	};

	useEffect(() => {
		const changeThePhase = setTimeout(() => {
			setPhase("consuming");
		}, 380);
		startTimer();

		return () => {
			clearTimeout(changeThePhase);
			pauseTimer();
		};
	}, [startTimer]);

	useEffect(() => {
		parent.onclick = () => dismiss();
		parent.onmouseenter = () => {
			if (phase !== "consuming") return;
			setPhase("paused");
			pauseTimer();
		};
		parent.onmouseleave = () => {
			if (phase !== "paused") return;
			setPhase("consuming");
			startTimer();
		};
	}, []);

	useEffect(() => {
		parent.setAttribute("phase", phase);
	}, [phase]);

	return (
		<>
			<h3 className="better-badges-title">{title} - {Translates(["name"]).name || "Better Roblox Badges"}</h3>
			<p className="better-badges-description">{message}</p>
			<div className="better-badges-progress-margin"></div>
			{
				phase === "consuming" &&
				<div className="better-badges-progress-bar" style={{ "--duration": `${duration}ms` } as React.CSSProperties}></div>
			}
		</>
	);
}

let container: HTMLDivElement | null = null;

function Notify(title: string, message: string, duration: number | "default" = "default", color: string = "unset") {
	if (!container) throw new Error("Unable to display the notification; the container is not ready.");
	const notification = document.createElement("div");
	notification.className = "notification";
	notification.style = `--color: ${color};`;

	createRoot(notification).render(<Notification parent={notification} title={title} message={message} duration={duration === "default" ? 5_000 : duration} color={color} />);
	
	container.appendChild(notification);
}

export default Notify;

(async () => {
	if (container) return;
	const parent = await awaitForElement("body#rbx-body");
	if (!parent) return;
	
	const notifications = document.querySelector("#better-roblox-badges-notifications-container" as "div") || document.createElement("div");
	notifications.id = "better-roblox-badges-notifications-container";
	parent.appendChild(notifications);
	container = notifications;
})();