export function getParamFromRouteTree(route: any, param: string): string | undefined {
	let current = route;
	while (current) {
		if (current.params && current.params[param]) {
			return current.params[param];
		}
		current = current.parent;
	}
	return undefined;
}
