import { Environment, OrbitControls } from "@react-three/drei"
import { AnimatedAnt } from "../entities/animatedAnt"

const AntAnimationScene = () => {
	return (
		<>
			<Environment preset="sunset" background />

			{/* <pointLight position={[10, 10, 10]} /> */}
			<directionalLight position={[0, 10, 0]} intensity={1} castShadow />

			<OrbitControls enableDamping={false} />

			<AnimatedAnt />
		</>
	)
}

export default AntAnimationScene
