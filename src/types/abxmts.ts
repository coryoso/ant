import { AgentSystem } from "../store/environment"

export abstract class Behaviour {
	static behaviourName: () => string

	preExecute() {}
	execute(agent: Agent, agentSystem: AgentSystem) {}
	postExecute() {}
}

export abstract class Agent {
	id!: string

	preExecute() {}
	execute(agentSystem: AgentSystem) {}
	postExecute() {}

	reset() {}
}

// export interface AgentSystem {}
