const { TownHall, WarOptedIn, WarStats } = require('./../utils/customEmojis.js');

function getNbDaysSinceCreation() {
    return Math.ceil(
        (new Date().getTime() - new Date('05/17/2023').getTime()) / (1000 * 3600 * 24)
        );
}

function getCapitalAndDistrictsLevel(_capital) {
    returnText = `\`${_capital.capitalHallLevel}\``;
    var districts = _capital.districts;
    districts.forEach(
        (district) => returnText += ` \`${district.districtHallLevel}\``
    )

    return returnText;
}

function getMembersDonations(_fetchMembers) {
    var donations = new Map();

    _fetchMembers.forEach((element) => {
        donations.set('Sent', donations.get('Sent') ? donations.get('Sent') + element.donations : element.donations);
        donations.set('Received', donations.get('Received') ? donations.get('Received') + element.received : element.received);
    })

    return `${WarStats.LW_Up} | Troupes données : \`${donations.get('Sent')}\`\n${WarStats.LW_Down} | Troupes reçues : \`${donations.get('Received')}\``;
}

function getMembersTownHallLevel(_fetchMembers, _propertyName) {
    var returnText      = '';
    var endMap          = 0;
    
    var townHallList    = getValueFromFetch(_fetchMembers, _propertyName);

    townHallList = new Map([...townHallList.entries()].reverse());
    townHallList.forEach((value, key) => {
        endMap      += 1;
        let index 	 = Object.keys(TownHall).indexOf(Object.keys(TownHall).find((element) => element === `TownHall${key}`));
        returnText += `${Object.values(TownHall)[index]} : \`${value}\`${endMap === townHallList.size ? '' : ' | '}`;
    })

    return returnText;
}

function getMembersWarOptedIn(_fetchMembers, _propertyName) {
    var warOptedInList = getValueFromFetch(_fetchMembers, _propertyName);
    
    return (
        `${WarOptedIn.LW_True} | Joueurs disponibles : ${warOptedInList.get('true')}\n${WarOptedIn.LW_False} | Joueurs indisponibles : ${warOptedInList.get('false')}`
    )
    
}

function getValueFromFetch(_fetch, _propertyName) {
    var result      = new Map();
    var returnMap   = new Map();
    var index       = Object.keys(_fetch[0]).indexOf(Object.keys(_fetch[0]).find(element => element == _propertyName));

    _fetch.forEach((element) => {
        result.set(`${Object.values(element)[index]}`, result.get(`${Object.values(element)[index]}`) ? result.get(`${Object.values(element)[index]}`) + 1 : 1);
    })

    result.forEach((value, key) => {
        if (key < 10) {
            returnMap.set(`0${key}`, value);
        } else {
            returnMap.set(key, value);
        }
    });

    return new Map([...returnMap.entries()].sort());;
}


module.exports = { getNbDaysSinceCreation, getMembersTownHallLevel, getMembersWarOptedIn, getCapitalAndDistrictsLevel, getMembersDonations }