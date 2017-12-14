function header() {
    let user = (Cookie('name') != null) ? Cookie('name') : false;
    console.log(user)
    const source = document.getElementById("header-template").innerHTML;
    const template = Handlebars.compile(source);
    document.getElementById("my-navbar").innerHTML = template({
        user: user,
        admin: Cookie('isAdmin')
    });
}
