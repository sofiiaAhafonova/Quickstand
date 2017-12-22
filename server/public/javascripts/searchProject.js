function updateResults(page, value) {
    if (!page || page < 1) page = 1;
    let name = (value) ?  '&name=' + value : '';
    var url = 'https://quickstand-web.herokuapp.com/api/v1/projects?page=' + page + name;
    fetch(url, {
        method: 'get',
        credentials: 'include',
        headers: {
            Authorization: "Bearer " + Cookie('access-token')
        }
    }).then(data => data.json()).then(res => {
        console.log( Cookie('searchValue'))
        Handlebars.registerHelper("for", function (number) {
            let src = '';
            for (let i = 1; i <= number; i++) {
                src +=
                    ' <button class="mybtn"  onclick="updateResults(' + i + ',\'' + value + '\')" >' +
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
    document.getElementById("search").innerHTML = template({val: Cookie("searchValue")});
}

function search() {
    let srch = document.getElementById("search-input").value
    updateResults(1, srch);
}