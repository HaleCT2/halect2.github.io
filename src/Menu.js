import { Link } from "react-router-dom"
import { useRef} from 'react'
import { useSpring, animated, to } from '@react-spring/web'
import { useGesture } from '@use-gesture/react'
import Container from 'react-bootstrap/Container';

import './Menu.scss';

const calcX = (y, ly) => -(y - ly - window.innerHeight / 2) / 10
const calcY = (x, lx) => (x - lx - window.innerWidth / 2) / 10

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
    <Container className="d-flex w-100 h-100 justify-content-center align-items-center mx-auto">
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
        }}> <Container className={appName}> <Link to={path}> {appName} </Link> </Container>
      </animated.div>
    </Container>
  )
}

function Menu() {
    return (<Container className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column" id="Menu">
        <h1 className="header p-3 pb-md-4 mx-auto text-center"> Web Playground </h1>
        <Container className="d-flex w-100 h-100 p-3 mx-auto flex-column text-center">
          <App appName={"automata"} path={"/automata"}/>
        </Container>
    </Container>
    );
}

export default Menu;