/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.15 scene.gltf -t -s 
Author: Medhue (https://sketchfab.com/Medhue1)
License: SKETCHFAB Standard (https://sketchfab.com/licenses)
Source: https://sketchfab.com/3d-models/medhue-ants-81c5df27431543818a2be3604abd3316
Title: Medhue Ants
*/

import { useAnimations, useGLTF } from "@react-three/drei"
import { useGraph } from "@react-three/fiber"
import React, { useMemo, useRef } from "react"
import * as THREE from "three"
import { GLTF, SkeletonUtils } from "three-stdlib"

type GLTFResult = GLTF & {
	nodes: {
		Object_64: THREE.SkinnedMesh
		_rootJoint: THREE.Bone
	}
	materials: {
		["Material.001"]: THREE.MeshStandardMaterial
	}
}

export type ActionName =
	| "Ant_Rig|Idle1"
	| "Ant_Rig|Attack"
	| "Ant_Rig|Dead"
	| "Ant_Rig|Death"
	| "Ant_Rig|Idle2"
	| "Ant_Rig|Idle3"
	| "Ant_Rig|Idle4"
	| "Ant_Rig|Run"
	| "Ant_Rig|TurnLeft"
	| "Ant_Rig|TurnRight"
	| "Ant_Rig|Walk"
type GLTFActions = Record<ActionName, THREE.AnimationAction>

type ContextType = Record<
	string,
	React.ForwardRefExoticComponent<
		JSX.IntrinsicElements["skinnedMesh"] | JSX.IntrinsicElements["bone"]
	>
>

export function AnimatedAnt(props: JSX.IntrinsicElements["group"] & {}) {
	const group = useRef<THREE.Group>(null)
	const { materials, animations, scene } = useGLTF(
		"/ant/scene.gltf",
	) as GLTFResult

	const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
	const { nodes } = useGraph(clone) as GLTFResult

	// @ts-ignore
	const { actions } = useAnimations<GLTFActions>(animations, group)

	React.useEffect(() => {
		// @ts-ignore
		actions["Ant_Rig|Idle2"].play()
	}, [actions])

	return (
		<group
			ref={group}
			scale={10}
			rotation={[0, Math.PI / 2, 0]}
			{...props}
			dispose={null}
		>
			<group name="Sketchfab_Scene">
				<group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
					<group
						name="c4a2737fe7244c2db46762e7ee0c4a8afbx"
						rotation={[Math.PI / 2, 0, 0]}
						scale={0.01}
					>
						<group name="Object_2">
							<group name="RootNode">
								<group
									name="Ant_Rig"
									rotation={[-Math.PI / 2, 0, 0]}
									scale={100}
								>
									<group name="Object_5">
										<primitive object={nodes._rootJoint} />
										<group
											name="Object_63"
											rotation={[Math.PI / 2, 0, 0]}
											scale={0.01}
										/>
										<skinnedMesh
											name="Object_64"
											geometry={nodes.Object_64.geometry}
											material={materials["Material.001"]}
											skeleton={nodes.Object_64.skeleton}
										/>
									</group>
								</group>
								<group
									name="Ant_Model"
									rotation={[Math.PI / 2, 0, 0]}
									scale={0.01}
								/>
							</group>
						</group>
					</group>
				</group>
			</group>
		</group>
	)
}

useGLTF.preload("/ant/scene.gltf")
