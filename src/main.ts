import { SceneSetup } from './scene/SceneSetup';
import { CameraController } from './scene/CameraController';
import { BoardManager } from './game/BoardManager';
import { PieceManager } from './game/PieceManager';
import { ChessGame } from './game/ChessGame';
import { InputManager } from './game/InputManager';
import { AnimationManager } from './game/AnimationManager';
import { HighlightManager } from './game/HighlightManager';
import { NetworkManager } from './network/NetworkManager';
import { UIManager } from './ui/UIManager';
import * as TWEEN from '@tweenjs/tween.js';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const sceneSetup = new SceneSetup(canvas);
const cameraController = new CameraController(sceneSetup.camera, sceneSetup.renderer.domElement);

const boardManager = new BoardManager(sceneSetup.scene);
const highlightManager = new HighlightManager(sceneSetup.scene);
const pieceManager = new PieceManager(sceneSetup.scene);
const animationManager = new AnimationManager();
const networkManager = new NetworkManager();

const game = new ChessGame(
  pieceManager,
  highlightManager,
  animationManager,
  networkManager,
  cameraController
);

const inputManager = new InputManager(
  sceneSetup.camera,
  sceneSetup.renderer.domElement,
  pieceManager,
  boardManager,
  game
);

const uiManager = new UIManager(game, networkManager);

// Connect promotion dialog
game.onPromotionNeeded = () => {
  uiManager.showPromotionDialog();
};

boardManager.create();

function animate(): void {
  requestAnimationFrame(animate);
  TWEEN.update();
  cameraController.update();
  highlightManager.update();
  sceneSetup.render();
}

animate();
