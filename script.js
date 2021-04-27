$(document).ready(function() {

    //Alles wichtigen Klicks
    const Start = document.querySelector(".Start button");
    const Quizbox = document.querySelector(".Quizbox");

    //Nachdem man auf Start Quiz klickt
    $('#start-btn').on('click', function() {
        $('#quizbox').addClass("activeBox");

    })

    function highlight(id) {
        if (polygonSeries.getPolygonById(id).properties.hoverable == true) {
            activateHighlight(id);
        } else {
            deactivateHighlight(id);
        }
    };

    function activateHighlight(id) {
        polygonSeries.getPolygonById(id).setState("highlight");
    }

    function deactivateHighlight(id) {
        polygonSeries.getPolygonById(id).setState("default");
    }

    //Toggle germany
    $("#DEU").on('click', function() {
        polygonSeries.getPolygonById("DE").isActive = !polygonSeries.getPolygonById("DE").isActive;
    });

    $("#toggleHL").on('click', function() {
        highlight("DE");
    });

    $("#activateHL").on('click', function() {
        activateHighlight("DE");
    });

    $("#deactivateHL").on('click', function() {
        deactivateHighlight("DE");
    });

})