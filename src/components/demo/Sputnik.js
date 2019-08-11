import {
  Color3,
  Color4,
  CubeTexture,
  FresnelParameters,
  StandardMaterial,
  Vector3
} from 'babylonjs'
import 'babylonjs-inspector'
import { TimelineLite } from 'gsap/all'
import * as React from 'react'
import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  Scene,
  Skybox
} from 'react-babylonjs'
import ScaledModelWithProgress from './ScaledModelWithProgress'
import './style.css'

const SkyboxScenes = [
  {
    name: 'sunny day',
    texture: `/assets/textures/TropicalSunnyDay`
  },
  {
    name: 'specular HDR',
    texture: `/assets/textures/SpecularHDR.dds`
  }
]

class Sputnik extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      atomYPos: 0,
      atomScaling: 3.0,
      skyboxIndex: 0
    }
    this.logoTween = new TimelineLite({ paused: true })
    this.onModelLoaded = this.onModelLoaded.bind(this)
  }

  onModelLoaded(model, { scene }){
    model.meshes.map((mesh, index) => {
      const material = new StandardMaterial('kosh', scene)
      material.reflectionTexture = new CubeTexture('/assets/textures/TropicalSunnyDay', scene)
      material.diffuseColor = new Color3(0, 0, 0)
      material.emissiveColor = new Color3(0.5, 0.5, 0.5)
      material.alpha = 0.2
      material.specularPower = 16

      // Fresnel
      material.reflectionFresnelParameters = new FresnelParameters()
      material.reflectionFresnelParameters.bias = 0.1

      material.emissiveFresnelParameters = new FresnelParameters()
      material.emissiveFresnelParameters.bias = 0.6
      material.emissiveFresnelParameters.power = 4
      material.emissiveFresnelParameters.leftColor = Color3.White()
      material.emissiveFresnelParameters.rightColor = Color3.Black()

      material.opacityFresnelParameters = new FresnelParameters()
      material.opacityFresnelParameters.leftColor = Color3.White()
      material.opacityFresnelParameters.rightColor = Color3.Black()
      if (index === 0) {
        this.logoTween.to(mesh.scaling, 2, { x: 4, y: 4, z: 4 })
        this.logoTween.to(mesh.scaling, 2, { x: 2, y: 2, z: 2 })
        this.logoTween.to(mesh.rotation, 1, { x: 1, y: 1, z: 1 })
        this.logoTween.play()
      }
      mesh.material = material
    })
  }

  render () {
    return (
      <Engine antialias adaptToDeviceRatio canvasId='babylonJS'>
        <Scene clearColor={new Color4(1.0, 1.0, 1.0, 1.0)}>
          <Skybox
            rootUrl={SkyboxScenes[Math.abs(this.state.skyboxIndex) % SkyboxScenes.length].texture}
          />
          <ArcRotateCamera
            name='camera1'
            alpha={Math.PI / 2}
            beta={Math.PI / 2}
            radius={9.0}
            target={Vector3.Zero()}
            minZ={0.001}
          />
          <HemisphericLight name='light1' intensity={0.7} direction={Vector3.Up()} />
          <ScaledModelWithProgress
            rootUrl={`/assets/models/`}
            sceneFilename='atom.glb'
            scaleTo={this.state.atomScaling}
            progressBarColor={Color3.FromInts(135, 206, 235)}
            center={new Vector3(0, this.state.atomYPos, 0)}
            onModelLoaded={this.onModelLoaded}
          />
        </Scene>
      </Engine>
    )
  }
}

export default Sputnik
