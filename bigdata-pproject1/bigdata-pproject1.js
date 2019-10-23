var generateWorkers = function () {
    var posts = ["owner", "risk director", "financial analyst", "managing director", "trader",
        "chief accountant", "branch manager", "bank tellers"
    ];
    var departments = ["operations", "crediten analysis"];
    var FNames = ['Mihail', 'Ivan', 'Serioja', 'Nikola', 'Vladimir', 'Anastasija', 'Ekaterina'];
    var SNames = ['Petrov', 'Ivanov', 'Jozik', 'Toskov', 'Putin', 'Kozareva', 'Velika'];
    var LNames = ['Antonovich', 'Afanasievich', 'Andreevich', 'Vladimirovich', 'Egorovich', 'Ivanovich', 'Petrovich'];

    var phoneNumber = "+" + Math.random().toString().slice(2, 11);;
    var email = Math.random().toString(36).substring(2, 11) + '@gmail.com'

    db.workers.insert({
        FName: getRandom(FNames),
        SName: getRandom(SNames),
        LName: getRandom(LNames),
        adress: getRendomAdress(),
        phoneNumber: phoneNumber,
        email: email,
        position: getRandom(posts),
        department: getRandom(departments)
    })
}

var generateСustomers = function () {
    var FNames = ['Mihail', 'Ivan', 'Serioja', 'Nikola', 'Vladimir', 'Anastasija', 'Ekaterina'];
    var SNames = ['Petrov', 'Ivanov', 'Jozik', 'Toskov', 'Putin', 'Kozareva', 'Velika'];
    var LNames = ['Antonovich', 'Afanasievich', 'Andreevich', 'Vladimirovich', 'Egorovich', 'Ivanovich', 'Petrovich'];

    var phoneNumber = "+" + Math.random().toString().slice(2, 11);
    var email = Math.random().toString(36).substring(2, 11) + '@gmail.com'

    db.customers.insert({
        FName: getRandom(FNames),
        SName: getRandom(SNames),
        LName: getRandom(LNames),
        adress: getRendomAdress(),
        phoneNumber: phoneNumber,
        email: email,
        invoice: getInvoice()
    })
}

var addToWorkersChief = function () {
    db.workers.find().forEach(function (document) {
        db.workers.update({
            _id: document._id
        }, {
            $set: {
                chief: getChief(document.position)
            }
        }, {
            multi: true
        })
    })
}

var getInvoice = function () {
    var invoice = [];
    var invoiceCount = Math.floor((Math.random() * 10));

    for (i = 0; i < invoiceCount; i++) {
        var currency = ['BG', 'UAH', 'USD', 'EUR'];
        var id = Math.random().toString(16).slice(2);
        var cash = Math.floor((Math.random() * 999999)) + " " + getRandom(currency);
        db.invoices.insert({
            id: id,
            cash: cash
        })
        invoice.push(id);
    }
    return invoice;
}

var createСustomers = function (count) {
    for (i = 0; i < count; i++) {
        generateСustomers();
    }
}

var createWorkers = function (count) {
    for (i = 0; i < count; i++) {
        generateWorkers();
    }
    addToWorkersChief();
}

var getChief = function (position) {
    var chief = ["no boss"];
    switch (position) {
        case 'risk director':
        case 'managing director':
        case 'financial analyst':
        case 'branch manager':
            if (db.workers.find({
                    position: "owner"
                })) {
                chief = db.workers.find({
                    position: "owner"
                });
            }

            case 'trader':
            case 'bank tellers':
            case 'chief accountant':
                if (db.workers.find({
                        position: "branch manager"
                    })) {
                    chief = db.workers.find({
                        position: "branch manager"
                    });
                }

                default:
                    break;
    }

    var ids = chief.map(function (i) {
        if (i._id) {
            return chief;
        }
        return i._id;
    });

    return ids;;
}

var getRendomAdress = function () {
    var streetNumber = ['25489', '87459', '35478', '15975', '95125', '78965']
    var streetName = ['A street', 'B street', 'C street', 'D street', 'E street', 'F street', ]
    var cityName = ['Riyadh', 'Dammam', 'Jedda', 'Tabouk', 'Makka', 'Maddena', 'Haiel']
    var stateName = ['Qassem State', 'North State', 'East State', 'South State', 'West State']
    var zipCode = ['28889', '96459', '35748', '15005', '99625', '71465']

    return getRandom(streetNumber) +
        getRandom(streetName) +
        getRandom(cityName) +
        getRandom(stateName) +
        getRandom(zipCode);

}

function getRandom(input) {
    return input[Math.floor((Math.random() * input.length))];
}