import { useContactMaterial, usePlane } from "@react-three/cannon"
import { useRef } from "react"
import { Mesh } from "three"

const Floor = () => {
	const [ref] = usePlane(
		() => ({
			mass: 0,
			position: [0, -10, 0],
			rotation: [-Math.PI / 2, 0, 0],
			material: "floor",
		}),
		useRef<Mesh>(null),
	)

	useContactMaterial("floor", "ant", {
		friction: 1,
		restitution: 0.3,
		contactEquationStiffness: 1e8,
		contactEquationRelaxation: 3,
	})

	useContactMaterial("ant", "ant", {
		friction: 0.5,
	})

	return (
		<mesh ref={ref} castShadow receiveShadow>
			<planeGeometry args={[100, 100]} />
			<meshStandardMaterial color={"#dddddd"} />
		</mesh>
	)
}

export default Floor
