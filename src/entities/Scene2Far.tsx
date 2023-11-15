import { Vector3 } from "three"
import Floor from "./floor"
import Platform from "./platform"
import { Debug } from "@react-three/cannon"

const Scene2Far = () => {
	return (
		<>
			<Floor />
			<Platform
				position={new Vector3(-15, -5, 0)}
				size={new Vector3(10, 11, 10)}
			/>
			<Platform
				position={new Vector3(15, -5, 0)}
				size={new Vector3(10, 11, 10)}
			/>
		</>
	)
}

export default Scene2Far
