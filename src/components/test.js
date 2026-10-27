


export async function AskOpenAI(question) {
    const APIURL = `${process.env.REACT_APP_SERVER_API}/civilengineer/askopenai`;

    try {
        const response = await fetch(APIURL, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(question),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(
                data.error || `Request failed with status ${response.status}`
            );
        }

        return data;

    } catch (err) {
        throw err instanceof Error
            ? err
            : new Error(String(err));
    }
}




