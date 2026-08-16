export async function LogoutUser(engineerid) {
    if (!engineerid) {
        throw new Error("Missing engineer ID for logout.");
    }

    const APIURL = `${process.env.REACT_APP_SERVER_API}/gfk/${engineerid}/logout`;

    try {
        const resp = await fetch(APIURL, {
            credentials: "include"
        });

        if (!resp.ok) {
            const data = await resp.json();
            throw data.message || "Logout failed";
        }

        return await resp.json();

    } catch (err) {
        throw typeof err === "string"
            ? err
            : err.message || "Server error during logout";
    }
}

export async function EngineerLogin(values) {
    const APIURL = `${process.env.REACT_APP_SERVER_API}/gfk/users/clientlogin`;

    try {
        const resp = await fetch(APIURL, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        // Handle client errors (400–499)
        if (!resp.ok) {
            const errorData = await resp.json().catch(() => ({}));
            const message = errorData.message || `Request failed with status ${resp.status}`;
            throw new Error(message);
        }

        return await resp.json();
    } catch (err) {
        throw err;
    }
}

export async function SaveContactUs(values) {
    const APIURL = `${process.env.REACT_APP_SERVER_API}/gfk/savecontactus`;

    try {
        const response = await fetch(APIURL, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            const message =
                data.message || 'Request failed or server is not responding';
            throw new Error(message);
        }

        return await response.json();

    } catch (err) {
        throw err instanceof Error ? err : new Error(String(err));
    }
}

export async function UploadFieldImage(formData) {
    const APIURL = `${process.env.REACT_APP_SERVER_API}/gfk/upload/fieldimage`;

    try {
        const resp = await fetch(APIURL, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        // Handle non-OK responses
        if (!resp.ok) {
            const errorData = await resp.json().catch(() => null);

            if (resp.status >= 400 && resp.status < 500 && errorData?.message) {
                throw new Error(errorData.message);
            }

            throw new Error("Please try again later, server is not responding");
        }

        // Return successful response
        return await resp.json();

    } catch (error) {
        // Normalize error object
        return Promise.reject(error.message || "Unexpected error occurred");
    }
}












export async function LoadZoneCharts() {
    const APIURL = `${process.env.REACT_APP_SERVER_API}/gfk/loadzonecharts`;

    try {
        const resp = await fetch(APIURL, { credentials: "include" });

        if (!resp.ok) {
            // Handle client errors (400–499)
            if (resp.status >= 400 && resp.status < 500) {
                const data = await resp.json();
                throw new Error(data.message || "Client error");
            }

            // Handle server or unknown errors
            throw new Error("Please try again later, server is not responding");
        }

        return await resp.json();

    } catch (err) {
        // Normalize errors into a readable message
        throw err instanceof Error ? err : new Error("Network error");
    }
}


export async function LoadProjects() {
    const APIURL = `${process.env.REACT_APP_SERVER_API}/gfk/loadprojects`;

    try {
        const resp = await fetch(APIURL, { credentials: 'include' });

        if (!resp.ok) {
            // Try to extract server error message if available
            const errorData = await resp.json().catch(() => ({}));
            const message =
                errorData?.message ||
                (resp.status >= 400 && resp.status < 500
                    ? 'Client error while loading projects.'
                    : 'Please try again later, server is not responding.');
            throw new Error(message);
        }

        return await resp.json();
    } catch (err) {
        console.error('❌ Error loading projects:', err);
        throw err;
    }
}

export async function GetSummary(projectid) {
    const APIURL = `${process.env.REACT_APP_SERVER_API}/gfk/xml/${projectid}/labsummary`;

    try {
        const resp = await fetch(APIURL, { credentials: 'include' });

        if (!resp.ok) {
            // Try to parse JSON error if server sent one
            const errorData = await resp.json().catch(() => null);
            const message =
                errorData?.message ||
                (resp.status >= 400 && resp.status < 500
                    ? 'Client error while loading summary.'
                    : 'Server error. Please try again later.');

            throw new Error(message);
        }

        // ⬅️ IMPORTANT: API returns a PDF, so use blob()
        const pdfBlob = await resp.blob();
        return pdfBlob;

    } catch (err) {
        console.error('❌ Error fetching summary:', err);
        throw err;
    }
}



export async function LoadProject(projectid) {
    const APIURL = `${process.env.REACT_APP_SERVER_API}/gfk/${projectid}/loadproject`;

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

export async function DownloadInvoice(projectid, invoiceid) {
    const APIURL = `${process.env.REACT_APP_SERVER_API}/gfk/xml/${projectid}/invoice/${invoiceid}`;

    try {
        const resp = await fetch(APIURL, { credentials: 'include' });

        if (!resp.ok) {
            // Try to parse JSON error if server sent one
            const errorData = await resp.json().catch(() => null);
            const message =
                errorData?.message ||
                (resp.status >= 400 && resp.status < 500
                    ? 'Client error while loading summary.'
                    : 'Server error. Please try again later.');

            throw new Error(message);
        }

        // ⬅️ IMPORTANT: API returns a PDF, so use blob()
        const pdfBlob = await resp.blob();
        return pdfBlob;

    } catch (err) {
        console.error('❌ Error fetching summary:', err);
        throw err;
    }
}


export async function CheckUser() {
    const APIURL = `${process.env.REACT_APP_SERVER_API}/gfk/checkuser`;

    try {
        const resp = await fetch(APIURL, {
            credentials: 'include'
        });

        if (!resp.ok) {
            if (resp.status >= 400 && resp.status < 500) {
                const data = await resp.json().catch(() => ({}));
                throw new Error(data.message || "Client-side error");
            } else {
                throw new Error("Please try again later, server is not responding");
            }
        }

        return await resp.json();
    } catch (err) {
        throw err;
    }
}



export async function SaveBorings(values) {
    const APIURL = `${process.env.REACT_APP_SERVER_API}/gfk/saveborings`;

    try {
        const resp = await fetch(APIURL, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        });

        if (!resp.ok) {
            const data = await resp.json();
            throw data.message || "Failed to save borings";
        }

        return await resp.json();

    } catch (err) {
        throw typeof err === "string"
            ? err
            : err.errorMessage ||
            err.message ||
            "Server error while saving borings";
    }
}


export async function SaveFieldReports(values) {
    const APIURL = `${process.env.REACT_APP_SERVER_API}/gfk/savefieldreports`;

    try {
        const response = await fetch(APIURL, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            const message =
                data.message || 'Request failed or server is not responding';
            throw new Error(message);
        }

        return await response.json();

    } catch (err) {
        throw err instanceof Error ? err : new Error(String(err));
    }
}


export async function SaveSeismic(values) {
    const APIURL = `${process.env.REACT_APP_SERVER_API}/gfk/saveseismic`;

    try {
        const resp = await fetch(APIURL, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        });

        if (!resp.ok) {
            const data = await resp.json();
            throw data.message || "Failed to save seismic";
        }

        return await resp.json();

    } catch (err) {
        throw typeof err === "string"
            ? err
            : err.errorMessage ||
            err.message ||
            "Server error while saving seismic";
    }
}

export async function SavePTSlab(values) {

    const APIURL = `${process.env.REACT_APP_SERVER_API}/gfk/saveptslab`;

    try {
        const resp = await fetch(APIURL, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        });

        if (!resp.ok) {
            const data = await resp.json();
            throw data.message || "Failed to save ptslab";
        }

        return await resp.json();

    } catch (err) {
        throw typeof err === "string"
            ? err
            : err.errorMessage ||
            err.message ||
            "Server error while saving ptslab";
    }
}


export async function SaveSlope(values) {
    const APIURL = `${process.env.REACT_APP_SERVER_API}/gfk/saveslope`;

    try {
        const resp = await fetch(APIURL, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        });

        if (!resp.ok) {
            const data = await resp.json();
            throw data.message || "Failed to save slope";
        }

        return await resp.json();

    } catch (err) {
        throw typeof err === "string"
            ? err
            : err.errorMessage ||
            err.message ||
            "Server error while saving slope";
    }
}

export async function SaveClients(values) {
    const APIURL = `${process.env.REACT_APP_SERVER_API}/gfk/saveclients`;

    try {
        const resp = await fetch(APIURL, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        });

        if (!resp.ok) {
            const data = await resp.json();
            throw data.message || "Failed to save clients";
        }

        return await resp.json();

    } catch (err) {
        throw typeof err === "string"
            ? err
            : err.errorMessage ||
            err.message ||
            "Server error while saving clients";
    }
}

export async function SaveSchedule(values) {
    const APIURL = `${process.env.REACT_APP_SERVER_API}/gfk/saveschedule`;

    try {
        const resp = await fetch(APIURL, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        });

        if (!resp.ok) {
            const data = await resp.json();
            throw data.message || "Failed to save schedule";
        }

        return await resp.json();

    } catch (err) {
        throw typeof err === "string"
            ? err
            : err.errorMessage ||
            err.message ||
            "Server error while saving schedule";
    }
}


export async function SaveTimesheet(values) {
    const APIURL = `${process.env.REACT_APP_SERVER_API}/gfk/savetimesheet`;

    try {
        const resp = await fetch(APIURL, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        });

        if (!resp.ok) {
            const data = await resp.json();
            throw data.message || "Failed to save timesheet";
        }

        return await resp.json();

    } catch (err) {
        throw typeof err === "string"
            ? err
            : err.errorMessage ||
            err.message ||
            "Server error while saving timesheet";
    }
}


export async function SaveScheduke(values) {
    const APIURL = `${process.env.REACT_APP_SERVER_API}/gfk/saveschedule`;

    try {
        const resp = await fetch(APIURL, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        });

        if (!resp.ok) {
            const data = await resp.json();
            throw data.message || "Failed to save schedule";
        }

        return await resp.json();

    } catch (err) {
        throw typeof err === "string"
            ? err
            : err.errorMessage ||
            err.message ||
            "Server error while saving schedule";
    }
}




export async function SaveCompactionCurves(values) {
    const APIURL = `${process.env.REACT_APP_SERVER_API}/gfk/savecompactioncurves`;

    try {
        const resp = await fetch(APIURL, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        });

        if (!resp.ok) {
            const data = await resp.json();
            throw data.message || "Failed to save compactioncurves";
        }

        return await resp.json();

    } catch (err) {
        throw typeof err === "string"
            ? err
            : err.errorMessage ||
            err.message ||
            "Server error while saving compactioncurves";
    }
}


export async function UploadGraphicLog(formData) {
    const APIURL = `${process.env.REACT_APP_SERVER_API}/gfk/uploadgraphiclog`;

    try {
        const resp = await fetch(APIURL, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        // Handle non-OK responses
        if (!resp.ok) {
            const errorData = await resp.json().catch(() => null);

            if (resp.status >= 400 && resp.status < 500 && errorData?.message) {
                throw new Error(errorData.message);
            }

            throw new Error("Please try again later, server is not responding");
        }

        // Return successful response
        return await resp.json();

    } catch (error) {
        // Normalize error object
        return Promise.reject(error.message || "Unexpected error occurred");
    }
}




export async function SaveProjects(values) {
    const API_URL = `${process.env.REACT_APP_SERVER_API}/gfk/saveprojects`;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const message =
                errorData.message ||
                (response.status >= 400 && response.status < 500
                    ? "Invalid request. Please check your data."
                    : "Please try again later, server is not responding.");
            throw new Error(message);
        }

        return await response.json();
    } catch (err) {
        console.error("❌ SaveProjects error:", err);
        throw err;
    }
}
