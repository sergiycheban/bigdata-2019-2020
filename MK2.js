// use stu_1601321023

var validatorForTransport = function( name, identifier ){
    if( name && identifier )
    {
        db.transport.insert({
            name: name,
            identifier: identifier
        })
    }
}

var generateVehicle = function () {
    var names = ['BMW', 'Lada', 'Tayota', 'Mitsubisi', 'Infiniti'];

    for (let index = 0; index < names.length; index++) {
        validatorForTransport( names[index], Math.random().toString(36).substring(2, 11) );
    }
}

var updateVehicleInfo = function(){
    db.transport.find().forEach(function (item) {
        db.transport.update({}, {
            $set: {
                space: Math.floor(Math.random() * (12 - 2 + 1)) + 2
            }
        }, {
            multi: true
        })
    })
}

var generateCargo = function(){
    var names = ['Domatto', 'Cucumbers', 'People'];
    var categories = ["fruits" , "vegetables" , "meat" ,"milk and dairy","ather"]
    var priorityCategories = ["fruits" , "vegetables" , "meat" ,"milk and dairy"];
    var transport =  db.transport.find();
    var rndТransport = Math.floor((Math.random() * transport.length()));
    var name = getRandom( names )
    var category = getRandom(categories)
    db.cargo.insert({
        name: name,
        category:category,
        count: Math.floor((Math.random() * 200)),
        transportIdentifier: transport[rndТransport].identifier
    })
    if( priorityCategories.includes( category ) )
    {
        createPriorityCargo( name, transport[rndТransport].identifier )
    }
}

var createPriorityCargo = function( name, transportIdentifier ){
    db.priorityCargo.insert({
        name: name,
        transportIdentifier: transportIdentifier
    })
}

var listCargoAndTransport = function(){
    var result = [];
    db.cargo.find().forEach(function (item){
        if( db.cargo.find( {identifier: item.transportIdentifier} ) )
        {
            result.push( {
                cargo: item.transportIdentifier,
                transportName: db.cargo.find( {identifier: item.transportIdentifier} )[0].name
            } )
        }
    })
    return result;
}

var getRandom = function (input) {
    return input[Math.floor((Math.random() * input.length))];
}