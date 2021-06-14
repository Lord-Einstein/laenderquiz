$(document).ready(function () {

    //#region Init map

    //Create theme
    function am4themes_myTheme(target) {
        if (target instanceof am4core.ColorSet) {
            target.list = [
                // 0 Outline color
                am4core.color('#0A1128'),
                // 1 Background color
                am4core.color('#001F54'),
                // 2 Primary color
                am4core.color('#FB9902'),
                // 3 Hover color
                am4core.color('#FDAC53'),
                // 4 Active color
                am4core.color('#63730B'),
                // 5 Active hover color
                am4core.color('#1258DC'),
                // 6 Highlight state color
                am4core.color('#99E46B')
            ];
        }
    };

    /*
    // 0 Outline color
                    am4core.color('#ffffff'),
                    // 1 Background color
                    am4core.color('#363945'),
                    // 2 Primary color
                    am4core.color('#672E3B'),
                    // 3 Hover color
                    am4core.color('#9e475b'),
                    // 4 Active color
                    am4core.color('#6395F2'),
                    // 5 Active hover color
                    am4core.color('#1258DC'),
                    // 6 Highlight state color
                    am4core.color('#88B04B')
    */

    //Applying themes
    am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_myTheme);

    // Create map instance
    var chart = am4core.create('chartdiv', am4maps.MapChart);

    // Create map instance
    var chart = am4core.create(
        document.getElementById('chartdiv'),
        am4maps.MapChart
    );

    // Set map definition
    chart.geodata = am4geodata_worldHigh;
    chart.geodataNames = am4geodata_lang_DE;

    // Set projection
    chart.projection = new am4maps.projections.Miller();

    // Create map polygon series
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;

    //Set Background
    chart.background.fill = chart.colors.getIndex(1);
    chart.background.fillOpacity = 1;

    // Configure series
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = '{name}';
    polygonTemplate.stroke = chart.colors.getIndex(0);
    polygonTemplate.properties.strokeWidth = 1;
    polygonTemplate.fill = chart.colors.getIndex(2);


    //Select countries
    polygonSeries.include = ['AD', 'AL', 'AT', 'BA', 'BE', 'BG', 'BY', 'CH', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GB', 'GR', 'HR', 'HU', 'IE', 'IS', 'IT', 'LT', 'LU', 'LV', 'MD', 'ME', 'MK', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'RS', 'RU', 'SE', 'SI', 'SK', 'TR', 'UA', 'XK', '',];

    // Create hover state, set fill and stroke color, set float
    var hoverState = polygonTemplate.states.create('hover');
    hoverState.properties.fill = chart.colors.getIndex(3);
    hoverState.properties.stroke = chart.colors.getIndex(3).lighten(0.6);
    hoverState.properties.strokeWidth = 3;
    hoverState.properties.dx = -1;
    hoverState.properties.dy = -2;

    //Default to no dropshadow
    var shadow = polygonTemplate.filters.push(new am4core.DropShadowFilter);
    shadow.opacity = 0.2;

    // Slightly shift the shadow and make it more prominent on hover
    var hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
    hoverShadow.opacity = 0.5;
    hoverShadow.dx = 2;
    hoverShadow.dy = 4;

    //Fix hover outlines
    polygonSeries.mapPolygons.template.events.on('over', function (event) {
        event.target.zIndex = Number.MAX_VALUE;
        event.target.toFront();
    });

    /*
    // Create active state
    var activeState = polygonTemplate.states.create('active');
    activeState.properties.fill = chart.colors.getIndex(4);

    // Create an event to toggle 'active' state, prints the name
    polygonTemplate.events.on('hit', function(ev) {
        ev.target.isActive = !ev.target.isActive;

        // get object info
        //console.log(ev.target.dataItem.dataContext.name);
    })

    // Create hover active state and set alternative fill color
    var hoverActive = polygonTemplate.states.create('hoverActive');
    hoverActive.properties.fill = chart.colors.getIndex(5);
    hoverActive.properties.stroke = chart.colors.getIndex(5).lighten(0.6);
    */

    // Disable zoom and pan
    var zoomLvl = 5.5;
    chart.seriesContainer.draggable = false;
    chart.seriesContainer.resizable = false;
    chart.minZoomLevel = zoomLvl;
    chart.maxZoomLevel = zoomLvl;

    //Set initial position and zoom
    chart.homeZoomLevel = zoomLvl;
    chart.homeGeoPoint = {
        latitude: 56,
        longitude: 7,
    };

    var highlight = polygonTemplate.states.create('highlight');
    highlight.properties.fill = chart.colors.getIndex(6);
    highlight.properties.hoverable = false;
    highlight.properties.clickable = false;

    //#endregion

    //#region Map Functions

    function toggleHL(id) {
        if (polygonSeries.getPolygonById(id).properties.hoverable == true) {
            activateHL(id);
        } else {
            deactivateHL(id);
        }
    };

    function activateHL(id) {
        polygonSeries.getPolygonById(id).setState("highlight");
    };

    function deactivateHL(id) {
        polygonSeries.getPolygonById(id).setState("default");
    };
    //#endregion

    //#region map buttons

    //Buttons
    //Toggle germany
    $('#DEU').on('click', function () {
        polygonSeries.getPolygonById('DE').isActive = !polygonSeries.getPolygonById('DE').isActive;
    });

    $('#toggleHL').on('click', function () {
        toggleHL('DE');
    });

    $('#activateHL').on('click', function () {
        activateHL('DE');
    });

    $('#deactivateHL').on('click', function () {
        deactivateHL('DE');
    });

    $('#toggleMap').on('click', function () {
        $('#map').toggle();
    });


    //#endregion



    //Attach Debug Btns
    /*
    $('#btn-bar').append(`
    <!--
        <div class="btn-map" id="DEU">Deutschland</div>
        <div class="btn-map" id="toggleHL">Toggle Highlight</div>
        <div class="btn-map" id="activateHL">Activate Highlight</div>
        <div class="btn-map" id="deactivateHL">Deactivate Highlight</div>
        
        <div class="btn-map" id="replace-dom">Test Replace</div>
        -->
        <div class="btn-map" id="toggleMap">Toggle Map</div>
        <div class="btn-map" id="evalmod">Eval Modal</div>
        <div class="btn-map" id="add-reward">Add Reward</div>
        <div class="btn-map" id="set-cookie">Set Cookie</div>
        <div class="btn-map" id="read-cookie">Read Cookie</div>
        <div class="btn-map" id="delete-cookie">Delete Cookie</div>

        <div class="btn-map" id="debug-btn">Debug modal</div>

        <div class="modal" id="debug-modal">
            <div class="modal-content" id="debug-window">
           
            </div>
        </div>
    `);
    */


    //QUIZ-FUNKTIONEN
    //Question counter
    var cnt;
    //Counts the number of correct questions
    var corr_cnt;
    //The max number of questions
    var qCount = 2;

    //The selected answer
    var answer;
    //The current question ID
    var qNum;

    //Set of answered questions
    var questionsDone = new Set();

    var rewardsGranted = new Set(readCookie());
    var rewardCnt = 0;

    //set html element shortcuts
    var $quiz_header = $('#quiz-header')
    var $answer1 = $('#antwort1');
    var $answer2 = $('#antwort2');
    var $answer3 = $('#antwort3');
    var $next_btn = $('#next-btn');

    if (readPath() == "rewards.html") {
        if (rewardsGranted.size != 0) {
            for (reward of rewardsGranted) {
                addRewardItem(reward)
            }
        }
    }

    //#region Buttons

    //Quiz starten
    $('#start-btn').on('click', function () {
        initGame();
    });

    //selects the clicked answer
    $answer1.on('click', function () {
        $answer1.addClass('clicked');
        $answer2.removeClass('clicked');
        $answer3.removeClass('clicked');
        answer = 1;
    });

    $answer2.on('click', function () {
        $answer2.addClass('clicked');
        $answer1.removeClass('clicked');
        $answer3.removeClass('clicked');
        answer = 2;
    });

    $answer3.on('click', function () {
        $answer3.addClass('clicked');
        $answer1.removeClass('clicked');
        $answer2.removeClass('clicked');
        answer = 3;
    });


    //Überprüfen button
    $('#check-btn').on('click', function () {
        checkBtn();
    });


    //reset the quizbox and go to next question
    $('#next-btn').on('click', function () {
        nextBtn();
    });

    //test button to call evaluation popup
    $('#evalmod').on('click', function () {
        callEval();
    });

    $('#end-modal-btn').on('click', function () {
        hideEval();
        initGame();
    });

    //#endregion

    //rnd generator
    function getRandomInt(min = 0, max = 121) {
        return Math.floor(Math.random() * (max - min)) + min;
    };

    //return not asked question id
    function getQuestion() {
        if (rewardsGranted.size >= 121)
            return 0;

        var randInt = getRandomInt();

        if (questionsDone.has(randInt)) {
            console.log('ID already used getting new ID')
            randInt = getQuestion();
        } else {
            console.log('adding ID: ' + randInt + ' to set')
            questionsDone.add(randInt);
        }

        return randInt;
    };


    function initGame() {
        //init vars
        answer = 0;
        cnt = 1;
        corr_cnt = 0;

        $('#inner-container').fadeIn();
        $('#start-btn').hide();

        //resets the buttons
        $answer1.removeClass('clicked');
        $answer2.removeClass('clicked');
        $answer3.removeClass('clicked');

        $answer1.removeClass('correct');
        $answer2.removeClass('correct');
        $answer3.removeClass('correct');

        $answer1.removeClass('incorrect');
        $answer2.removeClass('incorrect');
        $answer3.removeClass('incorrect');

        if (qNum) {
            deactivateHL(data[qNum].LAND);
        }

        //inits the question counter
        $('#maxQuestion').text(qCount);
        $('#qNumber').text(cnt);
        $('#corr_qCnt').text('0');

        $('#progress').animate({
            width: (100 / qCount) + '%'
        });

        nextQuestion();
    };

    function checkBtn() {
        //shows next btn and hides check btn
        $('#check-btn').toggle();
        $('#next-btn').toggle();

        //get the id of the correct answer
        corAns = data[qNum].KORREKTE_ANTWORT;

        //sets the visual feedback on answer buttons
        switch (corAns) {
            case '1':
                $answer1.addClass('correct');
                $answer2.addClass('incorrect');
                $answer3.addClass('incorrect');
                break;

            case '2':
                $answer1.addClass('incorrect');
                $answer2.addClass('correct');
                $answer3.addClass('incorrect');
                break;

            case '3':
                $answer1.addClass('incorrect');
                $answer2.addClass('incorrect');
                $answer3.addClass('correct');
                break;
        };

        //incements the correct answer counter
        if (answer == corAns) {
            corr_cnt++;
            $('#corr_qCnt').text(corr_cnt);
        };

    }

    function nextBtn() {

        $answer1.removeClass('correct');
        $answer2.removeClass('correct');
        $answer3.removeClass('correct');

        $answer1.removeClass('incorrect');
        $answer2.removeClass('incorrect');
        $answer3.removeClass('incorrect');

        $answer1.removeClass('clicked');
        $answer2.removeClass('clicked');
        $answer3.removeClass('clicked');


        $('#next-btn').toggle();
        $('#check-btn').toggle();

        deactivateHL(data[qNum].LAND);

        cnt++;
        answer = 0;

        //limit quiz to 10 questions
        if (cnt <= qCount) {
            nextQuestion();
        } else {
            callEval();
        }
    }

    //selects the next question
    function nextQuestion() {
        qNum = getQuestion();

        //console.table(data);

        $quiz_header.html(`${data[qNum].FRAGE}`);
        $answer1.html(`${data[qNum].ANTWORT1}`);
        $answer2.html(`${data[qNum].ANTWORT2}`);
        $answer3.html(`${data[qNum].ANTWORT3}`);

        activateHL(data[qNum].LAND);

        var progressWidth = cnt * (100 / qCount);
        $('#progress').animate({
            width: progressWidth + '%'
        });

        $('#qNumber').html(cnt);
    };

    //Evaluation popup
    function callEval() {
        addRewardItem();
        $('#eval-mod-correct').text(corr_cnt);
        $('#eval-modal').fadeIn('2000');
        setCookie();
    };

    function hideEval() {
        $.when($('#eval-modal').fadeOut(500)).then(function () {
            $('#reward-container').empty()
        });
    }

    //return not asked question id
    function getReward() {

        if (rewardsGranted.size >= 12)
            return 0;

        var randInt = getRandomInt(1, 13);

        if (rewardsGranted.has(randInt)) {
            console.log('Reward already used getting new Reward');
            randInt = getReward();
        } else {
            console.log('adding RewardID: ' + randInt + ' to set')
            rewardsGranted.add(randInt);
        }

        return randInt;
    }

    function addRewardItem(rewardID = getReward()) {

        console.log('Reward ID = ' + rewardID);

        if (rewardID == 0) {
            console.log("Max reached");
            $('#reward-container')
                .append(`<div class="table-item">       
                <div class="table-text">
                empty</div></div>`);
        } else {
            $('#reward-container')
                .append(`<div class="table-item">
            <img src="./images/${img[rewardID].img_name}">
            <div class="table-text">
            ${img[rewardID].description}
            </div></div>`);
        }

    }


    //#region Cookie Funktions

    function setCookie() {
        var expiryDate = "; expires=Fri, 31 Dec 2021 23:59:59 UTC;";
        var cPath = " path=/";

        var x;

        obj = {
            rewards: Array.from(rewardsGranted),
        }
        x = JSON.stringify(obj) + expiryDate + cPath;
        document.cookie = x;
        console.log("cookie set")
    }

    function readCookie() {
        var cookie = document.cookie;

        console.log("cookie read")

        if (cookie != "") {
            var mySet = new Set(JSON.parse(cookie).rewards)
            console.log(mySet)
            return mySet;
        }
    }

    function deleteCookie() {

    }

    function readPath() {
        var path = window.location.pathname;
        var page = path.split("/").pop();
        console.log(page);
        return page;
    }

    //#endregion



    //#region Debugging
    $('#set-cookie').on('click', function () {

        setCookie();

        debug("cookie set")
    })

    $('#read-cookie').on('click', function () {
        debug(JSON.stringify(readCookie()));
    })

    $('#delete-cookie').on('click', function () {
        deleteCookie();
        debug("cookie deleted")
    })

    $('#replace-dom').on('click', function () {
        location.assign("rewards.html");
    });

    $('#add-item').on('click', function () {
        addRewardItem();
    })

    $('#add-reward').on('click', function () {
        getReward();
        debug("added reward")
    })

    //test button to call evaluation popup
    $('#debug-btn').on('click', function () {
        $('#debug-modal').show();
    });

    function debug(text) {
        $('#debug-window').text(text)
        $('#debug-modal').show();
    }

    window.onclick = function (event) {
        if (event.target == document.getElementById("debug-modal")) {
            $('#debug-modal').hide();
        }
    }


    //#endregion

});