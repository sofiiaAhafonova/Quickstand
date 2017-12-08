const Cookie = name => {
    let cookiestr = RegExp('' + name + '[^;]+').exec(document.cookie);
    return decodeURIComponent(!!cookiestr ? cookiestr.toString().replace(/^[^=]+./, '') : '');
  };