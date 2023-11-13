import { useSphere } from "@react-three/cannon"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { Mesh, Vector3 } from "three"

const Ant_Radius = 0.5

const AntAgent = ({ position }: { position: Vector3 }) => {
	const [ref, body] = useSphere(
		() => ({
			args: [Ant_Radius],
			mass: 1,
			position: [0, 10, 0],
			material: "ant",
		}),
		useRef<Mesh>(null),
	)

	useFrame(() => {
		body.applyImpulse([0.1, 0, 0], [0, 0, 0])
		if (ref.current) {
		}
	})

	return (
		<>
			<mesh ref={ref}>
				<sphereGeometry args={[Ant_Radius, 36, 36]} />
				<meshPhysicalMaterial
					color={"Yellow"}
					roughness={0.8}
					clearcoat={1}
					clearcoatRoughness={0.35}
				/>
			</mesh>
		</>
	)
}

export default AntAgent
