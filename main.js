var socket = io(config.serverkey);
var votes = {};
var charts = [];
var events = [];
function graphDataGenerator(obj) {
    var values = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            values.push(obj[key]);
        }
    }
    var keys = values.map(function (value, index) {
        return 'data' + index;
    });
    values = values.sort(function (a, b) {
        return b - a;
    });
    return [keys, values];
}

function loadNewGraph() {
    charts.forEach(function (chart) {
        chart.chartInstance.load({rows: graphDataGenerator(chart.data)});
    });
}

socket.on('connect', function () {

});

socket.on('votes', function (data) {
    votes = data;
    events = [
        {
            name: 'risingStar',
            title: 'Rising Star',
            data: votes.risingStar
        },
        {
            name: 'sportsIcon',
            title: 'Sports Icon',
            data: votes.sportsIcon
        },
        {
            name: 'faceOfTheYearMale',
            title: 'Face of the Year - Male',
            data: votes.face.male
        },
        {
            name: 'faceOfTheYearFemale',
            title: 'Face of the Year - Female',
            data: votes.face.female
        },
        {
            name: 'styleIconMale',
            title: 'Style Icon - Male',
            data: votes.styleIcon.male
        },
        {
            name: 'styleIconFemale',
            title: 'Style Icon - Female',
            data: votes.styleIcon.female
        },
        {
            name: 'artistOfTheYearMale',
            title: 'Artist of the Year - Male',
            data: votes.artist.male
        },
        {
            name: 'artistOfTheYearFemale',
            title: 'Artist of the Year - Female',
            data: votes.artist.female
        },
        {
            name: 'personaMale',
            title: 'Persona - Male',
            data: votes.persona.male
        },
        {
            name: 'personaFemale',
            title: 'Persona - Female',
            data: votes.persona.female
        }
    ];

    charts = events.map(function (event) {
        return {
            name: event.name,
            data: event.data,
            chartInstance: c3.generate({
                bindto: '#' + event.name,
                data: {
                    type: 'donut',
                    rows: graphDataGenerator(event.data),
                    colors: event.colors
                },
                donut: {
                    title: event.title,
                    width: 25,
                    label: {
                        show: false
                    }
                },
                tooltip: {
                    show: false
                },
                legend: {
                    hide: true
                }
            })
        }
    });
});

socket.on('vote', function (data) {
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
    loadNewGraph();
});

socket.on('disconnect', function () {
});
