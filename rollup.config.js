import nodeBuiltins from "rollup-plugin-node-builtins";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "src/app.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
  },
  plugins: [nodeBuiltins(), commonjs(), resolve()],
};
