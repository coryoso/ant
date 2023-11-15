import { useBox } from "@react-three/cannon"
import { Edges } from "@react-three/drei"
import { useEffect, useRef } from "react"
import { Mesh, Vector3 } from "three"
import { BodyRefType, useEnvironment } from "../store/environment"

const Obstacle = ({ position }: { position: Vector3 }) => {
	// const args = useMemo(() => {
	// 	const geometry = new DodecahedronGeometry()
	// 	return toConvexProps(geometry)
	// }, [])

	// const [ref] = useConvexPolyhedron(
	// 	() => ({
	// 		args,
	// 		position: position.toArray(),
	// 		mass: 0,
	// 		material: "floor",
	// 	}),
	// 	useRef<Mesh>(null),
	// )

	const [ref] = useBox(
		() => ({
			args: [1, 1, 1],
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
		<mesh ref={ref} receiveShadow>
			<boxGeometry args={[1, 1, 1]} />
			<meshBasicMaterial color="hotpink" />

			<Edges scale={1} threshold={15} color="red" />
		</mesh>
		// <mesh ref={ref}>
		// 	<Dodecahedron castShadow>
		// 		<meshStandardMaterial color="hotpink" />
		// 	</Dodecahedron>
		// </mesh>
	)
}

export default Obstacle
