export const getProjects = async(page, value) => {
    if (!page || page < 1)
        page = 1;
    let name = !value ? '': '&name=' + value;
    var url = 'http://localhost:8080/api/v1/projects?page=' + page + name
    var res =  fetch(url, {
        method: 'get',
        credentials: 'include',
        headers: {
            Authorization: "Basic " + getCookie('basic')
        }
    })
    .then(data => data.json())

    return res;
};

export const deleteProject = async (id) => {
    const url = `http://localhost:8080/api/v1/projects/${id}`;
    console.log("deleting url: ", url);
    const response = await fetch(url, {
        method: 'delete',
        headers: {
            Authorization: "Basic " + getCookie('basic')
        }
    });
    if(response.status === 200) {
        console.log("success");
    } else {
        window.location.replace('/search');
        console.log("status: " + response.status);
    }
    return response.json;
};



const getCookie = cookiename => {
    let cookiestring = RegExp('' + cookiename + '[^;]+').exec(document.cookie);
    return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, '') : '')
};