function Loading(props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
	return (
		<div {...props} className={`better-roblox-badges-loading ${props.className || ""}`}></div>
	);
}

export default Loading;