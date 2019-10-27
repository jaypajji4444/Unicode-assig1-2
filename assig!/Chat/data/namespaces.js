
const Namespace =  require('../classes/Namespaces');
const Room =  require('../classes/Rooms');

// Set up the namespaces
let namespaces = [];
let zomatoNs = new Namespace(0,'Zomato','https://upload.wikimedia.org/wikipedia/en/0/09/Zomato_company_logo.png','/zomato');
// can create more namespace ,incase chahiye to....


// Make the main room and add it to rooms. it will ALWAYS be 0
zomatoNs.addRoom(new Room(0,'General','Zomato'));
zomatoNs.addRoom(new Room(1,'FoodRelated','Zomato'));
zomatoNs.addRoom(new Room(2,'RestuarantRelated','Zomato'));

namespaces.push(zomatoNs);

module.exports = namespaces;