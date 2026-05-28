export class SSEUtils {
	static transient<K>(url: string, onUpdate: (param: K) => void) {
		const eventSource = new EventSource(url, { withCredentials: true });

		eventSource.onmessage = response => {
			const data: K = JSON.parse(response.data);
			onUpdate(data);
			eventSource.close();
		};

		eventSource.onerror = error => {
			console.error(error);
			eventSource.close();
		};
	}

	static persistent<K>(url: string, onUpdate: (param: K) => void) {
		const eventSource = new EventSource(url, { withCredentials: true });

		eventSource.onmessage = response => {
			const data: K = JSON.parse(response.data);
			onUpdate(data);
		};

		eventSource.onerror = error => {
			console.error(error);
			eventSource.close();
		};
	}
}
