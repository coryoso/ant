import {
	ConvexPolyhedronProps,
	useSphere,
	useSpring,
} from "@react-three/cannon"
import { Line } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { MutableRefObject, useEffect, useRef, useState } from "react"
import { BufferGeometry, DoubleSide, Mesh, Vector3 } from "three"
import { Geometry, Line2 } from "three-stdlib"
import { useAnimationStore } from "../store/animation"
import { AntAgent, BodyRefType, useEnvironment } from "../store/environment"
import { AnimatedAnt } from "./animatedAnt"

const Ant_Radius = 0.5

function toConvexProps(
	bufferGeometry: BufferGeometry,
): ConvexPolyhedronProps["args"] {
	const geo = new Geometry().fromBufferGeometry(bufferGeometry)
	// Merge duplicate vertices resulting from glTF export.
	// Cannon assumes contiguous, closed meshes to work
	geo.mergeVertices()
	return [
		geo.vertices.map((v) => [v.x, v.y, v.z]),
		geo.faces.map((f) => [f.a, f.b, f.c]),
		[],
	]
}

const AntAgentEntity = ({
	position,
	id,
	attachPoints,
	attachMeshUUIDs,
}: {
	position: Vector3
	id: string
	attachPoints: Vector3[]
	attachMeshUUIDs: string[]
}) => {
	const lineARef = useRef<Line2>(null)
	const lineBRef = useRef<Line2>(null)
	// const args = useMemo(() => {
	// 	const geometry = new SphereGeometry(0.5, 32, 16)
	// 	// const geometry = new SphereGeometry(0.5, 32, 16)
	// 	// geometry.scale(1, 0.35, 0.8)
	// 	return toConvexProps(geometry)
	// }, [])

	// const [ref] = useConvexPolyhedron(() => ({ args, mass: 100, position, rotation }), useRef<Mesh>(null))

	const [ref, body] = useSphere(
		() => ({
			args: [0.5],
			// args, //: [Ant_Radius],

			mass: 1,
			position: position.toArray(),
			material: "ant",
			linearDamping: 0.999,
			// linearDamping: 0.99999,
			// onCollide: (e) => {
			// 	console.log("COLLIDING")
			// 	useEnvironment.setState((state) => {
			// 		;(state.agentSystems[0].agents[id] as AntAgent).lastCollision = e
			// 	})
			// },
			onCollideBegin(e) {
				useEnvironment.setState((state) => {
					if (state.agentSystems[0].agents[id] as AntAgent) {
						;(state.agentSystems[0].agents[id] as AntAgent).addCollision()
					}
				})
			},
			onCollideEnd(e) {
				useEnvironment.setState((state) => {
					if (state.agentSystems[0].agents[id] as AntAgent) {
						;(state.agentSystems[0].agents[id] as AntAgent).removeCollision()
					}
				})
			},
		}),
		useRef<Mesh>(null),
	)

	useEffect(() => {
		useEnvironment.setState((state) => {
			if (state.agentSystems[0].agents[id] as AntAgent) {
				;(state.agentSystems[0].agents[id] as AntAgent).physicsBody = body
				;(state.agentSystems[0].agents[id] as AntAgent).meshUUID =
					ref.current!.uuid
			}
		})
	}, [id, body, ref])

	// TODO: remove
	useEffect(() => {
		if (ref.current) {
			useEnvironment.setState((state) => {
				state.bodyTypes[ref.current!.uuid] = BodyRefType.Ant
				state.bodyRefs[ref.current!.uuid] = ref
				state.meshUUIDsToBodies[ref.current!.uuid] = id
			})
		}
	}, [position, ref, id])

	const [connectionRefA, setConnectionRefA] =
		useState<MutableRefObject<Mesh | null> | null>(null)
	const [connectionRefB, setConnectionRefB] =
		useState<MutableRefObject<Mesh | null> | null>(null)
	const anchor = useRef<Vector3 | undefined>(undefined)

	useEffect(() => {
		if (attachMeshUUIDs.length > 0 && attachPoints.length > 0) {
			const ref = useEnvironment.getState().bodyRefs[attachMeshUUIDs[0]]
			setConnectionRefA(ref)

			if (attachMeshUUIDs.length > 1) {
				const ref = useEnvironment.getState().bodyRefs[attachMeshUUIDs[1]]
				setConnectionRefB(ref)
			}

			// anchor.current = attachPoint
			// anchor.current = new Vector3(...connectionCollision.contact.bj.)
		}
	}, [attachPoints, attachMeshUUIDs])
	// let ref = useRef()
	// useEffect(() => {
	// 	if (shouldConnect&&lastCollide) {
	// 		ref = useEnvironment.getState().bodyRefs[lastCollide.body.name]
	// 	}
	// })

	useSpring(
		ref,
		connectionRefA,
		{
			worldAnchorB:
				attachPoints.length > 0 ? attachPoints[0]!.toArray() : undefined,
			damping: 1,
			stiffness: 150,
			restLength: 0.05,
		},
		[connectionRefA],
	)

	useSpring(
		ref,
		connectionRefB,
		{
			worldAnchorB:
				attachPoints.length > 1 ? attachPoints[1]!.toArray() : undefined,
			damping: 1,
			stiffness: 150,
			restLength: 0.05,
		},
		[connectionRefB],
	)

	const { mixer } = useAnimationStore((state) => state)

	useFrame((_, delta) => {
		if (mixer) {
			mixer.update(delta)
		}

		// const agents = useEnvironment.getState().agentSystems[0].agents as Record<
		// 	string,
		// 	AntAgent
		// >
		// const meshUUIDsToBodies = useEnvironment.getState().meshUUIDsToBodies

		// if (lineARef.current) {
		// 	const id = meshUUIDsToBodies[attachMeshUUIDs[0]]
		// 	let positionB: Vector3 | undefined = undefined
		// 	if (id.includes(",")) {
		// 		positionB = new Vector3(...id.split(",").map((v) => parseFloat(v)))
		// 	} else {
		// 		positionB = agents[meshUUIDsToBodies[attachMeshUUIDs[0]]].position
		// 	}
		// 	if (positionB) {
		// 		lineARef.current.geometry.setPositions(
		// 			[position.toArray(), positionB.toArray()].flatMap((v) => v),
		// 		)
		// 	}
		// }

		// if (lineBRef.current) {
		// 	const id = meshUUIDsToBodies[attachMeshUUIDs[1]]
		// 	let positionB: Vector3 | undefined = undefined
		// 	if (id.includes(",")) {
		// 		positionB = new Vector3(...id.split(",").map((v) => parseFloat(v)))
		// 	} else {
		// 		positionB = agents[meshUUIDsToBodies[attachMeshUUIDs[0]]].position
		// 	}
		// 	if (positionB) {
		// 		lineBRef.current.geometry.setPositions(
		// 			[position.toArray(), positionB.toArray()].flatMap((v) => v),
		// 		)
		// 	}
		// }
	})

	return (
		<>
			<mesh ref={ref} castShadow>
				<sphereGeometry args={[0.5, 32, 16]} />
				<meshPhysicalMaterial
					color={0xffffff}
					transmission={1}
					side={DoubleSide}
					opacity={1}
					metalness={0}
					roughness={0}
					thickness={0.2}
					transparent
				/>

				{/* <MeshTransmissionMaterial
					backside
					samples={4}
					thickness={0.2}
					distortionScale={0}
					temporalDistortion={0}
				/> */}

				<AnimatedAnt position={[-0.05, -0.05, 0]} scale={6} />
			</mesh>

			{attachPoints.length > 0 && attachPoints[0] && (
				<Line
					points={[position, attachPoints[0].toArray()]}
					color="black"
					lineWidth={1}
					segments
					dashed={false}
					ref={lineARef}
				/>
			)}
			{attachPoints.length > 1 && attachPoints[1] && (
				<Line
					points={[position, attachPoints[1].toArray()]}
					color="black"
					lineWidth={1}
					segments
					dashed={false}
					ref={lineBRef}
				/>
			)}
		</>
	)
}

export default AntAgentEntity
