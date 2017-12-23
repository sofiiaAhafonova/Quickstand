$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', "Bearer " +  Cookie('access-token'));
    }
});
let Lists = null;
function appendObjTo(thatArray, objToAppend) {
    return Object.freeze(thatArray.concat(objToAppend));
}
function getLists(){
    var queryString =Host + "/api/v1" + window.location.href.replace(Host,'') + "/lists";
    $.get(queryString, function( data ) {
        const source = document.getElementById("lists-template").innerHTML;
        const template = Handlebars.compile(source);
        document.getElementById("task-lists").innerHTML = template({
            lists: data["lists"],
        });
        Lists =  data["lists"];

        getTasks();
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
function getTasks(){
    for(let list of Lists)
    {
        for(let task of list.tasks)
        {
            queryString = Host + "/api/v1/tasks/" + task;
            $.get(queryString, function( data ) {
                $("#name-"+task).text(data["task"].name);
                $("#description-"+task).text(data["task"].description);
            });
        }
    }
}

function createTask(id){
    if( $("#task-form-"+id).is(":visible")) 
        $("#task-form-"+id).hide()
    else
    $("#task-form-"+id).show()
}
function checkTaskEdit(id){
    let list_id = id.replace("task-input-button-",'')
    jQuery.validator.setDefaults({
        debug: true,
        success: "valid"
      });
    var form = $( "#task-form-" + list_id);
    form.validate();
    var queryString = Host + "/api/v1/tasks/";
   
    var name =  $("#task-input-field-"+list_id).val();
    var description =  $("#task-input-area-"+list_id).val();
        if(form.valid())
            $.post(queryString,{
                name:name,
                description:description, 
                list: list_id  
            },(data, err) =>{
                console.log(data)
                 getLists()
            })
  
}

function removeTask(e){
   
        let id = e.replace("remove-",'');
        var queryString = Host + "/api/v1/tasks/" + id;
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