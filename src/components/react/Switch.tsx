import { useEffect, useState } from "react";

function Switch({ defaultState = false, toggled }: { defaultState?: boolean, toggled: (state: boolean) => void }) {
	const [state, setState] = useState(defaultState);

	useEffect(() => {
		toggled(state);
	}, [state]);

	return (
		<button type="button" role="switch" className={`btn-toggle receiver-destination-type-toggle ${state ? "on" : ""}`} aria-checked={state} onClick={() => setState((old) => !old)}>
			<span className="toggle-flip"></span>
			<span className="toggle-on"></span>
			<span className="toggle-off"></span>
		</button>
	);
}

export default Switch;