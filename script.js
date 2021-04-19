//Alles wichtigen Klicks

const Start = document.querySelector(".Start button");
const Quizbox = document.querySelector(".Quizbox");

//Nachdem man auf Start Quiz klickt

Start.onclick = ()=>{
    Quizbox.className.add ("activeBox");

}