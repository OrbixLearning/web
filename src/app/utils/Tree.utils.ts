export class TreeUtils {
	static findItemById(tree: any[], id: string, idFieldName: string, childrenFieldName: string): any | undefined {
		for (const item of tree) {
			if (item[idFieldName] === id) {
				return item;
			}
			if (item[childrenFieldName]) {
				const found = this.findItemById(item[childrenFieldName], id, idFieldName, childrenFieldName);
				if (found) {
					return found;
				}
			}
		}
	}
}
