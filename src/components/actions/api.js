export async function LogoutUser(values) {

    var APIURL = `https://civilengineer.io/gfk/api/logout.php`

    return fetch(APIURL, {
        credentials: "include"
    })
        .then(resp => {

            if (!resp.ok) {
                if (resp.status >= 400 && resp.status < 500) {
                    return resp.json().then(data => {
                        let err = { errorMessage: data.message };
                        throw err;
                    })
                }
                else {
                    let err = { errorMessage: 'Please try again later, server is not responding' };
                    throw err;
                }
            }

            return resp.json();
        })
}
export async function LoginUser(values) {

    var APIURL = `https://civilengineer.io/gfk/api/login.php`

    return fetch(APIURL, {
        method: 'post',
        credentials: "include",
        headers: new Headers({
            'Content-Type': 'application/json',
        }),

        body: JSON.stringify(values)
    })
        .then(resp => {

            if (!resp.ok) {
                if (resp.status >= 400 && resp.status < 500) {
                    return resp.json().then(data => {
                        let err = { errorMessage: data.message };
                        throw err;
                    })
                }
                else {
                    let err = { errorMessage: 'Please try again later, server is not responding' };
                    throw err;
                }
            }

            return resp.json();
        })
}

export async function UploadFieldImage(formdata) {
    var APIURL = `https://civilengineer.io/gfk/api/uploadfieldimage.php`

    return fetch(APIURL, {
        method: 'post',
        credentials: 'include',
        body: formdata,

    })
        .then(resp => {

            if (!resp.ok) {
                if (resp.status >= 400 && resp.status < 500) {
                    return resp.json().then(data => {
                        let err = { errorMessage: data.message };
                        throw err;
                    })
                }
                else {
                    let err = { errorMessage: 'Please try again later, server is not responding' };
                    throw err;
                }
            }

            return resp.json();
        })
}

export async function LoadSeismic() {
    let APIURL = `http://civilengineer.io/gfk/api/loadseismic.php`

    return fetch(APIURL, { credentials: 'include' }).then(resp => {

        if (!resp.ok) {
            if (resp.status >= 400 && resp.status < 500) {
                return resp.json().then(data => {

                    throw data.message;
                })
            }
            else {
                let err = { errorMessage: 'Please try again later, server is not responding' };
                throw err;
            }
        }

        return resp.json();
    })
}




export async function LoadSlopeStability() {
    let APIURL = `http://civilengineer.io/gfk/api/loadslopestability.php`

    return fetch(APIURL, { credentials: 'include' }).then(resp => {

        if (!resp.ok) {
            if (resp.status >= 400 && resp.status < 500) {
                return resp.json().then(data => {

                    throw data.message;
                })
            }
            else {
                let err = { errorMessage: 'Please try again later, server is not responding' };
                throw err;
            }
        }

        return resp.json();
    })
}



export async function LoadPTSlab() {
    let APIURL = `http://civilengineer.io/gfk/api/loadptslab.php`

    return fetch(APIURL, { credentials: 'include' }).then(resp => {

        if (!resp.ok) {
            if (resp.status >= 400 && resp.status < 500) {
                return resp.json().then(data => {

                    throw data.message;
                })
            }
            else {
                let err = { errorMessage: 'Please try again later, server is not responding' };
                throw err;
            }
        }

        return resp.json();
    })
}

export async function LoadZoneCharts() {
    let APIURL = `http://civilengineer.io/gfk/api/zonecharts.php`

    return fetch(APIURL, { credentials: 'include' }).then(resp => {

        if (!resp.ok) {
            if (resp.status >= 400 && resp.status < 500) {
                return resp.json().then(data => {

                    throw data.message;
                })
            }
            else {
                let err = { errorMessage: 'Please try again later, server is not responding' };
                throw err;
            }
        }

        return resp.json();
    })
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


export async function CheckUserLogin() {
    let APIURL = `http://civilengineer.io/gfk/api/loadprofile.php?engineerid=mazen`

    return fetch(APIURL, { credentials: 'include' }).then(resp => {

        if (!resp.ok) {
            if (resp.status >= 400 && resp.status < 500) {
                return resp.json().then(data => {

                    throw data.message;
                })
            }
            else {
                let err = { errorMessage: 'Please try again later, server is not responding' };
                throw err;
            }
        }

        return resp.json();
    })
}

export async function DeletePTSlab(section_id, layer_id) {
    const values = { section_id, layer_id }

    var APIURL = `http://civilengineer.io/gfk/api/deleteptslab.php`

    return fetch(APIURL, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({
            'Content-Type': 'application/json',
        }),

        body: JSON.stringify(values)
    })
        .then(resp => {

            if (!resp.ok) {
                if (resp.status >= 400 && resp.status < 500) {
                    return resp.json().then(data => {
                        let err = { errorMessage: data.message };
                        throw err;
                    })
                }
                else {
                    let err = { errorMessage: 'Please try again later, server is not responding' };
                    throw err;
                }
            }

            return resp.json();
        })
}

export async function HandleSlopeStability(projectid, sections) {
    const values = { projectid, sections }

    var APIURL = `http://civilengineer.io/gfk/api/handleslopestability.php`

    return fetch(APIURL, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({
            'Content-Type': 'application/json',
        }),

        body: JSON.stringify(values)
    })
        .then(resp => {

            if (!resp.ok) {
                if (resp.status >= 400 && resp.status < 500) {
                    return resp.json().then(data => {
                        throw data;
                    })
                }
                else {
                    let err = ' Error Making Request'
                    throw err;
                }
            }

            return resp.json();
        })
}

export async function HandleSeismic(seismic) {


    var APIURL = `http://civilengineer.io/gfk/api/handleseismic.php`

    return fetch(APIURL, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({
            'Content-Type': 'application/json',
        }),

        body: JSON.stringify(seismic)
    })
        .then(resp => {

            if (!resp.ok) {
                if (resp.status >= 400 && resp.status < 500) {
                    return resp.json().then(data => {
                        let err = { errorMessage: data.message };
                        throw err;
                    })
                }
                else {
                    let err = { errorMessage: 'Please try again later, server is not responding' };
                    throw err;
                }
            }

            return resp.json();
        })
}


export async function HandlePTSlab(ptslab) {
    console.log(ptslab)

    var APIURL = `http://civilengineer.io/gfk/api/handleptslab.php`

    return fetch(APIURL, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({
            'Content-Type': 'application/json',
        }),

        body: JSON.stringify(ptslab)
    })
        .then(resp => {

            if (!resp.ok) {
                if (resp.status >= 400 && resp.status < 500) {
                    return resp.json().then(data => {
                        let err = { errorMessage: data.message };
                        throw err;
                    })
                }
                else {
                    let err = { errorMessage: 'Please try again later, server is not responding' };
                    throw err;
                }
            }

            return resp.json();
        })
}

export async function SaveBorings(engineerid, projectid, borings) {
    const values = { engineerid, projectid, borings }
    var APIURL = `https://civilengineer.io/gfk/api/saveborings.php`

    return fetch(APIURL, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({
            'Content-Type': 'application/json',
        }),

        body: JSON.stringify(values)
    })
        .then(resp => {

            if (!resp.ok) {
                if (resp.status >= 400 && resp.status < 500) {
                    return resp.json().then(data => {
                        let err = { errorMessage: data.message };
                        throw err;
                    })
                }
                else {
                    let err = { errorMessage: 'Please try again later, server is not responding' };
                    throw err;
                }
            }

            return resp.json();
        })
}

export async function SaveFieldReport(fieldreport) {
    const values = { fieldreport }
    var APIURL = `https://civilengineer.io/gfk/api/handlefieldreport.php`
    return fetch(APIURL, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({
            'Content-Type': 'application/json',
        }),

        body: JSON.stringify(values)
    })
        .then(resp => {

            if (!resp.ok) {
                if (resp.status >= 400 && resp.status < 500) {
                    return resp.json().then(data => {
                        throw data.message
                    })
                }
                else {
                    let err = 'Request failed or Server is not responding';
                    throw err;
                }
            }

            return resp.json();
        })
}

export async function UploadGraphicLog(formData) {

    var APIURL = `https://civilengineer.io/gfk/api/uploadgraphiclog.php`
    return fetch(APIURL, {
        method: 'post',
        credentials: 'include',
        body: formData
    })
        .then(resp => {

            if (!resp.ok) {
                if (resp.status >= 400 && resp.status < 500) {
                    return resp.json().then(data => {

                        throw data.message;
                    })
                }
                else {
                    let err = { errorMessage: 'Please try again later, server is not responding' };
                    throw err;
                }
            }

            return resp.json();
        })
}
export async function SaveTime(values) {
    var APIURL = `https://civilengineer.io/gfk/api/savetime.php`
    return fetch(APIURL, {
        method: 'post',
        credentials: 'include',
        headers: new Headers({
            'Content-Type': 'application/json',
        }),

        body: JSON.stringify(values)
    })
        .then(resp => {

            if (!resp.ok) {
                if (resp.status >= 400 && resp.status < 500) {
                    return resp.json().then(data => {

                        throw data.message;
                    })
                }
                else {
                    let err = { errorMessage: 'Please try again later, server is not responding' };
                    throw err;
                }
            }

            return resp.json();
        })
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
