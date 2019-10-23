var generateWorkers = function () {
    var posts = ["owner", "risk director", "financial analyst", "managing director", "trader",
        "chief accountant", "branch manager", "bank tellers"
    ];
    var departments = ["operations", "crediten analysis"];
    var FNames = ['Mihail', 'Ilvan', 'Slerioja', 'Nilkola', 'Vladimir', 'Anastasilja', 'Ekaterina'];
    var SNames = ['Petlrov', 'Ivlanov', 'Jozik', 'Tolskov', 'Putin', 'Kozareva', 'Velika'];
    var LNames = ['Antonovich', 'Afanasievich', 'Andreevich', 'Vladimirovich', 'Egorovich', 'Ivanovich', 'Petrovich'];

    var phoneNumber = "+" + Math.random().toString().slice(2, 11);;
    var email = Math.random().toString(36).substring(2, 11) + '@bankoftomarow.bg'
    var salary = Math.floor(Math.random() * (10000 - 1300 + 1)) + 1300;
    var workExperience = Math.floor(Math.random() * (50 - 0 + 1)) + 0;
    db.workers.insert({
        FName: getRandom(FNames),
        SName: getRandom(SNames),
        LName: getRandom(LNames),
        adress: getRendomAdress(),
        phoneNumber: phoneNumber,
        email: email,
        salary: salary,
        workExperience: workExperience,
        position: getRandom(posts),
        department: getRandom(departments),
        departmentHistory: getСareer(),
        fired: Math.random() >= 0.5,
        motherhood: Math.random() >= 0.5,
        leave: Math.random() >= 0.5
    })
}

var generateDepartment = function () {
    var departments = ["operations", "crediten analysis"];
    departments.forEach(function (department) {
        db.departments.insert({
            name: department
        })
    })
}

var generateСustomers = function () {
    var FNames = ['lMihail', 'Ivan', 'Seriloja', 'Nlikola', 'Vladimir', 'Anastasija', 'Ekaterina'];
    var SNames = ['Petrlov', 'Ivanov', 'Jozik', 'Tloskov', 'Putin', 'Kozareva', 'Velika'];
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
        var cash = Math.floor((Math.random() * 999999));
        db.invoices.insert({
            id: id,
            cash: cash,
            currency: getRandom(currency)
        })
        invoice.push(id);
    }
    return invoice;
}

var getСareer = function () {
    var departments = ["operations", "crediten analysis"];
    var career = [];
    var ranNum = Math.floor((Math.random() * 4));
    var start = new Date(1970, 0, 1);

    for (var index = 0; index <= ranNum; index++) {
        var startData = randomDate(start, new Date())
        var end = "still working"

        if (index = ranNum)
            end = randomDate(startData, new Date())

        career.push({
            department: getRandom(departments),
            start: start,
            end: end
        })

        start = end;
    }
    return career;
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
    // addToWorkersChief();
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
        return i._id;
    });

    return ids;;
}

var randomDate = function (start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

var getRendomAdress = function () {
    var streetNumber = ['25489', '87459', '35478', '15975', '95125', '78965']
    var streetName = ['A street', 'B street', 'C street', 'D street', 'E street', 'F street', ]
    var country = ['Bulgaria', 'Dammam', 'Bulgaria', 'Tabouk', 'Bulgaria', 'Maddena', 'Haiel']
    var city = ['Qassem State', 'North State', 'East State', 'South State', 'West State']

    return {
        streetNumber: getRandom(streetNumber),
        streetName: getRandom(streetName),
        city: getRandom(city),
        country: getRandom(country)
    }

}

var getRandom = function (input) {
    return input[Math.floor((Math.random() * input.length))];
}

/////////////////////////////////// Бизнес заявки част 1 ///////////////////////////////////////

/**
 * Да се създаде листинг на имената на всички отдели в банката 
 */
var listAllDepartment = function () {
    return db.workers.distinct("department")
}

/**
 * Да се създаде листинга на месечните възнаграждения на всички служители, в листинга е
 * необходимо да присъстват двете имена на служителя и неговата заплата
 */
var listSaleries = function () {
    var result = []
    db.workers.find().forEach(function (w) {
        result.push({
            FName: w.FName,
            SName: w.SName,
            salary: w.salary
        })
    })

    return result;
}

/**
 * Да се създаде листинг на всички служители в банката в листинга трябва да присъстват
 * двете имена на служителите и новогенерирани E-mail адреси, които да се състоят от
 * конкатенирани първото и второ име на служителя разделени с точка. Имената на
 * служителите трябва да бъдат с малки букни в мейла. Домейна на компанията е
 * bankoftomarow.bg
 */
var listNewEmail = function () {
    let result = [];
    db.workers.find().forEach(w => {
        result.push({
            FName: w.FName,
            SName: w.SName,
            email: w.FName.toLowerCase() + "." + w.SName.toLowerCase() + "@bankoftomarow.bg"
        });
    });
    return result;
}

/**
 * Намерете всички служители които банката дефинира като старши служители. Старши
 * служители са всички които работят в компанията от 5 години.
 */
var listOldEmployees = function () {
    return db.workers.find({
        workExperience: {
            $gt: 4
        }
    })
}

/**
 * Намерете всички служители чиито първи имена започват с буквата S
 */
var listEmployeesNameStartWithS = function () {
    return db.workers.find({
        FName: /^S/
    });
}

/**
 * Намерете всички чуждестранни служители. Чуждестранни са тези служители които не са
 * родени в България.
 */
var listFellowCountrymen = function () {
    return db.workers.find({
        country: {
            $not: /^Bulgaria.*/
        }
    })
}

/**
 * Намерете всички служители чиите имена (първо / второ или допълнително съдържат
 * буквата l)
 */
var listEmployeesContainI = function () {
    return db.workers.find({
        $or: [{
                FName: {
                    $regex: /l/i
                }
            },
            {
                SName: {
                    $regex: /l/i
                }
            },
            {
                LName: {
                    $regex: /l/i
                }
            }
        ]
    })
}

/////////////////////////////////// Бизнес заявки част 3 ///////////////////////////////////////

/**
 * Да се реализира листинг показващ всички служители които са били уволнени от
 * компанията
 */
var listFired = function () {
    return db.workers.find({
        fired: true
    })
}

/**
 * Да се реализира листинг на всички служителки които са в майчинство в момента. 
 */
var listMotherhood = function () {
    return db.workers.find({
        motherhood: true
    })
}

/**
 * Да се реализира листинг на всички служители които са в отпуска / болничен в момента 
 */
var listLeave = function () {
    return db.workers.find({
        leave: true
    })
}

/**
 * Намерете всички служитери които имат заплата в интервала 2000 – 3000
 */
var listSaleries2000_3000 = function () {
    return db.workers.find({
        $and: [{
            salary: {
                $gte: 2000
            }
        }, {
            salary: {
                $lte: 3000
            }
        }]
    });
}

/**
 * Намерете всички служители които получават съответно 2500 / 3000 / 3500 / 5000
 */
var listSaleries2500_3000_3500__5000 = function () {
    var result = [];
    result.push({
        "2500": db.workers.find({
            salary: 2500
        })
    })
    result.push({
        "3000": db.workers.find({
            salary: 2500
        })
    })
    result.push({
        "3500": db.workers.find({
            salary: 2500
        })
    })
    result.push({
        "4000": db.workers.find({
            salary: 2500
        })
    })
    result.push({
        "4500": db.workers.find({
            salary: 2500
        })
    })
    result.push({
        "5000": db.workers.find({
            salary: 2500
        })
    })
    return result;
}

/**
 * Намерете всички служители които нямат ръководител
 */
var listEmployeesNotBoss = function () {
    return db.workers.find({
        chief: ["no boss"]
    })
}

/**
 * Намерете всички старши служители които получават заплата по висока от 5000 лв.
 * Подредете ги в обратен азбучен ред, като се има предвид тяхното първо име. 
 */
var listEmployeesNotBoss = function () {
    var result = db.workers.find({
        salary: {
            $gt: 5000
        }
    }).sort({
        FName: 1
    })
}

/**
 * Намерете петимата най-високо платени служители във всеки отдел. Групирайте ги по отдели
 */
var listEmployeesTop5Salary = function () {
    var result = [];
    var departments = ["operations", "crediten analysis"];
    departments.forEach(function (department) {
        result.push({
            department: db.workers.find({
                department: department
            }).sort({
                salary: -1
            }).limit(5)
        })
    })
}

/**
 * Намерете отдела или отделите, в които / които служителите сумарно получават найниска заплата.
 */
var listDepartmentsLowSalary = function () {
    var result = [];
    var departments = ["operations", "crediten analysis"];
    departments.forEach(function (department) {
        result.push({
            department: db.workers.aggregate([{
                $group: {
                    total: {
                        $sum: "$salary"
                    }
                }
            }])
        })
    })
}

/**
 * Намерете средната заплата във всеки отдел, групирайте по средна заплата и отдел
 */
var listDepartmentsAverageSalary = function () {
    var result = [];
    var departments = ["operations", "crediten analysis"];
    departments.forEach(function (department) {
        result.push({
            department: db.workers.aggregate([{
                "$group": {
                    "avg_salary": {
                        "$avg": "$salary"
                    },
                }
            }])
        })
    })
}

/////////////////////////////////// Бизнес заявки част 4 ///////////////////////////////////////

/**
 * Да се намерят всички клиенти които имат сметки във валута. ( различна от BGN )
 */
var fun1 = function () {
    db.customers.find({
        invoice: {
            currency: {
                $ne: "BGN"
            }
        }
    })
}

/**
 * Да се намерят всички клиенти които имат сметки с нулево парично салдо. Напълно празни. 
 */
var fun2 = function () {
    db.customers.find({
        invoice: {
            cash: {
                $eq: 0
            }
        }
    });
}

/**
 * . Да се добави название на сметката на всеки клиент. Названието на сметката му, е името на
 * клиента последвано от думата сметка и валутата на сметката. Актуализирайте всички
 * клиенти
 */
var fun3 = function () {
    db.customers.find().forEach(function (document) {
        db.customers.update({}, {
            $set: {
                invoice: {
                    name: customers.FName + customers.invoice.currency
                }

            }
        }, {
            multi: true
        })
    })
}