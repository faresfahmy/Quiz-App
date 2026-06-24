/**
 * @jest-environment jsdom
 */

beforeEach(() => {
  // 1. تنظيف الـ Cache لضمان قراءة التعديل الجديد
  jest.resetModules();

  // 2. بناء هيكل HTML متوافق تماماً مع السلكتورز في كودك
  document.body.innerHTML = `
    <div class="quiz-app">
      <div class="choose-exam">
        <span class="html-exam">HTML</span>
        <span class="css-exam">CSS</span>
        <span class="js-exam">JavaScript</span>
      </div>
      <div class="quiz-info">
        <div class="category">Category : <span>HTML</span></div>
        <div class="count">Questions Count : <span>0</span></div>
      </div>
      <div class="quiz-area"></div>
      <div class="answer-area"></div>
      <button class="submit-answer">Submit Answer</button>
      <div class="bullets">
        <div class="spans"></div>
      </div>
      <div class="countdown">00:00</div>
    </div>
  `;

  // 3. تصفير المتغيرات العامة
  global.currentIndex = 0;
  global.correct = 0;
  global.wrong = 0;
  
  // 4. استدعاء ملف الكود
  require('./main.js'); 
});

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});

describe("Quiz Application Testing", () => {

  test("createBullets() should create correct number of bullets and update count span", () => {
    window.createBullets(3);

    const countSpan = document.querySelector(".count span");
    const bulletsSpans = document.querySelector(".bullets .spans");

    expect(countSpan.innerHTML).toBe("3");
    expect(bulletsSpans.children.length).toBe(3);
    expect(bulletsSpans.children[0].classList.contains("on")).toBe(true);
  });

test("addQuestionData() should render question title and radio inputs correctly", () => {
    const mockQuestion = {
      "title": "Which element is used for the largest heading?",
      "answer_1": "<h6>",
      "answer_2": "<heading>",
      "answer_3": "<h1>",
      "answer_4": "<head>",
      "right_answer": "<h1>"
    };


    const bulletsSpans = document.querySelector(".bullets .spans");
    bulletsSpans.appendChild(document.createElement("span"));
    window.addQuestionData(mockQuestion);

    const quizArea = document.querySelector(".quiz-app .quiz-area");
    const answerArea = document.querySelector(".quiz-app .answer-area");

    expect(quizArea.querySelector(".title").innerHTML).toBe(mockQuestion["title"]);
    expect(Object.keys(mockQuestion).length).toBe(6);
    expect(answerArea.querySelectorAll(".answer").length).toBe(4);
    expect(answerArea.querySelector("#answer_1").checked).toBe(true);
  });

  test("countdown() should update the timer DOM element correctly", () => {
    jest.useFakeTimers(); 
    
    window.countdown(10, 5);
    
    const timer = document.querySelector(".countdown");
    
    jest.advanceTimersByTime(1000);
    expect(timer.innerHTML).toBe("00:10");

    jest.advanceTimersByTime(2000);
    expect(timer.innerHTML).toBe("00:08");
  });
});