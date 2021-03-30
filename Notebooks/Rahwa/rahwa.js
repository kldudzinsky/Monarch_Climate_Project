//string holding path to json file
source_file = "/raw_data/cleaned_agdata.json"
//d3.json() makes a promise to do something after the file is retrieved.
//that's why we use the .then() to add a function to do something with
//the data once we've received it.
var globaldata = {}
d3.json(source_file).then(data => {
    globaldata = data
    states = [];
    for (var state in data) {
        states.push(state);
    }
    console.log(states);
    var dropDown = d3.select("#stateDataset")
    var options = dropDown.selectAll("option")
        .data(states)
        .enter()
        .append("option");
    options.text(function (x) {
        return x;
    });
    counties = []
    for (var county in data["ALABAMA"]) {
        counties.push(county);
    }

});
console.log(globaldata)
var baroption = ["Alphabetical", "County Acreage, Ascending", "County Acreage, Decending"]
var bardropdown = d3.select("#barHandle")
var optionsbar = bardropdown.selectAll("option")
    .data(baroption)
    .enter()
    .append("option");
optionsbar.text(function (x) {
    return x;
});



function sortUpCounty() {
    var countyarray = []
    Object.entries(globaldata[globalstate]).forEach(county => {
        countyarray.push(county)

    });
    countyarray.sort(function (x, y) {
        return d3.ascending(x[1].crop_acres, y[1].crop_acres);
    })
    return countyarray
}

function sortDownCounty() {
    var countyarray = []
    Object.entries(globaldata[globalstate]).forEach(county => {
        countyarray.push(county)

    });
    countyarray.sort(function (x, y) {
        return d3.descending(x[1].crop_acres, y[1].crop_acres);
    })
    return countyarray
}

function sortAlphaCounty() {
    var countyarray = []
    Object.entries(globaldata[globalstate]).forEach(county => {
        countyarray.push(county)

    });
    countyarray.sort(function (x, y) {
        return d3.ascending(x[0], y[0]);
    })
    return countyarray
}

function stateInfo(state, data) {
    counties = []
    for (var county in data[state]) {
        counties.push(county);
    }
    console.log(counties)
    var dropDownCounty = d3.select("#countyDataset")
    dropDownCounty.selectAll("option").remove()
    var options = dropDownCounty.selectAll("option")
        .data(counties)
        .enter()
        .append("option");
    options.text(function (x) {
        return x;
    });

}
var globalstate = []


console.log(globalstate)

function countyInfo(index, data, state) {
    var list = d3.select('#sample-metadata')
    list.selectAll("ul").remove()
    var ul = list.append("ul")

    console.log(data)

    // ul.selectAll("li").remove()
    ul.append("li").text('State: ' + globalstate)
    ul.append("li").text('County: ' + index)
    ul.append("li").text('Crop Acres: ' + data[state][index].crop_acres)
    ul.append("li").text('Crop Operations: ' + data[state][index].crop_ops)
    ul.append("li").text('Pasture Acres: ' + data[state][index].pasture_acres)
    ul.append("li").text('Wood Pasture Operation ' + data[state][index].pasture_ops)
    ul.append("li").text('Woodland Acres: ' + data[state][index].woodland_acres)
    ul.append("li").text('Woodland Operation: ' + data[state][index].woodland_ops)
    ul.append("li").text('Woodland-Pasture Acres: ' + data[state][index]["wood-pasture_acres"])
    ul.append("li").text('Woodland-Pasture Ops: ' + data[state][index]["wood-pasture_ops"])

}
function createBar(cleanedData, state) {
    var xData = cleanedData.map(function (x) {
        return x[0];
    });
    var yData = cleanedData.map(function (x) {
        return x[1].crop_acres;
    });
    var trace1 = {
        x: xData,
        y: yData,
        type: 'bar'
    };
    var data1 = [trace1];

    var layout = {
        title: [state] + "'s County Crop Acreage",

    }

    Plotly.newPlot('bar', data1, layout);
};


function stateChanged(index) {

    stateInfo(index, globaldata);
    globalstate = ""
    globalstate = index
    OrgData = sortAlphaCounty()
    console.log(OrgData)
    createBar(OrgData, index)


}

function countyChanged(index) {
    countyInfo(index, globaldata, globalstate);

}

var barSelection = []

function barChanged(index) {
    barselection = []
    switch (index) {
        case "County Acreage, Decending":
            createBar(sortDownCounty(), globalstate);

            break;
        case "County Acreage, Ascending":
            createBar(sortUpCounty(), globalstate);
            break;
        case "Alphabetical":
            createBar(sortAlphaCounty(), globalstate);
            break;
        default:
            console.log("Broken")
    }
}
//Note: You won't be able to read the file unless you're using a localhost
//server via go live or python or the like. It's a security thing.