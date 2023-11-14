import { AnimationAction, AnimationMixer, Object3D } from "three"
import { create } from "zustand"

interface AnimationStore {
	actions: Record<string, AnimationAction>
	mixer: AnimationMixer | undefined

	setupMixer: (root: Object3D) => void
}

export const useAnimationStore = create<AnimationStore>((set) => ({
	actions: {},
	mixer: undefined,

	setupMixer: (root: Object3D) => {
		set({
			mixer: new AnimationMixer(root),
		})
	},
}))
