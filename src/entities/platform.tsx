import { useBox } from "@react-three/cannon"

import { Edges } from "@react-three/drei"
import { useEffect, useRef } from "react"
import { Mesh, Vector3 } from "three"
import { BodyRefType, useEnvironment } from "../store/environment"

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
				state.bodyTypes[ref.current!.uuid] = BodyRefType.Platform
				state.meshUUIDsToBodies[ref.current!.uuid] = position
					.toArray()
					.join(",")
			})
		}
	}, [position, ref])

	return (
		<mesh ref={ref} receiveShadow>
			<boxGeometry args={size.toArray()} />
			<meshBasicMaterial color="white" />

			<Edges scale={1} threshold={15} color="black" />
		</mesh>
	)
}

export default Platform
