// elements
const turn_on = document.querySelector("#turn_on");
const jarvis_intro = document.querySelector("#j_intro");
const time = document.querySelector("#time");
const machine = document.querySelector(".machine");

let stopingR = false;
// krishi's commands
let fridayComs = [];
fridayComs.push("hello krishi");
fridayComs.push("what are your commands");
fridayComs.push("close this - to close opened popups");
fridayComs.push(
  "change my information - information regarding your acoounts and you"
);
fridayComs.push("whats the weather or temperature");
fridayComs.push("show me the full weather report");
fridayComs.push("are you there - to check krishi's presence");
fridayComs.push("shut down - stop voice recognition");
fridayComs.push("open google");
fridayComs.push('search for "your keywords" - to search on google ');
fridayComs.push("open whatsapp");
fridayComs.push("open youtube");
fridayComs.push('play "your keywords" - to search on youtube ');
fridayComs.push("close all tabs - to close all opened browser tabs");
fridayComs.push("open calender");
fridayComs.push("listen to music");
fridayComs.push("open chat gpt");
fridayComs.push("open instagram");
fridayComs.push("open my instagram profile");
fridayComs.push("open github");
fridayComs.push("open my github profile");


// show a warn to check for all the commands
console.warn('*to check for the commands speak "what are your commands"');

//time setup
let date = new Date();
let hrs = date.getHours();
let mins = date.getMinutes();
let secs = date.getSeconds();

// this is what friday tells about weather
let weatherStatement = "";
let charge,chargeStatus, connectivity, currentTime
chargeStatus = "unplugged"

window.onload = () => {
  // turn_on.play();
  turn_on.addEventListener("ended", () => {
    setTimeout(() => {
      // autoJarvis();
      readOut("Ready to go sir");
      if (localStorage.getItem("jarvis_setup") === null) {
        readOut(
          "Sir, kindly fill out the form on your screen so that you could access most of my features and if you want to see my commands see a warning in the console"
        );
      }
    }, 200);
  });

  fridayComs.forEach((e) => {
    document.querySelector(".commands").innerHTML += `<p>#${e}</p><br />`;
  });
  // battery
  let batteryPromise = navigator.getBattery();
  batteryPromise.then(batteryCallback);

  // internet connectivity

  if (navigator.onLine) {
    document.querySelector("#internet").textContent = "online";
    connectivity = "online";
  } else {
    document.querySelector("#internet").textContent = "offline";
    connectivity = "offline";
  }

  setInterval(() => {
    if (navigator.onLine) {
      document.querySelector("#internet").textContent = "online";
      connectivity = "online";
    } else {
      document.querySelector("#internet").textContent = "offline";
      connectivity = "offline";
    }
  }, 60000);

  function batteryCallback(batteryObject) {
    printBatteryStatus(batteryObject);
    setInterval(() => {
      printBatteryStatus(batteryObject);
    }, 5000);
  }
  function printBatteryStatus(batteryObject) {
    document.querySelector("#battery").textContent = `${(
      batteryObject.level * 100
    ).toFixed(2)}%`;
    charge = batteryObject.level * 100;
    if (batteryObject.charging === true) {
      document.querySelector(".battery").style.width = "200px";
      document.querySelector("#battery").textContent = `${(
        batteryObject.level * 100
      ).toFixed(2)}% Charging`;
      chargeStatus = "plugged in";
    }
  }

};


    function formatAMPM(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;
      currentTime = strTime;
      time.textContent = strTime;
    }

    formatAMPM(date);
    setInterval(() => {
      formatAMPM(date);
    }, 60000);

    // auto friday

function autoJarvis() {
  setTimeout(() => {
    recognition.start();
  }, 1000);
}

// 
// start jarvis with btn
document.querySelector("#start_jarvis_btn").addEventListener("click", () => {
  recognition.start();
})


document.querySelector("#stop_jarvis_btn").addEventListener("click", () => {
  stopingR = true;
  recognition.stop();
})

// weather setup

function weather(location) {
  const weatherCont = document.querySelector(".temp").querySelectorAll("*");
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=48ddfe8c9cf29f95b7d0e54d6e171008`;
  const xhr = new XMLHttpRequest();

  xhr.open("GET", url, true);

  xhr.onload = function () {
    if (this.status === 200) {
      let data = JSON.parse(this.responseText);
      weatherCont[0].textContent = `Location : ${data.name}`;
      weatherCont[1].textContent = `Country : ${data.sys.country}`;
      weatherCont[2].textContent = `Weather type : ${data.weather[0].main}`;
      weatherCont[3].textContent = `Weather description : ${data.weather[0].description}`;
      weatherCont[4].src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      weatherCont[5].textContent = `Original Temperature : ${ktc(
        data.main.temp
      )}`;
      weatherCont[6].textContent = `But it feels like ${ktc(
        data.main.feels_like
      )}`;
      weatherCont[7].textContent = `Min temperature ${ktc(data.main.temp_min)}`;
      weatherCont[8].textContent = `Max temperature ${ktc(data.main.temp_max)}`;
      weatherStatement = `the weather in ${data.name} is ${
        data.weather[0].description
      } 
            and the temperature feels like ${ktc(data.main.feels_like)}`;
    } else {
      weatherCont[0].textContent = "Weather Info not found";
    }
  };

  xhr.send();
}

// convert kelvin to celcius
function ktc(k) {
  k = k - 273.15;
  return k.toFixed(2);
}

if (localStorage.getItem("jarvis_setup") !== null) {
  weather(JSON.parse(localStorage.getItem("jarvis_setup")).location)
}

// jarvis information setup

const setup = document.querySelector(".jarvis_setup");
setup.style.display = "none";
if (localStorage.getItem("jarvis_setup") === null) {
  setup.style.display = "flex";
  setup.querySelector("button").addEventListener("click", userInfo);
}

//userInfo function

function userInfo() {
  let setupInfo = {
    name: setup.querySelectorAll("input")[0].value,
    gender: setup.querySelectorAll("input")[1].value,
    bio: setup.querySelectorAll("input")[2].value,
    location: setup.querySelectorAll("input")[3].value,
    email: setup.querySelectorAll("input")[4].value,
    instagram: setup.querySelectorAll("input")[5].value,
    github: setup.querySelectorAll("input")[6].value,
  };

  let testArr = [];
  setup.querySelectorAll("input").forEach((e) => {
    testArr.push(e.value);
  });

  if (testArr.includes("")) {
    readOut("please enter your complete information");
  } else {
    localStorage.clear();
    localStorage.setItem("jarvis_setup", JSON.stringify(setupInfo));
    setup.style.display = "none";
    weather(JSON.parse(localStorage.getItem("jarvis_setup")).location);
  }
}
// speech recognition setup

const isSpeechRecognitionSupported =
  "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
console.log("SpeechRecognition support:", isSpeechRecognitionSupported);

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
// recognition.lang = localStorage.getItem("lang");

var synth = window.speechSynthesis;
// const speech = new SpeechSynthesisUtterance();

recognition.onstart = function () {
  console.log("voice recognition activated");
  document.querySelector("#stop_jarvis_btn").style.display = "flex";
};

// arr of window
let windowsB = [];

// sr result
recognition.onresult = function (event) {
  let current = event.resultIndex;
  let transcript = event.results[current][0].transcript;
  transcript = transcript.toLowerCase();
  let userdata = localStorage.getItem("jarvis_setup");
  console.log(`my words ${transcript}`);


  // jarvis commands
  if (transcript.includes("hello krishi")) {
    readOut("hello mam! How can I help you");
  }
  if (transcript.includes("what are your commands")) {
    readOut("here's the list of commands i can follow");
    if (window.innerWidth <= 400) {
      window.resizeTo(screen.width, screen.height);
    }
    document.querySelector(".commands").style.display = "block";
  }
  // jarvis bio
  if (transcript.includes("about yourself")) {
    readOut("sir, i am a jarvis, a voice asistant made for browsers using javascript by one of the Enthusiastic dev on the planet. I can do anything which can be done from a browser.");
  }
  // availability check
  if (transcript.includes("are you there")) {
    readOut("yes I am here, please tell me what can I do for you");
  }
  // close voice recognition
  if (transcript.includes("shut down") || transcript.includes("shutdown")) {
    readOut("Ok then i will take a nap");
    stopingR = true;
    recognition.stop();
  }

  // some casual commands
  if (transcript.includes("what is the current charge")) {
    readOut(`the current charge is ${charge}`);
  }
  if (transcript.includes("what is the charging status")) {
    readOut(`the current charging status is ${chargeStatus}`);
  }
  if (transcript.includes("current time")) {
    readOut(currentTime);
  }
  if (transcript.includes("connection status")) {
    readOut(`you are ${connectivity} `);
  }

  // userdata access commands

  if (transcript.includes(" my name")) {
    readOut(`Yes, I know that you are ${JSON.parse(userdata).name}`);
  }
  if (transcript.includes(" what I do")) {
    readOut(`Yes, I know that you are ${JSON.parse(userdata).bio}`);
  }
  if (transcript.includes("do you know my gender")) {
    readOut(` You are a ${JSON.parse(userdata).gender}`);
  }

  // close popups
  if (transcript.includes("close this")) {
    readOut("closing the tab");
    document.querySelector(".commands").style.display = "none";
    if (window.innerWidth >= 401) {
      window.resizeTo(250, 250);
    }
    setup.style.display = "none";
  }

  // info change
  if (transcript.includes("change my information")) {
    readOut("Opening the information tab ");
    localStorage.clear();

    if (window.innerWidth <= 400) {
      window.resizeTo(screen.width, screen.height);
    }
    setup.style.display = "flex";
    setup.querySelector("button").addEventListener("click", userInfo);
  }

  //weather report

  if (transcript.includes("what is the temperature")) {
    readOut(weatherStatement);
  }

  if (transcript.includes("full weather report")) {
    readOut("opening the weather report ");
    let a = window.open(
      `https://www.google.com/search?q=weather+in+${
        JSON.parse(localStorage.getItem("jarvis_setup")).location
      }`
    );
    windowsB.push(a);
  }

  // browser commands --->

  // whatsapp
  if (transcript.includes("open whatsapp")) {
    readOut("opening whatsapp for you");
    let a = window.open("https://web.whatsapp.com/");
    windowsB.push(a);
  }

  // spotify
  if (transcript.includes("listen to music")) {
    readOut("okay then I am opening spotify for you");
    let a = window.open("https://open.spotify.com/");
    windowsB.push(a);
  }

  // canva

  if (transcript.includes("open my canva designs")) {
    readOut("opening canva designs");
    window.open("https://www.canva.com/folder/all-designs");
  }

  if (transcript.includes("open canva") || transcript.includes("open camera")) {
    readOut("opening canva");
    window.open("https://www.google.com/");
  }

  //youtube
  if (transcript.includes("open youtube")) {
    readOut("opening youtube for you");
   let a =  window.open("https://www.youtube.com/");
   windowsB.push(a);
  }

  // to play on youtube
  if (transcript.includes("play")) {
    readOut("here are the videos for you");
    let i = transcript.split("");
    i.splice(0, 5);
    i = i.join("");
    console.log(i);
    let a =window.open(`https://www.youtube.com/results?search_query=${i}`);
    windowsB.push(a);
  }

  // chat gpt
  if (
    transcript.includes("open chatgpt") ||
    transcript.includes("open chat gpt")
  ) {
    readOut("opening chat GPT for you");
    let a =window.open("https://chat.openai.com/");
    windowsB.push(a);
  }

  // to open google

  if (transcript.includes("open google")) {
    readOut("opening google for you");
    let a = window.open("https://www.google.com/");
    windowsB.push(a);
  }

  // to search on google
  if (transcript.includes("search for")) {
    readOut("here's the result for you");
    let input = transcript.split("");
    input.splice(0, 11);
    input = input.join("");
    console.log(input);
    let a = window.open(`https://www.google.com/search?q=${input}`);
    windowsB.push(a);
  }

  //to open github
  if (transcript.includes("open github")) {
    readOut("opening github for you");
    let a = window.open("https://www.github.com/");
    windowsB.push(a);
  }
  // to open my github account
  if (transcript.includes("open my github account")) {
    readOut("opening your github account for you");
    let a = window.open(
      `https://www.github.com/${JSON.parse(userdata).github}`
    );
    windowsB.push(a);
  }
  //to open instagram
  if (transcript.includes("open instagram")) {
    readOut("opening instagram for you");
    let a = window.open("https://www.instagram.com/");
    windowsB.push(a);
  }
  // to open my instagram account
  if (transcript.includes("open my instagram account")) {
    readOut("opening your instagram account for you");
    let a= window.open(`https://www.instagram.com/${JSON.parse(userdata).instagram}/`);
    windowsB.push(a);
  }
  // calendar
  if (transcript.includes("open calendar")) {
    readOut("opening calendar");
    let a = window.open("https://calendar.google.com/");
    windowsB.push(a);
  }
  // close all opened tabs
  if (transcript.includes("close all tabs")) {
    readOut("closing all tabs ");
    windowsB.forEach((e) => {
      e.close();
    });
    // news commands
    if (transcript.includes("top headlines")) {
      readOut("These are today's top headlines ");
      getNews();
    }

    if (transcript.includes("news regarding")) {
      // readOut("These are today's top headlines sir")
      let input = transcript;
      let a = input.indexOf("regarding");
      input = input.split("");
      input.splice(0, a + 9);
      input.shift();
      input.pop();

      readOut(`here's some headlines on ${input.join("")}`);
      getCategoryNews(input.join(""));
    }
  }


  recognition.onerror = function (event) {
    console.error("Speech recognition error:", event.error);
  };

  recognition.onend = function () {
    if (stopingR === false) {
      setTimeout(() => {
        recognition.start();
      }, 500);
    } else if (stopingR === true) {
      recognition.stop();
      document.querySelector("#stop_jarvis_btn").style.display = "none";
    }
  };

  // krishi speech
  function readOut(message) {
    const speech = new SpeechSynthesisUtterance(message);
    const allVoices = speechSynthesis.getVoices();
    speech.text = message;
    speech.voice = allVoices[6];
    speech.volume = 1;
    speechSynthesis.speak(speech);
    console.log("speaking out");
  }

  function readOutHindi(message) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.volume = 1;
    window.speechSynthesis.speak(speech);
    console.log("Speaking out");
  }

  // small jarvis
  const smallJarvis = document.querySelector("#small_jarvis");

  smallJarvis.addEventListener("click", () => {
    window.open(
      `${window.location.href}`,
      "newWindow",
      "menubar=true,location=true,resizable=false,scrollbars=false,width=200,height=200,top=0,left=0"
    );
    window.close();
  });

  document.querySelector("#jarvis_start").addEventListener("click", () => {
    recognition.start();
  });

  // calendar

  const lang = navigator.language;

  let datex = new Date();
  let dayNumber = date.getDate();
  let monthx = date.getMonth();

  let dayName = date.toLocaleString(lang, { weekday: "long" });
  let monthName = date.toLocaleString(lang, { month: "long" });
  let year = date.getFullYear();


  // news setup

  async function getNews() {
    var url =
      "https://newsapi.org/v2/top-headlines?country=in&apiKey=dbfa45791caf4dcaa28c08465b174ce1";
    var req = new Request(url);
    await fetch(req)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let arrNews = data.articles;
        arrNews.length = 10;
        let a = [];
        arrNews.forEach((e, index) => {
          a.push(index + 1);
          a.push(".........");
          a.push(e.title);
          a.push(".........");
        });
        readOut(a);
      });
  }

  // category news

  let yyyy, mm, dd;

  dd = date.getDate();
  mm = date.getMonth();
  yyyy = date.getFullYear();

  async function getCategoryNews(category) {
    var url =
      "https://newsapi.org/v2/everything?" +
      `q=${category}&` +
      `from=${yyyy}-${mm}-${dd}&` +
      "sortBy=popularity&" +
      "apiKey=dbfa45791caf4dcaa28c08465b174ce1";

    // https://newsapi.org/v2/everything?q=Apple&from=2021-09-19&sortBy=popularity&apiKey=API_KEY

    var req = new Request(url);

    await fetch(req)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let arrNews = data.articles;
        arrNews.length = 10;
        let a = [];
        arrNews.forEach((e, index) => {
          a.push(index + 1);
          a.push(".........");
          a.push(e.title);
          a.push(".........");
        });
        readOut(a);
      });
  }

}