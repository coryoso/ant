export interface Behaviour {
	preExecute: () => void
	execute: (agent: Agent) => void
	postExecute: () => void
}

export interface Agent {
	id: string

	preExecute: () => void
	execute: () => void
	postExecute: () => void

	reset: () => void
}

export interface AgentSystem {}
