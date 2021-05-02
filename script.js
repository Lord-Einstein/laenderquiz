$(document).ready(function() {

    //#region Init map

    //Create theme
    function am4themes_myTheme(target) {
        if (target instanceof am4core.ColorSet) {
            target.list = [
                // 0 Outline color
                am4core.color("#ffffff"),
                // 1 Background color
                am4core.color("#363945"),
                // 2 Primary color
                am4core.color("#672E3B"),
                // 3 Hover color
                am4core.color("#9e475b"),
                // 4 Active color
                am4core.color("#6395F2"),
                // 5 Active hover color
                am4core.color("#1258DC"),
                // 6 Highlight state color
                am4core.color("#88B04B")
            ];
        }
    };

    //Applying themes
    am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_myTheme);

    // Create map instance
    var chart = am4core.create("chartdiv", am4maps.MapChart);

    // Create map instance
    var chart = am4core.create(
        document.getElementById("chartdiv"),
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
    polygonTemplate.tooltipText = "{name} : {id}";
    polygonTemplate.stroke = chart.colors.getIndex(0);
    polygonTemplate.properties.strokeWidth = 1;
    polygonTemplate.fill = chart.colors.getIndex(2);


    //Select countries
    polygonSeries.include = ["AD", "AL", "AT", "BA", "BE", "BG", "BY", "CH", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GB", "GR", "HR", "HU", "IE", "IS", "IT", "LT", "LU", "LV", "MD", "ME", "MK", "MT", "NL", "NO", "PL", "PT", "RO", "RS", "RU", "SE", "SI", "SK", "TR", "UA", "XK", "", ];

    // Create hover state, set fill and stroke color, set float
    var hoverState = polygonTemplate.states.create("hover");
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
    hoverShadow.opacity = 1;
    hoverShadow.dx = 2;
    hoverShadow.dy = 4;

    //Fix hover outlines
    polygonSeries.mapPolygons.template.events.on("over", function(event) {
        event.target.zIndex = Number.MAX_VALUE;
        event.target.toFront();
    });

    // Create active state
    var activeState = polygonTemplate.states.create("active");
    activeState.properties.fill = chart.colors.getIndex(4);

    // Create an event to toggle "active" state, prints the name
    polygonTemplate.events.on("hit", function(ev) {
        ev.target.isActive = !ev.target.isActive;

        // get object info
        //console.log(ev.target.dataItem.dataContext.name);
    })

    // Create hover active state and set alternative fill color
    var hoverActive = polygonTemplate.states.create("hoverActive");
    hoverActive.properties.fill = chart.colors.getIndex(5);
    hoverActive.properties.stroke = chart.colors.getIndex(5).lighten(0.6);

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

    var highlight = polygonTemplate.states.create("highlight");
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


    ////#region map buttons

    //Buttons
    //Toggle germany
    $("#DEU").on('click', function() {
        polygonSeries.getPolygonById("DE").isActive = !polygonSeries.getPolygonById("DE").isActive;
    });

    $("#toggleHL").on('click', function() {
        toggleHL("DE");
    });

    $("#activateHL").on('click', function() {
        activateHL("DE");
    });

    $("#deactivateHL").on('click', function() {
        deactivateHL("DE");
    });

    $("#toggleMap").on('click', function() {
        $("#map").toggle();
    });


    ////#endregion


    //Alle wichtigen Klicks
    const Start = document.querySelector(".Start button");
    const Quizbox = document.querySelector(".Quizbox");

    //QUIZ-FUNKTIONEN
    //notwendige variablen

    //fragenzähler
    var cnt;

    var korr_cnt;

    var answer;
    var qNum;
    var questionsDone = [];

    //html element shortcuts
    var $quiz_header = $('#quiz-header')
    var $antwort1 = $('#antwort1');
    var $antwort2 = $('#antwort2');
    var $antwort3 = $('#antwort3');
    var $next_btn = $('#next-btn');

    var $f_nr = $('#f_nr');

    //fragen-randomisierer
    function getRandomInt() {
        var min = 0;
        var max = 121;
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function getQuestion() {
        var randInt;
        do {
            randInt = getRandomInt();
            questionsDone.push(randInt);
        } while (!questionsDone.includes(randInt));

        return randInt;
    }

    //Quiz starten
    $('#start-btn').on('click', function() {

        //init game
        cnt = 1;
        korr_cnt = 0;

        //resets the buttons
        $antwort1.removeClass("clicked");
        $antwort2.removeClass("clicked");
        $antwort3.removeClass("clicked");

        $antwort1.removeClass("correct");
        $antwort2.removeClass("correct");
        $antwort3.removeClass("correct");

        $antwort1.removeClass("incorrect");
        $antwort2.removeClass("incorrect");
        $antwort3.removeClass("incorrect");

        //sets the question counter
        $f_nr.html(`Nr.: ${cnt}`);

        $("#progress").width(10 + "%");

        nextQuestion();

    })

    //selects the clicked answer
    $antwort1.on('click', function() {
        $antwort1.addClass("clicked");
        $antwort2.removeClass("clicked");
        $antwort3.removeClass("clicked");
        answer = 1;
    })

    $antwort2.on('click', function() {
        $antwort2.addClass("clicked");
        $antwort1.removeClass("clicked");
        $antwort3.removeClass("clicked");
        answer = 2;
    })

    $antwort3.on('click', function() {
        $antwort3.addClass("clicked");
        $antwort1.removeClass("clicked");
        $antwort2.removeClass("clicked");
        answer = 3;
    })


    //Überprüfen button
    $("#check-btn").on('click', function() {
        //shows next btn and hides check btn
        $("#next-btn").toggle();
        $("#check-btn").toggle();

        //get the id of the correct answer
        corAns = data[qNum].KORREKTE_ANTWORT;

        //sets the visual feedback on answer buttons
        switch (corAns) {
            case "1":
                $antwort1.addClass("correct");
                $antwort2.addClass("incorrect");
                $antwort3.addClass("incorrect");
                break;

            case "2":
                $antwort1.addClass("incorrect");
                $antwort2.addClass("correct");
                $antwort3.addClass("incorrect");
                break;

            case "3":
                $antwort1.addClass("incorrect");
                $antwort2.addClass("incorrect");
                $antwort3.addClass("correct");
                break;
        };

        //incements the correct answer counter
        if (answer == corAns) {
            korr_cnt++;
            $('#fcnt_k').text(korr_cnt);
        };

        var progWidth = cnt * 10;
        $("#progress").width(progWidth + "%");
    });


    //reset the quizbox and go to next question
    $("#next-btn").on('click', function() {

        $antwort1.removeClass("correct");
        $antwort2.removeClass("correct");
        $antwort3.removeClass("correct");

        $antwort1.removeClass("incorrect");
        $antwort2.removeClass("incorrect");
        $antwort3.removeClass("incorrect");

        $antwort1.removeClass("clicked");
        $antwort2.removeClass("clicked");
        $antwort3.removeClass("clicked");


        $("#next-btn").toggle();
        $("#check-btn").toggle();

        deactivateHL(data[qNum].LAND);

        cnt++;
        $f_nr.html(`Nr.: ${cnt}`);


        //limit quiz to 10 questions
        if (cnt < 11) {
            nextQuestion();
        } else {
            alert("quiz-beendet");
        };
    })



    //sucht die nächste frage aus
    function nextQuestion() {
        qNum = getQuestion();
        $quiz_header.html(`${data[qNum].FRAGE}`);
        $antwort1.html(`${data[qNum].ANTWORT1}`);
        $antwort2.html(`${data[qNum].ANTWORT2}`);
        $antwort3.html(`${data[qNum].ANTWORT3}`);

        activateHL(data[qNum].LAND);
    }


})