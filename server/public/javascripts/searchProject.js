function updateResults(page, value) {
    if (!page || page < 1)
        page = 1;
    var url = 'http://localhost:8080/api/v1/projects?page=' + page + '&name=' + value;
    fetch(url, {
        method: 'get',
        credentials: 'include',
        headers: {
            Authorization: "Basic " + Cookie('basic')
        }
    }).then(data => data.json()).then(res => {
        Handlebars.registerHelper("for", function (number) {
            let src = '';
            for (let i = 1; i <= number; i++) {
                src +=
                    ' <button class="page-link"  onclick="updateResults(' + i + ',\'' + value + '\')" >' +
                    i + '</button>';
            }
            return src;
        });
        const source = document.getElementById("projects-template").innerHTML;
        const template = Handlebars.compile(source);
        if (res["projects"]) {
            document.getElementById("projects-list").innerHTML = template({
                projects: res["projects"],
                pages: res["totalPages"]
            });
        } else
            document.getElementById("projects-list").innerHTML = template({
                error: res["message"]
            });
    })
}


function searchInput() {
    const source = document.getElementById("srch-projects-template").innerHTML;
    const template = Handlebars.compile(source);
    document.getElementById("search").innerHTML = template({});
}

function search() {
    let srch = document.getElementById("search-input").value
    updateResults(1, srch);
}