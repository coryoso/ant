import { Physics } from "@react-three/cannon"
import {
	Box,
	Dodecahedron,
	Environment,
	OrbitControls,
} from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import AntAgent from "../entities/antAgent"
import Floor from "../entities/floor"
import { Agent, useEnvironment } from "../store/environment"

const Agent_Limit = 10
const Spawn_Delay = 2

const DefaultScene = () => {
	const agents = useEnvironment((state) =>
		state.agentSystems.map((system) => system.agents).flat(),
	)
	const execute = useEnvironment((state) => state.execute)
	const lastSpawn = useRef<number>(0)

	useFrame(({ clock }) => {
		useEnvironment.setState((state) => {
			console.log(clock.elapsedTime - lastSpawn.current)
			if (
				state.agentSystems[0].agents.length < Agent_Limit &&
				clock.elapsedTime - lastSpawn.current > Spawn_Delay
			) {
				lastSpawn.current = clock.elapsedTime

				state.agentSystems[0].addAgent(new Agent())
			}
		})

		execute()
	})

	return (
		<>
			<Environment preset="sunset" background />

			<pointLight position={[10, 10, 10]} />
			<directionalLight position={[0, 10, 0]} intensity={0.5} />

			{/*Init Position*/}
			<Box position={[-10, 0, 0]}>
				<meshStandardMaterial color="orange" />
			</Box>
			{/*End Position*/}
			<Box position={[10, 0, 0]}>
				<meshStandardMaterial color="green" />
			</Box>

			{/*Obstacles*/}
			<Dodecahedron position={[-5, 2.5, 0]}>
				<meshStandardMaterial color="hotpink" />
			</Dodecahedron>
			<Dodecahedron position={[5, -2.5, 0]}>
				<meshStandardMaterial color="hotpink" />
			</Dodecahedron>

			<OrbitControls />

			<Physics>
				<Floor />

				{agents.map((agent) => (
					<AntAgent key={agent.id} position={agent.position} />
				))}
			</Physics>
		</>
	)
}

export default DefaultScene
