import { Vector3 } from "three"
import Floor from "./floor"
import Platform from "./platform"
import { Debug } from "@react-three/cannon"
import { Dodecahedron } from "@react-three/drei"

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
			{/*Obstacles*/}
			<Dodecahedron position={[-5, 2.5, 0]} castShadow>
				<meshStandardMaterial color="hotpink" />
			</Dodecahedron>
			<Dodecahedron position={[5, -2.5, 0]} castShadow>
				<meshStandardMaterial color="hotpink" />
			</Dodecahedron>
		</>
	)
}

export default Scene3FarWithObjs
