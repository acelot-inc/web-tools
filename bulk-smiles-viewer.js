(function() {
  const content = document.querySelector('content')
  const screen  = document.getElementById('screen')
  const cancel  = document.getElementById('cancel')
  const drawer  = new SmilesDrawer.Drawer({
    width:  250,
    height: 200,
    compactDrawing: false
  })

  function getMols() {
    const input = document.getElementById('data')
    const lines = input.value.split('\n')
    return lines.map(line => {
      const i = line.indexOf(' ')
      if(i === -1) {
        return [line]
      }

      const smiles = line.substring(0, i)
      const name   = line.substring(i + 1)
      return [smiles, name]
    })
  }

  async function drawMol(smiles, canvas) {
    SmilesDrawer.parse(smiles, function(tree) {
      drawer.draw(tree, canvas, 'light')
    }, function(error) {
      console.log(error)
    })
  }

  function clearImages() {
    while(content.lastChild) {
      content.removeChild(content.lastChild)
    }
  }

  function addImages(mols) {
    mols.forEach((mol, i) => {
      if(!mol[0]) return

      const div = document.createElement('div')
      const cvs = document.createElement('canvas')
      const lbl = document.createElement('span')

      lbl.setAttribute('title', 'Copy SMILES')
      lbl.innerText = mol[1] || ('Mol' + (i + 1))
      lbl.dataset.smiles = mol[0]

      div.appendChild(cvs)
      div.appendChild(lbl)
      content.appendChild(div)

      drawMol(mol[0], cvs)
    })
  }

  function render() {
    clearImages()
    addImages(getMols())
    cancel.style.display = 'inline-block'
    screen.style.display = 'none'
  }

  document.getElementById('draw').addEventListener('click', event => {
    render()
  })

  document.getElementById('cancel').addEventListener('click', event => {
    screen.style.display = 'none'
  })

  document.getElementById('update').addEventListener('click', event => {
    screen.style.display = 'block'
    document.getElementById('data').focus()
  })

  content.addEventListener('click', event => {
    if(event.target.tagName === 'SPAN') {
      const smiles = event.target.dataset.smiles
      const name   = event.target.innerText
      navigator.clipboard.writeText(smiles + ' ' + name)
    }
  })

  document.addEventListener('keydown', event => {
    // console.log(event)
    if(event.key === 'Enter' && event.metaKey && screen.style.display !== 'none') {
      document.getElementById('draw').click()
    }
    else if(event.key === 'Escape' && cancel.offsetParent !== null) {
      cancel.click()
    }
    if(event.key === '/' && screen.style.display === 'none') {
      document.getElementById('update').click()
    }
    else {
      return
    }

    event.stopPropagation()
    event.preventDefault()
  })

  const scale = document.getElementById('scale')
  scale.addEventListener('change', event => {
    content.classList.remove('large')
    content.classList.remove('small')
    content.classList.add(event.target.value)
  })

  const files = document.getElementById('file-input')
  files.addEventListener('change', event => {
    const file = event.target.files[0]
    if(!file) return

    const reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload  = e => {
      const data = document.getElementById('data')
      data.value = e.target.result

      if(screen.style.display === 'none') {
        render()
      }
    }
    reader.onerror = e => {
      console.warn(e.target.error)
      alert('There was an error reading the file.')
    }
  })

  document.querySelectorAll('button.upload').forEach(button => {
    button.addEventListener('click', event => {files.click()})
  })

  scale.dispatchEvent(new Event('change'))
  document.getElementById('data').select()
})();
