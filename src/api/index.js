import { Config } from "../constants";
import { getLocalStorage } from "../localStorage";

export const fetch = async ({ url = '', http_verb = 'get', data = null, contentType = 'application/json', token = false }) =>{
    const storedToken = token ?? getLocalStorage(Config.userToken);

		const requestOptions = {
			method: http_verb,
			headers: {
				Authorization: 'Bearer ' + storedToken,
				Accept: 'application/json',
				"Content-Type": contentType,
			},
		};

		if (http_verb?.toLowerCase() !== 'get') {
            requestOptions['body'] = JSON.stringify(data);
        };

		try {
			const response = await fetch(Config.apiUrl + url, requestOptions);
			const responseJson = await response?.json();
			return responseJson;
		} catch (err) {
			return false;
		}

}