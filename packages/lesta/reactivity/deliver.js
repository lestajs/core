export default function deliver(target, path, value) {
  let i
  for (i = 0; i < path.length - 1; i++) target = target[path[i]]
  target[path[i]] = value
}