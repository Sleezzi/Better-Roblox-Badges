import getIcon from "../getIcon";

function Icon({icon, color}: {icon: string, color: string}) {
	return (
		<div style={{background: color, mask: `url(${getIcon(icon)}) center/cover no-repeat`, height: "100%", width: "100%", aspectRatio: "1/1"}}></div>
	);
}

export default Icon;