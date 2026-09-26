function Select({ container = { className: "" }, name = "", options, selectProps = { className: "" } }: { container?: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLDivElement>, HTMLDivElement>, name: string, options: { text: string, value: string }[], selectProps?: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> }) {
	const id = Math.random().toString(36).slice(2);
	
	return (
		<div className={`select-group ${container.className}`} {...container}>
			<label htmlFor={id} className="select-label text-label">{name}</label>
			<div className="rbx-select-group select-group">
				<select className="input-field rbx-select select-option" name={name} id={id} {...selectProps}>
					{
						options.map((option, index) => (<option value={option.value} key={index}>{option.text}</option>))
					}
				</select>
				<span className="icon-arrow icon-down-16x16"></span>
			</div>
		</div>
	);
}

export default Select;