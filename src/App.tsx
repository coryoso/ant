import { Canvas } from "@react-three/fiber"
import "./App.css"
import DefaultScene from "./scene/defaultScene"

function App() {
	return (
		<div className="w-screen h-screen">
			<Canvas>
				<DefaultScene />
			</Canvas>
		</div>
	)
}

export default App
