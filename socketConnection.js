var socket = io(config.serverkey);
var votes = {};
function graphDataGenerator(obj) {
    var keys = [];
    var values = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            keys.push(key);
            values.push(obj[key]);
        }
    }
    return [keys, values];
}

function loadNewGraph() {
    risingstar.load({
        rows: graphDataGenerator(votes.risingStar)
    });
    sportsicon.load({
        rows: graphDataGenerator(votes.sportsIcon)
    });
    facem.load({
        rows: graphDataGenerator(votes.face.male)
    });
    facef.load({
        rows: graphDataGenerator(votes.face.female)
    });
    stylem.load({
        rows: graphDataGenerator(votes.styleIcon.male)
    });
    stylef.load({
        rows: graphDataGenerator(votes.styleIcon.female)
    });
    artistm.load({
        rows: graphDataGenerator(votes.artist.male)
    });
    artistf.load({
        rows: graphDataGenerator(votes.artist.female)
    });
    personam.load({
        rows: graphDataGenerator(votes.persona.male)
    });
    personaf.load({
        rows: graphDataGenerator(votes.persona.female)
    });
}

socket.on('connect', function () {
});
socket.on('votes', function (data) {
    console.log(data);
    votes = data;
    loadNewGraph();
});
socket.on('vote', function (data) {
    console.log(data);
    for (var i in data) {
        if (data.hasOwnProperty(i)) {
            if (typeof data[i] == 'string') {
                votes[i][data[i]] = (votes[i][data[i]] || 0) + 1;
            } else {
                votes[i].male[data[i].male] = (votes[i].male[data[i].male] || 0) + 1;
                votes[i].female[data[i].female] = (votes[i].female[data[i].female] || 0) + 1;
            }
        }
    }
    console.log(votes);
    loadNewGraph();
});
socket.on('disconnect', function () {
});
