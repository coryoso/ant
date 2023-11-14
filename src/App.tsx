import { Canvas } from "@react-three/fiber"
import "./App.css"
import AntAnimationScene from "./scene/antAnimation"

function App() {
	return (
		<div className="w-screen h-screen">
			<Canvas camera-position-z={40} camera-far={100} shadows>
				<color attach="background" args={["#202025"]} />

				<AntAnimationScene />
			</Canvas>
		</div>
	)
}

export default App
