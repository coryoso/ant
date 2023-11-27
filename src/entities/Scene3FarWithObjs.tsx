import { Vector3 } from "three"
import Floor from "./floor"
import Obstacle from "./obstacle"
import Platform from "./platform"

const Scene3FarWithObjs = () => {
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

			<Obstacle position={new Vector3(-8, 0, 0)} />
			<Obstacle position={new Vector3(4, -1, 0)} />
			<Obstacle position={new Vector3(8, 0, 0)} />
			<Obstacle position={new Vector3(-4, -1, 0)} />
			<Obstacle position={new Vector3(0, 0, 0)} />
		</>
	)
}

export default Scene3FarWithObjs
