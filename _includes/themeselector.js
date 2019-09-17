var url = new URL(window.location.href);
var localhost = url.host;
var nightmode = url.searchParams.get("nightmode");
if (nightmode == "true") {
	var link = document.createElement( "link" );
	link.href = "/css/base16-solarizeddark.css"
	link.type = "text/css";
	link.rel = "stylesheet";
	document.getElementsByTagName("head")[0].appendChild(link);
}

aEls = document.body.getElementsByTagName("a");
for(var i=0; i< aEls.length; i++) {
	var turl = new URL(aEls[i].href);
	var host = turl.host
	if (host == localhost) {
		turl.searchParams.set("nightmode","true");
	} else {
		turl.searchParams.delete("nightmode");
	}
	aEls[i].href = turl.href;
}
