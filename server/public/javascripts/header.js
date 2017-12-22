
const Host = window.location.origin
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
    let user = Cookie('name')
     checkAdmin().then(admin =>{
        document.getElementById("my-navbar").innerHTML = template({
                user: user,
                admin: admin
            });
    })

   
}
function checkAdmin(){
  var url = Host + '/api/v1/auth/admin';
  return fetch(url, {
      method: 'get',
      credentials: 'include',
      headers: {
          Authorization: "Bearer " + Cookie('access-token')
      }
  }).then(data => data.json()).then(res => { 
      let admin = res['isAdmin'];
      console.log(admin);
      return admin;
  })
}
