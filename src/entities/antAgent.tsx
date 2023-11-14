import { useSphere, useSpring } from "@react-three/cannon"
import { Box } from "@react-three/drei"
import { MutableRefObject, useEffect, useRef, useState } from "react"
import { Mesh, Vector3 } from "three"
import { AntAgent, useEnvironment } from "../store/environment"
import { AnimatedAnt } from "./animatedAnt"

const Ant_Radius = 0.5

const AntAgentEntity = ({
	position,
	id,
	// connectionCollision,
	attachPoint,
	attachMeshUUID,
	intersections,
}: {
	position: Vector3
	id: string
	// connectionCollision: CollideEvent | undefined
	attachPoint: Vector3 | undefined
	attachMeshUUID: string | undefined
	intersections: Vector3[]
}) => {
	const [ref, body] = useSphere(
		() => ({
			args: [Ant_Radius],
			mass: 3,
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
					;(state.agentSystems[0].agents[id] as AntAgent).addCollision()
				})
			},
			onCollideEnd(e) {
				useEnvironment.setState((state) => {
					;(state.agentSystems[0].agents[id] as AntAgent).removeCollision()
				})
			},
		}),
		useRef<Mesh>(null),
	)

	useEffect(() => {
		useEnvironment.setState((state) => {
			;(state.agentSystems[0].agents[id] as AntAgent).physicsBody = body
			;(state.agentSystems[0].agents[id] as AntAgent).meshUUID =
				ref.current!.uuid
		})
	}, [id, body])

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
				<sphereGeometry args={[Ant_Radius, 36, 36]} />
				<meshPhysicalMaterial
					color={"Yellow"}
					roughness={0.8}
					clearcoat={1}
					clearcoatRoughness={0.35}
				/>

				<AnimatedAnt />
			</mesh>

			{attachPoint && (
				<Box args={[0.1, 0.1, 1]} position={anchor.current}>
					<meshStandardMaterial color="hotpink" />
				</Box>
			)}

			{/* {intersections.map((intersection) => (
				<Box args={[0.1, 0.1, 0.1]} position={intersection}>
					<meshStandardMaterial color="hotpink" />
				</Box>
			))} */}
		</>
	)
}

export default AntAgentEntity
