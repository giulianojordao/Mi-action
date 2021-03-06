//Initial State

let device = document.getElementById("device-card");
$("#success-alert").hide();
device.style.display = "none";

// Variables

let isDropdownActive = false;

let stepsDates = []
let stepsData = [];

let heartDates = [];
let heartData = [];

// Functions

connectDevice = (url, name) => {
    document.getElementById("dropdown-devices").innerHTML = "Connecting";

    handleConnectDevice(url, (err, data) => {
        if (err != null) {
            document.getElementById("dropdown-devices").innerHTML = "Disconnected";
        } else {
            let response = (JSON.parse(data)).Authentication;
            if (response == "True") {
                document.getElementById("dropdown-devices").innerHTML = "Connected";
                deviceModelContainer(name);
                getInitialData();
            }
            else {
                document.getElementById("dropdown-devices").innerHTML = "Disconnected";
            }
        }
    });

}

deviceModelContainer = (name) => {
    document.getElementById("device-title").innerHTML = name;
    let device = document.getElementById("device-card");
    if (device.style.display === "none") {
        device.style.display = "block";
    }
    else {
        device.style.display = "none";
    }
}

handleDisconnectDevice = (url, callback) => {
    let request = new XMLHttpRequest();

    request.open("DELETE", url, true);
    request.onload = () => {
        let status = request.status;
        if (status == 200) {
            callback(null, request.response);
        } else {
            callback(status);
        }
    }
    request.send(null);
}

handleConnectDevice = (url, callback) => {
    let request = new XMLHttpRequest();
    request.open("POST", url, true);
    request.onload = () => {
        let status = request.status;

        if (status == 200) {
            callback(null, request.response);
        } else {
            callback(status);
        }
    }
    request.send(null);
}



getBluetoothDevices = (url, callback) => {
    let request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onload = () => {
        let status = request.status;

        if (status == 200) {
            callback(null, request.response);
        } else {
            callback(status);
        }
    }
    request.send(null);
}


handleSteps = (callback) => {
    let request = new XMLHttpRequest();
    request.open("GET", "http://127.0.0.1:5000/steps", true);
    request.onload = () => {
        let status = request.status;

        if (status == 200) {
            callback(null, request.response);
        } else {
            callback(status);
        }
    }
    request.send(null);

}

getSteps = () => {
    if (document.getElementById("heart-rate").innerHTML != "Getting") {
        document.getElementById("steps").innerHTML = "Getting";
        handleSteps((err, data) => {
            if (err != null) {
                console.error(err);
            } else {
                let steps = (JSON.parse(data)).Steps;
                let meters = (JSON.parse(data)).Meters;
                document.getElementById("steps").innerHTML = steps;
                getStepsChartData();
            }
        });
    }
}

handleHeartRate = (callback) => {
    let request = new XMLHttpRequest();
    request.open("GET", "http://127.0.0.1:5000/heart", true);
    request.onload = () => {
        let status = request.status;

        if (status == 200) {
            callback(null, request.response);
        } else {
            callback(status);
        }
    }
    request.send(null);
}

getHeartRate = () => {
    if (document.getElementById("steps").innerHTML != "Getting") {
        document.getElementById("heart-rate").innerHTML = "Getting";
        handleHeartRate((err, data) => {
            if (err != null) {
                console.error(err);
            } else {
                console.log(JSON.parse(data));
                let heartRate = (JSON.parse(data)).HeartRate;
                document.getElementById("heart-rate").innerHTML = heartRate;
                getHeartChartData();
            }
        });
    }

}

handleHeartChartData = (callback) => {
    let request = new XMLHttpRequest();

    request.open("GET", "http://127.0.0.1:5000/heartPersistence", true);
    request.onload = () => {
        let status = request.status;
        if (status == 200) {
            callback(null, request.response);
        } else {
            callback(status);
        }
    }
    request.send(null);
}

getHeartChartData = () => {
    handleHeartChartData((err, data) => {
        if (err != null) {
            console.error(err);
        } else {
            console.log(JSON.parse(data));
            let heartDates = (JSON.parse(data)).date;
            let heartData = (JSON.parse(data)).heart;

            heartChart.labels = heartDates;
            heartChart.data.datasets[0].data = heartData;
            heartChart.update();
        }
    });
}



getStepsChartData = () => {
    handleStepChartData((err, data) => {
        if (err != null) {
            console.error(err);
        } else {
            console.log(JSON.parse(data));
            let stepsDates = (JSON.parse(data)).date;
            let stepsData = (JSON.parse(data)).steps;

            stepsChart.labels = stepsDates;
            stepsChart.data.datasets[0].data = stepsData;
            stepsChart.update();
        }
    });
}

handleStepChartData = (callback) => {
    let request = new XMLHttpRequest();

    request.open("GET", "http://127.0.0.1:5000/stepsPersistence", true);
    request.onload = () => {
        let status = request.status;
        if (status == 200) {
            callback(null, request.response);
        } else {
            callback(status);
        }
    }
    request.send(null);
}

getInitialData = () => {

    document.getElementById("steps").innerHTML = "Getting";
    document.getElementById("heart-rate").innerHTML = "Getting";

    handleSteps((err, data) => {
        if (err != null) {
            console.error(err);
        } else {
            let steps = (JSON.parse(data)).Steps;
            let meters = (JSON.parse(data)).Meters;
            document.getElementById("steps").innerHTML = steps;

            handleHeartRate((err, data) => {
                if (err != null) {
                    console.error(err);
                } else {
                    console.log(JSON.parse(data));
                    let heartRate = (JSON.parse(data)).HeartRate;
                    document.getElementById("heart-rate").innerHTML = heartRate;

                    handleStepChartData((err, data) => {
                        if (err != null) {
                            console.error(err);
                        } else {
                            console.log(JSON.parse(data));
                            let stepsDates = (JSON.parse(data)).date;
                            let stepsData = (JSON.parse(data)).steps;

                            stepsChart.labels = stepsDates;
                            stepsChart.data.datasets[0].data = stepsData;
                            stepsChart.update();

                            handleHeartChartData((err, data) => {
                                if (err != null) {
                                    console.error(err);
                                } else {
                                    console.log(JSON.parse(data));
                                    let heartDates = (JSON.parse(data)).date;
                                    let heartData = (JSON.parse(data)).heart;

                                    heartChart.labels = heartDates;
                                    heartChart.data.datasets[0].data = heartData;
                                    heartChart.update();
                                }
                            });
                        }
                    });
                }
            });

        }
    });

}

dropdownClick = () => {
    dropdownStatus = document.getElementById("dropdown-devices").innerHTML;
    console.log(dropdownStatus);

    if (isDropdownActive) {
        isDropdownActive = false;
        if (dropdownStatus == "Searching") {
            document.getElementById("dropdown-devices").innerHTML = "Disconnected";
        }
    }
    else {
        isDropdownActive = true;
        if (dropdownStatus == "Disconnected") {
            document.getElementById("dropdown-devices").innerHTML = "Searching";
        }

    }
    // Refresh elements

    getBluetoothDevices("http://127.0.0.1:5000/devices", (err, data) => {

        //Remove old elements

        var elements = document.getElementsByClassName("dropdown-item");

        while (elements[0]) {
            elements[0].parentNode.removeChild(elements[0]);
        }

        if (err != null) {
            document.getElementById("dropdown-devices").innerHTML = "Disconnected";
        } else {
            var devices = (JSON.parse(data).Devices);
            console.log(devices);
            console.log(devices[0].address);
            console.log(devices.lenght);

            for (let i = 0; i < devices.length; i++) {
                let dropItem = document.createElement("button");
                dropItem.className = "dropdown-item";
                dropItem.type = "button";
                dropItem.innerHTML = devices[i].name;
                dropItem.id = "di" + i;
                dropItem.onclick = () => {
                    document.getElementById("dropdown-devices").innerHTML = "Connecting...";
                    connectDevice("http://127.0.0.1:5000/auth/" + devices[i].address, devices[i].name);

                }
                document.getElementById("dropdown-bluetooth").appendChild(dropItem);
            }


            let dropStatus = document.getElementById("dropdown-devices").innerHTML;

            console.log(dropStatus);

            if (dropStatus == "Connected") {

                let dividerDiv = document.createElement("div");
                dividerDiv.className = "dropdown-divider";
                document.getElementById("dropdown-bluetooth").appendChild(dividerDiv);

                let dropItemDisconnect = document.createElement("button");
                dropItemDisconnect.className = "dropdown-item";
                dropItemDisconnect.type = "button";
                dropItemDisconnect.innerHTML = "Disconnect";
                dropItemDisconnect.id = "disconnectBtn";
                dropItemDisconnect.onclick = () => {

                    handleDisconnectDevice("http://127.0.0.1:5000/auth", (err, data) => {
                        if (err != null) {
                            console.error(err);
                        } else {
                            document.getElementById("dropdown-devices").innerHTML = "Disconnected";
                            let response = (JSON.parse(data)).Authentication;
                        }
                    });
                }
                document.getElementById("dropdown-bluetooth").appendChild(dropItemDisconnect);
            }


        }
    });
}

// Chart Config

var ctx1 = document.getElementById('stepsChart');
var stepsChart = new Chart(ctx1, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            data: [],
            label: "Steps",
            backgroundColor: 'rgb(230,185,51)'
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

var ctx2 = document.getElementById('heartChart');
var heartChart = new Chart(ctx2, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Heart',
            data: [],
            backgroundColor: 'rgb(211,79,92)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

// Trigger Listenings 
document.getElementById("dropdown-devices").addEventListener("click", dropdownClick);
document.getElementById("btn-steps").addEventListener("click", getSteps);
document.getElementById("btn-heart").addEventListener("click", getHeartRate);