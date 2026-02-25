import * as THREE from 'three/webgpu'

const text = `
███████╗██╗██████╗ ██████╗ ██╗   ██╗
██╔════╝██║██╔══██╗██╔══██╗██║   ██║
███████╗██║██║  ██║██║  ██║██║   ██║
╚════██║██║██║  ██║██║  ██║██║   ██║
███████║██║██████╔╝██████╔╝╚██████╔╝
╚══════╝╚═╝╚═════╝ ╚═════╝  ╚═════╝ 

██████╗  ██████╗ ██████╗ ████████╗███████╗ ██████╗ ██╗     ██╗ ██████╗ 
██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝██╔═══██╗██║     ██║██╔═══██╗
██████╔╝██║   ██║██████╔╝   ██║   █████╗  ██║   ██║██║     ██║██║   ██║
██╔═══╝ ██║   ██║██╔══██╗   ██║   ██╔══╝  ██║   ██║██║     ██║██║   ██║
██║     ╚██████╔╝██║  ██║   ██║   ██║     ╚██████╔╝███████╗██║╚██████╔╝
╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚══════╝╚═╝ ╚═════╝ 

╔═ Intro ═══════════════════════╗
║ Hey developer 👋
║ Welcome to Siddu’s 3D portfolio.
║ This world is built with Three.js, WebGPU,
║ physics, shaders, and a lot of curiosity.
║ Feel free to explore, break things, and inspect.
╚══════════════════════════════╝

╔═ Socials ═════════════════════╗
║ Mail     ⇒ guttulasiddharth1109@gmail.com
║ X        ⇒ https://x.com/Siddu_Makes_3D
║ Bluesky  ⇒ https://bsky.app/profile/siddu1109.bsky.social
║ YouTube  ⇒ https://www.youtube.com/@siddharthcreations1498
║ Twitch   ⇒ https://www.twitch.tv/siddu_makes_3d
║ GitHub   ⇒ https://github.com/Zpphs-gollavilli
║ LinkedIn ⇒ https://www.linkedin.com/in/siddharth-guttula-b85652392/
║ Discord  ⇒ Open the in-site modal 😉
╚══════════════════════════════╝

╔═ Debug ═══════════════════════╗
║ Add #debug at the end of the URL and reload.
║ Press [V] to toggle the free camera.
╚══════════════════════════════╝

╔═ Three.js ═══════════════════╗
║ This portfolio is rendered using Three.js
║ (release: ${THREE.REVISION})
║ https://threejs.org/
║ Created by mr.doob and maintained by
║ an incredible open-source community.
║ WebGPU support makes this experience possible.
╚══════════════════════════════╝

╔═ Inspiration ════════════════╗
║ Inspired by Bruno Simon’s portfolio
║ and re-built, customized, and extended
║ as a learning + showcase project.
╚══════════════════════════════╝

╔═ Source Code ════════════════╗
║ GitHub repository (MIT License):
║ https://github.com/Zpphs-gollavilli/Siddharth-folio-2025
║ Feel free to explore, learn, and remix.
╚══════════════════════════════╝

╔═ Tech Stack ═════════════════╗
║ Three.js        ⇒ 3D Rendering
║ WebGPU / TSL    ⇒ Modern GPU pipeline
║ Rapier          ⇒ Physics engine
║ Howler.js       ⇒ Audio
║ Blender         ⇒ Assets & baking
╚══════════════════════════════╝
`

let finalText = ''
let finalStyles = []

const stylesSet = {
    letter: 'color: #ffffff; font: 400 1em monospace;',
    pipe: 'color: #D66FFF; font: 400 1em monospace;',
}

let currentStyle = null

for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const style = char.match(/[╔║═╗╚╝]/) ? 'pipe' : 'letter'

    if (style !== currentStyle) {
        currentStyle = style
        finalText += '%c'
        finalStyles.push(stylesSet[currentStyle])
    }

    finalText += char
}

export default [finalText, ...finalStyles]
