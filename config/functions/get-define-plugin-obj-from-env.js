/**
 * Add webpack env key and value to webpack DefinePlugin. This will allow to replace process.env.key
 * to value in React and Node
 */
export function getDefinePluginObjFromEnv(env = {}) {
  const definePluginObj = {};
  Object.keys(env).forEach((key) => {
    try {
      definePluginObj[`process.env.${key}`] = JSON.parse(env[key]);
    } catch {
      definePluginObj[`process.env.${key}`] = JSON.stringify(env[key]);
    }
  });
  return definePluginObj;
}
