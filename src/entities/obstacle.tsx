import { useConvexPolyhedron } from "@react-three/cannon"
import { Dodecahedron } from "@react-three/drei"
import { useEffect, useMemo, useRef } from "react"
import { DodecahedronGeometry, Mesh, Vector3 } from "three"
import { BodyRefType, useEnvironment } from "../store/environment"
import { toConvexProps } from "./antAgent"

const Obstacle = ({ position }: { position: Vector3 }) => {
	const args = useMemo(() => {
		const geometry = new DodecahedronGeometry()
		// const geometry = new SphereGeometry(0.5, 32, 16)
		// geometry.scale(1, 0.35, 0.8)
		return toConvexProps(geometry)
	}, [])

	const [ref] = useConvexPolyhedron(
		() => ({
			args,
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
				state.bodyTypes[ref.current!.uuid] = BodyRefType.Obstacle
				state.meshUUIDsToBodies[ref.current!.uuid] = position
					.toArray()
					.join(",")
			})
		}
	}, [position, ref])

	return (
		<>
			<Dodecahedron position={[-5, 2.5, 0]} ref={ref} castShadow>
				<meshStandardMaterial color="hotpink" />
			</Dodecahedron>
		</>
	)
}

export default Obstacle
