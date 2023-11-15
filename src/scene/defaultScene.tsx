import { Debug, Physics } from "@react-three/cannon"
import { Environment, OrbitControls, SoftShadows } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import AntAgentEntity from "../entities/antAgent"
import { AntAgent, useEnvironment } from "../store/environment"

import { Perf } from "r3f-perf"
import Scene1Close from "../entities/Scene1Close"
import Scene2Far from "../entities/Scene2Far"
import Scene3FarWithObjs from "../entities/Scene3FarWithObjs"

const Agent_Limit = 200
const Spawn_Delay = 2

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
			{/* <Environment preset="forest" background /> */}
			{/* @ts-ignore */}

			{/* <Perf /> */}

			<SoftShadows size={100} samples={16} />

			{/* <fog attach="fog" args={["#f0f0f0", 0, 20]} /> */}
			{/* <pointLight position={[10, 10, 10]} /> */}
			<directionalLight
				position={[-5, 5, 5]}
				intensity={1}
				castShadow
				shadow-mapSize={2048}
				shadow-bias={-0.0001}
			/>
			<OrbitControls enableDamping={false} />

			<Physics>
				<Scene3FarWithObjs />

				{agents.map((agent) => (
					<AntAgentEntity
						key={agent.id}
						id={agent.id}
						position={(agent as AntAgent).position}
						// connectionUUID={(agent as AntAgent).connectionUUID}
						// connectionCollision={(agent as AntAgent).connectionCollision}
						attachPoints={(agent as AntAgent).attachPoints}
						attachMeshUUIDs={(agent as AntAgent).attachMeshUUIDs}
					/>
				))}
			</Physics>
		</>
	)
}

export default DefaultScene
