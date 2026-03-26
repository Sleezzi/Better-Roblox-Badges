function Select({ name, options, selectProps = {} }: { name: string, options: { text: string, value: string }[], selectProps?: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> }) {
	const id = window.sleezzi.random();
	
	return (
		<div className="select-group" id={name}>
			<label htmlFor={id} className="select-label text-label">{name}</label>
			<div className="rbx-select-group select-group">
				<select className="input-field rbx-select select-option" name={name} id={id} {...selectProps}>
					{
						options.map((option, index) => (<option value={option.value}>{option.text}</option>))
					}
				</select>
				<span className="icon-arrow icon-down-16x16"></span>
			</div>
		</div>
	);
}

export default Select;