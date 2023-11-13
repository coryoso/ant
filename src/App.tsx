import { Canvas } from "@react-three/fiber"
import "./App.css"
import DefaultScene from "./scene/adding_agents"

function App() {
	return (
		<div className="w-screen h-screen">
			<Canvas camera-position-z={40} camera-far={100}>
				<color attach="background" args={["#202025"]} />
				<DefaultScene />
			</Canvas>
		</div>
	)
}

export default App
