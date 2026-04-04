function splitNumber(number: number | string) {
	if (!localStorage.getItem("splitNumber")) return `${number}`;
	
	return `${number}`.replace(/\B\B(?=([0-9]{3})+(?![0-9]))/g, localStorage.getItem("splitNumber") === "dot" ? "." : " ");
}
export default splitNumber;