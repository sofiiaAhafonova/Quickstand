$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', "Bearer " +  Cookie('access-token'));
    }
});
let Lists = null;
function getLists(){
    var queryString =Host + "/api/v1" + window.location.href.replace(Host,'') + "/lists";
    console.log(queryString)
    $.get(queryString, function( data ) {
        const source = document.getElementById("lists-template").innerHTML;
        const template = Handlebars.compile(source);
        
        document.getElementById("task-lists").innerHTML = template({
            lists: data["lists"]
        });
        Lists =  data["lists"];
        console.log(Lists)
    });
}
function addList() {
    document.getElementById("list-input").hidden = false;
}
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}


function check(){

    jQuery.validator.setDefaults({
        debug: true,
        success: "valid"
      });
      var form = $( "#myform" );
    form.validate();
    var queryString = Host + "/api/v1/lists/";
    var boardurl = window.location.href.replace(Host ,'')
    var board = boardurl.replace('/boards/','')
   
        var name =  $("#list-input-field").val();
        if(form.valid())
        console.log(board)
            $.post(queryString,{
                name:name, 
                board: board 
            },(data, err) =>{
                console.log(data)
                 getLists()
            })
  

}
function removeList(e){
    let id = e.parentElement.id;
    var queryString = Host + "/api/v1/lists/" + id;
    $.ajax({
        url: queryString,
        type: 'DELETE',
        headers: {
            Authorization: "Bearer " + Cookie('access-token')
        },
        success: function(response) {
          console.log(response);
          getLists()
        }
     });
}

function editList(e){
    let id = e.parentElement.id
    console.log(id)
   if( $("#form-"+id).is(":visible")) 
    $("#form-"+id).hide()
   else
   $("#form-"+id).show()
    //= false;
    // $.ajax({
    //     url: queryString,
    //     type: 'P',
    //     headers: {
    //         Authorization: "Bearer " + Cookie('access-token')
    //     },
    //     success: function(response) {
    //       console.log(response);
    //       getLists()
    //     }
    //  });
}
function checkListEdit(e){
    let id = e.parentElement.parentElement.parentElement.id;
    console.log(id) ;
    var queryString = Host + "/api/v1/lists/" + id;
    jQuery.validator.setDefaults({
        debug: true,
        success: "valid"
      });
      var form = $( "#form-"+id );
    form.validate();

    var name =  $("#list-input-field-"+id).val();
    console.log(name)
    const formData = new FormData();
    formData.append('name', name);
    if(form.valid())
    fetch(queryString, {
        method: 'put',
        headers: {
            Authorization: "Bearer " + Cookie('access-token')
        },
        body: formData,
    }).then(function(response) {
        console.log(response);
        getLists()
        })
}