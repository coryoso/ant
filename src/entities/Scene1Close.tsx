import { Vector3 } from "three"
import Floor from "./floor"
import Platform from "./platform"
import { Debug } from "@react-three/cannon"

const Scene1Close = () => {
	return (
		<>
			<Debug>
				<Floor />
				<Platform
					position={new Vector3(-8, -5, 0)}
					size={new Vector3(13, 11, 10)}
				/>
				<Platform
					position={new Vector3(8, -5, 0)}
					size={new Vector3(13, 11, 10)}
				/>
			</Debug>
		</>
	)
}

export default Scene1Close
