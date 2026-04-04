import Translates from "./translates";

function parseDate(date: string | number | Date) {
	const _date = new Date(date);
	const format = localStorage.getItem("dateFormat");
	const messages = Translates(["day", "month"])
	const day = (messages.day || "Sunday/Monday/Thuesday/Wednesday/Thursday/Friday/Saturday").split("/", 7)[_date.getDay()];
	const month = (messages.month || "January/February/March/April/May/June/July/August/September/October/November/December").split("/", 12)[_date.getMonth()];

	if (format === "American/Small") {
		return `${_date.getMonth() < 9 ? `0${_date.getMonth()}` : _date.getMonth()}/${_date.getDate() < 9 ? `0${_date.getDate()}` : _date.getDate()}/${_date.getFullYear()} ${_date.getHours() > 9 ? _date.getHours() : `0${_date.getHours()}`}:${_date.getMinutes() > 9 ? _date.getMinutes() : `0${_date.getMinutes()}`}`;
	}
	if (format === "Default/Small") {
		return `${_date.getDate() < 9 ? `0${_date.getDate()}` : _date.getDate()}/${_date.getMonth() < 9 ? `0${_date.getMonth()}` : _date.getMonth()}/${_date.getFullYear()} ${_date.getHours() > 9 ? _date.getHours() : `0${_date.getHours()}`}:${_date.getMinutes() > 9 ? _date.getMinutes() : `0${_date.getMinutes()}`}`;
	}
	if (format === "American/Full") {
		return `${day} ${month} ${_date.getDate()} ${_date.getFullYear()} ${_date.getHours() > 9 ? _date.getHours() : `0${_date.getHours()}`}:${_date.getMinutes() > 9 ? _date.getMinutes() : `0${_date.getMinutes()}`}`;
	}
	return `${day} ${_date.getDate()} ${month} ${_date.getFullYear()} ${_date.getHours() > 9 ? _date.getHours() : `0${_date.getHours()}`}:${_date.getMinutes() > 9 ? _date.getMinutes() : `0${_date.getMinutes()}`}`;;
}

export default parseDate;