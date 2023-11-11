import { Sphere } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { Mesh, Vector3 } from "three"

const AntAgent = ({ position }: { position: Vector3 }) => {
	const sphere = useRef<Mesh>(null)

	useFrame(() => {
		if (sphere.current) {
			sphere.current!.position.set(position.x, position.y, position.z)
		}
	})

	return (
		<>
			<Sphere ref={sphere}>
				<meshStandardMaterial color="hotpink" />
			</Sphere>
		</>
	)
}

export default AntAgent
