$(document).ready(function() {

    //Alles wichtigen Klicks
    const Start = document.querySelector(".Start button");
    const Quizbox = document.querySelector(".Quizbox");

    //Nachdem man auf Start Quiz klickt
    $('#start-btn').on('click', function() {
        $('#quizbox').addClass("activeBox");

    })
})