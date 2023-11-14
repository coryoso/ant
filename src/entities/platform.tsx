import { useBox } from "@react-three/cannon"

import { useEffect, useRef } from "react"
import { Mesh, Vector3 } from "three"
import { useEnvironment } from "../store/environment"

const Platform = ({ position, size }: { position: Vector3; size: Vector3 }) => {
	const [ref] = useBox(
		() => ({
			args: size.toArray(),
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
			<boxGeometry args={size.toArray()} />
			<meshNormalMaterial />
		</mesh>
	)
}

export default Platform
