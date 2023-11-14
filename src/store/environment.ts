import { CollideEvent, PublicApi } from "@react-three/cannon"
import { MutableRefObject } from "react"
import {
	Intersection,
	MathUtils,
	Mesh,
	Object3D,
	Object3DEventMap,
	Raycaster,
	Vector3,
} from "three"
import { v4 } from "uuid"
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { Agent, Behaviour } from "../types/abxmts"

export enum BodyRefType {
	Ant,
	Platform,
	Obstacle,
}

export class MoveBehaviour extends Behaviour {
	static behaviourName() {
		return "MoveBehaviour"
	}

	private paused = false

	preExecute() {}

	execute(agent: Agent, agentSystem: AgentSystem) {
		const antAgent = agent as AntAgent

		if (antAgent.attachMeshUUIDs.length > 0 && antAgent.physicsBody) {
			//antAgent.physicsBody.angularDamping.set(0.8)
			// antAgent.physicsBody.linearDamping.set(0.8)

			this.paused = true
		}

		if (antAgent.physicsBody && !this.paused) {
			antAgent.physicsBody.angularDamping.set(0.6)
			// antAgent.physicsBody.angularFactor.set(0, 0, 0)

			antAgent.physicsBody.applyImpulse([0.3, 0, 0], [0, 0, 0])
			//antAgent.physicsBody.applyTorque([0, 0, -0.5])
		}
	}

	postExecute() {}
}

export class HingeBehaviour extends Behaviour {
	static behaviourName() {
		return "HingeBehaviour"
	}

	raycasting = false
	didHinge = false
	hingable = true

	preExecute() {}

	execute(agent: Agent, agentSystem: AgentSystem) {
		if (!this.hingable) {
			return
		}

		const antAgent = agent as AntAgent

		const bodyRefs = useEnvironment.getState().bodyRefs
		const allObjects = Object.values(bodyRefs)
			.map((v) => v.current)
			.filter((v) => v !== null) as Mesh[]
		// console.log(antAgent.lastCollision?.contact.contactPoint)

		// if (antAgent.velocity.y < -0.5 && antAgent.needsConnection) {
		// 	antAgent.connectionCollision = antAgent.lastCollision
		// }
		//console.log(antAgent.prevVelocity)
		//console.log(antAgent.velocity)

		if (antAgent.prevVelocity.y - antAgent.velocity.y > 1.3) {
			const bodyTypes = useEnvironment.getState().bodyTypes

			if (antAgent.velocity.y < -0.75 && !this.raycasting) {
				this.didHinge = true
				// if (antAgent.connectionCount === 0 && !this.raycasting) {
				console.log("Attach agent ", agent.id)
				// raycast
				this.raycasting = true

				let intersections: Intersection<Object3D<Object3DEventMap>>[] = []

				const raycaster = new Raycaster()

				for (let polarAngle = 0; polarAngle <= 360; polarAngle += 5) {
					const phi = MathUtils.degToRad(polarAngle)

					// Calculate the direction of the ray based on polar coordinates
					const rayDirection = new Vector3(
						Math.sin(phi),
						Math.cos(phi),
						0,
					).normalize()

					raycaster.set(antAgent.position, rayDirection)

					// Perform the raycasting
					const intersection = raycaster.intersectObjects(allObjects)
					intersection.forEach((intersection) => {
						intersections.push(intersection)
					})
				}

				const possibleObjects = Object.keys(bodyRefs)
				const sortedIntersections = intersections
					.filter((intersection) => intersection.distance < 1.2)
					.sort((a, b) => {
						const bodyTypeA = bodyTypes[a.object.uuid]
						const bodyTypeB = bodyTypes[b.object.uuid]

						if (bodyTypeA === bodyTypeB) {
							return a.distance - b.distance
						} else {
							if (
								bodyTypeA === BodyRefType.Platform ||
								bodyTypeA === BodyRefType.Obstacle
							) {
								return -1
							} else {
								return 1
							}
						}
					})
					.filter(
						(intersection) =>
							intersection.object.uuid !== antAgent.meshUUID &&
							possibleObjects.includes(intersection.object.uuid),
					)
				const uniqueUUIds = new Set(
					sortedIntersections.map((v) => v.object.uuid),
				)
				const uniqueIntersections = Array.from(uniqueUUIds).map((uuid) => {
					return sortedIntersections.filter((v) => v.object.uuid === uuid)[0]
				})

				if (uniqueIntersections.length > 0) {
					antAgent.attachPoints = uniqueIntersections
						.map((v) => v.point)
						.slice(0, 2)
					antAgent.attachMeshUUIDs = uniqueIntersections
						.map((v) => v.object.uuid)
						.slice(0, 2)
				}
			}
		}
	}

	postExecute() {}
}

export class GoalBehavior extends Behaviour {
	static behaviourName() {
		return "GoalBehavior"
	}

	didReachGoal = false

	preExecute() {}

	execute(agent: Agent, agentSystem: AgentSystem) {
		const antAgent = agent as AntAgent
		const goal = new Vector3(8, 0, 0)

		if (antAgent.position.distanceTo(goal) < 1) {
			antAgent.physicsBody?.angularDamping.set(1)
			antAgent.physicsBody?.linearDamping.set(1)

			this.didReachGoal = true
		}
	}

	postExecute() {}
}

export class AntAgent implements Agent {
	private _id: string
	private startPosition: Vector3
	position: Vector3
	private _physicsBody: PublicApi | undefined = undefined
	private _behaviours: Record<string, Behaviour>

	prevVelocity: Vector3 = new Vector3()
	velocity: Vector3 = new Vector3()

	lastCollision: CollideEvent | undefined = undefined
	// connectionUUID: string | undefined = undefined
	connectionCollision: CollideEvent | undefined = undefined
	connectionCount: number | undefined = undefined

	attachPoints: Vector3[] = []
	attachMeshUUIDs: string[] = []

	intersections: Vector3[] = []

	meshUUID: string | undefined = undefined

	constructor(position: Vector3 = new Vector3(), behaviours: Behaviour[] = []) {
		this._id = v4()

		this.startPosition = position
		this.position = position.clone()
		this._behaviours = behaviours.reduce(
			(acc, behaviour) => {
				acc[behaviour.constructor.name] = behaviour
				return acc
			},
			{} as Record<string, Behaviour>,
		)
	}

	reset() {
		this.position.copy(this.startPosition)
	}

	preExecute() {}

	execute(agentSystem: AgentSystem) {
		Object.values(this._behaviours).forEach((behaviour) =>
			behaviour.execute(this, agentSystem),
		)

		if (this.prevVelocity.distanceToSquared(this.velocity)) {
		}
	}

	postExecute() {}

	get id() {
		return this._id
	}

	get behaviours() {
		return this._behaviours
	}

	set physicsBody(body: PublicApi | undefined) {
		if (this._physicsBody !== body) {
			this._physicsBody = body

			this.prevVelocity = this.velocity

			body?.position.subscribe((position) => {
				this.position = new Vector3(...position)
			})

			body?.velocity.subscribe((velocity) => {
				this.velocity = new Vector3(...velocity)
			})
		}
	}

	get physicsBody(): PublicApi | undefined {
		return this._physicsBody
	}

	addCollision() {
		if (this.connectionCount !== undefined) {
			this.connectionCount += 1
		} else {
			this.connectionCount = 1
		}
	}

	removeCollision() {
		if (this.connectionCount !== undefined) {
			this.connectionCount -= 1
		} else {
			this.connectionCount = 0
		}
	}
}

export class AgentSystem {
	agents: Record<string, Agent>

	didTouchGoal = false
	didHingeBothSides = false

	constructor(agents: Agent[] = []) {
		this.agents = agents.reduce(
			(acc, agent) => {
				acc[agent.id] = agent
				return acc
			},
			{} as Record<string, Agent>,
		)
	}

	spawnAgent() {
		if (!this.didTouchGoal) {
			const behaviours: Behaviour[] = [new MoveBehaviour(), new GoalBehavior()]
			if (!this.didHingeBothSides) {
				behaviours.push(new HingeBehaviour())
			}

			console.log(behaviours)

			const agent = new AntAgent(new Vector3(-13, 1, 0), behaviours)
			//console.log("Adding agent ", agent.id)
			this.agents[agent.id] = agent
		}
	}

	reset() {
		Object.values(this.agents).forEach((agent) => agent.reset())
	}

	preExectue() {}

	execute() {
		Object.values(this.agents).forEach((agent) => agent.execute(this))
	}

	postExecute() {
		if (!this.didHingeBothSides) {
			const bodyTypes = Array.from(
				new Set(
					Object.values(this.agents)
						.map((agent) => (agent as AntAgent).attachMeshUUIDs)
						.flatMap((v) => v),
				),
			).map((uuid) => useEnvironment.getState().bodyTypes[uuid])
			const platformTypeCount = bodyTypes.filter(
				(v) => v === BodyRefType.Platform,
			).length

			if (platformTypeCount === 2) {
				this.didHingeBothSides = true

				Object.values(this.agents).forEach((agent) => {
					;(
						(agent as AntAgent).behaviours[
							HingeBehaviour.behaviourName()
						] as HingeBehaviour
					).hingable = false
				})
			}
		}

		// ((agent as AntAgent).behaviours[GoalBehavior.behaviourName()] as GoalBehavior).didReachGoal
		if (!this.didTouchGoal) {
			this.didTouchGoal = Object.values(this.agents).reduce((acc, agent) => {
				return (
					acc ||
					(
						(agent as AntAgent).behaviours[
							GoalBehavior.behaviourName()
						] as GoalBehavior
					).didReachGoal
				)
			}, false)
		}
	}
}

enum EnvironmentState {
	Idle,
	Running,
	Converged,
}

interface Environment {
	agentSystems: AgentSystem[]
	bodyRefs: Record<string, MutableRefObject<Mesh | null>>
	bodyTypes: Record<string, BodyRefType>
	meshUUIDsToBodies: Record<string, string>

	state: EnvironmentState

	execute: () => void
	spawnAgent: () => void
}

export const useEnvironment = create(
	immer<Environment>((set) => ({
		agentSystems: [new AgentSystem([])],
		bodyRefs: {},
		bodyTypes: {},
		meshUUIDsToBodies: {},

		state: EnvironmentState.Idle,

		execute: () => {
			set((state) => {
				if (state.state === EnvironmentState.Running) {
					return
				}

				state.state = EnvironmentState.Running

				state.agentSystems.forEach((agentSystem) => agentSystem.execute())
				state.agentSystems.forEach((agentSystem) => agentSystem.postExecute())

				state.state = EnvironmentState.Idle
			})
		},
		spawnAgent: () => {
			set((state) => {
				state.agentSystems[0].spawnAgent()
			})
		},
	})),
)
