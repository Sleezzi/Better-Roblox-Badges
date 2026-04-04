type AwaitForElement = <ElementType extends keyof HTMLElementTagNameMap>(element: string) => Promise<ElementType extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[ElementType] : Element>;

const awaitForElement: AwaitForElement = (element: string) => new Promise((resolve, error) => {
	let resolved = false;
	if (document.querySelector(element)) {
		resolve(document.querySelector(element) as any);
		return;
	}
	
	const onChange = () => {
		if (document.querySelector(element)) {
			resolved = true;
			resolve(document.querySelector(element) as any);
			return;
		}
	}
	const osberver = new MutationObserver(onChange);
	osberver.observe(document.body, {
		subtree: true,
		childList: true
	});
	setTimeout(() => {
		if (resolved) return;
		error("Timeout");
	}, 10_000);
});

export default awaitForElement;