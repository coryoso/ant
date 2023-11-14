import { Canvas } from "@react-three/fiber"
import "./App.css"
import DefaultScene from "./scene/defaultScene"

function App() {
	return (
		<div className="w-screen h-screen">
			<Canvas camera-position-z={40} camera-far={100} shadows>
				<color attach="background" args={["#202025"]} />

				{/* <AntAnimationScene /> */}
				<DefaultScene />
			</Canvas>
		</div>
	)
}

export default App
