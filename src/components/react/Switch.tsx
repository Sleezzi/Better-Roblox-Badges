import { useState } from "react";

function Switch({ defaultState = false, state, toggled }: { defaultState?: boolean, state?: boolean, toggled: (state: boolean) => void }) {
	const [_state, setState] = useState(state || defaultState);

	return (
		<button type="button" role="switch" className={`btn-toggle receiver-destination-type-toggle ${state === true || _state ? "on" : "off"}`} aria-checked={!!state} onClick={() => {
			toggled(!_state);
			setState((old) => !old)
		}}>
			<span className="toggle-flip"></span>
			<span className="toggle-on"></span>
			<span className="toggle-off"></span>
		</button>
	);
}

export default Switch;