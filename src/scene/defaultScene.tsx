import { Environment, OrbitControls } from "@react-three/drei"

const DefaultScene = () => {
	return (
		<>
			<Environment preset="sunset" background />

			<pointLight position={[10, 10, 10]} />
			<mesh>
				<sphereGeometry />
				<meshStandardMaterial roughness={0.1} color="hotpink" />
			</mesh>

			<OrbitControls />
		</>
	)
}

export default DefaultScene
