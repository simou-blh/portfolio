export const SCENE_READY_EVENT = "portfolio:scene-ready";

export function markSceneReady() {
  document.documentElement.dataset.sceneReady = "1";
  window.dispatchEvent(new Event(SCENE_READY_EVENT));
}

export function isSceneReady() {
  return document.documentElement.dataset.sceneReady === "1";
}