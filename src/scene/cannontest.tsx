import { Environment, OrbitControls } from "@react-three/drei"
import {
	Debug,
	Physics,
	useSphere,
	usePlane,
	useTrimesh,
	useContactMaterial,
} from "@react-three/cannon"
import { useFrame } from "@react-three/fiber"

import { useRef, useMemo } from "react"
import { TorusGeometry } from "three"

const numBalls = 100

function Plane() {
	const [ref] = usePlane(() => ({
		material: "ground",
		rotation: [-Math.PI / 2, 0, 0],
	}))

	return (
		// @ts-ignore
		<mesh ref={ref} receiveShadow>
			<planeGeometry args={[25, 25]} />
			<meshStandardMaterial />
		</mesh>
	)
}

function TorusKnot() {
	const geometry = useMemo(() => new TorusGeometry(0.75, 1, 0.75, 1), [])
	const [ref] = useTrimesh(() => ({
		args: [geometry.attributes.position.array, geometry.index!.array],
		material: "ring",
		position: [0, 1, 0],
		rotation: [-Math.PI / 2, 0, 0],
	}))

	return (
		// @ts-ignore
		<mesh ref={ref} castShadow>
			<torusGeometry />
			<meshStandardMaterial />
		</mesh>
	)
}

function InstancedSpheres() {
	const count = useRef(0)
	const lastTime = useRef(0)

	const [ref, { at }] = useSphere(() => ({
		args: [0.25],
		mass: 1,
		position: [
			Math.random() - 0.5 * 2,
			Math.random() - 1000,
			Math.random() - 0.5 * 2,
		],
		material: "bouncy",
	}))

	useFrame(({ clock }) => {
		const time = clock.getElapsedTime()
		if (time - lastTime.current > 0.25) {
			const id = (count.current += 1) % numBalls
			at(id).velocity.set(0, 0, 0)
			at(id).angularVelocity.set(0, 0, 0)
			at(id).position.set(
				Math.random() - 0.5 * 2,
				Math.random() * 2 + 5,
				Math.random() - 0.5 * 2,
			)
			lastTime.current = time
		}
	})

	return (
		<instancedMesh
			// @ts-ignore
			ref={ref}
			args={[undefined, undefined, numBalls]}
			castShadow
			frustumCulled={false}
		>
			<sphereGeometry args={[0.25]} />
			<meshStandardMaterial />
		</instancedMesh>
	)
}

function ContactMaterials() {
	useContactMaterial("ground", "bouncy", {
		restitution: 0.5,
	})
	useContactMaterial("ring", "bouncy", {
		restitution: 0.45,
	})

	return null
}

const DefaultScene = () => {
	return (
		<>
			<Environment preset="sunset" background />

			<Physics>
				<ContactMaterials />
				<Debug color={0x004400}>
					<Plane />
					<TorusKnot />
				</Debug>
				<InstancedSpheres />
			</Physics>
			<OrbitControls />
		</>
	)
}

export default DefaultScene
