import { Link } from "react-router-dom"
import { useRef} from 'react'
import { useSpring, animated, to } from '@react-spring/web'
import { useGesture } from '@use-gesture/react'

import './Menu.scss';

const calcX = (y, ly) => -(y - ly - window.innerHeight / 2) / 20
const calcY = (x, lx) => (x - lx - window.innerWidth / 2) / 20

function App({appName, path}) {
  const target = useRef(null)
  const [{ x, y, rotateX, rotateY, rotateZ, zoom, scale }, api] = useSpring(
    () => ({
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scale: 1,
      zoom: 0,
      x: 0,
      y: 0,
      config: { mass: 5, tension: 350, friction: 40 },
    })
  )

  useGesture(
    {
      onMove: ({ xy: [px, py]}) =>
        api({
          rotateX: calcX(py, y.get()),
          rotateY: calcY(px, x.get()),
          scale: 1.1,
        }),
      onHover: () =>
        api({ rotateX: 0, rotateY: 0, scale: 1 })
    },
    { target, eventOptions: { passive: false } }
  )

  return (
    <div className="container">
      <animated.div
        ref={target}
        className="card"
        style={{
          transform: 'perspective(600px)',
          x,
          y,
          scale: to([scale, zoom], (s, z) => s + z),
          rotateX,
          rotateY,
          rotateZ,
        }}> <Link to={path}> <h1 className={appName}>{appName}</h1> </Link>
      </animated.div>
    </div>
  )
}

function Menu() {
    return (<div id="Menu">
        <h1> Web Playground </h1>
        <div className="content">
            <App appName={"automata"} path={"/automata"}/>
        </div>
    </div>
    );
}

export default Menu;