var SPAWN_RANGE = 3;
var basePosition, avatarRot;

var size = 20

avatarRot = Quat.fromPitchYawRollDegrees(0, MyAvatar.bodyYaw, 0.0);
basePosition = Vec3.sum(MyAvatar.position, Vec3.multiply(SPAWN_RANGE * 3, Quat.getFront(avatarRot)));

basePosition.y -= SPAWN_RANGE;

var ground = Entities.addEntity({
  type: "Model",
  modelURL: "https://hifi-public.s3.amazonaws.com/eric/models/floor.fbx?v11",
  dimensions: {
    x: size,
    y: 1,
    z: size
  },
  position: basePosition,
  shapeType: 'box'
});



function cleanup() {
  // Entities.deleteEntity(ground);
}

Script.scriptEnding.connect(cleanup);