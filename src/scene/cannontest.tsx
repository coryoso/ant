import {
	Physics,
	useBox,
	useHingeConstraint,
	useLockConstraint,
	usePlane,
	useSphere,
} from "@react-three/cannon"
import { OrbitControls } from "@react-three/drei"
import { ThreeElements } from "@react-three/fiber"
import { Perf } from "r3f-perf"

const rad = 0.5
const boxL = 3
function Ground(props: any) {
	// @ts-ignore
	const [ref] = usePlane(() => ({
		mass: 0,
		rotation: [-Math.PI / 2, 0, 0],
		...props,
	}))
	return (
		// @ts-ignore
		<mesh ref={ref} castShadow receiveShadow>
			<planeGeometry args={[100, 100]} />
			<meshStandardMaterial color={"#dddddd"} />
		</mesh>
	)
}

function Boxes(props: any) {
	const [bb1] = useBox(() => ({
		args: [1, 1, boxL],
		position: [0, boxL, 0],
		mass: 0,
		...props,
	}))

	const [bb2] = useBox(() => ({
		args: [1, 1, boxL],
		position: [0, boxL, boxL + 0.1],
		mass: 1,
		...props,
	}))

	useHingeConstraint(bb1, bb2, {
		pivotA: [0, 0, boxL / 2],
		pivotB: [boxL / 2, 0, 0],
		collideConnected: true,
	})

	return (
		<>
			{/* @ts-ignore */}
			<mesh ref={bb1}>
				<boxGeometry args={[1, 1, boxL]} />
				<meshNormalMaterial />
			</mesh>

			{/* @ts-ignore */}

			<mesh ref={bb2}>
				<boxGeometry args={[1, 1, boxL]} />
				<meshNormalMaterial />
			</mesh>
		</>
	)
}

function Balls(props: ThreeElements["mesh"]) {
	const [b1] = useSphere(() => ({
		args: [rad],
		mass: 0,
		position: [0, 10, 0],
	}))

	const [b2, api2] = useSphere(() => ({
		args: [rad],
		mass: 1,
		position: [0, 10, -1],
	}))

	const [b3, api3] = useSphere(() => ({
		args: [rad],
		mass: 1,
		position: [0, 10, -2],
	}))

	const [b4, api4] = useSphere(() => ({
		args: [rad],
		mass: 1,
		position: [0, 10, -3],
	}))

	const [b5, api5] = useSphere(() => ({
		args: [rad],
		mass: 1,
		position: [0, 10, -4],
	}))

	const [b6, api6] = useSphere(() => ({
		args: [rad],
		mass: 1,
		position: [0, 10, -5],
	}))

	useLockConstraint(b1, b2, {
		maxForce: 100,
	})

	useLockConstraint(b2, b3, {})
	useLockConstraint(b3, b4, {})
	useLockConstraint(b4, b5, {})
	useLockConstraint(b5, b6, {})
	return (
		<group>
			<group>
				{/* @ts-ignore */}
				<mesh ref={b1}>
					<sphereGeometry args={[rad, 36, 36]} />
					<meshPhysicalMaterial
						color={"Yellow"}
						roughness={0.8}
						clearcoat={1}
						clearcoatRoughness={0.35}
					/>
				</mesh>
			</group>

			<group
				onClick={() => {
					api2.applyImpulse([3, 3, 3], [0, 0, 0])
				}}
			>
				{/* @ts-ignore */}

				<mesh ref={b2}>
					<sphereGeometry args={[rad, 36, 36]} />
					<meshPhysicalMaterial
						color={"Yellow"}
						roughness={0.8}
						clearcoat={1}
						clearcoatRoughness={0.35}
					/>
				</mesh>
			</group>

			<group
				onClick={() => {
					api3.applyImpulse([3, 3, 3], [0, 0, 0])
				}}
			>
				{/* @ts-ignore */}

				<mesh ref={b3}>
					<sphereGeometry args={[rad, 36, 36]} />
					<meshPhysicalMaterial
						color={"Yellow"}
						roughness={0.8}
						clearcoat={1}
						clearcoatRoughness={0.35}
					/>
				</mesh>
			</group>
			<group
				onClick={() => {
					api4.applyImpulse([3, 3, 3], [0, 0, 0])
				}}
			>
				{/* @ts-ignore */}

				<mesh ref={b4}>
					<sphereGeometry args={[rad, 36, 36]} />
					<meshPhysicalMaterial
						color={"Yellow"}
						roughness={0.8}
						clearcoat={1}
						clearcoatRoughness={0.35}
					/>
				</mesh>
			</group>
			<group
				onClick={() => {
					api5.applyImpulse([3, 3, 3], [0, 0, 0])
				}}
			>
				{/* @ts-ignore */}

				<mesh ref={b5}>
					<sphereGeometry args={[rad, 36, 36]} />
					<meshPhysicalMaterial
						color={"Yellow"}
						roughness={0.8}
						clearcoat={1}
						clearcoatRoughness={0.35}
					/>
				</mesh>
			</group>
			<group
				onClick={() => {
					api6.applyImpulse([3, 3, 3], [0, 0, 0])
				}}
			>
				{/* @ts-ignore */}

				<mesh ref={b6}>
					<sphereGeometry args={[rad, 36, 36]} />
					<meshPhysicalMaterial
						color={"Yellow"}
						roughness={0.8}
						clearcoat={1}
						clearcoatRoughness={0.35}
					/>
				</mesh>
			</group>
		</group>
	)
}

const DefaultScene = () => {
	return (
		<>
			<pointLight position={[0, 20, 0]} color={"Yellow"} intensity={1000} />
			<spotLight
				position={[-2.5, 5, 5]}
				angle={Math.PI / 4}
				penumbra={0.5}
				castShadow
			/>
			<Physics>
				<Boxes />

				<Ground />
			</Physics>
			<Perf position="top-right" style={{ margin: 10 }} />
			<OrbitControls />
		</>
	)
}

export default DefaultScene
