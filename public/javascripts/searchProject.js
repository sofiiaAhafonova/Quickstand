
function updateResults(page, value) {
	var str = '';
	if (value && page)
		str += "?name=" + value + "&page=" + page;
	else if (page)
		str += "?page=" + page;
	else if (value)
		str += "?search=" + value;
	console.log(str);
	var url = 'http://localhost:8080/api/v1/projects/';
	Handlebars.registerHelper("for", function (number) {
		var src = '';
		for (var i = 1; i <= number; i++) {
			src += '<li class="page-item">' +
                ' <button class="page-link"  onclick="updateResults(' + i + ',' + value + ')" >'
                 + i + '</button></li>';
		}
		return src;
    });
	 fetch(url, {
        method: 'get',
        credentials: 'include',
		headers: {
			Authorization: "Basic " + Cookie('basic')
		}
     }).then(data => data.json()).then(res=> console.log(res) )

}