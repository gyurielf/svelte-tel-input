const send = async ({
	method,
	path,
	data,
	base
}: {
	method: string;
	path: string;
	data?: any;
	base: string;
}) => {
	const opts: any = { method, headers: {}, credentials: 'include' };

	if (data) {
		opts.headers['content-type'] = 'application/json';
		opts.body = JSON.stringify(data);
	}

	const fullPath: string = encodeURI(`${base}${path}`);
	const response = await fetch(fullPath, opts);

	if (response.status === 204) {
		return { response };
	}

	if (response.headers.get('content-type') === 'application/json') {
		const json: Record<string, any> = await response.json();
		return { response, json };
	}

	return { response };
};

// Shortcut methods
export const get = (base: string, path: string) => {
	return send({ method: 'GET', path, base });
};

export const del = (base: string, path: string, data?: any) => {
	return send({ method: 'DELETE', path, data, base });
};

export const post = (base: string, path: string, data?: any) => {
	return send({ method: 'POST', path, data, base });
};

export const put = (base: string, path: string, data?: any) => {
	return send({ method: 'PUT', path, data, base });
};
