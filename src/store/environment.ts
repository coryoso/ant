import { Vector3 } from "three"
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

class Agent {
	private startPosition: Vector3
	position: Vector3

	constructor(position: Vector3 = new Vector3()) {
		this.startPosition = position
		this.position = position.clone()
	}

	reset() {
		this.position.copy(this.startPosition)
	}

	preExecute() {}

	execute() {
		this.position.x += 0.01

		return this
	}

	postExecute() {}
}

type Behavior = () => void

const MoveBehavior: Behavior = () => {
	console.log("hi")
}

// interface MoveBehaviour extends Behaviour { }

const _Agent = (behaviors: Behavior[], lastStep: any) => {}

class AgentSystem {
	agents: Agent[]

	constructor(agents: Agent[] = []) {
		this.agents = agents
	}

	reset() {
		this.agents.forEach((agent) => agent.reset())
	}

	preExectue() {}

	execute() {
		this.agents = this.agents.map((agent) => agent.execute())

		return this
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
		agentSystems: [new AgentSystem([new Agent(new Vector3(0, 0, 0))])],

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
