// File: _site/assets/js/adventureGame/PlatformerIntegration.js
import GameControl from '../platformer/GameControl.js';
import GameEnv from '../platformer/GameEnv.js';

export function transitionToPlatformerLevel(levelTag) {
    // Find the platformer game level by tag
    //const level = GameEnv.levels.find(l => l.tag === levelTag);
    console.log("transiitoning to level", levelTag);
    if (level) {
        // Transition to the platformer game level
        console.log(`Transitioned to level with tag ${levelTag}.`);
        GameControl.transitionToLevel(levelTag);
    } else {
        console.error(`Level with tag ${levelTag} not found.`);
    }
}