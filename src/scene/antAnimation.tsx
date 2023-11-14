import { Debug, Physics } from "@react-three/cannon"
import { Environment, OrbitControls } from "@react-three/drei"
import { Vector3 } from "three"
import AntAgentEntity from "../entities/antAgent"
import Floor from "../entities/floor"

const AntAnimationScene = () => {
	return (
		<>
			<Environment preset="sunset" background />

			{/* <pointLight position={[10, 10, 10]} /> */}
			<directionalLight position={[0, 10, 0]} intensity={1} castShadow />

			<OrbitControls enableDamping={false} />

			<Physics>
				<Debug>
					<Floor />

					<AntAgentEntity
						id="123"
						position={new Vector3(0, -4, 0)}
						attachPoint={undefined}
						intersections={[]}
						attachMeshUUID={undefined}
					/>
				</Debug>
			</Physics>
		</>
	)
}

export default AntAnimationScene
