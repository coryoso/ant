import { PublicApi } from "@react-three/cannon"
import { Vector3 } from "three"
import { v4 } from "uuid"
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { Agent, Behaviour } from "../types/abxmts"

export class MoveBehaviour implements Behaviour {
	preExecute() {}

	execute(agent: Agent, agentSystem: AgentSystem) {
		const antAgent = agent as AntAgent

		if (antAgent.physicsBody) {
			antAgent.physicsBody.applyImpulse([0.1, 0, 0], [0, 0, 0])
		}
	}

	postExecute() {}
}

export class HingeBehaviour implements Behaviour {
	preExecute() {}

	execute(agent: Agent, agentSystem: AgentSystem) {
		const antAgent = agent as AntAgent

		Object.values(agentSystem.agents).forEach((agent) => {
			;(agent as AntAgent).physicsBody?.position.subscribe((a) =>
				console.log(a),
			)
		})
	}

	postExecute() {}
}

export class AntAgent implements Agent {
	private _id: string
	private startPosition: Vector3
	position: Vector3
	private _physicsBody: PublicApi | undefined = undefined
	private _behaviours: Behaviour[]

	constructor(position: Vector3 = new Vector3(), behaviours: Behaviour[] = []) {
		this._id = v4()

		this.startPosition = position
		this.position = position.clone()
		this._behaviours = behaviours
	}

	reset() {
		this.position.copy(this.startPosition)
	}

	preExecute() {}

	execute(agentSystem: AgentSystem) {
		this._behaviours.forEach((behaviour) =>
			behaviour.execute(this, agentSystem),
		)
	}

	postExecute() {}

	get id() {
		return this._id
	}

	set physicsBody(body: PublicApi | undefined) {
		if (this._physicsBody !== body) {
			this._physicsBody = body
		}
	}

	get physicsBody(): PublicApi | undefined {
		return this._physicsBody
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

	state: EnvironmentState

	execute: () => void
}

export const useEnvironment = create(
	immer<Environment>((set) => ({
		agentSystems: [
			new AgentSystem([
				new AntAgent(new Vector3(0, 0, 0), [
					new MoveBehaviour(),
					new HingeBehaviour(),
				]),
			]),
		],

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
	})),
)
