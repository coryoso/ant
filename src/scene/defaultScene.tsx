import {
	Box,
	Dodecahedron,
	Environment,
	OrbitControls,
} from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import AntAgent from "../entities/antAgent"
import { useEnvironment } from "../store/environment"

const DefaultScene = () => {
	const agents = useEnvironment((state) =>
		state.agentSystems.map((system) => system.agents).flat(),
	)
	const execute = useEnvironment((state) => state.execute)

	useFrame(({ clock }) => {
		execute()
	})

	return (
		<>
			<Environment preset="sunset" background />

			<pointLight position={[10, 10, 10]} />
			<directionalLight position={[0, 10, 0]} intensity={0.5} />

			<Box position={[-10, 0, 0]}>
				<meshStandardMaterial color="orange" />
			</Box>
			<Box position={[10, 0, 0]}>
				<meshStandardMaterial color="green" />
			</Box>

			<Dodecahedron position={[-5, 2.5, 0]}>
				<meshStandardMaterial color="hotpink" />
			</Dodecahedron>
			<Dodecahedron position={[5, -2.5, 0]}>
				<meshStandardMaterial color="hotpink" />
			</Dodecahedron>

			<OrbitControls />

			{agents.map((agent) => (
				<AntAgent position={agent.position} />
			))}
		</>
	)
}

export default DefaultScene
