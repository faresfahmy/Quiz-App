"use strict";
//Select Elements
let countSpan = document.querySelector(".count span");
let chooseExam = document.querySelectorAll(".quiz-app .choose-exam span");
let bulletsSpans = document.querySelector(".bullets .spans");
let bullets = document.querySelector(".bullets");
let answerArea = document.querySelector(".quiz-app .answer-area");
let areaQuestion = document.querySelector(".quiz-app .quiz-area");
let submitButton = document.querySelector(".quiz-app .submit-answer");
let result = document.querySelector(".quiz-app .result");
let timer = document.querySelector(".countdown");

//Set Options
let currentIndex = 0;
let wrong = 0;
let correct = 0;
let duration = 10;
let countdownTnterval;


if (typeof process === 'undefined' || process.env.NODE_ENV !== 'test') {
    getQuestions();
}
function getQuestions(){
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function(){
        if(this.status===200 && this.readyState===4){
            let questionsObject = JSON.parse(this.responseText);
            let questionsCount = questionsObject.length;
            //Create Bullets + Set Qusetions Count
            createBullets(questionsCount);

            //Add Question Data 
            addQuestionData(questionsObject[currentIndex], questionsCount);

            //Function Timer
            countdown(5,questionsCount)
            //Click On Submit 
            submitButton.addEventListener("click",(e)=>{
                e.preventDefault();
                //Function Check Answer
                checkAnswer(questionsObject,questionsCount);

                //Function Timer
                clearInterval(countdownTnterval)
                countdown(5,questionsCount);
            })
            duration = 10;
        }
    }
    myRequest.open("GET", "quiz_js.json",true);
    myRequest.send();
}
function createBullets(num){
    countSpan.innerHTML = num;
    // Create Spans 
    for(let i = 0; i<num; i++){
        //Create Span (Bullet)
        let newSpan = document.createElement("span");
        //Append Bullets To Main Bullet Container 
        bulletsSpans.appendChild(newSpan);
    }
    // Added Class On 
    bulletsSpans.children[0].classList.add("on");
}

function addQuestionData(Obj){
    //Create h2 Question Title
    let qusetionsTitle = document.createElement("h2");
    //Add Class Title
    qusetionsTitle.classList.add("title")

    // Element Content
    qusetionsTitle.innerHTML = Obj['title'];

    //Append The h3 To The Quiz Area
    areaQuestion.appendChild(qusetionsTitle);
    for(let i = 1; i<=4; i++){
        //Create Main Answer Div
        let answer = document.createElement("div");

        // Add Class To Main Div
        answer.classList.add("answer");

        //Create Radio Input
        let inputRadio = document.createElement("input");

        //Add Type + Name + Id + Data-Attribute
        inputRadio.setAttribute("type", "radio");
        inputRadio.setAttribute("id", `answer_${i}`);
        inputRadio.name = "questions";
        inputRadio.dataset.answer = Obj[`answer_${i}`];

        //Make First Option Selected
        if(i === 1){
            inputRadio.checked = true;
        }
        //Create The Label 
        let theLabel  = document.createElement("label");

        //Add For Attribute 
        theLabel.setAttribute("for", `answer_${i}`);
        
        //Create Label Text
        let theLabelText = document.createTextNode(Obj[`answer_${i}`]);

        //Add The Text To Label 
        theLabel.appendChild(theLabelText);

        
        //Add Input + Label To Main Div
        answer.appendChild(inputRadio);
        answer.appendChild(theLabel);

        
        // Append All Divs To Answers Area
        answerArea.appendChild(answer);
    }
    addOnBullet()
}
function addOnBullet(){
    bulletsSpans.childNodes[currentIndex].classList.add("on");
}

function checkAnswer(Obj,count){
    answerArea.childNodes.forEach((e)=>{
        if(e.firstElementChild.checked){
            if(e.lastElementChild.innerText==Obj[currentIndex].right_answer){
                    ++correct;
                    e.style.backgroundColor = " rgb(88 230 111)";
            }
            else{
                    ++wrong;
                    e.style.backgroundColor = " rgb(245 93 93)";
                }
        }
                   
})
    setTimeout(()=>{
        ++currentIndex;
        document.querySelector(".quiz-app .answer-area").innerHTML = '';
        document.querySelector(".quiz-app .quiz-area").innerHTML = ''

        //Check Condition in Question Number
        if(wrong+correct!=count){
            addQuestionData(Obj[currentIndex], count);
        }
        else{
            showResult(count);
        }
       
    },1000)
}

function showResult(count){
    if(count==currentIndex){
        answerArea.remove();
        areaQuestion.remove();
        submitButton.remove();
        bullets.remove();
        if(correct>wrong&&count>correct){
            result.innerHTML = `<span class="good">Good </span>You Answered ${correct} From ${count}`;
        }
        else if(correct==count){
            result.innerHTML = `<span class="perfect">Perfect </span>, All Answeres Is Good`;
        }
        else{
            result.innerHTML = `<span class="bad">Bad </span>You Answered ${correct} From ${count}`;
        }
        result.style.padding = `10px`;
        result.style.marginTop = '10px';
        result.style.backgroundColor = 'white';
    }
}
 function countdown(duration, count){
    let timeMain = duration;
    if(currentIndex<count){
        let minutes, seconds;
        countdownTnterval =setInterval(()=>{
            minutes = parseInt(duration/60);
            seconds = parseInt(duration%60);
            minutes = minutes<10?`0${minutes}`:minutes;
            seconds = seconds<10?`0${seconds}`:seconds;
            timer.innerHTML = `${minutes}:${seconds}`;
            if(--duration<0){
                clearInterval(countdownTnterval);
                submitButton.click()
            }
    },1000)
    }
 }

 // في آخر ملف app.js لإتاحة الدوال لبيئة الاختبار
if (typeof window !== 'undefined') {
  window.createBullets = createBullets;
  window.addQuestionData = addQuestionData;
  window.countdown = countdown;
}