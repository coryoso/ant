import { Debug, Physics } from "@react-three/cannon"
import { Dodecahedron, Environment, OrbitControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { Vector3 } from "three"
import AntAgentEntity from "../entities/antAgent"
import Floor from "../entities/floor"
import Platform from "../entities/platform"
import { AntAgent, useEnvironment } from "../store/environment"

import Scene3FarWithObjs from "../entities/Scene3FarWithObjs"
import Scene1Close from "../entities/Scene1Close"
import Scene2Far from "../entities/Scene2Far"

const Agent_Limit = 50
const Spawn_Delay = 1

const DefaultScene = () => {
	const agents = useEnvironment((state) =>
		state.agentSystems.map((system) => Object.values(system.agents)).flat(),
	)
	const execute = useEnvironment((state) => state.execute)
	const spawnAgent = useEnvironment((state) => state.spawnAgent)
	const lastSpawn = useRef<number>(0)

	useFrame(({ clock }, delta) => {
		if (
			agents.length === 0 ||
			(agents.length < Agent_Limit &&
				clock.elapsedTime - lastSpawn.current > Spawn_Delay)
		) {
			lastSpawn.current = clock.elapsedTime

			spawnAgent()
		}

		execute()
	})

	return (
		<>
			<Environment preset="sunset" background />

			{/* <pointLight position={[10, 10, 10]} /> */}
			<directionalLight position={[0, 10, 0]} intensity={1} castShadow />

			<OrbitControls enableDamping={false} />

			<Physics>
				<Debug>
					<Scene1Close />

					{agents.map((agent) => (
						<AntAgentEntity
							key={agent.id}
							id={agent.id}
							position={(agent as AntAgent).position}
							// connectionUUID={(agent as AntAgent).connectionUUID}
							// connectionCollision={(agent as AntAgent).connectionCollision}
							attachPoint={(agent as AntAgent).attachPoint}
							attachMeshUUID={(agent as AntAgent).attachMeshUUID}
							intersections={(agent as AntAgent).intersections}
							prevVelocity={(agent as AntAgent).prevVelocity}
						/>
					))}
				</Debug>
			</Physics>
		</>
	)
}

export default DefaultScene
