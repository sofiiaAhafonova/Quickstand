function header() {
    Handlebars.registerHelper('if', function(conditional, options) {
        if(conditional) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      });  
      const source = document.getElementById("header-template").innerHTML;
      const template = Handlebars.compile(source);
    let user = Cookie('name')// (Cookie('name') != null) ? Cookie('name') : false;
     checkAdmin().then(admin =>{
        document.getElementById("my-navbar").innerHTML = template({
                user: user,
                admin: admin
            });
    })

   
}
