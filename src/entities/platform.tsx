import { useBox } from "@react-three/cannon"

import { useEffect, useRef } from "react"
import { Mesh, Vector3 } from "three"
import { useEnvironment } from "../store/environment"

const Platform_Width = 10

const Platform = ({ position }: { position: Vector3 }) => {
	const [ref] = useBox(
		() => ({
			args: [Platform_Width, 1, 1],
			position: position.toArray(),
			mass: 0,
			material: "floor",
		}),
		useRef<Mesh>(null),
	)

	useEffect(() => {
		if (ref.current) {
			useEnvironment.setState((state) => {
				state.bodyRefs[ref.current!.uuid] = ref
			})
		}
	}, [position, ref])

	return (
		<mesh ref={ref}>
			<boxGeometry args={[Platform_Width, 1, 1]} />
			<meshNormalMaterial />
		</mesh>
	)
}

export default Platform
