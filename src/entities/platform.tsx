import { useBox } from "@react-three/cannon"

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
		<mesh ref={ref} receiveShadow castShadow>
			<boxGeometry args={size.toArray()} />
			{/* <meshStandardMaterial color="white" roughness={0.1} /> */}
			<meshBasicMaterial color="black" wireframeLinewidth={30} wireframe />
			{/* <meshNormalMaterial /> */}
		</mesh>
	)
}

export default Platform
