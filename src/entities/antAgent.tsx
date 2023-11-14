import {
	ConvexPolyhedronProps,
	useConvexPolyhedron,
	useSpring,
} from "@react-three/cannon"
import { Box } from "@react-three/drei"
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react"
import { BufferGeometry, Mesh, SphereGeometry, Vector3 } from "three"
import { Geometry } from "three-stdlib"
import { AntAgent, useEnvironment } from "../store/environment"
import { AnimatedAnt } from "./animatedAnt"

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
	prevVelocity,
	position,
	id,
	// connectionCollision,
	attachPoint,
	attachMeshUUID,
	intersections,
}: {
	prevVelocity: Vector3
	position: Vector3
	id: string
	// connectionCollision: CollideEvent | undefined
	attachPoint: Vector3 | undefined
	attachMeshUUID: string | undefined
	intersections: Vector3[]
}) => {
	const args = useMemo(() => {
		const geometry = new SphereGeometry(0.5, 32, 16)
		geometry.scale(1, 0.35, 0.8)
		return toConvexProps(geometry)
	}, [])

	// const [ref] = useConvexPolyhedron(() => ({ args, mass: 100, position, rotation }), useRef<Mesh>(null))

	const [ref, body] = useConvexPolyhedron(
		() => ({
			args, //: [Ant_Radius],

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
				state.bodyRefs[ref.current!.uuid] = ref
			})
		}
	}, [position, ref])

	const [connectionRef, setConnectionRef] =
		useState<MutableRefObject<Mesh | null> | null>(null)
	const anchor = useRef<Vector3 | undefined>(undefined)

	useEffect(() => {
		if (attachMeshUUID && attachPoint) {
			const ref = useEnvironment.getState().bodyRefs[attachMeshUUID]
			setConnectionRef(ref)

			anchor.current = attachPoint
			// anchor.current = new Vector3(...connectionCollision.contact.bj.)
		}
	}, [attachPoint, attachMeshUUID])
	// let ref = useRef()
	// useEffect(() => {
	// 	if (shouldConnect&&lastCollide) {
	// 		ref = useEnvironment.getState().bodyRefs[lastCollide.body.name]
	// 	}
	// })

	useSpring(
		ref,
		connectionRef,
		{
			worldAnchorB: attachPoint ? attachPoint!.toArray() : undefined,
			// worldAnchorB: attachPoint?  : undefined,
			// worldAnchorA: connectionCollision
			// 	? connectionCollision.contact.bi.position.toArray()
			// 	: undefined,
			// worldAnchorB: connectionCollision
			// 	? connectionCollision.contact.bi.position.toArray()
			// 	: undefined,
			damping: 1,
			stiffness: 150,
			restLength: 0.05,
		},
		[connectionRef],
	)

	//useLockConstraint(ref, connectionRef, { maxForce: 1e6 }, [connectionRef])

	// useHingeConstraint(
	// 	ref,
	// 	connectionRef,
	// 	{
	// 		pivotB: attachPoint ? attachPoint!.toArray() : undefined,
	// 		axisA: [0, 0, 1],
	// 		axisB: [0, 0, 1],
	// 	},
	// 	[connectionRef],
	// )
	// useLockConstraint(ref, connectionRef, { maxForce: 1 }, [connectionRef])

	return (
		<>
			<mesh ref={ref} castShadow>
				<AnimatedAnt position={[-0.1, -0.1, 0]} />
			</mesh>

			{attachPoint && (
				<Box args={[0.1, 0.1, 1]} position={anchor.current}>
					<meshStandardMaterial color="hotpink" />
				</Box>
			)}
		</>
	)
}

export default AntAgentEntity
