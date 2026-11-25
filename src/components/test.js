export async function DownLoadFigure(projectid, figureid) {



    const baseURL = process.env.REACT_APP_SERVER_API.replace(/\/+$/, '');

    const APIURL =

    `${baseURL}/gfk/${encodeURIComponent(projectid)}/figures/${encodeURIComponent(figureid)}/reportxml`;

    try {
        const resp = await fetch(APIURL, {
            credentials: 'include'
        });

        if (!resp.ok) {
            const errorData = await resp.json().catch(() => null);

            throw new Error(
                errorData?.message ||
                `Failed to download report. HTTP ${resp.status}`
            );
        }

        return await resp.blob();

    } catch (err) {
        console.error('Error downloading report:', err);
        throw err;
    }
}