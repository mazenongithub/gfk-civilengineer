export async function LoadGraphics(companyid) {
    const APIURL = `${process.env.REACT_APP_SERVER_API}/gfk/${companyid}/loadgraphiclogs`;

    try {
        const resp = await fetch(APIURL, { credentials: 'include' });

        if (!resp.ok) {
            // Try to extract server error message if available
            const errorData = await resp.json().catch(() => ({}));
            const message =
                errorData?.message ||
                (resp.status >= 400 && resp.status < 500
                    ? 'Client error while loading project.'
                    : 'Please try again later, server is not responding.');
            throw new Error(message);
        }

        return await resp.json();
    } catch (err) {
        console.error('❌ Error loading project:', err);
        throw err;
    }
}