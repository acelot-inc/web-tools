var drawer = null
var source = null
var drawme = document.getElementById('smiles').value


function onresize() {
  const recto = document.getElementById('recto')
  drawer = new SmilesDrawer.Drawer({
    width:  recto.offsetWidth,
    height: recto.offsetHeight,
    compactDrawing: false
  })

  render(drawme)
}

function validate(input, allow_empty = true) {
  if(allow_empty && input.value === '') {
    input.classList.remove('invalid')
    return
  }

  SmilesDrawer.parse(input.value, function(tree) {
    input.classList.remove('invalid')
  }, function(error) {
    input.classList.add('invalid')
    // console.log(error)
  })
}

function replace(template, replacements) {
  for(const [label, value] of Object.entries(replacements)) {
    if(value === '') {
      // SMILES gets mad about empty side chains...
      template = template.replaceAll('(' + label + ')', value)
    }

    template = template.replaceAll(label, value)
  }

  return template
}

function render(smiles) {
  SmilesDrawer.parse(smiles, function(tree) {
    drawer.draw(tree, 'canvas', 'light')
    drawme = smiles
    console.log('render()ed')
  }, function(error) {
    // ???
  })
}

function render_raw() {
  const templ = document.getElementById('smiles').value
  render(templ)
}

function render_row(tr) {
  const templ  = document.getElementById('smiles').value
  const repls  = get_replacements(tr)
  const smiles = replace(templ, repls)
  render(smiles)
}

function get_replacements(tr) {
  const thead = document.querySelector('#verso thead')
  const repls = {}

  for(let i = 1; i < 5; ++i) {
    const label  = thead.firstElementChild.children[i].dataset.label
    const value  = tr.children[i].firstElementChild.value
    repls[label] = value
  }

  return repls
}

// const url = new URL(window.location.href)
// const mol = url.searchParams.get('mol')
// if(mol) {
//   const input = document.getElementById('smiles')
//   input.value = mol
// }

window.addEventListener('resize', function(event) {
  onresize()
})

document.getElementById('smiles').addEventListener('keyup', function(event) {
  const input = event.target
  validate(input, false)
  render_raw()
})

document.getElementById('form').addEventListener('change', function(event) {
  const input = event.target
  if(input.type === 'radio') {
    const v = document.getElementById('vertical')
    document.body.classList.toggle('vertical', v.checked)
    onresize()
  }
})

document.getElementById('verso').addEventListener('keyup', function(event) {
  const input = event.target
  if(input.tagName !== 'INPUT') {
    return
  }

  const td = input.parentElement
  const tr = td.parentElement

  if(event.keyCode === 13) {
    const index = Array.prototype.indexOf.call(tr.children, td)
    const tr2 = event.shiftKey? tr.previousElementSibling : tr.nextElementSibling

    if(tr2 !== null) {
      tr2.children[index].firstElementChild.focus()
    }
  }
  else {
    validate(input, true)
    render_row(tr)
  }
})

document.getElementById('verso').addEventListener('focus', function(event) {
  const input = event.target
  if(input.tagName === 'INPUT') {
    const tr = input.parentElement.parentElement
    render_row(tr)
  }
}, true)

document.getElementById('verso').addEventListener('click', function(event) {
  const input = event.target
  if(input.classList.contains('copy')) {
    const tr = input.parentElement.parentElement
    tr.after(tr.cloneNode(true))
    // render_row(tr)
  }
  else if(input.classList.contains('remove')) {
    const tr = input.parentElement.parentElement
    tr.parentElement.removeChild(tr)
  }
})

document.getElementById('smiles').addEventListener('focus', function(event) {
  render_raw()
}, true)

document.querySelector('#buttons > a[href="#add-line"]').addEventListener('click', function(event) {
  event.stopPropagation()
  event.preventDefault()

  const base = document.getElementById('template')
  const copy = base.cloneNode(true)
  copy.removeAttribute('id')
  base.before(copy)
})

document.querySelector('#buttons > a[href="#download"]').addEventListener('click', function(event) {
  const templ  = document.getElementById('smiles').value
  const tbody  = document.getElementById('replacements')
  const result = [templ]
  for(const tr of tbody.children) {
    if(tr.id === 'template') continue
    const repls  = get_replacements(tr)
    const smiles = replace(templ, repls)
    result.push(smiles)
  }

  let uri = 'data:text/plain;charset=utf-8,'
  uri += encodeURIComponent(result.join('\n') + '\n')
  event.target.setAttribute('href', uri);
})

onresize()
