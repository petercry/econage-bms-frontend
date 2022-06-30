var userAgent = navigator.userAgent, 
				rMsie = /(msie\s|trident.*rv:)([\w.]+)/, 
				rFirefox = /(firefox)\/([\w.]+)/, 
				rOpera = /(opera).+version\/([\w.]+)/, 
				rChrome = /(chrome)\/([\w.]+)/, 
				rSafari = /version\/([\w.]+).*(safari)/;
				var browser;
				var version;
				var ua = userAgent.toLowerCase();
				function uaMatch(ua) {
					var match = rMsie.exec(ua);
					if (match != null) {
						return { browser : "IE", version : match[2] || "0" };
					}
					var match = rFirefox.exec(ua);
					if (match != null) {
						return { browser : match[1] || "", version : match[2] || "0" };
					}
					var match = rOpera.exec(ua);
					if (match != null) {
						return { browser : match[1] || "", version : match[2] || "0" };
					}
					var match = rChrome.exec(ua);
					if (match != null) {
						return { browser : match[1] || "", version : match[2] || "0" };
					}
					var match = rSafari.exec(ua);
					if (match != null) {
						return { browser : match[2] || "", version : match[1] || "0" };
					}
					if (match != null) {
						return { browser : "", version : "0" };
					}
				}
				var browserMatch = uaMatch(userAgent.toLowerCase());
				if (browserMatch.browser) {
					browser = browserMatch.browser;
					version = browserMatch.version;
				}

var str = '';

var copyright='某某科技iWebOffice2015智能文档中间件[演示版];V5.0S0xGAAEAAAAAAAAAEAAAAKcBAACwAQAALAAAAGkOWLlF9b3Rd/VGYvKyb6/AiFRJdvquQoBssQR4SlHaKeWA5qqXVFYOEVfwHomrSf35CJTFi4OU6iVfTduCG43ucIPvLOZrarubI2Ja/S6Eu/VrGLJRfTxPG3NJM/yA60OVyGj0ukTXvioyxQ8XtAiq9+uFbM8PFT72P1A9RVgu17R6Wu28E5aXrOBpj5efFV2WrHtT1+9aF6N3udgKXJ3TO1BVCQOHJOOdcsBLZAReSee7m6zIX7Yrd6v5nazXyd1nzhB5yWzkwDNYD+Cjv/2Swh5JP6GdDBTmJyv/49tvPBLmesS5ZNF/XcKxuK4MKM7s4K4McA7pgfe10+zC59q9rkbt1gdC+e63Wfg82Qhrq3tiN5FcVhbKkKmU4GrWD9r+sEMaSJXeRgCp/Q1jR9WEV9tZY909+0/FL3nYWqsbmmTqj0YvRHvKJ+iY9H7j9LH4p9U/9Wg6a9RbdyVnBzYt267RtnAw6+Xoiy1QHiWnI8CO26J8/ciI+n3y7bkkJXt7a/y3GEhLmCzajLn3i6LJ/CJoFKzVUolXP1CD//DPaULRNuQOCKQdszqUb0n5tPOBX27dJFkTANPtWP1hKpc=';

if ((window.ActiveXObject!=undefined) || (window.ActiveXObject!=null) ||"ActiveXObject" in window)
{
	str += '<object id="iWebPDF2018" ';
	str += ' width="100%"';
	str += ' height="100%"';
	if(window.navigator.platform == "Win32")
		str += ' CLASSID="CLSID:7017318C-BC50-4DAF-9E4A-10AC8364C315"';
	if (window.navigator.platform == "Win64")
		str += ' CLASSID="CLSID:7017318C-BC50-4DAF-9E4A-10AC8364C364"';
	str += '>';
}
else if (browser == "chrome") 
{
	str += '<object id="iWebPDF2018" ';
	str += ' width="100%"';
	str += ' height="100%"';
	str += ' clsid="CLSID:7017318C-BC50-4DAF-9E4A-10AC8364C315"';         
	str += ' type="application/kg-plugin"';
	str += ' OnAddinEventInvoke="OnAddinEventInvoke"';
	str += ' OnCommand="OnCommand"';
	str += ' onAddSignature="onAddSignature"';
	str += ' OnOLECommand="OnOLECommand"';	
	str += ' Copyright="' + copyright + '"';
	str += '>';
}
else if (browser == "firefox") 
{
	str += '<object id="iWebPDF2018" ';
	str += ' width="100%"';
	str += ' height="100%"';
	str += ' clsid="CLSID:7017318C-BC50-4DAF-9E4A-10AC8364C315"';
	str += ' type="application/kg-activex"';
	str += ' OnCommand="OnCommand"';
	str += ' OnAddinEventInvoke="OnAddinEventInvoke"';
	str += ' OnOLECommand="OnOLECommand"';
	str += ' Copyright="' + copyright + '"';
	str += '>';
}
str += '</object>';
document.write(str); 
