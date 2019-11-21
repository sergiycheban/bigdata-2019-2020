var fs = require('fs');
var dir = './my-wallet';

var dirFile = './my-wallet/wallet.json';

function registerBtnClick(){
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    if (fs.existsSync(path)) {
        alert( "exists" );
        return;
    }

    fs.mkdirSync(dir);

    var walletObj = {
        walletId: hashCode( email + password )
    }
    fs.writeFile("./tmp/wallet.json", walletObj );
    
}

function loginBtnClick()
{
    var hash = document.getElementById('hash').value;

    fs.readFile(dirFile, {encoding: 'utf-8'}, function(err,data){
        if (!err) {
            if( hash == data.walletId )
            {
                alert( "OK" );
            }
            else
            {
                alert( "No OK" );
            }
        } else {
            alert(err);
        }
    });
}


function hashCode(string){
    return string.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}