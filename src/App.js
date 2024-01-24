import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { ReactComponent as PlayButton } from './play.svg';
import { ReactComponent as ResetButton } from './reset.svg';
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

function Controls({reset}) {

  return ( <div> 
    <div className="button" id="play">
      <PlayButton />
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

  function handlePlay(newCells) {
    setHistory([...history, newCells]);
  }

  return (<div>
    <div id="aligner">
    <h1>automata</h1>
    <Board cells={currentCells} onUse={handlePlay}/>
    <Controls reset={() => handlePlay(Array(buttons).fill(false))}/>
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
