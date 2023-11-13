import { AgentSystem } from "../store/environment"

export interface Behaviour {
	preExecute: () => void
	execute: (agent: Agent, agentSystem: AgentSystem) => void
	postExecute: () => void
}

export interface Agent {
	id: string

	preExecute: () => void
	execute: (agentSystem: AgentSystem) => void
	postExecute: () => void

	reset: () => void
}

// export interface AgentSystem {}
