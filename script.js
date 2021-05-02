$(document).ready(function () {

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
    polygonSeries.include = ["AD", "AL", "AT", "BA", "BE", "BG", "BY", "CH", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GB", "GR", "HR", "HU", "IE", "IS", "IT", "LT", "LU", "LV", "MD", "ME", "MK", "MT", "NL", "NO", "PL", "PT", "RO", "RS", "RU", "SE", "SI", "SK", "TR", "UA", "XK", "",];

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
    polygonSeries.mapPolygons.template.events.on("over", function (event) {
        event.target.zIndex = Number.MAX_VALUE;
        event.target.toFront();
    });

    // Create active state
    var activeState = polygonTemplate.states.create("active");
    activeState.properties.fill = chart.colors.getIndex(4);

    // Create an event to toggle "active" state, prints the name
    polygonTemplate.events.on("hit", function (ev) {
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

    function HL(id) {
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
    $("#DEU").on('click', function () {
        polygonSeries.getPolygonById("DE").isActive = !polygonSeries.getPolygonById("DE").isActive;
    });

    $("#toggleHL").on('click', function () {
        HL("DE");
    });

    $("#activateHL").on('click', function () {
        activateHL("DE");
    });

    $("#deactivateHL").on('click', function () {
        deactivateHL("DE");
    });

    $("#toggleMap").on('click', function () {
        $("#map").toggle();
    });



    ////#endregion


    //Alle wichtigen Klicks
    const Start = document.querySelector(".Start button");
    const Quizbox = document.querySelector(".Quizbox");

    //Nachdem man auf Start Quiz klickt
    /*
     $('#start-btn').on('click', function() {
         $('#quizbox').addClass("activeBox");

     })
     */

    //QUIZ-FUNKTIONEN
    //notwendige variablen


    //array für bereits beantwortete fragen anhand der ID
    var arr = [];

    //fragenzähler
    var cnt;

    var korr_cnt;
    var x;
    var answer;

    //html element shortcuts
    var $quiz_header = $('#quiz-header')
    var $antwort1 = $('#antwort1')
    var $antwort2 = $('#antwort2')
    var $antwort3 = $('#antwort3')
    var $next_btn = $('#next-btn')

    var $f_nr = $('#f_nr')

    //fragen-randomisierer
    function getRandomInt() {
        var min = 0
        var max = 120
        return Math.floor(Math.random() * (max - min)) + min;
    }

    //Quiz starten
    $('#start-btn').on('click', function () {

        //init game
        cnt = 1;
        korr_cnt = 0;
        x = 0;

        $antwort1.removeClass("clicked")
        $antwort2.removeClass("clicked")
        $antwort3.removeClass("clicked")

        $f_nr.html(`Nr.: ${cnt}`)

        x = getRandomInt()

        $quiz_header.html(`${data[x].FRAGE}`)
        $antwort1.html(`${data[x].ANTWORT1}`)
        $antwort2.html(`${data[x].ANTWORT2}`)
        $antwort3.html(`${data[x].ANTWORT3}`)

    })


    $antwort1.on('click', function () {
        $antwort1.addClass("clicked");

        $antwort2.removeClass("clicked")
        $antwort3.removeClass("clicked")
        answer = 1;
    })

    $antwort2.on('click', function () {
        $antwort2.addClass("clicked");

        $antwort1.removeClass("clicked")
        $antwort3.removeClass("clicked")
        answer = 2;
    })

    $antwort3.on('click', function () {
        $antwort3.addClass("clicked");

        $antwort1.removeClass("clicked")
        $antwort2.removeClass("clicked")
        answer = 3;
    })

    //überprüft ob ausgewählte antwort richtig ist
    $next_btn.on('click', function () {

        $antwort1.removeClass("clicked")
        $antwort2.removeClass("clicked")
        $antwort3.removeClass("clicked")
        
        if (answer == data[x].KORREKTE_ANTWORT) {
            

            switch (x) {
                case 1:
                    $antwort1.addClass("correct")
                    $antwort2.addClass("incorrect")
                    $antwort3.addClass("incorrect")

                    break;

                case 2:
                    $antwort1.addClass("incorrect")
                    $antwort2.addClass("correct")
                    $antwort3.addClass("incorrect")

                    break;

                case 3:

                    $antwort1.addClass("incorrect")
                    $antwort2.addClass("incorrect")
                    $antwort3.addClass("correct")

                    break;

            }
            alert("korrekt")

            korr_cnt++
            $('#fcnt_k').text(korr_cnt)

        } else {
            alert("falsch")

        }
      

        cnt++;
        $f_nr.html(`Nr.: ${cnt}`);

        if (cnt < 11) {
            nextQuestion()
        } else {
            alert("quiz-beendet")
        };
    })

    //ändert farbe von geklicktem button und weist der ausgewählten antwort wert zu
    function choseAndCheckAnswer() {


    }


    //sucht die nächste frage aus
    function nextQuestion() {
        x = getRandomInt();
        $quiz_header.html(`${data[x].FRAGE}`)
        $antwort1.html(`${data[x].ANTWORT1}`)
        $antwort2.html(`${data[x].ANTWORT2}`)
        $antwort3.html(`${data[x].ANTWORT3}`)
    }


})