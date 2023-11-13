import { useBox } from "@react-three/cannon"
import { useRef } from "react"
import { Mesh, Vector3 } from "three"

const Platform_Width = 2

const Platform = ({ position }: { position: Vector3 }) => {
	const [ref] = useBox(
		() => ({
			args: [Platform_Width, 1, 1],
			position: position.toArray(),
			mass: 0,
		}),
		useRef<Mesh>(null),
	)

	return (
		<mesh ref={ref}>
			<boxGeometry args={[Platform_Width, 1, 1]} />
			<meshNormalMaterial />
		</mesh>
	)
}

export default Platform
