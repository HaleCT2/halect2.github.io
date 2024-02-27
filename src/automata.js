import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { ReactComponent as PlayButton } from './play.svg';
import { ReactComponent as StopButton } from './stop.svg';
import { ReactComponent as ResetButton } from './reset.svg';
import { ReactComponent as RandomButton } from './random.svg';
import { ReactComponent as BackButton } from './back.svg';
import { ReactComponent as ForwardButton } from './forward.svg';

import './automata.scss';

const buttons = 256;

function Cell({ value, cellStateUpdate }) {
  return (<div className="holder">
            <div className={`cell ${value ? "active" : ""}`} data-value={value} onClick={cellStateUpdate}>
            </div>
          </div>
  )
}

function Board({cells, onUse}) {
  function handleClick(i) {
    const newCells = [...cells];
    newCells[i] = !cells[i];
    onUse(newCells);
  } 

  return (<div id="board">
  {[...Array(buttons)].map((e, i) => {
    return <Cell key={i} value={cells[i]} cellStateUpdate={() => handleClick(i)}/>
  })}     </div>
  )
}

function Controls({random, back, forward, reset, play, status}) {
  return ( <div> 
    <div className="button" id="reset" onClick={random}>
      <RandomButton />
    </div>
    <div className="small-button-left" id="back" onClick={back}>
      <BackButton />
    </div>
    <div className="button" id="play" data-value={status} onClick={play}>
      {(status) ? <StopButton /> : <PlayButton />}
    </div>
    <div className="small-button-right" id="forward" onClick={forward}>
      <ForwardButton />
    </div>
    <div className="button" id="reset" onClick={reset}>
      <ResetButton />
    </div>
          </div>
	)
}

function Automata() {
  const [history, setHistory] = useState([Array(buttons).fill(false)]);
  const [currentGen, setCurrentGen] = useState(0);
  const [isPlaying, setPlay] = useState(false);
  const currentCells = history[currentGen];

  function handlePlay(newCells, play=false) {
    if (!play) {
      setHistory([newCells.slice()])
    } else {
        if (isPlaying) {
          stopGame();
        }
        const nextHistory = [...history.slice(0, currentGen + 1), nextGen(currentCells)];
        setHistory([...history, nextGen(currentCells)])
        setCurrentGen(nextHistory.length - 1);
      }
  }

  const playGame = () => {
    setPlay(true);
    handlePlay(null, true); 
  };

  const stopGame = () => {
    setPlay(false);
  }

  useEffect(() => {
    if (currentGen > 0 && isPlaying) {
        const timeoutID = setTimeout(() => {
          const nextHistory = [...history.slice(0, currentGen + 1), nextGen(currentCells)];
          setHistory([...history, nextGen(currentCells)])
          setCurrentGen(nextHistory.length - 1);
        }, 300);
        return () => clearTimeout(timeoutID);
    }
  }, [history, currentGen, isPlaying, currentCells]);

  function jumpTo(nextMove) {
    if (isPlaying) {
      stopGame();
    }
    // "-2" represents a Reset Generation
    if (nextMove === -2) {
      setHistory([Array(buttons).fill(false)])
      setCurrentGen(0);
    } else if (nextMove < 0) {
        setCurrentGen(0);
    } else {
        setCurrentGen(nextMove);
    }
  }

  function nextGen(cells) {
    const tempCells = [...cells];
    const newCells = Array(buttons).fill(false);
    
    function isAlive(i) {
      if (i < 0 || i > (buttons - 1)) {
        return false;
      }
      return tempCells[i];
    }

    tempCells.forEach((e, i) => {
      let numAlive = isAlive(i-1) + isAlive(i+1) + isAlive(i+Math.sqrt(buttons)) + isAlive(i-Math.sqrt(buttons)) + isAlive(i+Math.sqrt(buttons)+1) + isAlive(i+Math.sqrt(buttons)-1) + isAlive(i-Math.sqrt(buttons)-1) + isAlive(i-Math.sqrt(buttons)+1);

      if (numAlive === 2) {
        newCells[i] = tempCells[i];
      } else if (numAlive === 3) {
        newCells[i] = true;
      } else {
        newCells[i] = false;
      }
    });
    
    return newCells;
  }

  return (<div id="automata">
    <div id="aligner">
    <div id="back-button" className="light">
        <Link to={"/"}> <FontAwesomeIcon icon={faArrowLeft} /> </Link>
    </div>
    <h1>automata</h1>
    <h3>gen: {currentGen}</h3>
    <Board cells={currentCells} onUse={handlePlay}/>
    <Controls reset={() => jumpTo(-2)}
              back={() => jumpTo(currentGen - 1)} 
              forward={() => handlePlay(null,true)} 
              random={() => {jumpTo(-2); handlePlay([...Array(buttons)].map(_=>Math.random() > 0.75 ? true : false))}}
              play={(isPlaying) ? stopGame : playGame}
              status={isPlaying}
    />
    </div>
    <div id="social-container" className="light">
      <div id="social-links">
        <a href="https://github.com/HaleCT2"><FontAwesomeIcon icon={faGithub}/></a>
      </div>
    </div>
  </div>
  );
}

export default Automata;
