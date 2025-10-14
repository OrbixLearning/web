export function enumTransform(label: string, format?: 'uppercase' | 'lowercase' | 'camelcase' | 'snakecase'): string {
	switch (format) {
		case 'uppercase':
			return label.toUpperCase();

		case 'lowercase':
			return label.toLowerCase();

		case 'camelcase':
			return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();

		case 'snakecase':
			return label.replace(/\s+/g, '_').toLowerCase();

		default:
			return label;
	}
}
