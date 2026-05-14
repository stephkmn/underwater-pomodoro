import { ReactElement, useState, useEffect } from 'react';
import './App.css';

// Asset imports
import closeBtn from './assets/close_button.png';
import minimizeBtn from './assets/minimize_button.png';
import workBtn from './assets/work.png';
import workBtnClicked from './assets/work_clicked.png';
import breakBtn from './assets/break.png';
import breakBtnClicked from './assets/break_clicked.png';
import startBtn from './assets/start_button.png';
import pauseBtn from './assets/pause_button.png';
import stopBtn from './assets/stop_button.png';
import endAlarm from './assets/end_alarm.mp3';

const ALARM = new Audio(endAlarm);
const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

const WORK_MESSAGES = [
  "Push through twin",
  "Keep going twin",
  "Almost there twin",
  "Lock in twin",
  "You can do it twin"
];

const BREAK_MESSAGES = [
  "Break time!",
  "Get yourself a snack twin",
  "Stay hydrated",
  "ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧"
];

function App() {
  const [timeRemaining, setTimeRemaining] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [breakButtonImage, setBreakButtonImage] = useState(breakBtn);
  const [workButtonImage, setWorkButtonImage] = useState(workBtn);
  const [startStopButtonImage, setStartStopButtonImage] = useState(startBtn);
  const [encouragement, setEncouragement] = useState("");

  // Message updater
  useEffect(() => {
    let messageInterval: NodeJS.Timeout;

    if(!isRunning) { setEncouragement(""); return; }

    const messages = isBreak ? BREAK_MESSAGES : WORK_MESSAGES;
    setEncouragement(messages[0]);
    let index = 1

    messageInterval = setInterval(() => {
      setEncouragement(messages[index]);
      index = (index + 1) % messages.length;
    }, 4000);

    return () => clearInterval(messageInterval);
  }, [isRunning, isBreak]);

  // Countdown timer
  useEffect(() => {
    if (!isRunning) return;

    if (timeRemaining === 0) {
      switchMode(!isBreak); 
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeRemaining]);

  // Set default mode to work
  useEffect(() => {
    switchMode(false);
  }, []);

  // Alarm sound
  useEffect(() => {
    if (timeRemaining === 0 && isRunning) {
      ALARM.play().catch((err: unknown) => {
        console.error("Audio play failed: ", err);
      });
      switchMode(!isBreak);
    }
  }, [timeRemaining, isRunning, isBreak])

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const switchMode = (breakMode: boolean) => {
    setIsBreak(breakMode);
    setIsRunning(false);
    setTimeRemaining(breakMode ? BREAK_TIME : WORK_TIME);
    setWorkButtonImage(breakMode ? workBtn : workBtnClicked);
    setBreakButtonImage(breakMode ? breakBtnClicked : breakBtn);
    setStartStopButtonImage(startBtn);
  }

  const handleClick = () => {
    if(!isRunning) {
      setIsRunning(true);
      setStartStopButtonImage(stopBtn);
    }
    else {
      setIsRunning(false);
      setTimeRemaining(isBreak ? BREAK_TIME : WORK_TIME);
      setStartStopButtonImage(startBtn);
    }
  };

  const containerClass = `home-container ${isBreak ? "background-green" : ""}`;

  const handleMinimizeClick = () => {
    if(window.electronAPI?.minimizeApp) {
      window.electronAPI.minimizeApp();
    } else {
      console.warn("Electron API not available");
    }
  };

  const handleCloseClick = () => {
    if(window.electronAPI?.closeApp) {
      window.electronAPI.closeApp();
    } else {
      console.warn("Electron API not available");
    }
  };

  return (
    <>
      <div className={containerClass} style={{ position: 'relative' }}>
        <div className="title-bar">
          <button className="title-bar-button" onClick={handleMinimizeClick} style={{right: "min(20vh, 18vw)"}}>
            <img src={minimizeBtn} alt="Minimize"/>
          </button>
          <button className="title-bar-button" onClick={handleCloseClick} style={{right: "min(10vh, 5vw)"}}>
            <img src={closeBtn} alt="Close"/>
          </button>
        </div>
        
        <div className="home-content">
          <div className="home-controls">
            <div className = "mode-controls">
              <button className="mode-button" onClick={() => switchMode(false)}>
                <img src={workButtonImage} alt="Work"/>
              </button>
              <button className="mode-button" onClick={() => switchMode(true)}>
                <img src={breakButtonImage} alt="Break"/>
              </button>
            </div>

            <p className ={`encouragement-text ${!isRunning ? "hidden" : ""}`}>
              {encouragement}
            </p>

            <h1 className="home-timer">{formatTime(timeRemaining)}</h1>

            <button className="home-button" onClick={handleClick}>
              <img src={startStopButtonImage} alt="Start / Stop"/>
            </button>

          </div>
        </div>
      </div>
    </>
  );
}

export default App;
