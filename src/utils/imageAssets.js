const imageModules = import.meta.glob("../assets/images/*", {
  eager: true,
});

const imageAssets = Object.entries(imageModules).reduce((assets, [path, mod]) => {
  const fileName = path.split("/").pop();
  assets[fileName] = mod.default;
  return assets;
}, {});

export function getImageAsset(fileName) {
  return imageAssets[fileName] || "";
}
