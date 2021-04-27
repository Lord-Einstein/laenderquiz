$(document).ready(function() {

    //Alles wichtigen Klicks
    const Start = document.querySelector(".Start button");
    const Quizbox = document.querySelector(".Quizbox");

    //Nachdem man auf Start Quiz klickt
    /*
     $('#start-btn').on('click', function() {
         $('#quizbox').addClass("activeBox");

     })
     */

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

    //QUIZ-FUNKTIONEN
    //notwendige variablen
    //fragenzähler
    var cnt = 1;

    //array für bereits beantwortete fragen anhand der ID
    var arr = [];

    var korr_cnt = 0;

    var x;

    var answer = 0;

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
    $('#start-btn').on('click', function() {

        $f_nr.html(`Nr.: ${cnt}`)

        x = getRandomInt()

        $quiz_header.html(`${data[x].FRAGE}`)
        $antwort1.html(`${data[x].ANTWORT1}`)
        $antwort2.html(`${data[x].ANTWORT2}`)
        $antwort3.html(`${data[x].ANTWORT3}`)

        choseAndCheckAnswer()

    })


    //ändert farbe von geklicktem button und weist der ausgewählten antwort wert zu
    function choseAndCheckAnswer() {

        $antwort1.on('click', function() {
            $antwort1.addClass("clicked");

            $antwort2.removeClass("clicked")
            $antwort3.removeClass("clicked")
            answer = 1;
        })
        $antwort2.on('click', function() {
            $antwort2.addClass("clicked");

            $antwort1.removeClass("clicked")
            $antwort3.removeClass("clicked")
            answer = 2;
        })
        $antwort3.on('click', function() {
            $antwort3.addClass("clicked");

            $antwort1.removeClass("clicked")
            $antwort2.removeClass("clicked")
            answer = 3;
        })

        //überprüft ob ausgewählte antwort richtig ist
        $next_btn.on('click', function() {
            if (answer == data[x].KORREKTE_ANTWORT) {
                alert("korrekt")

                korr_cnt++
                $('#fcnt_k').text(korr_cnt)

                //nextQuestion()
            } else {
                alert("falsch")

                //nextQuestion()
            }

            $antwort1.removeClass("clicked")
            $antwort2.removeClass("clicked")
            $antwort3.removeClass("clicked")

            cnt++
            $f_nr.html(`Nr.: ${cnt}`)
            nextQuestion()
        })
    }


    //sucht die nächste frage aus
    function nextQuestion() {
        x = getRandomInt();
        $quiz_header.html(`${data[x].FRAGE}`)
        $antwort1.html(`${data[x].ANTWORT1}`)
        $antwort2.html(`${data[x].ANTWORT2}`)
        $antwort3.html(`${data[x].ANTWORT3}`)
        choseAndCheckAnswer()
    }


})