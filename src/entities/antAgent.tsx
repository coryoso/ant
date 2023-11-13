import { useSphere } from "@react-three/cannon"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { Mesh, Vector3 } from "three"
import { AntAgent, useEnvironment } from "../store/environment"
import { AnimatedAnt } from "./animatedAnt"

const Ant_Radius = 0.5

const AntAgentEntity = ({
	position,
	id,
}: {
	position: Vector3
	id: string
}) => {
	const [ref, body] = useSphere(
		() => ({
			args: [Ant_Radius],
			mass: 1,
			position: position.toArray(),
			material: "ant",
		}),
		useRef<Mesh>(null),
	)

	useFrame(() => {
		if (body) {
			useEnvironment.setState((state) => {
				;(state.agentSystems[0].agents[id] as AntAgent).physicsBody = body
			})
		}
	})

	return (
		<>
			<mesh ref={ref} castShadow>
				<sphereGeometry args={[0.1, 36, 36]} />
				<meshPhysicalMaterial
					color={"Yellow"}
					roughness={0.8}
					clearcoat={1}
					clearcoatRoughness={0.35}
				/>

				<AnimatedAnt />
			</mesh>
		</>
	)
}

export default AntAgentEntity
