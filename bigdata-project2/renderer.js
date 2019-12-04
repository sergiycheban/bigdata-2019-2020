const {
    remote
} = require('electron').remote
const fs = require('fs');

var currentUserInSystem;

document.getElementById("loginBtn").addEventListener("click", login);

function login() {
    let inputLogin = document.getElementById("userIdInput").value;
    let isUsrExst = isUserExist(inputLogin);
    if (isUsrExst) {
        currentUserInSystem = inputLogin;
        document.getElementById("divLogin").style.visibility = 'hidden';
        createListWallet();
    }
}

const isUserExist = function (idUser) {
    let userList = fs.readdirSync("./storage/users");
    return userList.includes(idUser);
};

function createListWallet() {
    document.getElementById("listWallet").innerHTML = "";

    let cryptocurrenciesObj = fs.readFileSync("./storage/listofcryptocurrencies/cryptocurrencies.json");
    let cryptocurrenciesList = JSON.parse(cryptocurrenciesObj);
    cryptocurrenciesList.crypto.forEach(element => {
        let buttonElement = document.createElement("button");
        buttonElement.setAttribute("type", "button");
        buttonElement.innerHTML = element;
        buttonElement.className = "list-group-item list-group-item-action"
        document.getElementById("listWallet").appendChild(buttonElement);

        buttonElement.addEventListener("click", function () {
            createInfoAboutCrypto(element);
        });
    });
}

function getAllUsersWithCrypto(crypto) {
    let userList = [];
    let userFolderList = fs.readdirSync("./storage/users");
    userFolderList.forEach(folder => {
        let file = "./storage/users/" + folder + "/info.json";
        let userInfoObj = fs.readFileSync(file);
        let userInfo = JSON.parse(userInfoObj);
        userInfo.forEach(obj => {
            if (obj.crypto == crypto) {
                userList.push(folder);
            }
        })
    })
    return userList;
}

function createInfoAboutCrypto(crypto) {
    document.getElementById("sendAmout").innerHTML = "";

    document.getElementById("infoAboutCrypto").innerHTML = "";

    var users = getAllUsersWithCrypto(crypto);
    users.forEach(element => {
        let buttonElement = document.createElement("button");
        buttonElement.setAttribute("type", "button");
        buttonElement.innerHTML = element;
        buttonElement.className = "list-group-item list-group-item-action"
        document.getElementById("infoAboutCrypto").appendChild(buttonElement);

        buttonElement.addEventListener("click", function () {
            sendAmoutToUserForm(element, crypto);
        });
    });
}

function sendAmoutToUserForm(user, crypto) {
    document.getElementById("sendAmout").innerHTML = "";

    let hElement = document.createElement("h4");
    hElement.innerHTML = currentUserInSystem + " send amount to " + user;
    document.getElementById("sendAmout").appendChild(hElement);

    let inputElement = document.createElement("input");
    inputElement.setAttribute("type", "numder");
    inputElement.setAttribute("id", "amoutInput");
    inputElement.className = "form-control"
    document.getElementById("sendAmout").appendChild(inputElement);

    let buttonElement = document.createElement("button");
    buttonElement.setAttribute("type", "text");
    buttonElement.innerHTML = "Send";
    buttonElement.className = "btn btn-success btn-lg btn-block"
    document.getElementById("sendAmout").appendChild(buttonElement);


    buttonElement.addEventListener("click", function () {
        let amout = document.getElementById("amoutInput").value;
        sendAmoutToUser(currentUserInSystem, user, crypto, amout);
    });
}

function sendAmoutToUser(sender, recipient, crypto, amout) {
    let fileSender = "./storage/users/" + sender + "/info.json";
    let senderInfoObj = fs.readFileSync(fileSender);
    let senderInfo = JSON.parse(senderInfoObj);


    let fileRecipient = "./storage/users/" + recipient + "/info.json";
    let recipientInfoObj = fs.readFileSync(fileSender);
    let recipientInfo = JSON.parse(senderInfoObj);
    // senderInfo[0].amout = 300;

    isHaveCrypto = false;
    for (let index = 0; index < senderInfo.length; index++) {
        const obj = senderInfo[index];
        if (crypto == obj.crypto) {
            isHaveCrypto = true;
            if (obj.amount >= amout) {
                senderInfo[index].amount = obj.amount - amout;
                fs.writeFileSync(fileSender, JSON.stringify(senderInfo));
                isSend = false;
                for (let index = 0; index < recipientInfo.length; index++) {
                    if (recipientInfo[index].crypto == crypto) {
                        recipientInfo[index].amount += amout;
                        isSend = true;
                        fs.writeFileSync(fileSender, JSON.stringify(senderInfo));
                    }
                }
                if (!isSend) {
                    recipientInfo.push({
                        "crypto": crypto,
                        "amount": amout
                    });
                    fs.writeFileSync(fileSender, JSON.stringify(recipientInfo));
                }
                alert("The money is gone");
            } else {
                alert("Not enough money on the balance sheet");
            }
        }
    }
    if( ! isHaveCrypto )
    {
        alert("You have no such currency");
    }
    console.log(senderInfo);
}