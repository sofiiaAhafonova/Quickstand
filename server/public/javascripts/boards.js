const Cookie = name => {
    let cookiestr = RegExp('' + name + '[^;]+').exec(document.cookie);
    return decodeURIComponent(!!cookiestr ? cookiestr.toString().replace(/^[^=]+./, '') : '');
  };

$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', "Bearer " +  Cookie('access-token'));
    }
});


