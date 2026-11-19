// Le dossier lib/ du site (horaires, textes, liens) est partagé avec l'appli :
// une seule source de vérité pour le site et l'application.
const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
config.watchFolders = [path.resolve(__dirname, "../lib")];
module.exports = config;
