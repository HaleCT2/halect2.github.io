import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { ReactComponent as PlayButton } from './play.svg';
import { ReactComponent as ResetButton } from './reset.svg';
import { ReactComponent as RandomButton } from './random.svg';
import { ReactComponent as BackButton } from './back.svg';
import { ReactComponent as ForwardButton } from './forward.svg';

import './App.scss';

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

function Controls({random, back, play, forward, reset}) {
  return ( <div> 
    <div className="button" id="reset" onClick={random}>
      <RandomButton />
    </div>
    <div className="small-button-left" id="back" onClick={back}>
      <BackButton />
    </div>
    <div className="button" id="play" onClick={play}>
      <PlayButton />
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

function App() {
  const [history, setHistory] = useState([Array(buttons).fill(false)]);
  const currentCells = history[history.length - 1];

  function handlePlay(newCells, play=false) {
    if (!play) {
        setHistory([...history, newCells]);
    } else {
        setHistory([...history, nextGen(currentCells)])
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

  return (<div>
    <div id="aligner">
    <h1>automata</h1>
    <Board cells={currentCells} onUse={handlePlay}/>
    <Controls reset={() => handlePlay(Array(buttons).fill(false))}
              // TODO: Fix Back, Play, and Forward (need to incorporate jumpTo() function)
              back={() => handlePlay(null,true)} 
              play={() => handlePlay(null,true)} 
              forward={() => handlePlay(null,true)} 
              random={() => handlePlay([...Array(buttons)].map(_=>Math.random() > 0.75 ? true : false))}
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

export default App;
