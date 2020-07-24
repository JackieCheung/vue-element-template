const Clipboard = require('clipboard')
if (!Clipboard) {
  throw new Error('you should run `npm install clipboard --save` at first')
}

export default function handleClipboard ({ text, container } = {}) {
  return new Promise(function (resolve, reject) {
    const target = document.createElement('button')
    target.style.display = 'none'

    const clipboard = new Clipboard(target, {
      text () { return text },
      action () { return 'copy' },
      container: typeof container === 'object' ? container : document.body
    })
    clipboard.on('success', e => {
      clipboard.destroy()
      resolve(e)
    })
    clipboard.on('error', e => {
      clipboard.destroy()
      reject(e)
    })

    document.body.appendChild(target)
    target.click()
    document.body.removeChild(target)
  })
}
