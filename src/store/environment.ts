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

export class MoveBehaviour extends Behaviour {
	static behaviourName() {
		return "MoveBehaviour"
	}

	private paused = false

	preExecute() {}

	execute(agent: Agent, agentSystem: AgentSystem) {
		const antAgent = agent as AntAgent

		if (antAgent.attachMeshUUID && antAgent.physicsBody) {
			antAgent.physicsBody.angularDamping.set(0.8)
			// antAgent.physicsBody.linearDamping.set(0.8)

			this.paused = true
		}

		if (antAgent.physicsBody && !this.paused) {
			// antAgent.physicsBody.angularDamping.set(0.6)
			// antAgent.physicsBody.angularFactor.set(0, 0, 0)

			antAgent.physicsBody.applyImpulse([0.8, 0, 0], [0, 0, 0])
			antAgent.physicsBody.applyTorque([0, 0, -0.5])
		}
	}

	postExecute() {}
}

export class HingeBehaviour extends Behaviour {
	static behaviourName() {
		return "HingeBehaviour"
	}

	raycasting = false

	preExecute() {}

	execute(agent: Agent, agentSystem: AgentSystem) {
		const antAgent = agent as AntAgent

		const allObjects = Object.values(useEnvironment.getState().bodyRefs)
			.map((v) => v.current)
			.filter((v) => v !== null) as Mesh[]
		// console.log(antAgent.lastCollision?.contact.contactPoint)

		// if (antAgent.velocity.y < -0.5 && antAgent.needsConnection) {
		// 	antAgent.connectionCollision = antAgent.lastCollision
		// }

		if (antAgent.velocity.y < -0.5 && !this.raycasting) {
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

			const possibleObjects = Object.keys(useEnvironment.getState().bodyRefs)
			const sortedIntersections = intersections
				.sort((a, b) => {
					return a.distance - b.distance
				})
				.filter(
					(intersection) =>
						intersection.object.uuid !== antAgent.meshUUID &&
						possibleObjects.includes(intersection.object.uuid),
				)

			antAgent.intersections = intersections.map(
				(intersections) => intersections.point,
			)

			if (sortedIntersections.length > 0) {
				antAgent.attachPoint = sortedIntersections[0].point
				antAgent.attachMeshUUID = sortedIntersections[0].object.uuid
			}
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

	velocity: Vector3 = new Vector3()

	lastCollision: CollideEvent | undefined = undefined
	// connectionUUID: string | undefined = undefined
	connectionCollision: CollideEvent | undefined = undefined
	connectionCount: number | undefined = undefined

	attachPoint: Vector3 | undefined = undefined
	attachMeshUUID: string | undefined = undefined

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

	constructor(agents: Agent[] = []) {
		this.agents = agents.reduce(
			(acc, agent) => {
				acc[agent.id] = agent
				return acc
			},
			{} as Record<string, Agent>,
		)
	}

	addAgent(agent: Agent) {
		this.agents[agent.id] = agent
	}

	removeAgent(agent: Agent) {
		delete this.agents[agent.id]
	}

	reset() {
		Object.values(this.agents).forEach((agent) => agent.reset())
	}

	preExectue() {}

	execute() {
		Object.values(this.agents).forEach((agent) => agent.execute(this))
	}

	postExecute() {}
}

enum EnvironmentState {
	Idle,
	Running,
	Converged,
}

interface Environment {
	agentSystems: AgentSystem[]
	bodyRefs: Record<string, MutableRefObject<Mesh | null>>

	state: EnvironmentState

	execute: () => void
	spawnAgent: () => void
}

export const useEnvironment = create(
	immer<Environment>((set) => ({
		agentSystems: [new AgentSystem([])],
		bodyRefs: {},

		state: EnvironmentState.Idle,

		execute: () => {
			set((state) => {
				if (state.state === EnvironmentState.Running) {
					return
				}

				state.state = EnvironmentState.Running

				state.agentSystems.forEach((agentSystem) => agentSystem.execute())

				state.state = EnvironmentState.Idle
			})
		},
		spawnAgent: () => {
			set((state) => {
				const agent = new AntAgent(new Vector3(-13, 1, 0), [
					new MoveBehaviour(),
					new HingeBehaviour(),
				])
				console.log("Adding agent ", agent.id)
				state.agentSystems[0].addAgent(agent)
			})
		},
	})),
)
