const Cookie = name => {
    let cookiestr = RegExp('' + name + '[^;]+').exec(document.cookie);
    return decodeURIComponent(!!cookiestr ? cookiestr.toString().replace(/^[^=]+./, '') : '');
  };

$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', "Bearer " +  Cookie('access-token'));
    }
});

$(document).ready(function(){
    $.getJSON("http://localhost:8080/api/v1/projects/5a3990c30b4b3e15b017e43d/boards", function(data){
            console.log(data)
            for (let board of  data.boards){
                console.log("board ====" + board)
                  $(".board").html("<b>"+ board.name+ "</b>");
            }
          
    })
});
