import { ArrayUtils } from './Array.utils';

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

	static removeFromTree(tree: any[], itemsToRemove: any[], childrenFieldName: string): any[] {
		let filteredTree = tree.filter(item => !itemsToRemove.includes(item));
		filteredTree.forEach(item => {
			if (item[childrenFieldName]) {
				item[childrenFieldName] = this.removeFromTree(
					item[childrenFieldName],
					itemsToRemove,
					childrenFieldName,
				);
			}
		});
		return filteredTree;
	}

	static flattenTree(tree: any[], childrenFieldName: string): any[] {
		let flatList: any[] = [];
		tree.forEach(item => {
			flatList.push(item);
			if (item[childrenFieldName]) {
				flatList = flatList.concat(this.flattenTree(item[childrenFieldName], childrenFieldName));
			}
		});
		return flatList;
	}

	static hasItemInCommon(tree1: any[], tree2: any[], idFieldName: string, childrenFieldName: string): boolean {
		const flatTree1 = this.flattenTree(tree1, childrenFieldName);
		const flatTree2 = this.flattenTree(tree2, childrenFieldName);
		return ArrayUtils.hasItemInCommon(
			flatTree1.map(item => item[idFieldName]),
			flatTree2.map(item => item[idFieldName]),
		);
	}
}
